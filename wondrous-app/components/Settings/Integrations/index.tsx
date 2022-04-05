import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery, ApolloClient, InMemoryCache } from '@apollo/client';
import ENS, { getEnsAddress } from '@ensdomains/ensjs'

import { SettingsWrapper } from '../settingsWrapper'; import { HeaderBlock } from '../headerBlock';
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
import { GET_POD_ORG_ID } from '../../../graphql/queries/pod';
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
    snapshot,
    snapshotName,
    setSnapshotName,
    snapshotValid,
    setSnapshotValid,
    snapshotConnected,
    snapshotSpace,
    setSnapshotSpace,
    snapshotError,
    checkSnapshotSpace,
    getSnapshot,
    connectSnapshot,
    disconnectSnapshot
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

  const [getOrgId] = useLazyQuery(GET_POD_ORG_ID, {
    onError: error => {
      console.error(error)
    }
  });

  const handleCheckSnapshotSpace = async () => {
    const wallet = wonderWeb3.wallet;
    const provider = new ethers.providers.Web3Provider(wonderWeb3.web3Provider);

    await provider.resolveName(snapshotName);

    const ens = new ENS({ provider, ensAddress: getEnsAddress(`${await provider._network.chainId}`) });
    const name = await ens.name(snapshotName);

    const { data } = await checkSnapshotSpace({ variables: { id: snapshotName }});
    console.log('result', data);
    //const snapshotSpace = data;
    setSnapshotSpace({ ...data, id: snapshotName})
  }

  const handleConnectSnapshot = async () => {
    //console.log('connect snapshot')
    await connectSnapshot({ variables: {
      orgId,
      key: snapshotSpace.id,
      url: getSnapshotUrl(snapshotName),
      displayName: snapshotSpace.name,
    }})
  }

  const handleDisconnectSnapshot = async () => {
    //console.log('disconnect snapshot')
    await disconnectSnapshot({ variables: {
      orgId,
      key: '',
      url: '',
      displayName: ''
    }})
  }

  useEffect(async () => {
    if (orgId) {
      //console.log('getting snapshot')
      getSnapshot({
        variables: {
          orgId,
        },
      })
    } else if (podId) {
      const { data } = await getOrgId({
        variables: {
          podId,
        },
      })
      const orgId = await data.getPodById.orgId
      console.log(orgId)

      getSnapshot({
        variables: {
          orgId
        },
      })

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, podId]);

  useEffect(() => {
    if (snapshotValid) {
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
                          disabled={podId ? true : false}
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
                              onClick={handleCheckSnapshotSpace}
                              disabled={podId ? true : false}
                            >
                              Check Snapshot
                            </IntegrationsSnapshotButton>
                          : <IntegrationsSnapshotButton
                              onClick={handleConnectSnapshot}
                              disabled={podId ? true : false}
                            >
                              Connect Snapshot
                            </IntegrationsSnapshotButton>
                      }
                    </IntegrationsSnapshotSubBlock>
                  </>
                : <>
                    <IntegrationsSnapshotHelperText>
                      Snapshot connected:
                    </IntegrationsSnapshotHelperText>
                    <IntegrationsSnapshotSubBlock>
                      <IntegrationsSnapshotInputSubBlock>
                        <IntegrationsSnapshotENSInput
                          value={snapshot.key}
                          disabled
                        />
                      </IntegrationsSnapshotInputSubBlock>
                      <IntegrationsSnapshotButton
                        onClick={handleDisconnectSnapshot}
                        disabled={podId ? true : false}
                      >
                        Disconnect Snapshot
                      </IntegrationsSnapshotButton>
                    </IntegrationsSnapshotSubBlock>
                  </>
            }
          </IntegrationsSnapshotBlock>
        </IntegrationsInputsBlock>
      </IntegrationsContainer>
    </SettingsWrapper>
  );
};

export default Integrations;
