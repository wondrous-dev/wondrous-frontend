import { HeaderButton } from 'components/organization/wrapper/styles';
import Button from 'components/Button';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { Grid } from '@mui/material';
import { useSnapshot, getSnapshotUrl } from 'services/snapshot';

const SnapshotFooter = ({ onClose, connectionParams, orgId }) => {
  const { enteredSnapshotId } = connectionParams;
  const {
    getSnapshotSpaceAndValidateAdmin,

    snapshotConnected,
    isSnapshotAdmin,
    snapshotSpace,
    connectSnapshotToOrg,
  } = useSnapshot();

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
  return (
    <Grid display="flex" gap="12px">
      <Button
        onClick={onClose}
        buttonTheme={{
          background: palette.grey75,
          borderColor: 'transparent',
          fontSize: '14px',
          fontWeight: 500,
          paddingX: 24,
          paddingY: 8,
          maxHeight: '35px',
          hover: {
            background: palette.grey76,
          },
        }}
      >
        Cancel
      </Button>
      <HeaderButton reversed onClick={action}>
        {title}
      </HeaderButton>
    </Grid>
  );
};

export default SnapshotFooter;
