import { Box, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Label } from "components/CreateTemplate/styles";
import SelectComponent from "components/Shared/Select";
import { ErrorText, SharedSecondaryButton } from "components/Shared/styles";
import Modal from "components/Shared/Modal";
import { PUSH_QUEST_DISCORD_NOTFICATION, PUSH_DIRECTORY_DISCORD_NOTFICATION } from "graphql/mutations/discord";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import useAlerts from "utils/hooks";
import Switch from "components/Shared/Switch";
import TextField from "components/Shared/TextField";
import { GET_CMTY_ORG_DISCORD_CONFIG, GET_GUILD_DISCORD_CHANNELS } from "graphql/queries";
import GlobalContext from "utils/context/GlobalContext";

const PublishModal = ({ onClose }) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();
  const { activeOrg } = useContext(GlobalContext);
  const [publishDirectory] = useMutation(PUSH_DIRECTORY_DISCORD_NOTFICATION);
  const [channel, setChannel] = useState(null);
  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });
  const [questSettingsConditions, setQuestSettingsConditions] = useState([]);
  const [getGuildDiscordChannels, { data: guildDiscordChannelsData }] = useLazyQuery(GET_GUILD_DISCORD_CHANNELS);
  const guildId = orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildId;
  const guildDiscordChannels = guildDiscordChannelsData?.getAvailableChannelsForDiscordGuild;
  const channels = guildDiscordChannels?.map((channel) => ({
    label: channel.name,
    value: channel.id,
  }));
  useEffect(() => {
    if (guildId) {
      // fetch all guild channels
      getGuildDiscordChannels({
        variables: {
          guildId,
        },
      });
    }
  }, [guildId]);

  return (
    <Grid display="flex" flexDirection="column" gap="10px" width="10)%">
      <Typography fontFamily="Poppins" fontWeight={600} fontSize="14px" color="#06040A">
        Please choose a channel to publish the directory
      </Typography>
      <SelectComponent
        boxStyle={{
          flex: 1,
        }}
        options={channels}
        background="#C1B6F6"
        value={channel}
        onChange={(value) => setChannel(value)}
      />
      <Box display="flex" gap="10px" alignItems="center" width="100%" marginTop="8px">
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          $reverse
          onClick={onClose}
        >
          Cancel
        </SharedSecondaryButton>
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          onClick={() => {
            publishDirectory({
              variables: {
                orgId: activeOrg?.id,
                channelId: channel,
              },
            });
            setSnackbarAlertOpen(true);
            setSnackbarAlertMessage("Success!");
            setSnackbarAlertAnchorOrigin({
              vertical: "top",
              horizontal: "center",
            });
            onClose();
          }}
        >
          Publish
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};
const PublishDirectoryModal = ({ openPublishModal, setOpenPublishModal }) => {
  return (
    <>
      <Modal
        open={openPublishModal}
        onClose={() => setOpenPublishModal(false)}
        title="Publish directory to Discord channel"
      >
        <PublishModal onClose={() => setOpenPublishModal(false)} />
      </Modal>
    </>
  );
};

export default PublishDirectoryModal;
