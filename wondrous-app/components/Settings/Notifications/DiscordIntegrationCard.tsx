import React, { Fragment, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import {
  UPDATE_ORG_DISCORD_NOTIFICATION_CONFIG_CHANNEL,
  UPDATE_POD_DISCORD_NOTIFICATION_CONFIG_CHANNEL,
} from 'graphql/mutations';
import { useMutation } from '@apollo/client';
import TrashbinIcon from 'components/Icons/Trashbin';
import ChannelSelect from './ChannelSelect';
import AddServer from './AddServer';
import { RemoveDiscordServer } from './styles';
import AddWonderBotToDiscordConfig from './AddWonderBotToDiscordConfig';
import { NotificationType } from './constants';

type Props = {
  title: string;
  configData: any;
  type?: NotificationType;
  orgId?: string;
  podId?: string;
  displayAddButton?: boolean;
  handleDisconnect: (notificationType: string, id: string) => void;
  isCollab?: boolean;
};

const DiscordIntegrationCard = ({
  title,
  orgId,
  podId,
  configData,
  handleDisconnect,
  type = NotificationType.TasksNotifications,
  displayAddButton = false,
  isCollab,
}: Props) => {
  const [updateOrgChannel] = useMutation(UPDATE_ORG_DISCORD_NOTIFICATION_CONFIG_CHANNEL, {
    refetchQueries: ['getOrgDiscordNotificationConfig'],
  });
  const [updatePodChannel] = useMutation(UPDATE_POD_DISCORD_NOTIFICATION_CONFIG_CHANNEL, {
    refetchQueries: ['getPodDiscordNotificationConfig'],
  });

  const [expanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const updateChannelFunctions = {
    org: (id, channelId) => {
      updateOrgChannel({
        variables: {
          orgId,
          discordConfigId: id,
          channelId,
        },
      });
    },
    pod: (id, channelId) => {
      updatePodChannel({
        variables: {
          podId,
          discordConfigId: id,
          channelId,
        },
      });
    },
  };

  const handleUpdateChannel = (id, channelId) => updateChannelFunctions[podId ? 'pod' : 'org'](id, channelId);

  return (
    <Grid container my="20px" sx={{ background: palette.grey920, borderRadius: '6px' }}>
      <Grid
        container
        sx={{ padding: '10px 15px', cursor: 'pointer' }}
        justifyContent="space-between"
        alignItems="center"
        onClick={toggleExpanded}
      >
        <Grid display="flex" item alignItems="center">
          <Typography color="white" fontWeight={600}>
            {title}
          </Typography>
        </Grid>
      </Grid>

      <Collapse sx={{ width: '100%' }} in={expanded}>
        <Paper>
          <Box
            sx={{
              padding: '15px 15px',
              background: palette.grey900,
            }}
          >
            <Grid display="flex" direction="column" gap="10px">
              {displayAddButton && (
                <AddServer>
                  {(toggleServerPanel) => (
                    <AddWonderBotToDiscordConfig
                      isCollab={isCollab}
                      orgId={orgId}
                      onSave={toggleServerPanel}
                      type={type}
                      podId={podId}
                    />
                  )}
                </AddServer>
              )}
              {configData?.map((discordConfig, idx) => (
                <Fragment key={idx}>
                  <Grid display="flex" justifyContent="space-between">
                    <Typography color="white" fontWeight={500}>
                      {discordConfig?.channelInfo?.guildName}
                    </Typography>
                    <RemoveDiscordServer onClick={() => handleDisconnect(type, discordConfig.id)} type="button">
                      <TrashbinIcon />
                      Remove server
                    </RemoveDiscordServer>
                  </Grid>

                  <ChannelSelect
                    discordConfigId={discordConfig.id}
                    guildId={discordConfig?.guildId}
                    channelInfo={discordConfig?.channelInfo}
                    channelId={discordConfig?.channelId}
                    handleUpdateChannel={handleUpdateChannel}
                  />
                </Fragment>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Collapse>
    </Grid>
  );
};

export default DiscordIntegrationCard;
