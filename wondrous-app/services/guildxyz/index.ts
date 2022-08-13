import { useEffect, useState } from 'react';

// import specific Web3Provider snapshot is using
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { useWonderWeb3 } from '../web3';

const GUILD_BASE_URL = 'https://api.guild.xyz/v1';

const useGuildXyz = () => {
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
    for (let i = 0; i < guildIds.length; i += 1) {
      const guildId = guildIds[i];
      const url = `${GUILD_BASE_URL}/guild/${guildId}`;
      /* eslint-disable no-await-in-loop */
      const response = await fetch(url, {
        method: 'GET',
      });
      const guildInfo = await response.json();
      guildsInfo.push(guildInfo);
    }
    return guildsInfo;
  };

  const getGuildById = async (guildId: string) => {
    const url = `${GUILD_BASE_URL}/guild/${guildId}`;
    /* eslint-disable no-await-in-loop */
    const response = await fetch(url, {
      method: 'GET',
    });
    const guildInfo = await response.json();

    return guildInfo;
  };

  return {
    getGuildsJoinedByAddress,
    getGuildsByIds,
    getGuildById,
  };
};

export default useGuildXyz;
