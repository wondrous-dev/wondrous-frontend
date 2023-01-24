import { useEffect, useCallback, useState } from 'react';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { GET_POD_BY_ID } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';

export const useSelectedTab = () => {
  const [selectedTab, setSelectedTab] = useState('wallet');
  const PAYMENT_TABS = [
    { name: 'wallet', label: 'Wallet', action: () => setSelectedTab('wallet') },
    { name: 'off_platform', label: 'Off platform', action: () => setSelectedTab('off_platform') },
  ];
  return { selectedTab, setSelectedTab, PAYMENT_TABS };
};

export const useGetOrgOrPodWallet = (podId, orgId) => {
  const [wallets, setWallets] = useState([]);
  const [getPodById] = useLazyQuery(GET_POD_BY_ID);
  const [getOrgWallet] = useLazyQuery(GET_ORG_WALLET, {
    onCompleted: (data) => {
      setWallets(data?.getOrgWallet);
    },
    fetchPolicy: 'network-only',
  });
  const [getPodWallet] = useLazyQuery(GET_POD_WALLET, {
    fetchPolicy: 'network-only',
  });

  const getWallets = useCallback(
    async (podId, orgId) => {
      if (podId) {
        try {
          const result = await getPodWallet({
            variables: {
              podId,
            },
          });
          const podWallets = result?.data?.getPodWallet;
          if (podWallets && podWallets?.length >= 0) {
            setWallets(podWallets);
            return;
          }
          const podResult = await getPodById({
            variables: {
              podId,
            },
          });
          const pod = podResult?.data?.getPodById;
          getOrgWallet({
            variables: {
              orgId: pod?.orgId,
            },
          });
        } catch (err) {
          console.error(`failed to fetch wallet: ${err?.message}`);
        }
      } else if (orgId) {
        getOrgWallet({
          variables: {
            orgId,
          },
        });
      }
    },
    [podId, orgId]
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getWallets(podId, orgId);
  }, [podId, orgId, getWallets]);

  return wallets;
};
