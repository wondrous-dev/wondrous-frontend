import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CMTY_ORG_DISCORD_CONFIG, GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL, GET_QUEST_BY_ID } from "graphql/queries";
import ViewQuest from "components/ViewQuest";
import { GET_TELEGRAM_CONFIG_FOR_ORG } from "graphql/queries/telegram";

const ViewQuestPage = () => {
  let { id, ...rest } = useParams();
  const [searchParams] = useSearchParams();
  const { data: { getQuestById } = {}, loading: questLoading } = useQuery(GET_QUEST_BY_ID, {
    variables: {
      questId: id,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      document.title = data?.getQuestById?.title;
    },
    skip: !id,
  });

  const { data: telegramConfigData, loading: telegramConfigLoading } = useQuery(GET_TELEGRAM_CONFIG_FOR_ORG, {
    variables: {
      orgId: getQuestById?.orgId,
    },
    skip: !getQuestById?.orgId,
  });

  const { data: discordConfigData, loading: discordConfigLoading } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL, {
    variables: {
      orgId: getQuestById?.orgId,
    },
    skip: !getQuestById?.orgId,
  });

  const loading = questLoading || telegramConfigLoading || discordConfigLoading;

  return (
    <ViewQuest
      quest={getQuestById}
      loading={loading}
      hasTelegramIntegration={!!telegramConfigData?.getTelegramConfigForOrg?.chatId}
      hasDiscordIntegration={!!discordConfigData?.getCmtyOrgDiscordConfig?.id}
    />
  );
};

export default ViewQuestPage;
