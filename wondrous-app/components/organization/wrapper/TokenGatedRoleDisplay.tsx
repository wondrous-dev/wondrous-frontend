import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import apollo from 'services/apollo';

import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import {
  CHECK_ORG_ROLE_TOKEN_GATING_CONDITION,
  CHECK_POD_ROLE_TOKEN_GATING_CONDITION,
  GET_TOKEN_INFO,
  GET_NFT_INFO,
} from 'graphql/queries/tokenGating';
import { useWonderWeb3 } from 'services/web3';
import AccordionSummary from '@mui/material/AccordionSummary';
import palette from 'theme/palette';
import { useEditTokenGatingCondition } from 'utils/hooks';
import { CLAIM_POD_ROLE, CLAIM_ORG_ROLE } from 'graphql/mutations/tokenGating';
import Tooltip from 'components/Tooltip';
import { ErrorText } from '../../Common';
import Accordion from '../../Common/Accordion';
import { useMe } from '../../Auth/withAuth';

import {
  TokenGatedRoleTitle,
  TokenGatedRoleWrapper,
  TokenGatedRoleDescription,
  TokenLogoDisplay,
  ClaimRoleButton,
  ClaimRoleLabel,
  RoleActionWrapper,
} from './styles';
import RedXIcon from '../../Icons/redx';
import CheckMarkIcon from '../../Icons/checkMark';

interface TokenGatingCondition {
  id: string;
  booleanLogic?: string;
  name?: string;
  orgId?: string;
  accessCondition: [AccessCondition];
}

interface AccessCondition {
  chain: string;
  contractAddress: string;
  method: string;
  minValue: string;
  tokenIds?: string;
  type: string;
}

const CHAIN_NAME_TO_CHAIN_ID = {
  ethereum: 1,
  rinkeby: 4,
  polygon: 137,
};
const UNDEFINED_CONTRACT_RESPONSE = 'Unidentified contract';

