import { HeaderButton } from 'components/organization/wrapper/styles';
import Button from 'components/Button';
import palette from 'theme/palette';
import { Grid } from '@mui/material';
import { getSnapshotUrl } from 'services/snapshot';
import { useContext } from 'react';
import ConnectionContext from './ConnectionContext';
import FooterButtons from './FooterButtons';

const SnapshotFooter = () => {
  const { onClose, data, orgId } = useContext(ConnectionContext);
  const {
    enteredSnapshotId,
    connectSnapshotToOrg,
    snapshotSpace,
    snapshotConnected,
    isSnapshotAdmin,
    getSnapshotSpaceAndValidateAdmin,
  } = data;
  const handleCheckSnapshotClick = async () => {
    await getSnapshotSpaceAndValidateAdmin({ variables: { id: enteredSnapshotId } });
  };

  const handleConnectSnapshotSpace = async () => {
    await connectSnapshotToOrg({
      variables: {
        orgId,
        input: {
          snapshotEns: snapshotSpace.id,
          name: snapshotSpace.name,
          symbol: snapshotSpace.symbol,
          url: getSnapshotUrl(snapshotSpace.id),
          network: snapshotSpace.network,
        },
      },
    });
  };

  const isChecked = !snapshotConnected && isSnapshotAdmin && snapshotSpace?.id;
  const title = isChecked ? `Connect Snapshot: ${snapshotSpace?.name}` : 'Check Snapshot';
  const action = isChecked ? handleConnectSnapshotSpace : handleCheckSnapshotClick;
  return <FooterButtons onClose={onClose} action={action} title={title} />;
};

export default SnapshotFooter;
