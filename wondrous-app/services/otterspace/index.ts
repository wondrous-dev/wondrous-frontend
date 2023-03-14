import { useEffect, useState } from 'react';
import axios from 'axios';

import { useWonderWeb3 } from '../web3';

const GUILD_BASE_URL = 'https://api.thegraph.com/subgraphs/name/otterspace-xyz/badges-goerli';

const useOtterspace = () => {
  const getRaftInfo = async (raftId: string) => {
    const url = GUILD_BASE_URL;
    const query = `
    {
      raft(id: "${raftId}") {
        id
        metadata {
          name
          image
        }
      }
    }
    `;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
      }),
    });
    const res = await response.json();
    return res?.data;
  };

  const getRaftWithSpecs = async (raftId: string) => {
    const url = GUILD_BASE_URL;
    const query = `
    {
      raft(id: "${raftId}") {
        id
        metadata {
          name
        }
        totalSpecsCount
        totalBadgesCount
        specs {
          id
          totalBadgesCount
          metadata {
            name
            image
          }
        }
      }
    }
    
    
    `;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
      }),
    });
    const res = await response.json();
    return res?.data;
  };

  const getBadgeSpec = async (badgeId: string) => {
    const url = GUILD_BASE_URL;
    const query = `
    {
      badgeSpec(id: "${badgeId}") {
        id
        metadata {
          name
          description
          image
        }
      }
    }    `;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
      }),
    });
    const res = await response.json();
    return res?.data;
  };

  return {
    getRaftInfo,
    getRaftWithSpecs,
    getBadgeSpec,
  };
};

export default useOtterspace;
