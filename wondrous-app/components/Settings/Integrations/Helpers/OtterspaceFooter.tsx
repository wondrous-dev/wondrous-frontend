import { useMutation } from '@apollo/client';
import { CONNECT_GUILD_TO_ORG, CONNECT_OTTERSPACE_TO_ORG } from 'graphql/mutations';
import { useContext } from 'react';
import ConnectionContext from './ConnectionContext';
import FooterButtons from './FooterButtons';

const OtterspaceFooter = () => {
  const [connectOtterspaceToOrg] = useMutation(CONNECT_OTTERSPACE_TO_ORG, { refetchQueries: ['getOrgOtterspace'] });

  const { data, setData, orgId, podId, onClose } = useContext(ConnectionContext);
  const { connectedRaftId, selectedRaftId } = data;

  const title = connectedRaftId || !selectedRaftId ? '' : 'Connect Otterspace';

  const handleOtterspaceConnect = () => {
    if (!selectedRaftId) return;
    connectOtterspaceToOrg({
      variables: {
        orgId,
        raftId: selectedRaftId,
      },
    });
  };

  return <FooterButtons onClose={onClose} action={handleOtterspaceConnect} title={title} />;
};

export default OtterspaceFooter;
