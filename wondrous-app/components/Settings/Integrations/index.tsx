import React, { useEffect, useMemo, useState } from 'react';

import SettingsWrapper from 'components/Common/SidebarSettings';
import HeaderBlock from 'components/Settings/headerBlock';
import SnapshotConfigSection from 'components/Settings/Integrations/SnapshotConfig';
import { useRouter } from 'next/router';

import { GithubIntegration } from 'components/Settings/Github';
import GuildIntegration from 'components/Settings/Guild';

import { Grid } from '@mui/material';

import { useQuery } from '@apollo/client';
import { Spinner, SpinnerWrapper } from 'components/Dashboard/bounties/styles';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_ORG_GUILD, HAS_ORG_GITHUB_INTEGRATION } from 'graphql/queries';
import useGuildXyz from 'services/guildxyz';
import { useSnapshot } from 'services/snapshot';
import { FILTER_TYPES, INTEGRATION_TYPES } from './constants';
import Filters from './Filters';
import IntegrationsCard from './IntegrationsCard';
import { IntegrationsContainer } from './styles';

function Integrations(props) {
  // TODO: add separate endpoint for getting statuses

  const router = useRouter();
  const { orgId, podId } = router.query;

  const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.ALL);
  const { snapshotConnected, snapshotLoading, getOrgSnapshotInfo } = useSnapshot();


  useEffect(() => {
    getOrgSnapshotInfo({
      variables: {
        orgId: router.query.orgId,
      }
    })
  }, [])

  const { data: orgDiscordConfig, loading: orgDiscordIntegrationLoading } = useQuery(
    GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
    {
      variables: {
        orgId,
      },
      skip: !orgId,
    }
  );

  const { data: hasGithubIntegrationData, loading: hasOrgGithubIntegrationLoading } = useQuery(
    HAS_ORG_GITHUB_INTEGRATION,
    {
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
    skip: !orgId,
  });
  console.log(snapshotConnected, 'snapshotConnected');
  console.log(data, 'data');
  console.log(hasGithubIntegrationData, 'hasGithubIntegrationData');

  const loading =
    snapshotLoading || hasOrgGithubIntegrationLoading || getOrgGuildLoading || orgDiscordIntegrationLoading;

  const INTEGRATIONS = [
    {
      title: 'Discord',
      linkTitle: 'discord.com',
      url: 'https://discord.com',
      text: 'Connect your Discord account',
      type: INTEGRATION_TYPES.DISCORD,
      logo: '/images/integrations/discord-full-logo.png',
      active: !!orgDiscordConfig?.getOrgDiscordNotificationConfig?.id,
      action: () => {
        if(podId) {
          router.push(`/pod/settings/${podId}/notifications`, undefined, {
            shallow: true,
          });
        }
        else {
          router.push(`/organization/settings/${orgId}/notifications`, undefined, {
            shallow: true,
          });
        }
      }
    },
    {
      title: 'Guild.xyz',
      linkTitle: 'guild.xyz',
      url: 'https://guild.xyz',
      text: 'Connect your Guild.xyz account for custom permissions and roles for your community.',
      type: INTEGRATION_TYPES.GUILD,
      logo: '/images/integrations/guild-xyz-logo.png',
      active: !!data?.getOrgGuild?.guildId,
    },
    {
      title: 'Github',
      linkTitle: 'github.com',
      url: 'https://github.com',
      text: 'Connect your Github account.',
      type: INTEGRATION_TYPES.GITHUB,
      logo: '/images/integrations/github-logo.png',
      active: !!hasGithubIntegrationData?.hasOrgGithubIntegration,
    },
    {
      title: 'Snapshot',
      linkTitle: 'snapshot.org',
      url: 'https://snapshot.org',
      text: 'Connect your Snapshot account.',
      type: INTEGRATION_TYPES.SNAPSHOT,
      logo: '/images/integrations/snapshot-logo.png',
      active: snapshotConnected,
    },
    {
      title: 'Telegram',
      linkTitle: 'telegram.org',
      url: 'https://telegram.org',
      text: 'Connect your Telegram account.',
      type: INTEGRATION_TYPES.TELEGRAM,
      logo: '/images/integrations/telegram-logo.png',
      active: false,
    },
  ];
  const COUNT = useMemo(
    () => ({
      total: INTEGRATIONS.length,
      active: INTEGRATIONS.filter((integration) => integration.active).length,
      inactive: INTEGRATIONS.filter((integration) => !integration.active).length,
    }),
    [INTEGRATIONS]
  );

  const filteredIntegrations = useMemo(() => {
    if (activeFilter === FILTER_TYPES.ACTIVE) {
      return INTEGRATIONS.filter((integration) => integration.active);
    }
    if (activeFilter === FILTER_TYPES.INACTIVE) {
      return INTEGRATIONS.filter((integration) => !integration.active);
    }
    return INTEGRATIONS;
  }, [activeFilter, INTEGRATIONS]);

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
