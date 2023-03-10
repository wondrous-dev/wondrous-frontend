import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ErrorText } from 'components/Common';
import DropdownSelect from 'components/Common/DropdownSelect';
import { StyledNextLink } from 'components/Common/text';
import {
  IntegrationsConnectButton,
  IntegrationsDisconnectButton,
  IntegrationsHelperText,
  IntegrationsInputsBlock,
  IntegrationsSnapshotENSInput,
  IntegrationsSnapshotInputSubBlock,
  IntegrationsSnapshotSubBlock,
} from 'components/Settings/Integrations/styles';
import { LabelBlock } from 'components/Settings/styles';
import { CONNECT_OTTERSPACE_TO_ORG, DISCONNECT_OTTERSPACE_TO_ORG } from 'graphql/mutations';
import { GET_ORG_OTTERSPACE, GET_OTTERSPACE_RAFTS } from 'graphql/queries';
import { useContext, useEffect, useState } from 'react';
import useOtterspace from 'services/otterspace';
import { useWonderWeb3 } from 'services/web3';
import ConnectionContext from '../Integrations/Helpers/ConnectionContext';

export default function OtterspaceIntegration() {
  const { orgId, setData, data } = useContext(ConnectionContext);
  const { connectedRaftId = null, connectedRaftName = '', selectedRaftId = null } = data;

  const wonderWeb3 = useWonderWeb3();
  const { getRaftInfo } = useOtterspace();
  const [availableRafts, setAvailableRafts] = useState([]);
  const connectWeb3 = async () => {
    await wonderWeb3.onConnect();
  };
  const [getOtterspaceRafts, { data: otterspaceRaftsData }] = useLazyQuery(GET_OTTERSPACE_RAFTS, {
    fetchPolicy: 'network-only',
  });
  const { data: connectedOtterspaceData } = useQuery(GET_ORG_OTTERSPACE, {
    variables: {
      orgId,
    },
    onCompleted: (data) => {
      const raftId = data?.getOrgOtterspace?.raftId;
      setData((prev) => ({ ...prev, connectedRaftId: raftId }));
      getRaftInfo(raftId).then((res) => {
        const { raft } = res;
        const raftName = raft?.metadata?.name;
        setData((prev) => ({ ...prev, connectedRaftName: raftName }));
      });
    },
    skip: !orgId,
    fetchPolicy: 'network-only',
  });

  const getAvailableRafts = async () => {
    console.log('wonderWeb3?.address', wonderWeb3?.address);
    const { data } = await getOtterspaceRafts({
      variables: { walletAddress: '0x304C6479a657A073DaaB19Ff37E1641d766083A9' },
    });

    const { availableOtterspaceRaftsToConnect } = data;
    console.log('availableOtterspaceRaftsToConnect', availableOtterspaceRaftsToConnect);
    setAvailableRafts(availableOtterspaceRaftsToConnect);
  };
  const raftOptions = availableRafts.map((raft) => ({ value: raft.raftId, label: raft.raftName }));

  const [disconnectOtterspaceFromOrg] = useMutation(DISCONNECT_OTTERSPACE_TO_ORG, {
    onCompleted: () => {
      setData((prev) => ({ ...prev, connectedRaftId: null, connectedRaftName: '' }));
    },
    refetchQueries: [GET_ORG_OTTERSPACE],
  });

  useEffect(() => {
    connectWeb3();
  }, []);

  useEffect(() => {
    if (wonderWeb3.address) {
      getAvailableRafts();
    }
  }, [wonderWeb3.address]);

  const handleOtterspaceDisconnect = () => {
    disconnectOtterspaceFromOrg({
      variables: {
        orgId,
      },
    });
  };
  return (
    <IntegrationsInputsBlock>
      <LabelBlock>Otterspace config</LabelBlock>
      {connectedRaftId && (
        <div>
          <IntegrationsHelperText>Connected Otterspace:</IntegrationsHelperText>
          <IntegrationsSnapshotSubBlock>
            <IntegrationsSnapshotInputSubBlock>
              <IntegrationsSnapshotENSInput value={connectedRaftName} />
            </IntegrationsSnapshotInputSubBlock>
            <IntegrationsDisconnectButton onClick={handleOtterspaceDisconnect}>
              Disconnect Otterspace
            </IntegrationsDisconnectButton>
          </IntegrationsSnapshotSubBlock>
        </div>
      )}
      {!connectedRaftId && (
        <div>
          <IntegrationsHelperText>Rafts you are owner of</IntegrationsHelperText>
          <IntegrationsSnapshotSubBlock>
            <DropdownSelect
              value={data?.selectedRaftId}
              options={raftOptions}
              setValue={(value) => setData((prev) => ({ ...prev, selectedRaftId: value }))}
              formSelectStyle={{
                height: 'auto',
              }}
              innerStyle={{
                marginTop: '0',
                background: '#272729',
              }}
            />
          </IntegrationsSnapshotSubBlock>
          {availableRafts?.length === 0 && (
            <ErrorText>
              {' '}
              You are not owner of any rafts! Go to{' '}
              <a href="https://otterspace.xyz/" target="-blank">
                Otterspace
              </a>{' '}
              to join or create a raft{' '}
            </ErrorText>
          )}
        </div>
      )}
      <StyledNextLink href={`/organization/settings/${orgId}/token-gating`}>
        Set up Otterspace badge gating
      </StyledNextLink>
    </IntegrationsInputsBlock>
  );
}
