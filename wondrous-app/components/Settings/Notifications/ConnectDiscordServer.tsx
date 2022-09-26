import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import palette from 'theme/palette';
import WonderButton from 'components/Button';
import WonderModal from 'components/Modal';
import AddWonderBotToDiscordConfig from 'components/Settings/Notifications/AddWonderBotToDiscordConfig';
import styles from 'components/Settings/Notifications/DiscordNotificationSection/styles';

type Props = {
  orgId: string;
};

const ConnectDiscordServer = ({ orgId }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const closeModal = () => setOpenModal(false);

  return (
    <>
      <Grid container sx={styles.box}>
        <WonderButton
          borderRadius={6}
          minWidth={200}
          variant="outlined"
          color="blue"
          onClick={() => setOpenModal(true)}
        >
          Connect Discord
        </WonderButton>

        <Typography color={palette.grey250}>Connect one or more integrations types to your Discord server</Typography>
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
        <AddWonderBotToDiscordConfig orgId={orgId} />
      </WonderModal>
    </>
  );
};

export default ConnectDiscordServer;
