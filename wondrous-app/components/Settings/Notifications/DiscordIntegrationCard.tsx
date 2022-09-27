import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import DropdownSelect from 'components/Common/DropdownSelect';
import WonderButton from 'components/Button';
import { Discord } from 'components/Icons/discord';
import palette from 'theme/palette';

type Props = {
  title: string;
  disabled: boolean;
  onConnect: (channelId: string) => unknown;
  onDisconnect: () => unknown;
  channel: {
    channelName: string;
    guildName: string;
  } | null;
  discordChannels: Array<{
    id: string;
    name: string;
  }>;
};

const DiscordIntegrationCard = ({ title, disabled, discordChannels, channel, onConnect, onDisconnect }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    if (channel) {
      setExpanded(true);
    }
  }, [channel]);

  const discordChannelsMap = useMemo(
    () =>
      discordChannels.map((channel) => ({
        value: channel.id,
        label: channel.name,
      })),
    [discordChannels]
  );

  let rightButton = (
    <WonderButton disabled={disabled} height={30} borderRadius={6} onClick={() => setExpanded(true)}>
      Connect
    </WonderButton>
  );

  if (expanded) {
    rightButton = channel ? (
      <WonderButton
        variant="outlined"
        color="red"
        height={30}
        borderRadius={6}
        onClick={() => {
          setSelectedChannel(null);
          onDisconnect();
        }}
      >
        Disconnect
      </WonderButton>
    ) : (
      <WonderButton color="grey" height={30} borderRadius={6} onClick={() => setExpanded(false)}>
        Cancel
      </WonderButton>
    );
  }

  return (
    <Grid container my="20px" sx={{ background: palette.grey920, borderRadius: '6px' }}>
      <Grid container sx={{ padding: '10px 15px' }} justifyContent="space-between" alignItems="center">
        <Grid display="flex" item alignItems="center">
          <Discord height="15px" color={palette.white} />
          <Typography color="white" ml="10px">
            {title}
          </Typography>
        </Grid>
        <Grid item>{rightButton}</Grid>
      </Grid>

      <Collapse sx={{ width: '100%' }} in={expanded}>
        <Paper>
          <Box
            sx={{
              padding: '15px 15px',
              background: palette.grey900,
            }}
          >
            {channel ? (
              <Box>
                <Typography component="span" color={palette.grey250}>
                  Connected to{' '}
                </Typography>
                <Typography component="span" color="white">
                  #{channel.channelName}
                </Typography>
              </Box>
            ) : (
              <>
                <Typography color={palette.grey250} fontSize="12px">
                  For private channels, please ensure that the bot is added as a role.
                </Typography>
                <Typography color={palette.blue20} fontSize="14px" fontWeight={500} marginTop="10px">
                  POST IN
                </Typography>
                <DropdownSelect
                  labelText="Select Discord Channel"
                  value={selectedChannel}
                  setValue={setSelectedChannel}
                  formSelectStyle={{
                    height: 'auto',
                    maxWidth: '100%',
                  }}
                  innerStyle={{
                    background: palette.grey1000,
                  }}
                  options={discordChannelsMap}
                />
                <Box display="flex" mt="20px">
                  {selectedChannel ? (
                    <WonderButton
                      borderRadius={6}
                      variant="outlined"
                      color="blue"
                      height={30}
                      onClick={() => onConnect(selectedChannel)}
                    >
                      Connect
                    </WonderButton>
                  ) : null}
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Collapse>
    </Grid>
  );
};

export default DiscordIntegrationCard;
