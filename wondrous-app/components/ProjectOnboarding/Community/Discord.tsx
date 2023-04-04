import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import IntegrationFeatures from 'components/Settings/Integrations/Helpers/IntegrationFeatures';
import ConnectDiscordServer from 'components/Settings/Notifications/ConnectDiscordServer';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS } from 'graphql/queries';
import { useState } from 'react';
import { ANALYTIC_EVENTS } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import { ButtonsPanel, sendAnalyticsData } from '../Shared';
import { FEATURES, FEATURES_TYPES } from '../Shared/constants';

const DiscordIntegration = ({ nextStep }) => {
  const { orgId, setIsDiscordConnected } = useOrgBoard();
  const user = useMe();
  const { data, refetch } = useQuery(GET_ORG_DISCORD_NOTIFICATION_CONFIGS, {
    variables: {
      orgId,
    },
    onCompleted: (data) => {
      if (data?.getOrgDiscordNotificationConfig?.length) {
        setIsDiscordConnected(true);
      }
    },
    skip: !orgId,
  });

  const onSkip = () => {
    sendAnalyticsData(ANALYTIC_EVENTS.ONBOARDING_DISCORD_SETUP_SKIP, {
      orgId,
      userId: user?.id,
    });
    nextStep();
  };
  const handleOnConnect = () => {
    sendAnalyticsData(ANALYTIC_EVENTS.ONBOARDING_DISCORD_SETUP, {
      orgId,
      userId: user?.id,
    });
    refetch();
  };

  return (
    <Grid container direction="column" justifyContent="space-between" height="100%" gap="42px">
      <Grid display="flex" gap="24px" flexDirection="column">
        <ConnectDiscordServer
          orgId={orgId}
          title={data?.getOrgDiscordNotificationConfig?.length ? 'Discord connected' : 'Link Discord'}
          onConnect={handleOnConnect}
        />
        <Grid display="flex" gap="14px">
          <IntegrationFeatures
            features={FEATURES[FEATURES_TYPES.DISCORD]}
            label="Linking your Discord will enable these features:"
            typographyStyles={{
              fontWeight: 400,
            }}
          />
        </Grid>
      </Grid>
      <ButtonsPanel onContinue={nextStep} onSkip={onSkip} />
    </Grid>
  );
};

export default DiscordIntegration;
