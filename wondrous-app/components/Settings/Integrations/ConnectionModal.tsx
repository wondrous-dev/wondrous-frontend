import { Grid } from '@mui/material';
import Modal from 'components/Modal';
import { GithubIntegration } from 'components/Settings/Github';
import { useState } from 'react';
import palette from 'theme/palette';
import GuildIntegration from '../Guild';
import OtterspaceIntegration from '../Otterspace';
import { INTEGRATION_TYPES } from './constants';
import ConnectionContext from './Helpers/ConnectionContext';
import DiscordFooter from './Helpers/DiscordFooter';
import DiscordIntegrationsBody from './Helpers/DiscordIntegrationBody';
import GithubFooter from './Helpers/GithubFooter';
import GuildIntegrationFooter from './Helpers/GuildIntegrationFooter';
import IntegrationFeatures from './Helpers/IntegrationFeatures';
import ModalBody from './Helpers/ModalBody';
import OtterspaceFooter from './Helpers/OtterspaceFooter';
import SnapshotFooter from './Helpers/SnapshotFooter';
import TelegramIntegrationFooter from './Helpers/TelegramIntegrationFooter';
import SnapshotConfigSection from './SnapshotConfig';
import TelegramIntegration from './TelegramIntegration';

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
    component: () => <TelegramIntegration />,
    footer: () => <TelegramIntegrationFooter />,
  },
  [INTEGRATION_TYPES.DISCORD]: {
    title: 'Connect Discord',
    text: 'Connect your Discord account.',
    logo: '/images/integrations/discord-full-logo.png',
    footer: () => <DiscordFooter />,
    component: () => <DiscordIntegrationsBody />,
  },
  [INTEGRATION_TYPES.OTTERSPACE]: {
    title: 'Connect Otterspace',
    text: 'Connect Otterspace. Manage roles and permissions.',
    logo: '/images/integrations/otterspace.png',
    component: () => <OtterspaceIntegration />,
    footer: () => <OtterspaceFooter />,
  },
};
const ConnectionModal = ({ type, onClose, orgId, podId, isActive }) => {
  const config = INTEGRATIONS_TYPE_CONFIG[type];
  const [data, setData] = useState({
    isActive,
  });

  return (
    <ConnectionContext.Provider value={{ data, setData, orgId, podId, onClose }}>
      <Modal
        title={config?.title}
        open
        onClose={onClose}
        maxWidth={530}
        footerRight={config?.footer?.()}
        modalBodyStyle={{
          padding: '24px 0px 0px',
          background: palette.grey900,
        }}
      >
        <Grid display="flex" direction="column" gap="24px">
          <ModalBody text={config?.text} title={config?.title} logo={config?.logo} />
          <Grid
            bgcolor={palette.black92}
            sx={{
              padding: '24px',
              borderTop: `1px solid ${palette.grey85}`,
            }}
            display="flex"
            direction="column"
            gap="24px"
          >
            <IntegrationFeatures type={type} />
            {config?.component?.()}
          </Grid>
        </Grid>
      </Modal>
    </ConnectionContext.Provider>
  );
};

export default ConnectionModal;
