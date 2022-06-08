import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery, gql, ApolloClient, InMemoryCache } from '@apollo/client';

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
import { ErrorText } from '../../Common';

import { ethers } from 'ethers';
import snapshot from '@snapshot-labs/snapshot.js';

// config to use proper snapshot hub address
const isTestSnapshot = true;
const hub = isTestSnapshot
  ? 'https://testnet.snapshot.org'
  : 'https://hub.snapshot.org'
const client = new snapshot.Client712(hub);

// snapshot graphql API
const snapshotAPI = isTestSnapshot
  ? 'https://testnet.snapshot.org/graphql'
  : 'https://hub.snapshot.org/graphql'

const cache = new InMemoryCache();
const snapshotClient = new ApolloClient({
  cache: cache,
  uri: snapshotAPI
});

const GET_SPACE = gql`
  query Space($id: String!) {
    space(id: $id) {
      id
      name
      about
      network
      symbol
      strategies {
        name
        network
        params
      }
      admins
      members
      filters {
        minScore
        onlyMembers
      }
      plugins
    }
  }
`

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

interface ISnapshotSpace {
  name: string;
  skin?: string;
  about?: string;
  admins?: string[];
  avatar?: string;
  github?: string;
  symbol?: string;
  filters?: any;
  members?: string[];
  network?: string;
  plugins?: any;
  twitter?: string;
  strategies?: any[];
  validation?: any;
}

const useSnapshot = () => {
  const [snapshotChecked, setSnapshotChecked] = useState(false)
  const [snapshotConnected, setSnapshotConnected] = useState(false)
  const [snapshotSpace, setSnapshotSpace] = useState({ name: '' })

  return {
    snapshotChecked,
    setSnapshotChecked,
    snapshotConnected,
    setSnapshotConnected,
    snapshotSpace,
    setSnapshotSpace
  }
}


const CHAIN_VALUE_TO_GNOSIS_CHAIN_VALUE = {
  eth_mainnet: 'mainnet',
  polygon_mainnet: 'polygon',
  rinkeby: 'rinkeby',
};
const Integrations = (props) => {
  const router = useRouter();
  const wonderWeb3 = useWonderWeb3();
  const { orgId, podId } = router.query;
  const [wallets, setWallets] = useState([]);
  const [selectedChain, setSelectedChain] = useState('eth_mainnet');
  const [walletName, setWalletName] = useState('');
  const [safeAddress, setSafeAddress] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('')

  // snapshot state
  const [snapshotName, setSnapshotName] = useState('')
  const {
    snapshotChecked,
    setSnapshotChecked,
    snapshotConnected,
    setSnapshotConnected,
    snapshotSpace,
    setSnapshotSpace
  } = useSnapshot()

  // snapshot api to retrieve space data
  const [getSpace] = useLazyQuery(GET_SPACE, {
    client: snapshotClient,
    onCompleted: data => {
      // check to see if data is returned from query
      if (data.space) {
        console.log(data.space)
        // check if queried space includes User's address
        console.log(data.space.admins)
        if (data.space.admins.includes(wonderWeb3.address)) {
          setSnapshotSpace(data.space)
          setSnapshotChecked(true)
          setErrorMessage('')
        } else {
          setErrorMessage(`User is not an admin of '${data.space.id}'`)
        }
      } else {
        setErrorMessage(`'${snapshotSpace.name}' not found. Please enter a valid Snapshot Space ENS.`)
      }
    },
    onError: error => {
      console.error(error)
    },
    fetchPolicy: 'cache-and-network'
  })

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

  const handleConnectSnapshotClick = () => {
    console.log(snapshotSpace)
  }

  const handleCheckSnapshotClick = async () => {
    const wallet = wonderWeb3.wallet
    const provider = new ethers.providers.Web3Provider(wonderWeb3.web3Provider)
    console.log(snapshotSpace.name)
    console.log(wonderWeb3.wallet)
    console.log(await provider.resolveName(snapshotSpace.name))
    await getSpace({ variables: { id: snapshotSpace.name }})
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
            { !snapshotChecked
                ? <>
                    <IntegrationsSnapshotHelperText>
                      Enter ENS Domain to connect
                    </IntegrationsSnapshotHelperText>
                    <IntegrationsSnapshotSubBlock>
                      <IntegrationsSnapshotInputSubBlock>
                        <IntegrationsSnapshotENSInput
                          value={snapshotSpace?.name}
                          placeholder="ENS domain"
                          onChange={(e) => setSnapshotSpace({ ...snapshotSpace, name: e.target.value })}
                        />
                        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                      </IntegrationsSnapshotInputSubBlock>
                      <IntegrationsSnapshotButton
                        onClick={handleCheckSnapshotClick}
                      >
                        Check Snapshot
                      </IntegrationsSnapshotButton>
                    </IntegrationsSnapshotSubBlock>
                  </>
                : <IntegrationsSnapshotButton
                    onClick={handleConnectSnapshotClick}
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
