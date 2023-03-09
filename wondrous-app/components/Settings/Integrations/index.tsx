import React, { useEffect, useMemo, useState } from 'react';

import SettingsWrapper from 'components/Common/SidebarSettings';
import HeaderBlock from 'components/Settings/headerBlock';
import { useRouter } from 'next/router';

import { Grid } from '@mui/material';

import { useQuery } from '@apollo/client';
import { Spinner, SpinnerWrapper } from 'components/Dashboard/bounties/styles';
import {
  GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
  GET_ORG_GUILD,
  GET_POD_DISCORD_NOTIFICATION_CONFIGS,
  HAS_ORG_GITHUB_INTEGRATION,
} from 'graphql/queries';
import { useSnapshot } from 'services/snapshot';
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
  const { snapshotConnected, snapshotLoading, getOrgSnapshotInfo } = useSnapshot();

  useEffect(() => {
    if (podId) {
      return;
    }
    getOrgSnapshotInfo({
      variables: {
        orgId,
      },
    });
  }, [orgId, podId]);

  const { data: orgDiscordConfig, loading: orgDiscordIntegrationLoading } = useQuery(
    GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
    {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      variables: {
        orgId,
      },
      skip: !!podId,
    }
  );

  const { data: podDiscordConfig, loading: podDiscordIntegrationLoading } = useQuery(
    GET_POD_DISCORD_NOTIFICATION_CONFIGS,

    {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      variables: {
        podId,
      },
      skip: !podId,
    }
  );
  const { data: hasGithubIntegrationData, loading: hasOrgGithubIntegrationLoading } = useQuery(
    HAS_ORG_GITHUB_INTEGRATION,
    {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      variables: {
        orgId,
      },
      skip: !orgId,
    }
  );

  const { data, loading: getOrgGuildLoading } = useQuery(GET_ORG_GUILD, {
    variables: {
      orgId,
    },
    skip: !!podId,
  });

  const loading =
    snapshotLoading ||
    hasOrgGithubIntegrationLoading ||
    getOrgGuildLoading ||
    orgDiscordIntegrationLoading ||
    podDiscordIntegrationLoading;

  const hasActiveDiscordIntegration = useMemo(() => {
    if (podId) {
      return podDiscordConfig?.getPodDiscordNotificationConfig?.find((item) => !item.disabledAt);
    }
    return orgDiscordConfig?.getOrgDiscordNotificationConfig?.find((item) => !item.disabledAt);
  }, [orgId, podId, podDiscordConfig, orgDiscordConfig]);
  const INTEGRATIONS = [
    {
      title: 'Discord',
      linkTitle: 'discord.com',
      url: 'https://discord.com',
      text: 'Connect your Discord channels',
      type: INTEGRATION_TYPES.DISCORD,
      logo: '/images/integrations/discord-full-logo.png',
      hide: false,
      active: hasActiveDiscordIntegration,
    },
    {
      title: 'Guild.xyz',
      linkTitle: 'guild.xyz',
      url: 'https://guild.xyz',
      text: 'Connect your Guild.xyz account for custom permissions and roles for your community.',
      type: INTEGRATION_TYPES.GUILD,
      logo: '/images/integrations/guild-xyz-logo.png',
      active: !!data?.getOrgGuild?.guildId,
      hide: !!podId,
    },
    {
      title: 'Github',
      linkTitle: 'github.com',
      url: 'https://github.com',
      text: 'Connect your Github account.',
      type: INTEGRATION_TYPES.GITHUB,
      logo: '/images/integrations/github-logo.png',
      active: hasGithubIntegrationData?.hasGithubOrgIntegration?.exist,
      hide: false,
    },
    {
      title: 'Snapshot',
      linkTitle: 'snapshot.org',
      url: 'https://snapshot.org',
      text: 'Connect your Snapshot account.',
      type: INTEGRATION_TYPES.SNAPSHOT,
      logo: '/images/integrations/snapshot-logo.png',
      active: snapshotConnected,
      hide: !!podId,
    },
    {
      title: 'Telegram',
      linkTitle: 'telegram.org',
      url: 'https://telegram.org',
      text: 'Connect your Telegram account.',
      type: INTEGRATION_TYPES.TELEGRAM,
      logo: '/images/integrations/telegram-logo.png',
      active: false,
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
