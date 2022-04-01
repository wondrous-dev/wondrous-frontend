import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery, ApolloClient, InMemoryCache } from '@apollo/client';
import ENS, { getEnsAddress } from '@ensdomains/ensjs'

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
import {
  TableValueText,
  IntegrationsAddressInput,
  IntegrationsSnapshotBlock,
  IntegrationsInputsBlock,
  IntegrationsSnapshotENSInput,
  IntegrationsSnapshotSubBlock,
  IntegrationsSnapshotInputSubBlock,
  IntegrationsSnapshotHelperText,
  IntegrationsSnapshotValidText,
  IntegrationsSnapshotButton,
  LabelBlock,
  LabelBlockText
} from './styles';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';

import { CircularProgress } from '@material-ui/core';
import UserCheckIcon from '../../Icons/userCheckIcon';
import { useRouter } from 'next/router';
import { IntegrationsContainer } from './styles';
import { GET_ORG_WALLET, GET_POD_WALLET } from '../../../graphql/queries/wallet';
import { CREATE_ORG_WALLET, CREATE_POD_WALLET } from '../../../graphql/mutations/wallet';
import WrenchIcon from '../../Icons/wrench';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import { useWonderWeb3 } from '../../../services/web3';
import { getSnapshotUrl, useSnapshot } from '../../../services/snapshot';
import { ErrorText } from '../../Common';

import { ethers } from 'ethers';

const CHAIN_VALUE_TO_GNOSIS_CHAIN_VALUE = {
  eth_mainnet: 'mainnet',
  polygon_mainnet: 'polygon',
  rinkeby: 'rinkeby',
};

const SUPPORTED_PAYMENT_CHAINS = [
  {
    label: 'Ethereum Mainnet',
    value: 'eth_mainnet',
  },
  {
    label: 'Polygon Mainnet',
    value: 'polygon_mainnet',
  },
];
if (!process.env.NEXT_PUBLIC_PRODUCTION) {
  SUPPORTED_PAYMENT_CHAINS.push({
    label: 'Ethereum Rinkeby',
    value: 'rinkeby',
  });
}

const Integrations = (props) => {
  const router = useRouter();
  const wonderWeb3 = useWonderWeb3();
  const { orgId, podId } = router.query;
  const [wallets, setWallets] = useState([]);
  const [selectedChain, setSelectedChain] = useState('eth_mainnet');
  const [walletName, setWalletName] = useState('');
  const [safeAddress, setSafeAddress] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // snapshot state
  const {
    EMPTY_SPACE,
    snapshotName,
    setSnapshotName,
    snapshotValid,
    setSnapshotValid,
    snapshotConnected,
    snapshotSpace,
    setSnapshotSpace,
    snapshotError,
    getSpace,
    checkSnapshot,
    connectSnapshot
  } = useSnapshot();


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

  const [getOrgWallet] = useLazyQuery(GET_ORG_WALLET, {
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

  const handleCheckSnapshot = async () => {
    const wallet = wonderWeb3.wallet;
    const provider = new ethers.providers.Web3Provider(wonderWeb3.web3Provider);

    console.log(await provider.resolveName(snapshotName));
    const ens = new ENS({ provider, ensAddress: getEnsAddress(`${provider._network.chainId}`) });
    const name = await ens.name(snapshotName)

    await checkSnapshot({ variables: { id: snapshotName }})
    setSnapshotSpace({ ...snapshotSpace, id: snapshotName})
  }

  const handleConnectSnapshot = async () => {
    console.log('connect snapshot')
    console.log(orgId)
    console.log(snapshotName)
    await connectSnapshot({ variables: {
      orgId,
      displayName: snapshotSpace.name,
      url: getSnapshotUrl(snapshotName)
    }})
  }

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

  useEffect(async () => {
    if (snapshotValid) {
      console.log('valid!')
      setSnapshotValid(false)
      setSnapshotSpace(EMPTY_SPACE)
    }
  }, [snapshotName])

  return (
    <SettingsWrapper>
      <IntegrationsContainer>
        <HeaderBlock
          // icon={<WrenchIcon circle />}
          title="Integrations Settings"
          description="Set up Wonder integrations with external applications"
        />
        <IntegrationsInputsBlock>
          <IntegrationsSnapshotBlock>
            <LabelBlock>Snapshot Settings</LabelBlock>
            { !snapshotConnected
                ? <>
                    <IntegrationsSnapshotHelperText>
                      Enter ENS Domain to connect
                    </IntegrationsSnapshotHelperText>
                    <IntegrationsSnapshotSubBlock>
                      <IntegrationsSnapshotInputSubBlock>
                        <IntegrationsSnapshotENSInput
                          value={snapshotName}
                          placeholder="ENS domain"
                          onChange={e => setSnapshotName(e.target.value)}
                        />
                        {snapshotError && <ErrorText>{snapshotError}</ErrorText>}
                        {snapshotValid && (
                          <IntegrationsSnapshotValidText>
                            User is admin of '{snapshotSpace.id}'. Ready to connect.
                          </IntegrationsSnapshotValidText>
                        )}
                      </IntegrationsSnapshotInputSubBlock>
                      { !snapshotValid
                          ? <IntegrationsSnapshotButton
                              onClick={handleCheckSnapshot}
                            >
                              Check Snapshot
                            </IntegrationsSnapshotButton>
                          : <IntegrationsSnapshotButton
                              onClick={handleConnectSnapshot}
                            >
                              Connect Snapshot
                            </IntegrationsSnapshotButton>
                      }
                    </IntegrationsSnapshotSubBlock>
                  </>
                : <IntegrationsSnapshotButton
                    onClick={handleConnectSnapshot}
                  >
                    Connect Snapshot
                  </IntegrationsSnapshotButton>
            }
          </IntegrationsSnapshotBlock>
        </IntegrationsInputsBlock>
      </IntegrationsContainer>
    </SettingsWrapper>
  );
};

export default Integrations;
