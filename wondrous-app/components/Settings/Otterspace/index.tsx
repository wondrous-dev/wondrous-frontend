import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_OTTERSPACE, GET_OTTERSPACE_RAFTS } from 'graphql/queries';
import { CONNECT_OTTERSPACE_TO_ORG, DISCONNECT_OTTERSPACE_TO_ORG } from 'graphql/mutations';
import {
  IntegrationsInputsBlock,
  IntegrationsHelperText,
  IntegrationsSnapshotSubBlock,
  IntegrationsSnapshotInputSubBlock,
  IntegrationsConnectButton,
  IntegrationsDisconnectButton,
  IntegrationsSnapshotENSInput,
} from 'components/Settings/Integrations/styles';
import { LabelBlock } from 'components/Settings/styles';
import { useWonderWeb3 } from 'services/web3';
import DropdownSelect from 'components/Common/DropdownSelect';
import useOtterspace from 'services/otterspace';
import { ErrorText } from 'components/Common';

export default function OtterspaceIntegration({ orgId }) {
  const wonderWeb3 = useWonderWeb3();
  const { getRaftInfo } = useOtterspace();
  const [availableRafts, setAvailableRafts] = useState([]);
  const [selectedRaftId, setSelectedRaftId] = useState([]);
  const [connectedRaftId, setConnectedRaftId] = useState(null);
  const [connectedRaftName, setConnectedRaftName] = useState('');
  const connectWeb3 = async () => {
    await wonderWeb3.onConnect();
  };
  const [getOtterspaceRafts, { data }] = useLazyQuery(GET_OTTERSPACE_RAFTS, {
    fetchPolicy: 'network-only',
  });
  const { data: connectedOtterspaceData } = useQuery(GET_ORG_OTTERSPACE, {
    variables: {
      orgId,
    },
    onCompleted: (data) => {
      const raftId = data?.getOrgOtterspace?.raftId;
      setConnectedRaftId(raftId)
      getRaftInfo(raftId).then((res) => {
        const {raft} = res
        const raftName = raft?.metadata?.name
        setConnectedRaftName(raftName);
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

  const [connectOtterspaceToOrg] = useMutation(CONNECT_OTTERSPACE_TO_ORG, { refetchQueries: [GET_ORG_OTTERSPACE] });
  const [disconnectOtterspaceFromOrg] = useMutation(DISCONNECT_OTTERSPACE_TO_ORG, {
    onCompleted: () => {
      setConnectedRaftId(null);
      setConnectedRaftName('');
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

  useEffect(() => {}, []);
  const handleOtterspaceConnect = () => {
    if (!selectedRaftId) return;
    connectOtterspaceToOrg({
      variables: {
        orgId,
        raftId: selectedRaftId,
      },
    });
  };
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
              value={selectedRaftId}
              options={raftOptions}
              setValue={setSelectedRaftId}
              formSelectStyle={{
                height: 'auto',
              }}
              innerStyle={{
                marginTop: '0',
                background: '#272729',
              }}
            />
            <IntegrationsConnectButton onClick={handleOtterspaceConnect}>
              Connect Otterspace raft
            </IntegrationsConnectButton>
          </IntegrationsSnapshotSubBlock>
          {availableRafts?.length === 0 && (
            <ErrorText>
              {' '}
              You are not owner of any rafts! Go to{' '}
              <a href="https://otterspace.xyz/" target="-blank">
                Otterspace
              </a>{' '}
              to join a create a raft{' '}
            </ErrorText>
          )}
        </div>
      )}
    </IntegrationsInputsBlock>
  );
}
