import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Box, CircularProgress, Divider, Grid } from "@mui/material";
import { DiscordRoleIcon, PointsIcon } from "components/Icons/Rewards";
import PageSpinner from "components/PageSpinner";
import PageWrapper from "components/Shared/PageWrapper";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { SharedSecondaryButton } from "components/Shared/styles";
import { START_QUEST } from "graphql/mutations";
import { GET_QUEST_REWARDS } from "graphql/queries";
import { useEffect, useMemo } from "react";
import { BG_TYPES, ERRORS_LABELS } from "utils/constants";
import { getDiscordUrl } from "utils/discord";
import useAlerts from "utils/hooks";
import { ImageComponent, StyledLink, TextLabel } from "./styles";
import useErrorHandler from "./useErrorHandler";

const ViewQuest = ({ quest, loading }) => {
  const params = {
    questId: quest?.id,
    orgId: quest?.org?.id,
  };

  const discordAuthUrl = getDiscordUrl(
    "/discord/callback/cmty-user-connect",
    `&state=${encodeURIComponent(JSON.stringify(params))}`
  );

  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const cmtyUserToken = localStorage.getItem("cmtyUserToken");
  const isDiscordConnected = !!cmtyUserToken;
  const [getQuestRewards, { data: questRewardsData }] = useLazyQuery(GET_QUEST_REWARDS);

  useEffect(() => {
    if (quest?.id) {
      getQuestRewards({
        variables: {
          questId: quest?.id,
        },
      });
    }
  }, [quest?.id]);

  const rewards = useMemo(() => {
    let roles = [
      {
        label: `${quest?.pointReward} points`,
        icon: PointsIcon,
      },
    ];
    let questRewards =
      questRewardsData?.getQuestRewards?.map((reward) => {
        if (reward.type === "discord_role") {
          return {
            label: `Discord role: ${reward.discordRewardData?.discordRoleName}`,
            icon: DiscordRoleIcon,
          };
        }
      }) || [];
    return [...roles, ...questRewards];
  }, [quest, questRewardsData]);

  const { handleError } = useErrorHandler();

  const [startQuest, { loading: startQuestLoading }] = useMutation(START_QUEST, {
    context: {
      headers: {
        Authorization: `Bearer ${cmtyUserToken}`,
      },
    },
    onCompleted: ({ startQuest }) => {
      if (startQuest?.channelLink) {
        window.open(startQuest?.channelLink, "_blank");
      }
      if (startQuest?.error) {
        return handleError({ questInfo: quest, error: startQuest?.error });
      }
    },
  });

  const handleConnectDiscord = () => {
    window.open(discordAuthUrl);
  };
  const handleStartQuest = async (e) => {
    e.preventDefault();
    await startQuest({
      variables: {
        questId: quest?.id,
      },
    });
  };

  return (
    <PageWrapper
      containerProps={{
        sx: {
          justifyContent: "center",
        },
      }}
      bgType={BG_TYPES.VIEW_QUESTS}
    >
      <Grid
        justifyContent="center"
        alignItems="center"
        display="flex"
        width={{
          xs: "100%",
          md: "70%",
        }}
        height="100%"
        padding={{
          xs: "70px 0px 0px 0px",
          md: "70px",
        }}
      >
        <StyledLink to="/">
          <img src="/images/wonder-logo-3.svg" />
        </StyledLink>
        {!quest || loading ? (
          <PageSpinner color="#fee2ca" />
        ) : (
          <Grid
            width={{
              xs: "100%",
              md: "90%",
            }}
            height="100%"
          >
            <Grid
              position="relative"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              bgcolor="white"
              borderRadius={{
                xs: "0px",
                md: "32px 0px 0px 0px",
              }}
              paddingTop="42px"
              paddingBottom="24px"
              gap="24px"
            >
              <Box display="flex" flexDirection="column" gap="12px" alignItems="center" width="100%">
                <OrgProfilePicture
                  profilePicture={quest?.org?.profilePicture}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "100%",
                  }}
                />
                <TextLabel>{quest?.org?.name}</TextLabel>
                <Divider
                  sx={{
                    width: "100%",
                    marginTop: "20px",
                    height: "1px",
                    backgroundColor: "#EAEAEA",
                  }}
                />
              </Box>
              <TextLabel weight={600} color="#846AFF">
                Community Quest
              </TextLabel>
              <TextLabel weight={600} fontSize="24px">
                {quest?.title}
              </TextLabel>
              {quest?.level ? (
                <Box display="flex" alignItems="center" gap="4px">
                  <TextLabel>Requirements: </TextLabel>
                  <TextLabel weight={600} color="#2A8D5C">
                    Level {quest?.level}
                  </TextLabel>
                </Box>
              ) : null}
              <ImageComponent src="/images/view-quest-artwork.png" />
              <TextLabel color="#2A8D5C" fontSize="16px" weight={600}>
                Quest Rewards 🎁
              </TextLabel>
              <Grid display="flex" flexDirection="column" gap="16px" width="calc(100% - 84px)">
                {rewards?.map((reward, idx) => (
                  <Box
                    bgcolor="#EAEAEA"
                    borderRadius="12px"
                    minHeight="40px"
                    display="flex"
                    justifyContent="center"
                    key={`${idx}_reward`}
                    alignItems="center"
                    width="100%"
                    padding="8px"
                    gap="6px"
                  >
                    {reward && <reward.icon />}
                    <TextLabel>{reward.label}</TextLabel>
                  </Box>
                ))}
              </Grid>
              {isDiscordConnected ? (
                <SharedSecondaryButton onClick={handleStartQuest}>
                  {startQuestLoading ? (
                    <CircularProgress
                      size={30}
                      thickness={5}
                      sx={{
                        color: "#2A8D5C",
                        animationDuration: "10000ms",
                      }}
                    />
                  ) : (
                    "Begin Quest"
                  )}
                </SharedSecondaryButton>
              ) : null}
              {!isDiscordConnected ? (
                <SharedSecondaryButton onClick={handleConnectDiscord}>Connect your Discord</SharedSecondaryButton>
              ) : null}
              <Box
                height="42px"
                width="52px"
                borderRadius="0px 32px 0px 0px"
                position="absolute"
                bgcolor="white"
                top="0"
                display={{
                  xs: "none",
                  md: "block",
                }}
                right="-52px"
              >
                <Box height="100%" width="100%" bgcolor="#AF9EFF" borderRadius="32px 32px 0px 0px" />
              </Box>
            </Grid>
            <Box
              display={{
                xs: "none",
                md: "block",
              }}
              height="42px"
              width="100%"
              bgcolor="#AF9EFF"
              position="relative"
              borderRadius="0px 0px 32px 0px"
            >
              <Box
                height="100%"
                width="100%"
                bgcolor="#AF9EFF"
                position="absolute"
                left="-10%"
                borderRadius="0px 0px 0px 32px"
              />
              <Box
                bgcolor="white"
                height="100%"
                width="84px"
                position="absolute"
                right="0"
                borderRadius="0px 0px 32px 32px"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </PageWrapper>
  );
};

export default ViewQuest;
