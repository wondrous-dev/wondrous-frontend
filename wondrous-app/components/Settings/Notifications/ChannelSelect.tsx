import { useState } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import palette from 'theme/palette';
import WonderButton from 'components/Button';
import { useLazyQuery } from '@apollo/client';
import { GET_CHANNELS_FROM_DISCORD } from 'graphql/queries';
import { Autocomplete, Option } from 'components/SearchTasks/styles';
import { CreateEntityAutocompleteOptionTypography } from 'components/CreateEntity/CreateEntityModal/styles';
import { PaperComponent, TextField } from 'components/CreateCollaborationModal/Steps/AddTeamMembers/styles';
import ListBox from 'components/CreateCollaborationModal/Steps/AddTeamMembers/Listbox';

export default function ChannelSelect({ channelInfo, channelId, setChannelsToUpdate, guildId }) {
  const [selectedChannel, setSelectedChannel] = useState({ id: channelId, name: channelInfo?.channelName });
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);

  const handleOptions = () =>
    getChannelsFromDiscord({
      variables: {
        guildId,
      },
    });

  const options = discordChannelData?.getAvailableChannelsForDiscordGuild || [];

  const handleChange = (e, options) => {
    setSelectedChannel(options);
    setChannelsToUpdate((prev) => ({ ...prev, [guildId]: options.id }));
  };

  return (
    <Grid display="flex" direction="column" gap="10px">
      <Typography color={palette.grey250} fontSize="12px">
        For private channels, please ensure that the bot is added as a role.
      </Typography>
      <Typography color={palette.blue20} fontSize="14px" fontWeight={500}>
        POST IN
      </Typography>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <Autocomplete
          disablePortal
          onOpen={handleOptions}
          PaperComponent={PaperComponent}
          clearOnBlur
          options={options}
          sx={{
            color: 'white',
            flex: '1 1 auto',
            '.MuiOutlinedInput-root': {
              background: palette.black97,
              height: '36px',
            },
            'input': {
              color: palette.white,
            },
            '*': {
              color: 'white',
              fontWeight: '500',
            },
          }}
          openOnFocus
          value={selectedChannel}
          ListboxComponent={ListBox}
          onChange={handleChange}
          getOptionLabel={(option: any) => option?.name}
          renderInput={(params) => <TextField {...params} fullWidth placeholder="Select Discord Channel" />}
          renderOption={(props, option) => (
            <Option {...props}>
              <CreateEntityAutocompleteOptionTypography>#{option?.name}</CreateEntityAutocompleteOptionTypography>
            </Option>
          )}
        />
      </Box>
      {/* <Box display="flex">
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
      </Box> */}
    </Grid>
  );
}
