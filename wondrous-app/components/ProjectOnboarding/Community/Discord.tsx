import { Grid } from '@mui/material';
import IntegrationFeatures from 'components/Settings/Integrations/Helpers/IntegrationFeatures';
import ConnectDiscordServer from 'components/Settings/Notifications/ConnectDiscordServer';
import { useState } from 'react';
import { ButtonsPanel } from '../Shared';
import { FEATURES, FEATURES_TYPES } from '../Shared/constants';

const DiscordIntegration = ({ nextStep }) => {
  const [isConnected, setIsConnected] = useState(false);
  const onConnect = () => setIsConnected(true);

  return (
    <Grid container direction="column" justifyContent="space-between" height="100%">
      <Grid display="flex" gap="24px" flexDirection="column">
        <ConnectDiscordServer
          orgId=""
          title={isConnected ? 'Discord connected' : 'Link Discord'}
          onConnect={onConnect}
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
