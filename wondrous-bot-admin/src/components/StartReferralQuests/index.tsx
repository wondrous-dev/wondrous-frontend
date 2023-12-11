import { useLazyQuery, useMutation } from "@apollo/client";
import { Masonry } from "@mui/lab";
import { Grid, Box, Typography, ButtonBase } from "@mui/material";
import { CloseIcon } from "components/Shared/DatePicker/Shared/Icons";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import useErrorHandler from "components/ViewQuest/useErrorHandler";
import { Reward } from "components/ViewQuestResults/ViewRewards";
import { START_QUEST } from "graphql/mutations";
import {
  CHECK_CMTY_USER_GUILD_MEMBERSHIP,
  GET_CMTY_USER_TOKEN_EXPIRE_CHECK,
  GET_ORG_DISCORD_INVITE_LINK,
} from "graphql/queries";
import { useEffect, useMemo, useState } from "react";
import { constructRewards } from "utils/common";
import { REFERRAL_REWARD_SCHEME } from "utils/constants";
import InfoModal from "./InfoModal";
import useAlerts from "utils/hooks";
import { getDiscordUrl } from "utils/discord";
import IndividualQuestComponent from "./IndividualQuestComponent";

const getCmtyUserToken = () => localStorage.getItem("cmtyUserToken");

