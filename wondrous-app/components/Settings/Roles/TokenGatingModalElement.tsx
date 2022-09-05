import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import apollo from 'services/apollo';

import {
  TokenGatingNameHeader,
  TokenGatingElementWrapper,
  TokenGateActionMenuContainer,
  TokenGateListDiv,
  TokenGateListItemDiv,
  TokenGatingHeaderLabel,
  TokenLogoDisplay,
} from 'components/Settings/TokenGating/styles';
import palette from 'theme/palette';

import { GET_TOKEN_INFO, GET_NFT_INFO } from 'graphql/queries/tokenGating';
import { GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, GET_POD_ROLES_WITH_TOKEN_GATE } from 'graphql/queries';
import { APPLY_TOKEN_GATING_TO_ORG_ROLE, APPLY_TOKEN_GATING_TO_POD_ROLE } from 'graphql/mutations/tokenGating';

import { DropDown, DropDownItem } from '../../Common/dropdown';
import { TaskMenuIcon } from '../../Icons/taskMenu';

function TokenGatingModalElement(props) {
  const [tokenName, setTokenName] = useState(null);
  const [tokenLogo, setTokenLogo] = useState(null);
  const { tokenGatingCondition, selectedRoleForTokenGate, handleClose, orgId } = props;
  const router = useRouter();
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
  const contractAddress = tokenGatingCondition?.accessCondition.contractAddress;
  const dropdownItemStyle = {
    marginRight: '12px',
    color: palette.white,
  };

  useEffect(() => {
    const getTokenDisplayInfo = async () => {
      const type = tokenGatingCondition?.accessCondition.type;
      if (type === 'ERC20') {
        getTokenInfo({
          variables: {
            contractAddress,
            chain: tokenGatingCondition?.accessCondition.chain,
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
  }, [tokenGatingCondition?.accessCondition.contractAddress]);
  const handleWrapperElementClick = async () => {
    const confirmed = confirm(`Apply ${tokenGatingCondition?.name} to role?`);
    if (!confirmed) {
      return;
    }
    try {
      if (selectedRoleForTokenGate?.__typename === 'OrgRole') {
        await apollo.mutate({
          mutation: APPLY_TOKEN_GATING_TO_ORG_ROLE,
          variables: {
            tokenGatingConditionId: tokenGatingCondition?.id,
            orgRoleId: selectedRoleForTokenGate?.id,
          },
          refetchQueries: [GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD],
        });
      }

      if (selectedRoleForTokenGate?.__typename === 'PodRole') {
        await apollo.mutate({
          mutation: APPLY_TOKEN_GATING_TO_POD_ROLE,
          variables: {
            tokenGatingConditionId: tokenGatingCondition?.id,
            podRoleId: selectedRoleForTokenGate?.id,
          },
          refetchQueries: [GET_POD_ROLES_WITH_TOKEN_GATE],
        });
      }
    } catch (e) {
      console.error(e);
      return;
    }
    handleClose();
  };
  return (
    <TokenGatingElementWrapper onClick={handleWrapperElementClick}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenGatingNameHeader>{tokenGatingCondition?.name}</TokenGatingNameHeader>
        <TokenGateActionMenuContainer right="true">
          <DropDown DropdownHandler={TaskMenuIcon}>
            <DropDownItem
              key={`token-gate-edit${tokenGatingCondition?.id}`}
              onClick={() => {
                router.push(`/organization/settings/${orgId}/token-gating`, undefined, {
                  shallow: true,
                });
              }}
              style={dropdownItemStyle}
            >
              Edit
            </DropDownItem>
          </DropDown>
        </TokenGateActionMenuContainer>
      </div>
      <TokenGateListDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Chain:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>
            <span
              style={{
                textTransform: 'capitalize',
              }}
            >
              {tokenGatingCondition?.accessCondition.chain}
            </span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Token:</TokenGatingHeaderLabel>
          <TokenLogoDisplay src={tokenLogo} />
          <TokenGatingNameHeader>
            <span>{tokenName || tokenGatingCondition?.accessCondition.contractAddress}</span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Min. amount to hold:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>{tokenGatingCondition?.accessCondition.minValue}</TokenGatingNameHeader>
        </TokenGateListItemDiv>
      </TokenGateListDiv>
    </TokenGatingElementWrapper>
  );
}

export default TokenGatingModalElement;
