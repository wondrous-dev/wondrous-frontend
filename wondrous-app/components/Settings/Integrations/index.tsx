import React from 'react';

import { useRouter } from 'next/router';
// import SnapshotConfigSection from 'components/Settings/Integrations/SnapshotConfig';
import SettingsWrapper from 'components/Common/SidebarSettings';
import HeaderBlock from 'components/Settings/headerBlock';

import { GithubIntegration } from 'components/Settings/Github';
import GuildIntegration from 'components/Settings/Guild';

import { IntegrationsContainer } from './styles';

function Integrations(props) {
  const router = useRouter();
  const { orgId, podId } = router.query;

  return (
    <SettingsWrapper>
      <IntegrationsContainer>
        <HeaderBlock
          title="Integrations Settings"
          description="Set up Wonder integrations with external applications"
        />
        {/* <SnapshotConfigSection orgId={orgId} podId={podId} /> */}
        <GithubIntegration orgId={orgId} />
        <GuildIntegration orgId={orgId} />
      </IntegrationsContainer>
    </SettingsWrapper>
  );
}

export default Integrations;
