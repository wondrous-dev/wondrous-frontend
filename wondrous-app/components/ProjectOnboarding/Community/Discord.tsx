import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import IntegrationFeatures from 'components/Settings/Integrations/Helpers/IntegrationFeatures';
import ConnectDiscordServer from 'components/Settings/Notifications/ConnectDiscordServer';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS } from 'graphql/queries';
import { useState } from 'react';
import { useOrgBoard } from 'utils/hooks';
import { ButtonsPanel } from '../Shared';
import { FEATURES, FEATURES_TYPES } from '../Shared/constants';

const DiscordIntegration = ({ nextStep }) => {
  const { orgId } = useOrgBoard();
  const { data, refetch } = useQuery(GET_ORG_DISCORD_NOTIFICATION_CONFIGS, {
    variables: {
      orgId,
    },
    skip: !orgId,
  });

  return (
    <Grid container direction="column" justifyContent="space-between" height="100%" gap="42px">
      <Grid display="flex" gap="24px" flexDirection="column">
        <ConnectDiscordServer
          orgId={orgId}
          title={data?.getOrgDiscordNotificationConfig?.length ? 'Discord connected' : 'Link Discord'}
          onConnect={refetch}
        />
        <Grid display="flex" gap="14px">
          {/* <PageLabel fontSize="13px">Linking your Twitter will enable these features:</PageLabel> */}
          <IntegrationFeatures
            features={FEATURES[FEATURES_TYPES.DISCORD]}
            label="Linking your Discord will enable these features:"
            typographyStyles={{
              fontWeight: 400,
            }}
          />
        </Grid>
      </Grid>
      <ButtonsPanel onContinue={nextStep} onSkip={nextStep} />
    </Grid>
  );
};

export default DiscordIntegration;
