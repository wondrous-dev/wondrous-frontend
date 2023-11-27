import { useMutation, useQuery } from "@apollo/client";
import PageSpinner from "components/PageSpinner";
import { GraphQLErrorExtensions } from "graphql";
import { CONNECT_CMTY_USER } from "graphql/mutations";
import { GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL } from "graphql/queries";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ERRORS_LABELS } from "utils/constants";
import useAlerts from "utils/hooks";

const DiscordCallbackCmtyUserConnect = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams?.get("code");
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const state = searchParams?.get("state");
  const { questId, orgId, referralCode, referralCampaignExternalId } = JSON.parse(state || "{}");
  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL, {
    variables: {
      orgId,
    },
    skip: !orgId,
  });

  const handleError = (message) => {
    let guildInfo = orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildInfo;

    let label = typeof message === "string" ? ERRORS_LABELS[message] : null;

    if (message === "discord_user_not_in_guild") {
      if (referralCode && referralCampaignExternalId) {
        return navigate(
          `/referral?referralCode=${referralCode}&referralCampaignExternalId=${referralCampaignExternalId}&error=true&message=${message}`
        );
      }
      let guildName = guildInfo?.guildName || "the guild";
      label = label.replace("{guildName}", guildName);
    }
    setSnackbarAlertMessage(label || "Something went wrong, please try again later");
    setSnackbarAlertOpen(true);
    navigate(`/quests/view/${questId}?error=true&message=${message}`);
  };

  const navigate = useNavigate();
  const [connectCmtyUser, { loading }] = useMutation(CONNECT_CMTY_USER, {
    onCompleted: ({ connectCmtyUser }) => {
      if (connectCmtyUser?.token) {
        localStorage.setItem("cmtyUserToken", connectCmtyUser?.token);
        if (referralCode && referralCampaignExternalId) {
          return navigate(`/referral?referralCode=${referralCode}&referralCampaignExternalId=${referralCampaignExternalId}`);
        }
        navigate(`/quests/view/${questId}`);
      }
    },
    onError: (err) => {
      const message = err?.graphQLErrors[0]?.extensions?.message;
      return handleError(message);
    },
  });

  useEffect(() => {
    if (code && !loading && (questId || referralCode)) {
      connectCmtyUser({
        variables: {
          code,
          questId,
          referralCampaignExternalId,
        },
      });
    }
  }, [code, loading, questId, referralCampaignExternalId]);
  return <PageSpinner />;
};

export default DiscordCallbackCmtyUserConnect;
