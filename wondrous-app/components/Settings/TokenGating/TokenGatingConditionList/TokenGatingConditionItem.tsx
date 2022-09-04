import TokenGateActionMenu from 'components/Settings/TokenGating/TokenGatingConditionList/TokenGateActionMenu';
import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { GET_TOKEN_INFO, GET_NFT_INFO } from 'graphql/queries/tokenGating';
import { TokenGatingCondition } from 'types/TokenGating';

import {
  TokenGatingNameHeader,
  TokenGatingElementWrapper,
  TokenGateListDiv,
  TokenGateListItemDiv,
  TokenGatingHeaderLabel,
  TokenLogoDisplay,
} from '../styles';

type Props = {
  tokenGatingCondition: TokenGatingCondition;
};

function TokenGatingConditionItem({ tokenGatingCondition }: Props) {
  const [tokenName, setTokenName] = useState(null);
  const [tokenLogo, setTokenLogo] = useState(null);

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

  return (
    <TokenGatingElementWrapper>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenGatingNameHeader>{tokenGatingCondition.name}</TokenGatingNameHeader>
        <TokenGateActionMenu tokenGatingCondition={tokenGatingCondition} />
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

export default TokenGatingConditionItem;
