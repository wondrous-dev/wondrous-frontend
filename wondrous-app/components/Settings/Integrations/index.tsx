import React from 'react';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';

import { useRouter } from 'next/router';
import { IntegrationsContainer } from './styles';

import SnapshotConfigSection from 'components/Settings/Integrations/SnapshotConfig';
import { GithubIntegration } from '../Github';

const Integrations = (props) => {
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
};

export default Integrations;
