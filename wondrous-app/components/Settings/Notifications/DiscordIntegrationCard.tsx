import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ActionButton } from 'components/Common/Task/styles';
import ChannelSelect from './ChannelSelect';
import AddServer from './AddServer';
import WonderButton from 'components/Button';
import { Discord } from 'components/Icons/discord';
import palette from 'theme/palette';

type Props = {
  title: string;
  disabled: boolean;
  configData: any;
  type?: string;
  orgId: string;
};

const DiscordIntegrationCard = ({ title, disabled, orgId, configData, type = '' }: Props) => {
  const [channelsToUpdate, setChannelsToUpdate] = useState({});
  const [expanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

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
              <AddServer orgId={orgId} type={type}/>
              {configData?.map((discordConfig, idx) => (
                <Fragment key={idx}>
                  <Typography color="white" fontWeight={500}>
                    {discordConfig?.channelInfo?.guildName}
                  </Typography>
                  <ChannelSelect
                    guildId={discordConfig?.guildId}
                    channelInfo={discordConfig?.channelInfo}
                    channelId={discordConfig?.channelId}
                    setChannelsToUpdate={setChannelsToUpdate}
                  />
                </Fragment>
              ))}
            </Grid>
            {!!Object.keys(channelsToUpdate)?.length && (
              <Box sx={{ paddingTop: '10px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <ActionButton>Save</ActionButton>
              </Box>
            )}
          </Box>
        </Paper>
      </Collapse>
    </Grid>
  );
};

export default DiscordIntegrationCard;