const StartReferralQuests = ({ referralCampaign, referralCode, referralCampaignExternalId, referralCodeInfo }) => {
  const [isConnectionLoading, setIsConnectionLoading] = useState(false);
  const [infoModalQuestId, setInfoModalQuestId] = useState(null);

  const [isMember, setIsMember] = useState(false);
  const [isDiscordConneceted, setIsDiscordConnected] = useState(false);

  const [verifyToken] = useLazyQuery(GET_CMTY_USER_TOKEN_EXPIRE_CHECK, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setIsDiscordConnected(!!data?.getCmtyUserTokenExpireCheck?.cmtyUserId);
    },
  });

  const { handleError } = useErrorHandler();

  const [startQuest] = useMutation(START_QUEST, {
    fetchPolicy: "no-cache",
  });

  const handleOnCheckMembershipCompleted = async (data) => {
    if (data?.checkCmtyUserGuildMembership?.isMember !== isMember) {
      setIsMember(data?.checkCmtyUserGuildMembership?.isMember);
    }
    if (data?.checkCmtyUserGuildMembership?.isMember) {
      setIsConnectionLoading(false);
    }
  };

  const [checkCmtyUserGuildMembership, { startPolling: membershipStartPolling, stopPolling, data: membershipData }] =
    useLazyQuery(CHECK_CMTY_USER_GUILD_MEMBERSHIP, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
      nextFetchPolicy: "no-cache",
      onCompleted: handleOnCheckMembershipCompleted,
    });

  const handleTokenCheck = async (questId) => {
    try {
      const cmtyUserToken = getCmtyUserToken();
      const verifyTokenRes = await verifyToken({
        context: {
          headers: {
            Authorization: `Bearer ${cmtyUserToken}`,
          },
        },
      });
      const cmtyUserId = verifyTokenRes?.data?.getCmtyUserTokenExpireCheck?.cmtyUserId;
      if (!cmtyUserId) {
        setInfoModalQuestId(questId);
      }
      return cmtyUserId;
    } catch (error) {
      return null;
    }
  };

  const handleMembershipCheck = async (questId, orgId, cmtyUserId) => {
    const membershipRes = await checkCmtyUserGuildMembership({
      variables: {
        input: {
          orgId: referralCampaign?.orgId,
          cmtyUserId,
        },
      },
    });
    if (!membershipRes?.data?.checkCmtyUserGuildMembership?.isMember) {
      setInfoModalQuestId(questId);
      throw new Error("discord_user_not_in_guild");
    }
    return membershipRes?.data?.checkCmtyUserGuildMembership?.isMember;
  };

  const handleOnStartQuestCompleted = (res, questId) => {
    if (res?.data?.startQuest?.channelLink) {
      window.open(res?.data?.startQuest?.channelLink, "_blank");
    }
    if (res?.data?.startQuest?.error) {
      const quest = referralCampaign?.quests?.find((quest) => quest?.id === questId);
      if (res?.data?.startQuest?.error === "discord_user_not_in_guild") {
        getOrgDiscordInviteLink({
          variables: {
            orgId: referralCampaign?.orgId,
          },
        });
        setIsMember(false);
        setIsConnectionLoading(false);
        return setInfoModalQuestId(questId);
      }
      return handleError({ questInfo: quest, error: res?.data?.startQuest?.error });
    }
  };
  const onStartQuest = async (questId) => {
    try {
      const cmtyUserId = await handleTokenCheck(questId);

      if (!cmtyUserId) return;

      const isMember = await handleMembershipCheck(questId, referralCampaign?.orgId, cmtyUserId);

      if (!isMember) return;

      const cmtyUserToken = getCmtyUserToken();

      const res = await startQuest({
        variables: {
          questId: questId,
          referralCode,
          referralCampaignExternalId,
        },
        context: {
          headers: {
            Authorization: `Bearer ${cmtyUserToken}`,
          },
        },
      });
      handleOnStartQuestCompleted(res, questId);
    } catch (error) {
      //TODO: handle error
    }
  };

  const { setSnackbarAlertMessage } = useAlerts();

  const [getOrgDiscordInviteLink, { data: orgDiscordInviteLinkData }] = useLazyQuery(GET_ORG_DISCORD_INVITE_LINK);

  const inviteLink = orgDiscordInviteLinkData?.getOrgDiscordInviteLink?.link;

  const onStorageChange = (e) => {
    if (e?.key === "cmtyUserToken") {
      if (e.newValue) {
        verifyToken({
          context: {
            headers: {
              Authorization: `Bearer ${e.newValue}`,
            },
          },
        }).then(({ data }) => {
          setIsDiscordConnected(!!data?.getCmtyUserTokenExpireCheck?.cmtyUserId);
          if (!data?.getCmtyUserTokenExpireCheck?.cmtyUserId) {
            localStorage.removeItem("cmtyUserToken");
            return setSnackbarAlertMessage("Something went wrong. Please try again.");
          }
          checkCmtyUserGuildMembership({
            variables: {
              input: {
                orgId: referralCampaign?.orgId,
                cmtyUserId: data?.getCmtyUserTokenExpireCheck?.cmtyUserId,
              },
            },
          }).then(({ data }) => {
            if (!data?.checkCmtyUserGuildMembership?.isMember) {
              setIsMember(false);
              getOrgDiscordInviteLink({
                variables: {
                  orgId: referralCampaign?.orgId,
                },
              });
            }
          });
        });
        setIsConnectionLoading(false);
      }
      if (!e?.newValue) {
        setIsConnectionLoading(false);
        return setIsDiscordConnected(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const org = referralCampaign?.org;
  const [displayReferrer, setDisplayReferrer] = useState(true);

  const referredRewards = useMemo(() => {
    const { rewards, referredPointReward } = referralCampaign || {};
    return rewards?.reduce(
      (acc, reward) => {
        if (reward?.scheme === REFERRAL_REWARD_SCHEME.REFERRED || reward?.scheme === REFERRAL_REWARD_SCHEME.TWO_WAY) {
          acc.push(reward);
        }
        return acc;
      },
      referredPointReward ? [{ type: "points", value: referredPointReward }] : []
    );
  }, [referralCampaign?.rewards, referralCampaign?.referredPointReward]);

  const quests = referralCampaign?.quests || [];
  const rewardsValue = constructRewards({ rewards: referredRewards || [] });

  const masonryColumnsConfig = useMemo(() => {
    if (quests?.length <= 1) {
      return { xs: 1 };
    } else if (quests?.length <= 2) {
      return { xs: 1, sm: 2 };
    }
    return { xs: 1, sm: 2, md: 2, lg: 3 };
  }, [quests?.length]);

  const handleJoinDiscord = () => {
    window.open(inviteLink);
    setIsConnectionLoading(true);
    membershipStartPolling(1000);
  };

  const params = {
    referralCode,
    referralCampaignExternalId,
    orgId: referralCampaign?.orgId,
  };

  const handleOnConnect = () => {
    setIsConnectionLoading(true);
    const discordAuthUrl = getDiscordUrl(
      "/discord/callback/cmty-user-connect",
      `&state=${encodeURIComponent(JSON.stringify(params))}`
    );
    window.open(discordAuthUrl);
  };

  const handleInfoModalClose = () => {
    setInfoModalQuestId(null);
    stopPolling?.();
    setIsConnectionLoading(false);
  };

  return (
    <>
      <InfoModal
        isOpen={!!infoModalQuestId}
        onStartQuest={() => onStartQuest(infoModalQuestId)}
        onClose={handleInfoModalClose}
        showConnect={!isDiscordConneceted}
        showJoinDiscord={isDiscordConneceted && !isMember}
        showStartQuest={isDiscordConneceted && isMember}
        handleJoinDiscord={handleJoinDiscord}
        handleOnConnect={handleOnConnect}
        isConnectionLoading={isConnectionLoading}
      />

      {displayReferrer ? (
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <Box
            display="flex"
            padding="13px 14px"
            flex="1 0 0"
            top="100px"
            zIndex="10"
            width="calc(100% - 56px)"
            position="fixed"
            alignItems="center"
            justifyContent="space-between"
            alignSelf="stretch"
            borderRadius="12px"
            border="1px solid #2A8D5C"
            bgcolor="#d0e1d6"
          >
            <Box />
            <Typography color="black" fontSize="14px" fontFamily="Poppins" fontWeight={500}>
              {<strong>{referralCodeInfo?.referrerDisplayName}</strong>} referred you, complete the quests below!
            </Typography>
            <ButtonBase onClick={() => setDisplayReferrer(false)}>
              <CloseIcon />
            </ButtonBase>
          </Box>
        </Box>
      ) : null}

      <Grid
        display="flex"
        flexDirection="column"
        gap="24px"
        width="100%"
        justifyContent="center"
        alignItems="center"
        height="100%"
        flex="1"
      >
        <Box display="flex" flexDirection="column" gap="11px" justifyContent="center" alignItems="center">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            border="2px solid #000000"
            borderRadius="100%"
            padding="2px"
            position="relative"
          >
            <OrgProfilePicture
              profilePicture={referralCodeInfo?.orgProfilePicture}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "100%",
              }}
            />
          </Box>
        </Box>
        <Typography fontWeight={600} fontFamily="Poppins" fontSize="22px" color="black">
          {referralCodeInfo?.orgDisplayName}
        </Typography>
        {org.description ? (
          <Typography fontWeight={500} fontFamily="Poppins" fontSize="17" color="#626262" textAlign="center">
            {org?.description}
          </Typography>
        ) : null}
        {referredRewards?.length ? (
          <Box display="flex" gap="14px" alignItems="center" justifyContent="center" flexDirection="column">
            <Typography fontFamily="Poppins" fontSize="13px" color="black" fontWeight={500}>
              Earn rewards for completing these quests!
            </Typography>
            <Grid container alignItems="center" gap="14px" flex="1" justifyContent="center">
              {rewardsValue.map(Reward)}
            </Grid>
          </Box>
        ) : null}
        {/* //TODO: REPLACE THIS WITH NEWEST CARD */}

        <Box
          bgcolor="#AF9EFF"
          height="100%"
          padding="32px 56px"
          display="flex"
          width="100%"
          flex="1"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Masonry
            spacing={4}
            columns={masonryColumnsConfig}
            sx={{
              alignContent: "center",
              width: "100%",
            }}
          >
            {quests?.map((quest, index) => (
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                sx={{
                  maxWidth: "400px",
                }}
              >
                <IndividualQuestComponent quest={quest} key={index} onStartQuest={onStartQuest} />
              </Box>
            ))}
          </Masonry>
        </Box>
      </Grid>
    </>
  );
};

export default StartReferralQuests;
