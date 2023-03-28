import { Grid } from '@mui/material';
import { OrgInviteLinkComponent } from 'components/Common/InviteLinkModal/OrgInviteLink';
import { useOrgBoard } from 'utils/hooks';
import { ButtonsPanel } from '../Shared';

const InviteCollaborators = ({ nextStep }) => {
  const { orgData } = useOrgBoard();
  return (
    <Grid container justifyContent="space-between" direction="column" height="100%" gap="42px">
      <Grid gap="14px" display="flex" flexDirection="column">
        <OrgInviteLinkComponent
          gradientStyles={{
            fontSize: '16px',
            mb: '0',
          }}
          hideDivider
          orgId={orgData?.orgId}
        />
      </Grid>
      <ButtonsPanel onContinue={nextStep} nextTitle="Complete" />
    </Grid>
  );
};

export default InviteCollaborators;
