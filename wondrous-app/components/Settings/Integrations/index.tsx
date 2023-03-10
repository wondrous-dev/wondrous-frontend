import React, { useMemo, useState } from 'react';

import SettingsWrapper from 'components/Common/SidebarSettings';
import HeaderBlock from 'components/Settings/headerBlock';

import { Grid } from '@mui/material';

import { useQuery } from '@apollo/client';
import { Spinner, SpinnerWrapper } from 'components/Dashboard/bounties/styles';
import { GET_ORG_INTEGRATIONS, GET_POD_INTEGRATIONS } from 'graphql/queries';
import { FILTER_TYPES, INTEGRATION_TYPES } from './constants';
import Filters from './Filters';
import IntegrationsCard from './IntegrationsCard';
import { IntegrationsContainer } from './styles';

interface Props {
  orgId: string | string[];
  podId?: string | string[];
}

function Integrations({ orgId, podId }: Props) {
  const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.ALL);

  const { data: orgIntegrations, loading: orgIntegrationsLoading } = useQuery(GET_ORG_INTEGRATIONS, {
    variables: {
      orgId,
    },
    skip: !!podId,
  });

  const { data: podIntegrations, loading: podIntegrationsLoading } = useQuery(GET_POD_INTEGRATIONS, {
    variables: {
      podId,
    },
    skip: !podId,
  });

  const loading = orgIntegrationsLoading || podIntegrationsLoading;

  const integrations =
    orgIntegrations?.getOrgIntegrations?.integrations || podIntegrations?.getPodIntegrations?.integrations;

  const INTEGRATIONS = [
    {
      title: 'Discord',
      linkTitle: 'discord.com',
      url: 'https://discord.com',
      text: 'Connect your Discord channels',
      type: INTEGRATION_TYPES.DISCORD,
      logo: '/images/integrations/discord-full-logo.png',
      hide: false,
      active: integrations?.discord,
    },
    {
      title: 'Guild.xyz',
      linkTitle: 'guild.xyz',
      url: 'https://guild.xyz',
      text: 'Connect your Guild.xyz account for custom permissions and roles for your community.',
      type: INTEGRATION_TYPES.GUILD,
      logo: '/images/integrations/guild-xyz-logo.png',
      active: integrations?.guildxyz,
      hide: !!podId,
    },
    {
      title: 'Github',
      linkTitle: 'github.com',
      url: 'https://github.com',
      text: 'Connect your Github account.',
      type: INTEGRATION_TYPES.GITHUB,
      logo: '/images/integrations/github-logo.png',
      active: integrations?.github,
      hide: false,
    },
    {
      title: 'Snapshot',
      linkTitle: 'snapshot.org',
      url: 'https://snapshot.org',
      text: 'Connect your Snapshot account.',
      type: INTEGRATION_TYPES.SNAPSHOT,
      logo: '/images/integrations/snapshot-logo.png',
      active: integrations?.snapshot,
      hide: !!podId,
    },
    {
      title: 'Telegram',
      linkTitle: 'telegram.org',
      url: 'https://telegram.org',
      text: 'Connect your Telegram account.',
      type: INTEGRATION_TYPES.TELEGRAM,
      logo: '/images/integrations/telegram-logo.png',
      active: integrations?.telegram,
      hide: false,
    },
    {
      title: 'Otterspace',
      linkTitle: 'otterspace.xyz',
      url: 'https://www.otterspace.xyz/',
      text: 'Connect Otterspace. Manage roles and permissions.',
      type: INTEGRATION_TYPES.OTTERSPACE,
      logo: '/images/integrations/otterspace.png',
      active: integrations?.otterspace,
      hide: false,
    },
  ];
  const visibleIntegrations = useMemo(() => INTEGRATIONS.filter((integration) => !integration.hide), [INTEGRATIONS]);
  const COUNT = useMemo(
    () => ({
      total: visibleIntegrations.length,
      active: visibleIntegrations.filter((integration) => integration.active).length,
      inactive: visibleIntegrations.filter((integration) => !integration.active).length,
    }),
    [visibleIntegrations]
  );

  const filteredIntegrations = useMemo(() => {
    if (activeFilter === FILTER_TYPES.ACTIVE) {
      return visibleIntegrations.filter((integration) => integration.active);
    }
    if (activeFilter === FILTER_TYPES.INACTIVE) {
      return visibleIntegrations.filter((integration) => !integration.active);
    }
    return visibleIntegrations;
  }, [activeFilter, visibleIntegrations]);

  return (
    <SettingsWrapper fullWidth>
      <IntegrationsContainer>
        <HeaderBlock title="Integrations" description="Connect and edit integration settings" />
        {loading ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : (
          <>
            <Filters onChange={setActiveFilter} count={COUNT} activeType={activeFilter} />
            <Grid flexWrap="wrap" display="flex" gap="14px">
              {filteredIntegrations.map((integration) => (
                <IntegrationsCard integration={integration} key={integration.type} orgId={orgId} podId={podId} />
              ))}
            </Grid>
          </>
        )}
      </IntegrationsContainer>
    </SettingsWrapper>
  );
}

export default Integrations;
