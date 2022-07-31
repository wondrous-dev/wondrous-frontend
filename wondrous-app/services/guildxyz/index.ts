import { useEffect, useState } from 'react';

import { useLazyQuery, useMutation, gql, ApolloClient, InMemoryCache } from '@apollo/client';

// import specific Web3Provider snapshot is using
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { useWonderWeb3 } from '../web3';
import apollo from 'services/apollo';

const GUILD_BASE_URL = 'https://api.guild.xyz/v1';

export const useGuildXyz = () => {
  const wonderWeb3 = useWonderWeb3();

  const getGuildsJoinedByAddress = async (address: string) => {
    const url = `${GUILD_BASE_URL}/user/membership/${address}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    const guilds = await response.json();
    return guilds;
  };

  const getGuildsByIds = async (guildIds: string[]) => {
    const guildsInfo = [];
    for (let i = 0; i < guildIds.length; i++) {
      let guildId = guildIds[i];
      const url = `${GUILD_BASE_URL}/guild/${guildId}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      const guildInfo = await response.json();
      guildsInfo.push(guildInfo);
    }
    return guildsInfo;
  };

  return {
    getGuildsJoinedByAddress,
    getGuildsByIds,
  };
};
