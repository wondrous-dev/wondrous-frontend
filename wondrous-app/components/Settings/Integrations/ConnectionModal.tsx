import { Grid } from '@mui/material';
import Modal from 'components/Modal';
import { GithubIntegration } from 'components/Settings/Github';
import { useState } from 'react';
import GuildIntegration from '../Guild';
import { INTEGRATION_TYPES } from './constants';
import ConnectionContext from './Helpers/ConnectionContext';
import GithubFooter from './Helpers/GithubFooter';
import GuildIntegrationFooter from './Helpers/GuildIntegrationFooter';
import ModalBody from './Helpers/ModalBody';
import SnapshotFooter from './Helpers/SnapshotFooter';
import SnapshotConfigSection from './SnapshotConfig';

const INTEGRATIONS_TYPE_CONFIG = {
  [INTEGRATION_TYPES.SNAPSHOT]: {
    title: 'Connect Snapshot',
    text: 'Connect your Snapshot account.',
    logo: '/images/integrations/snapshot-logo.png',
    component: () => <SnapshotConfigSection />,
    footer: () => <SnapshotFooter />,
  },
  [INTEGRATION_TYPES.GUILD]: {
    title: 'Connect Guild.xyz',
    text: 'Connect your Guild.xyz account for custom permissions and roles for your community.',
    logo: '/images/integrations/guild-xyz-logo.png',
    component: () => <GuildIntegration />,
    footer: () => <GuildIntegrationFooter />,
  },
  [INTEGRATION_TYPES.GITHUB]: {
    title: 'Connect Github',
    text: 'Connect your Github account.',
    logo: '/images/integrations/github-logo.png',
    footer: () => <GithubFooter />,
    component: () => <GithubIntegration />,
  },
  [INTEGRATION_TYPES.TELEGRAM]: {
    title: 'Connect Telegram',
    text: 'Connect your Telegram account.',
    logo: '/images/integrations/telegram-logo.png',
  },
  [INTEGRATION_TYPES.DISCORD]: {
    title: 'Connect Discord',
    text: 'Connect your Discord account.',
    logo: '/images/integrations/discord-full-logo.png',
  },
};
const ConnectionModal = ({ type, onClose, orgId, podId, isActive }) => {
  const config = INTEGRATIONS_TYPE_CONFIG[type];
  const [data, setData] = useState({
    isActive,
  });

  return (
    <ConnectionContext.Provider value={{ data, setData, orgId, podId, onClose }}>
      <Modal title={config?.title} open onClose={onClose} maxWidth={530} footerRight={config?.footer?.()}>
        <Grid display="flex" direction="column">
          <ModalBody text={config?.text} title={config?.title} logo={config?.logo} />
          <Grid>{config?.component?.()}</Grid>
        </Grid>
      </Modal>
    </ConnectionContext.Provider>
  );
};

export default ConnectionModal;
