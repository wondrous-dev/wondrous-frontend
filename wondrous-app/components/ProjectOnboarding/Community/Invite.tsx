import { Grid } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import { OrgInviteLinkComponent } from 'components/Common/InviteLinkModal/OrgInviteLink';
import { ANALYTIC_EVENTS } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import { ButtonsPanel, sendAnalyticsData } from '../Shared';

const InviteCollaborators = ({ nextStep }) => {
  const { orgData } = useOrgBoard();
  const user = useMe();
  const postInviteLinkCreate = () => {
    sendAnalyticsData(ANALYTIC_EVENTS.ONBOARDING_INVITE_LINK_COPY, {
      orgId: orgData?.orgId,
      userId: user?.id,
    });
  };

  const postEmailInvite = () => {
    sendAnalyticsData(ANALYTIC_EVENTS.ONBOARDING_EMAIL_INVITES, {
      orgId: orgData?.orgId,
      userId: user?.id,
    });
  };

  return (
    <Grid container justifyContent="space-between" direction="column" height="100%" gap="42px">
      <Grid gap="14px" display="flex" flexDirection="column">
        <OrgInviteLinkComponent
          gradientStyles={{
            fontSize: '16px',
            mb: '0',
          }}
          postInviteLinkCreate={postInviteLinkCreate}
          hideDivider
          postEmailInvite={postEmailInvite}
          orgId={orgData?.orgId}
        />
      </Grid>
      <ButtonsPanel onContinue={nextStep} nextTitle="Complete" />
    </Grid>
  );
};

export default InviteCollaborators;
