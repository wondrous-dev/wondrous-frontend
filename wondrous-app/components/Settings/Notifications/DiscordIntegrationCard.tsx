import Divider from 'components/Common/Divider';
import DropdownSelect from 'components/Common/DropdownSelect';
import styles from 'components/Settings/Notifications/styles';
import React, { useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import WonderButton from 'components/Button';
import { Discord } from 'components/Icons/discord';
import palette from 'theme/palette';

type Props = {
  title: string;
  disabled: boolean;
  discordChannels: Array<{
    id: string;
    name: string;
  }>;
};

const DiscordIntegrationCard = ({ title, disabled, discordChannels }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const discordChannelsMap = useMemo(
    () =>
      discordChannels.map((channel) => ({
        value: channel.id,
        label: channel.name,
      })),
    [discordChannels]
  );

  return (
    <Grid container my="20px" sx={{ background: '#2d2d2d', borderRadius: '6px' }}>
      <Grid container sx={{ padding: '10px 15px' }} justifyContent="space-between" alignItems="center">
        <Grid display="flex" item alignItems="center">
          <Discord height="20px" color={palette.white} />
          <Typography color="white" ml="10px">
            {title}
          </Typography>
        </Grid>
        <Grid item>
          {expanded ? (
            <WonderButton color="grey" height={30} borderRadius={6} onClick={() => setExpanded(false)}>
              Cancel
            </WonderButton>
          ) : (
            <WonderButton disabled={disabled} height={30} borderRadius={6} onClick={() => setExpanded(true)}>
              Connect
            </WonderButton>
          )}
        </Grid>
      </Grid>

      <Collapse sx={{ width: '100%' }} in={expanded}>
        <Paper>
          <Box
            sx={{
              padding: '10px 15px',
              // background: '#2d2d2d',
              background: '#1D1D1D',
              borderTop: `1px dashed ${palette.grey75}`,
            }}
          >
            <Typography color="#C4C4C4" fontSize="12px">
              For private channels, please ensure that the bot is added as a role.
            </Typography>
            <Typography color="#CCBBFF" fontSize="14px" fontWeight={500} marginTop="10px">
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
          </Box>
        </Paper>
      </Collapse>
    </Grid>
  );
};

export default DiscordIntegrationCard;
