import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';

import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG, GET_TOKEN_INFO, GET_NFT_INFO } from 'graphql/queries/tokenGating';
import { DELETE_TOKEN_GATING_CONDITION } from 'graphql/mutations/tokenGating';
import { useWonderWeb3 } from 'services/web3';
import AccordionSummary from '@mui/material/AccordionSummary';
import palette from 'theme/palette';
import { useEditTokenGatingCondition } from 'utils/hooks';
import apollo from 'services/apollo';
import { ErrorText } from '../../Common';
import Accordion from '../../Common/Accordion';
import { DropDown, DropDownItem } from '../../Common/dropdown';
import { TaskMenuIcon } from '../../Icons/taskMenu';

import {
  TokenGatingNameHeader,
  TokenGatingElementWrapper,
  TokenGateActionMenu,
  TokenGateListDiv,
  TokenGateListItemDiv,
  TokenGatingHeaderLabel,
  TokenLogoDisplay,
} from './styles';
import UserCheckIcon from '../../Icons/userCheckIcon';
import { HeaderBlock } from '../headerBlock';

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

function TokenGatingConditionDisplay(props) {
  const router = useRouter();
  const [tokenName, setTokenName] = useState(null);
  const [tokenLogo, setTokenLogo] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const editTokenGatingCondition = useEditTokenGatingCondition();

  const { tokenGatingCondition } = props;
  const dropdownItemStyle = {
    marginRight: '12px',
    color: palette.white,
  };
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
  const contractAddress = tokenGatingCondition?.accessCondition[0].contractAddress;

  useEffect(() => {
    const getTokenDisplayInfo = async () => {
      const type = tokenGatingCondition?.accessCondition[0].type;
      if (type === 'ERC20') {
        getTokenInfo({
          variables: {
            contractAddress,
            chain: tokenGatingCondition?.accessCondition[0].chain,
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
  }, [tokenGatingCondition?.accessCondition[0].contractAddress]);
  const handleDelete = async () => {
    if (tokenGatingCondition) {
      try {
        await apollo.mutate({
          mutation: DELETE_TOKEN_GATING_CONDITION,
          variables: {
            tokenGatingConditionId: tokenGatingCondition?.id,
          },
        });
        router.reload();
      } catch (e) {
        setDeleteError(true);
      }
    }
  };
  return (
    <TokenGatingElementWrapper>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenGatingNameHeader>{tokenGatingCondition.name}</TokenGatingNameHeader>
        <TokenGateActionMenu right="true">
          <DropDown DropdownHandler={TaskMenuIcon}>
            <DropDownItem
              key={`token-gate-edit${tokenGatingCondition?.id}`}
              onClick={() => {
                editTokenGatingCondition?.setSelectedTokenGatingCondition(tokenGatingCondition);
                editTokenGatingCondition?.setShowConfigModal(true);
              }}
              style={dropdownItemStyle}
            >
              Edit
            </DropDownItem>
            <DropDownItem
              key={`token-gate-delete${tokenGatingCondition?.id}`}
              style={dropdownItemStyle}
              onClick={handleDelete}
            >
              Delete
            </DropDownItem>
          </DropDown>
        </TokenGateActionMenu>
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
              {tokenGatingCondition?.accessCondition[0].chain}
            </span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Token:</TokenGatingHeaderLabel>
          <TokenLogoDisplay src={tokenLogo} />
          <TokenGatingNameHeader>
            <span>{tokenName || tokenGatingCondition?.accessCondition[0].contractAddress}</span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Min. amount to hold:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>{tokenGatingCondition?.accessCondition[0].minValue}</TokenGatingNameHeader>
        </TokenGateListItemDiv>
      </TokenGateListDiv>
      {deleteError && <ErrorText>There are roles associated with this condition</ErrorText>}
    </TokenGatingElementWrapper>
  );
}

export default TokenGatingConditionDisplay;
