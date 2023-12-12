import { useLazyQuery, useMutation } from "@apollo/client";
import useErrorHandler from "components/ViewQuest/useErrorHandler";
import { START_QUEST } from "graphql/mutations";
import {
  CHECK_CMTY_USER_GUILD_MEMBERSHIP,
  GET_CMTY_USER_TOKEN_EXPIRE_CHECK,
  GET_ORG_DISCORD_INVITE_LINK,
} from "graphql/queries";
import { useEffect, useState } from "react";
import { getDiscordUrl } from "utils/discord";
import useAlerts from "utils/hooks";

const getCmtyUserToken = () => localStorage.getItem("cmtyUserToken");

interface IProps {
  setInfoModalQuestId: (questId: string | null) => void;
  orgId: string;
  quest?: any;
  quests?: [any];
  referralCode?: string;
  referralCampaignExternalId?: string;
  discordUrlParams: any;
}

const useStartQuest = ({
  setInfoModalQuestId,
  orgId,
  quest = null,
  quests = null,
  referralCode = null,
  referralCampaignExternalId = null,
  discordUrlParams,
}: IProps) => {
  const [isDiscordConneceted, setIsDiscordConnected] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isConnectionLoading, setIsConnectionLoading] = useState(false);

  const [getOrgDiscordInviteLink, { data: orgDiscordInviteLinkData }] = useLazyQuery(GET_ORG_DISCORD_INVITE_LINK);

  const { setSnackbarAlertMessage } = useAlerts();

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

  const { handleError } = useErrorHandler();

  const [startQuest] = useMutation(START_QUEST, {
    fetchPolicy: "no-cache",
  });

  const [verifyToken] = useLazyQuery(GET_CMTY_USER_TOKEN_EXPIRE_CHECK, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setIsDiscordConnected(!!data?.getCmtyUserTokenExpireCheck?.cmtyUserId);
    },
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
          orgId: orgId,
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
    setIsConnectionLoading(false);
    if (res?.data?.startQuest?.channelLink) {
      window.open(res?.data?.startQuest?.channelLink, "_blank");
      return setInfoModalQuestId(null);
    }
    if (res?.data?.startQuest?.error) {
      const selectedQuest = quest?.id || quests?.find((quest) => quest?.id === questId);
      if (res?.data?.startQuest?.error === "discord_user_not_in_guild") {
        setIsMember(false);
        return setInfoModalQuestId(questId);
      }
      return handleError({ questInfo: selectedQuest, error: res?.data?.startQuest?.error });
    }
  };

  const onStartQuest = async (questId) => {
    try {
      const cmtyUserId = await handleTokenCheck(questId);

      if (!cmtyUserId) return;

      const isMember = await handleMembershipCheck(questId, orgId, cmtyUserId);

      if (!isMember) return;

      const cmtyUserToken = getCmtyUserToken();

      const res = await startQuest({
        variables: {
          questId: questId,
          ...(referralCode && referralCampaignExternalId
            ? {
                referralCode,
                referralCampaignExternalId,
              }
            : {}),
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
                orgId,
                cmtyUserId: data?.getCmtyUserTokenExpireCheck?.cmtyUserId,
              },
            },
          }).then(({ data }) => {
            if (!data?.checkCmtyUserGuildMembership?.isMember) {
              setIsMember(false);
              getOrgDiscordInviteLink({
                variables: {
                  orgId,
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

  const handleJoinDiscord = async () => {
    setIsConnectionLoading(true);
    try {
      const { data } = await getOrgDiscordInviteLink({
        variables: {
          orgId: orgId,
        },
      });
      const inviteLink = data?.getOrgDiscordInviteLink?.link;
      window.open(inviteLink);
      membershipStartPolling(1000);
    } catch (error) {
      setIsConnectionLoading(false);
      setSnackbarAlertMessage("Something went wrong. Please try again.");
    }
  };

  const handleOnConnect = () => {
    setIsConnectionLoading(true);
    const discordAuthUrl = getDiscordUrl(
      "/discord/callback/cmty-user-connect",
      `&state=${encodeURIComponent(JSON.stringify(discordUrlParams))}`
    );
    window.open(discordAuthUrl);
  };

  const handleInfoModalClose = () => {
    setInfoModalQuestId(null);
    stopPolling?.();
    setIsConnectionLoading(false);
  };

  useEffect(() => {
    if (isMember) {
      return stopPolling?.();
    }
  }, [isMember]);
  return {
    onStartQuest,
    isDiscordConneceted,
    isMember,
    isConnectionLoading,
    handleJoinDiscord,
    handleOnConnect,
    handleInfoModalClose,
    orgDiscordInviteLinkData,
  }
};

export default useStartQuest;
