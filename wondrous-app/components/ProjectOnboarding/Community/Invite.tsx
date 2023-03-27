import { Grid } from '@mui/material';
import { OrgInviteLinkComponent } from 'components/Common/InviteLinkModal/OrgInviteLink';
import { ButtonsPanel } from '../Shared';

const InviteCollaborators = ({ nextStep }) => (
  <Grid container justifyContent="space-between" direction="column" height="100%" gap="42px">
    <Grid gap="14px" display="flex" flexDirection="column">
      <OrgInviteLinkComponent
        gradientStyles={{
          fontSize: '16px',
          mb: '0',
        }}
        hideDivider
        orgId=""
      />
    </Grid>
    <ButtonsPanel onContinue={nextStep} nextTitle="Complete" />
  </Grid>
);

export default InviteCollaborators;
