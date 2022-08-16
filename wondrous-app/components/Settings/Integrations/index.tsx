import React from 'react';

import { useRouter } from 'next/router';
import SnapshotConfigSection from 'components/Settings/Integrations/SnapshotConfig';
import SettingsWrapper from 'components/Settings/settingsWrapper';
import { HeaderBlock } from '../headerBlock';

import { IntegrationsContainer } from './styles';

import { GithubIntegration } from '../Github';

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
        <SnapshotConfigSection orgId={orgId} podId={podId} />
        <GithubIntegration orgId={orgId} />
      </IntegrationsContainer>
    </SettingsWrapper>
  );
}

export default Integrations;
