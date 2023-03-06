import { Grid, Typography } from '@mui/material';
import GradientHeading from 'components/GradientHeading';
import Modal from 'components/Modal';
import Image from 'next/image';
import { useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { INTEGRATION_TYPES } from './constants';
import SnapshotFooter from './Helpers/SnapshotFooter';
import SnapshotConfigSection from './SnapshotConfig';

const INTEGRATIONS_TYPE_CONFIG = {
  [INTEGRATION_TYPES.SNAPSHOT]: {
    title: 'Connect Snapshot',
    text: 'Connect your Snapshot account.',
    logo: '/images/integrations/snapshot-logo.png',
    component: ({ orgId, podId, setConnectionParams }) => (
      <SnapshotConfigSection orgId={orgId} podId={podId} setConnectionParams={setConnectionParams} />
    ),
    footer: ({ onClose, connectionParams, orgId, podId }: any) => (
      <SnapshotFooter orgId={orgId} onClose={onClose} connectionParams={connectionParams} />
    ),
  },
  [INTEGRATION_TYPES.GUILD]: {
    title: 'Connect Guild.xyz',
    text: 'Connect your Guild.xyz account for custom permissions and roles for your community.',
    logo: '/images/integrations/guild-xyz-logo.png',
  },
  [INTEGRATION_TYPES.GITHUB]: {
    title: 'Connect Github',
    text: 'Connect your Github account.',
    logo: '/images/integrations/github-logo.png',
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
const ConnectionModal = ({ type, isOpen, onClose, orgId, podId }) => {
  const config = INTEGRATIONS_TYPE_CONFIG[type];
  const [connectionParams, setConnectionParams] = useState({});

  return (
    <Modal
      title={config?.title}
      open={isOpen}
      onClose={onClose}
      maxWidth={530}
      footerRight={config?.footer && config?.footer({ onClose, connectionParams, orgId })}
    >
      <Grid display="flex" direction="column">
        <Grid display="flex" justifyContent="center" alignItems="center" gap="10px" direction="column">
          <Grid display="flex" gap="10px" justifyContent="center" alignItems="center">
            <Image
              src="/images/wonder-logo-white.svg"
              alt="Wonderverse logo"
              width={45}
              height={45}
              style={{
                borderRadius: '6px',
              }}
            />
            <Image
              src={config.logo}
              alt={`${config.title} logo`}
              width={45}
              height={45}
              style={{
                borderRadius: '6px',
              }}
            />
          </Grid>
          <GradientHeading>{config?.title}</GradientHeading>
          <Typography
            fontFamily={typography.fontFamily}
            fontWeight={400}
            fontSize="15px"
            lineHeight="24px"
            color={palette.white}
          >
            {config?.text}
          </Typography>
        </Grid>
        <Grid>{config?.component && config?.component({ orgId: 'orgId', podId: 'podId', setConnectionParams })}</Grid>
      </Grid>
    </Modal>
  );
};

export default ConnectionModal;
