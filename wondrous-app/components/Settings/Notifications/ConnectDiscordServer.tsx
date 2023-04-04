import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

import WonderButton from 'components/Button';
import { DiscordIcon } from 'components/Icons/discord';
import WonderModal from 'components/Modal';
import { HeaderButton } from 'components/organization/wrapper/styles';
import AddWonderBotToDiscordConfig from 'components/Settings/Notifications/AddWonderBotToDiscordConfig';
import palette from 'theme/palette';
import DiscordLogo from '../../../public/images/onboarding/discord.svg';
import styles from './styles';

type Props = {
  orgId: string;
  onConnect?: () => void;
  title?: string;
};

const ConnectDiscordServer = ({ orgId, title = 'Link Discord', onConnect }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => setOpenModal(false);

  const handleOnSave = () => {
    onConnect && onConnect();
    closeModal();
  };

  return (
    <>
      <Grid container sx={styles.connectDiscord} justifyContent="center" alignItems="center" minHeight="6rem">
        <HeaderButton reversed onClick={() => setOpenModal(true)}>
          <Grid display="flex" gap="8px" alignItems="center">
            <DiscordIcon fill="white" />
            {title}
          </Grid>
        </HeaderButton>
      </Grid>

      <WonderModal
        maxWidth={550}
        title="Connect Discord Server"
        open={openModal}
        onClose={closeModal}
        footerRight={
          <WonderButton color="grey" onClick={closeModal}>
            Cancel
          </WonderButton>
        }
      >
        <Typography sx={{ color: palette.white, margin: '0 15px', fontSize: '16px' }}>
          For private channels, please ensure that the bot is added as a role
        </Typography>
        <AddWonderBotToDiscordConfig orgId={orgId} onSave={handleOnSave} />
      </WonderModal>
    </>
  );
};

export default ConnectDiscordServer;
