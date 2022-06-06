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
import { GET_SPACE } from 'services/snapshot/gql';

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


const Integrations = (props) => {
  const router = useRouter();
  const wonderWeb3 = useWonderWeb3();
  const { orgId, podId } = router.query;
  const [userAddress, setUserAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('')

  // snapshot state
  const [snapshotName, setSnapshotName] = useState('')
  const {
    snapshotChecked,
    setSnapshotChecked,
    snapshotConnected,
    snapshotSpace,
    setSnapshotSpace,
    // connectSnapshotSpace,
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
          setErrorMessage(`User is not an admin of '${data.space.id}' Please update ENS text record or enter administered Snapshot`)
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


  useEffect(() => {
    if (wonderWeb3?.onConnect) {
      wonderWeb3.onConnect();
    }
    setUserAddress(wonderWeb3.address);
  }, []);

  const handleConnectSnapshotSpace = () => {
    // await connectSnapshotSpace({ variables: {
    //   orgId,
    //   key: snapshotSpace.id,
    //   url: getSnapshotUrl(snapshotName),
    //   displayName: snapshotSpace.name,
    // }});
  }

  const handleCheckSnapshotClick = async () => {
    const wallet = wonderWeb3.wallet
    const provider = new ethers.providers.Web3Provider(wonderWeb3.web3Provider)
    console.log(snapshotSpace.name)
    console.log(await provider.resolveName(snapshotSpace.name))
    await getSpace({ variables: { id: snapshotSpace.name }})
  }


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
                    onClick={handleConnectSnapshotSpace}
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
