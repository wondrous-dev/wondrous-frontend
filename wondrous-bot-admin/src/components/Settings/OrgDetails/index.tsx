import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { makeUniqueId } from "@apollo/client/utilities";
import { Typography, Grid, Box, CircularProgress } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import ConnectDiscordButton from "components/ConnectDiscord/ConnectDiscordButton";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import ImageUpload from "components/ImageUpload";
import { AVATAR_EDITOR_TYPES } from "components/ImageUpload/AvatarEditor";
import { SharedSecondaryButton } from "components/Shared/styles";
import { DISCONNECT_DISCORD_TO_CMTY_ORG, UPDATE_ORG } from "graphql/mutations";
import { GET_CMTY_ORG_DISCORD_CONFIG, GET_GUILD_DISCORD_CHANNELS } from "graphql/queries";
import { forwardRef, useContext, useEffect, useMemo, useRef, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import useAlerts from "utils/hooks";

import { handleImageFile, transformAndUploadMedia, uploadMedia } from "utils/media";
import { redColors } from "utils/theme/colors";
import QuestChannelName from "./QuestChannelName";
import { UPDATE_DISCORD_PARENT_CHANNEL_NAME } from "graphql/mutations/discord";

interface ChangeOrgDetailsProps {
  data: any;
  setData: (data: any) => void;
}

const ChangeOrgDetails = forwardRef(({ data, setData }: ChangeOrgDetailsProps, ref: any) => {
  const { activeOrg } = useContext(GlobalContext);

  const handleChange = (value) => setData({ profilePicture: value });

  useEffect(() => {
    if (data.profilePicture !== activeOrg?.profilePicture) {
      setData((prev) => ({
        ...prev,
        profilePicture: activeOrg?.profilePicture,
      }));
    }
  }, [activeOrg?.profilePicture, activeOrg?.headerPicture]);

  return (
    <Grid container direction="column" gap="24px">
      <Label>Project Logo</Label>

      <ImageUpload
        title=""
        image={data.profilePicture}
        updateFilesCb={(file) => handleChange(file)}
        imageType={AVATAR_EDITOR_TYPES.ICON_IMAGE}
        onDeleteImage={(imageType) => handleChange(null)}
        onReplace={(file) => handleChange(file)}
      />
      <Box display="flex" flexDirection="column" gap="14px" justifyContent="flex-start" alignItems="flex-start">
        <Label>Project Name</Label>
        <CustomTextField defaultValue={activeOrg?.name} onChange={(e) => (ref.current = e.target.value)} />
      </Box>
    </Grid>
  );
});

const OrgDetails = () => {
  const { activeOrg } = useContext(GlobalContext);

  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();

  const setSnackbarSuccess = () => {
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage("Success!");
    setSnackbarAlertAnchorOrigin({
      vertical: "top",
      horizontal: "center",
    });
  };
  const [updateOrg, { data: updateOrgData, loading: updateLoading }] = useMutation(UPDATE_ORG, {
    refetchQueries: ["getUserOrgs"],
    onCompleted: () => {
      setSnackbarSuccess();
    },
  });

  const [data, setData] = useState({
    profilePicture: null,
  });

  const [channelName, setChannelName] = useState("");

  const [getGuildDiscordChannels, { data: guildDiscordChannelsData, loading: discordChannelsLoading, refetch }] =
    useLazyQuery(GET_GUILD_DISCORD_CHANNELS, {
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        const defaultChannel = data?.getAvailableChannelsForDiscordGuild.find(
          (channel) => channel.id === parentChannelId || channel.name === "community-quest"
        );
        setChannelName(defaultChannel?.name);
      },
    });

  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data?.getCmtyOrgDiscordConfig?.guildId) {
        getGuildDiscordChannels({
          variables: {
            guildId: data?.getCmtyOrgDiscordConfig?.guildId,
          },
        });
      }
    },
  });

  const parentChannelId = orgDiscordConfig?.getCmtyOrgDiscordConfig?.additionalData?.parentChannel;

  const guildId = orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildId;

  const [updateChannelName, { loading: updateInProgress }] = useMutation(UPDATE_DISCORD_PARENT_CHANNEL_NAME, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setSnackbarSuccess();
    },
  });

  const ref = useRef(null);

  const defaultChannelName = useMemo(() => {
    if (guildDiscordChannelsData?.getAvailableChannelsForDiscordGuild) {
      const defaultChannel = guildDiscordChannelsData?.getAvailableChannelsForDiscordGuild.find(
        (channel) => channel.id === parentChannelId || channel.name === "community-quest"
      );
      return defaultChannel?.name;
    }
  }, [guildDiscordChannelsData?.getAvailableChannelsForDiscordGuild]);

  const onClick = async () => {
    let inputData = {};
    if (data.profilePicture !== activeOrg?.profilePicture) {
      const { filename } = await transformAndUploadMedia({
        file: data.profilePicture,
      });
      inputData = {
        ...inputData,
        profilePicture: filename,
      };
    }
    if (ref?.current && ref?.current !== activeOrg?.name) {
      inputData = {
        ...inputData,
        name: ref?.current,
      };
    }
    if (Object.keys(inputData)?.length) {
      await updateOrg({
        variables: {
          orgId: activeOrg.id,
          input: {
            ...inputData,
          },
        },
      });
    }
    if (defaultChannelName !== channelName) {
      await updateChannelName({
        variables: {
          orgId: activeOrg.id,
          newName: channelName,
        },
      });
    }
  };

  const loading = updateLoading || updateInProgress;
  return (
    <Grid
      flex="1"
      gap="24px"
      display="flex"
      flexDirection="column"
      width={{
        xs: "100%",
        sm: "70%",
      }}
    >
      <PanelComponent
        renderHeader={() => (
          <Typography
            fontFamily="Poppins"
            fontSize="12px"
            padding="14px"
            lineHeight="14px"
            fontWeight={600}
            color="#2A8D5C"
          >
            Basic Details
          </Typography>
        )}
        renderBody={() => <ChangeOrgDetails data={data} ref={ref} setData={setData} />}
      />
      <PanelComponent
        renderHeader={() => (
          <Typography
            fontFamily="Poppins"
            fontSize="12px"
            padding="14px"
            lineHeight="14px"
            fontWeight={600}
            color="#2A8D5C"
          >
            Discord Quest Channel Name
          </Typography>
        )}
        renderBody={() => (
          <QuestChannelName
            guildId={guildId}
            channelName={channelName}
            setChannelName={setChannelName}
            isLoading={discordChannelsLoading}
          />
        )}
      />
      <Grid
        marginTop="20%"
        position="sticky"
        bgcolor="#FFEBDA"
        width="100%"
        bottom="10%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="14px"
        borderRadius="16px"
        border="1px solid #000212"
      >
        <SharedSecondaryButton disabled={loading} onClick={onClick}>
          {loading ? <CircularProgress size={20} /> : "Save"}
        </SharedSecondaryButton>
      </Grid>
    </Grid>
  );
};

export default OrgDetails;