function TokenGatedRoleDisplay(props) {
  const router = useRouter();
  const user = useMe();
  const [tokenName, setTokenName] = useState(null);
  const [tokenLogo, setTokenLogo] = useState(null);
  const [canClaimRole, setCanClaimRole] = useState(false);
  const [canClaimRoleLoading, setCanClaimRoleLoading] = useState(false);
  const [checkOrgRoleTokenGatingCondition, { data: checkOrgRoleAccessData, loading: checkOrgRoleAccessLoading }] =
    useLazyQuery(CHECK_ORG_ROLE_TOKEN_GATING_CONDITION);
  const [checkPodRoleTokenGatingCondition, { data: checkPodRoleAccessData, loading: checkPodRoleAccessLoading }] =
    useLazyQuery(CHECK_POD_ROLE_TOKEN_GATING_CONDITION);

  const { role } = props;
  const [getTokenInfo, { loading: getTokenInfoLoading }] = useLazyQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      if (data?.getTokenInfo) {
        setTokenName(data?.getTokenInfo.name);
        setTokenLogo(data?.getTokenInfo.logoUrl);
      }
    },
    fetchPolicy: 'network-only',
  });

  const [getNFTInfo, { loading: getNFTInfoLoading }] = useLazyQuery(GET_NFT_INFO, {
    onCompleted: (data) => {
      if (data?.getNFTInfo) {
        setTokenName(data?.getNFTInfo.name);
        setTokenLogo(data?.getNFTInfo.logoUrl);
      }
    },
    fetchPolicy: 'network-only',
  });
  const contractAddress = role?.tokenGatingCondition?.accessCondition[0].contractAddress;
  const tokenGatingConditionName = role?.tokenGatingCondition?.name;

  useEffect(() => {
    if (checkPodRoleAccessData?.checkPodRoleTokenGatingCondition?.success) {
      setCanClaimRole(true);
    }
    if (checkOrgRoleAccessData?.checkOrgRoleTokenGatingCondition?.success) {
      setCanClaimRole(true);
    }
    if (checkOrgRoleAccessLoading || checkPodRoleAccessLoading) {
      setCanClaimRoleLoading(true);
    }
    if (!checkOrgRoleAccessLoading && !checkPodRoleAccessLoading) {
      setCanClaimRoleLoading(false);
    }
  }, [checkOrgRoleAccessData, checkPodRoleAccessData, checkOrgRoleAccessLoading, checkPodRoleAccessLoading]);

  useEffect(() => {
    const checkUserCanObtainRole = async () => {
      if (!role) return;
      if (!user) return;
      if (role.podId) {
        checkPodRoleTokenGatingCondition({
          variables: {
            podRoleId: role.id,
            userId: user.id,
          },
        });
      } else if (role.orgId) {
        checkOrgRoleTokenGatingCondition({
          variables: {
            orgRoleId: role.id,
            userId: user.id,
          },
        });
      }
    };
    setCanClaimRole(false);
    checkUserCanObtainRole();
  }, [role, user]);

  useEffect(() => {
    const getTokenDisplayInfo = async () => {
      const type = role?.tokenGatingCondition?.accessCondition[0].type;
      if (type === 'ERC20') {
        getTokenInfo({
          variables: {
            contractAddress,
            chain: role?.tokenGatingCondition?.accessCondition[0].chain,
          },
        });
      }
      if (type === 'ERC721') {
        getNFTInfo({
          variables: {
            contractAddress,
          },
        });
      }
    };

    getTokenDisplayInfo();
  }, [role?.tokenGatingCondition?.accessCondition[0].contractAddress]);

  const handleClaimRoleClick = async () => {
    try {
      if (role?.orgId) {
        await apollo.mutate({
          mutation: CLAIM_ORG_ROLE,
          variables: {
            orgRoleId: role.id,
          },
        });
      }
      if (role?.podId) {
        await apollo.mutate({
          mutation: CLAIM_POD_ROLE,
          variables: {
            podRoleId: role.id,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
    router.reload();
  };
  return (
    <TokenGatedRoleWrapper>
      <div>
        <TokenGatedRoleTitle>Role: {role?.name}</TokenGatedRoleTitle>
        {/* {tokenGatingConditionName && <TokenGatedRoleDescription> {tokenGatingConditionName}</TokenGatedRoleDescription>} */}
        <Tooltip key={`claimable-role-${role?.tokenGatingCondition?.id}`} title={contractAddress} placement="top">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TokenLogoDisplay src={tokenLogo} />
            <TokenGatedRoleDescription>
              {tokenName && tokenName !== UNDEFINED_CONTRACT_RESPONSE ? tokenName : tokenGatingConditionName}
            </TokenGatedRoleDescription>
          </div>
        </Tooltip>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TokenGatedRoleDescription
            style={{
              marginRight: '5px',
            }}
          >
            Min. amount to hold:
          </TokenGatedRoleDescription>
          <TokenGatedRoleDescription>
            {role?.tokenGatingCondition?.accessCondition[0].minValue}
          </TokenGatedRoleDescription>
        </div>
      </div>
      <RoleActionWrapper>
        {checkOrgRoleAccessLoading || checkPodRoleAccessLoading ? (
          <CircularProgress
            style={{
              width: '30px',
              height: '30px',
            }}
          />
        ) : canClaimRole ? (
          <div>
            {/* <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <CheckMarkIcon
                style={{
                  width: '30',
                  height: '30',
                }}
              />
            </div>
 */}
            {canClaimRole && (
              <ClaimRoleButton onClick={handleClaimRoleClick}>
                <ClaimRoleLabel>Claim Role</ClaimRoleLabel>
              </ClaimRoleButton>
            )}
          </div>
        ) : (
          <RedXIcon
            style={{
              width: '30',
              height: '30',
            }}
          />
        )}
      </RoleActionWrapper>
    </TokenGatedRoleWrapper>
  );
}

export default TokenGatedRoleDisplay;
