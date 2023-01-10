import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_NFT_INFO, GET_TOKEN_INFO } from 'graphql/queries';
import { AccessCondition, GuildAccessCondition, TokenGatingCondition } from 'types/TokenGating';

function useGetTokenDisplayInfo(tokenAccessCondition: AccessCondition) {
  // should try to use this
  const [accessConditionsDsiplay, setAccessConditionsDsiplay] = useState<
    Array<{
      name: string;
      value: string;
      image?: string;
    }>
  >([]);
  const [getTokenInfo] = useLazyQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      setAccessConditionsDsiplay([
        {
          name: 'Chain',
          value: tokenAccessCondition.chain,
        },
        {
          name: 'Token',
          image: data?.getTokenInfo.logoUrl,
          value: data?.getTokenInfo.name || tokenAccessCondition.contractAddress,
        },
        {
          name: 'Min. amount to hold:',
          value: tokenAccessCondition.minValue,
        },
      ]);
    },
    fetchPolicy: 'network-only',
  });

  const [getNFTInfo] = useLazyQuery(GET_NFT_INFO, {
    onCompleted: (data) => {
      setAccessConditionsDsiplay([
        {
          name: 'Chain',
          value: tokenAccessCondition.chain,
        },
        {
          name: 'Token',
          image: data?.getNFTInfo.logoUrl,
          value: data?.getNFTInfo.name || tokenAccessCondition.contractAddress,
        },
        {
          name: 'Min. amount to hold:',
          value: tokenAccessCondition.minValue,
        },
      ]);
    },
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    const getTokenDisplayInfo = async () => {
      const { contractAddress } = tokenAccessCondition;
      switch (tokenAccessCondition.type) {
        case 'ERC20':
          {
            getTokenInfo({
              variables: {
                contractAddress,
                chain: tokenAccessCondition.chain,
              },
            });
          }
          break;

        case 'ERC721':
          {
            getNFTInfo({
              variables: {
                contractAddress,
                chain: tokenAccessCondition.chain,
                tokenType: 'ERC721',
              },
            });
          }
          break;
        case 'ERC1155':
          {
            getNFTInfo({
              variables: {
                contractAddress,
                chain: tokenAccessCondition.chain,
                tokenType: 'ERC1155',
                tokenId: '98621154128753925190066773332738462629707461629451146306987043088493755528496',
              },
            });
          }
          break;
      }
    };

    if (tokenAccessCondition?.contractAddress) {
      getTokenDisplayInfo();
    }
  }, [tokenAccessCondition?.contractAddress]);
  return accessConditionsDsiplay;
}

export default useGetTokenDisplayInfo;
