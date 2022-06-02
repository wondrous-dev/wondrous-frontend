import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';
import { TableValueText, WalletAddressInput } from './styles';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';

import { CircularProgress } from '@material-ui/core';
import UserCheckIcon from '../../Icons/userCheckIcon';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { WalletsContainer } from './styles';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { CREATE_ORG_WALLET, CREATE_POD_WALLET } from 'graphql/mutations/wallet';
import WrenchIcon from '../../Icons/wrench';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import { useWonderWeb3 } from 'services/web3';
import { ErrorText } from '../../Common';
import { CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL } from '../../../utils/constants';
const LIMIT = 20;

const SUPPORTED_PAYMENT_CHAINS = [
  {
    label: 'Ethereum Mainnet',
    value: 'ethereum',
  },
  {
    label: 'Polygon Mainnet',
    value: 'polygon',
  },
  {
    label: 'Harmony Mainnet',
    value: 'harmony',
  },
  {
    label: 'Boba Mainnet',
    value: 'boba',
  },
  {
    label: 'Arbitrum Mainnet',
    value: 'arbitrum',
  },
];
if (!process.env.NEXT_PUBLIC_PRODUCTION) {
  SUPPORTED_PAYMENT_CHAINS.push({
    label: 'Ethereum Rinkeby',
    value: 'rinkeby',
  });
}

const Wallets = (props) => {
  const router = useRouter();
  const wonderWeb3 = useWonderWeb3();
  const { orgId, podId } = router.query;
  const [wallets, setWallets] = useState([]);
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [walletName, setWalletName] = useState('');
  const [safeAddress, setSafeAddress] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const emptyError = {
    safeAddressError: null,
  };
  const [errors, setErrors] = useState(emptyError);

  useEffect(() => {
    if (wonderWeb3?.onConnect) {
      wonderWeb3.onConnect();
    }
    setUserAddress(wonderWeb3.address);
  }, []);

  const [getOrgWallet, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_WALLET, {
    onCompleted: (data) => {
      setWallets(data?.getOrgWallet);
    },
    fetchPolicy: 'network-only',
  });
  const [getPodWallet] = useLazyQuery(GET_POD_WALLET, {
    onCompleted: (data) => {
      setWallets(data?.getPodWallet);
    },
    fetchPolicy: 'network-only',
  });

  const [createOrgWallet] = useMutation(CREATE_ORG_WALLET, {
    onCompleted: (data) => {
      setErrors(emptyError);
      setSafeAddress('');
      setWalletName('');
      // wallets.push(data?.createOrgWallet);
      // setWallets(wallets);
    },
    onError: (e) => {
      console.error(e);
    },
    refetchQueries: ['getOrgWallet'],
  });

  const [createPodWallet] = useMutation(CREATE_POD_WALLET, {
    onCompleted: (data) => {
      setErrors(emptyError);
      setSafeAddress('');
      setWalletName('');
      // wallets.push(data?.createPodWallet);
      // setWallets(wallets);
    },
    onError: (e) => {
      console.error(e);
    },
    refetchQueries: ['getPodWallet'],
  });

  const handleCreateWalletClick = async () => {
    const newError = emptyError;
    const safeServiceUrl = CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL[selectedChain];
    const safeService = new SafeServiceClient(safeServiceUrl);
    let checksumAddress;
    try {
      checksumAddress = wonderWeb3.toChecksumAddress(safeAddress);
    } catch (e) {
      newError.safeAddressError = `Cannot convert to checksum address`;
      setErrors(newError);
      return;
    }
    try {
      const safe = await safeService.getSafeInfo(checksumAddress);
    } catch (e) {
      if (String(e).includes('Not Found')) {
        newError.safeAddressError = `Safe address not deployed on ${selectedChain}`;
      } else {
        newError.safeAddressError = 'unknown gnosis network error';
      }
      setErrors(newError);
      return;
    }
    if (orgId) {
      createOrgWallet({
        variables: {
          input: {
            orgId,
            name: walletName,
            address: checksumAddress,
            chain: selectedChain,
          },
        },
      });
    } else if (podId) {
      createPodWallet({
        variables: {
          input: {
            podId,
            name: walletName,
            address: checksumAddress,
            chain: selectedChain,
          },
        },
      });
    }
    setErrors(newError);
  };
  useEffect(() => {
    if (orgId) {
      getOrgWallet({
        variables: {
          orgId,
        },
      });
    } else if (podId) {
      getPodWallet({
        variables: {
          podId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, podId]);

  return (
    <SettingsWrapper>
      <WalletsContainer>
        <HeaderBlock
          // icon={<WrenchIcon circle />}
          title="Configure Wallets"
          description="Set up your multisig wallet to pay contributors"
        />
        <StyledTableContainer>
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell align="center" width="30%">
                  Name
                </StyledTableCell>
                <StyledTableCell align="center" width="30%">
                  Address
                </StyledTableCell>
                <StyledTableCell align="center" width="40%">
                  Chain
                </StyledTableCell>
              </StyledTableRow>
            </StyledTableHead>
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {loading && <CircularProgress />}
            </div>
            <StyledTableBody>
              {wallets &&
                wallets.map((wallet) => {
                  return (
                    <StyledTableRow key={wallet?.id}>
                      <StyledTableCell>
                        <TableValueText>{wallet.name}</TableValueText>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableValueText>{wallet.address}</TableValueText>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TableValueText>{wallet.chain}</TableValueText>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <WalletAddressInput placeholder="Name" value={walletName} onChange={(e) => setWalletName(e.target.value)} />
          <WalletAddressInput
            placeholder="Safe Address"
            value={safeAddress}
            onChange={(e) => setSafeAddress(e.target.value)}
          />
          <DropdownSelect
            value={selectedChain}
            options={SUPPORTED_PAYMENT_CHAINS}
            setValue={setSelectedChain}
            onChange={(e) => {}}
            innerStyle={{
              marginTop: 0,
            }}
            formSelectStyle={{
              height: 'auto',
            }}
          />
        </div>
        {errors.safeAddressError && <ErrorText> {errors.safeAddressError} </ErrorText>}
        <CreateFormPreviewButton
          style={{
            marginLeft: 0,
            marginTop: '32px',
          }}
          onClick={handleCreateWalletClick}
        >
          Add wallet
        </CreateFormPreviewButton>
      </WalletsContainer>
    </SettingsWrapper>
  );
};

export default Wallets;
