import React from 'react';

import { useRouter } from 'next/router';
import SnapshotConfigSection from 'components/Settings/Integrations/SnapshotConfig';
import SettingsWrapper from 'components/Common/SidebarSettings';
import HeaderBlock from 'components/Settings/headerBlock';

import { GithubIntegration } from 'components/Settings/Github';
import GuildIntegration from 'components/Settings/Guild';

import { Grid } from '@mui/material';
import { INTEGRATIONS } from './constants';

import { IntegrationsContainer } from './styles';
import IntegrationsCard from './IntegrationsCard';

function Integrations(props) {
  const router = useRouter();
  const { orgId, podId } = router.query;

  return (
    <SettingsWrapper fullWidth>
      <IntegrationsContainer>
        <HeaderBlock title="Integrations" description="Connect and edit integration settings" />
        {/* <SnapshotConfigSection orgId={orgId} podId={podId} />
        <GithubIntegration orgId={orgId} />
        <GuildIntegration orgId={orgId} /> */}
        <Grid flexWrap="wrap" display="flex" gap="14px">
          {INTEGRATIONS.map((integration) => (
            <IntegrationsCard integration={integration} key={integration.type} />
          ))}
        </Grid>
      </IntegrationsContainer>
    </SettingsWrapper>
  );
}

export default Integrations;
