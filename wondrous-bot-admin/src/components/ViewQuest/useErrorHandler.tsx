import { useLazyQuery } from "@apollo/client";
import { GET_MINIMAL_QUEST_BY_ID, GET_QUEST_BY_ID } from "graphql/queries";
import { GET_DISCORD_ROLE_INFO } from "graphql/queries/discord";
import { ERRORS_LABELS, REQUIREMENTS_NOT_MET_ERRORS } from "utils/constants";
import useAlerts from "utils/hooks";
import { UnderlinedLink } from "./styles";

const DEFAULT_QUEST_ERR_MESSAGE = "We couldn't start the quest, please try again later";

const ERROR_TO_DISPLAY_MORE_INFO = [
  REQUIREMENTS_NOT_MET_ERRORS.DISCORD_ROLE,
  REQUIREMENTS_NOT_MET_ERRORS.LEVEL,
  REQUIREMENTS_NOT_MET_ERRORS.ONLY_ONCE,
  REQUIREMENTS_NOT_MET_ERRORS.QUEST,
];
export default function useErrorHandler() {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertAutoHideDuration } = useAlerts();
  const [getDiscordRoleInfo] = useLazyQuery(GET_DISCORD_ROLE_INFO);
  const [getQuestById] = useLazyQuery(GET_MINIMAL_QUEST_BY_ID);

  const handleSnackbar = (label) => {
    setSnackbarAlertMessage(label || DEFAULT_QUEST_ERR_MESSAGE);
    setSnackbarAlertOpen(true);
  };

  const handleDiscordRoleError = async (conditions) => {
    const discordCondition = conditions?.find((condition) => condition.type === "discord_role");
    const conditionData = discordCondition?.conditionData || {};
    let label = ERRORS_LABELS[REQUIREMENTS_NOT_MET_ERRORS.DISCORD_ROLE];
    const { discordGuildId, discordRoleId } = conditionData;
    try {
      const { data } = await getDiscordRoleInfo({
        variables: {
          discordGuildId,
          discordRoleId,
        },
      });
      label = label.replace("{discordRole}", data?.getDiscordRoleInfo?.name);
    } catch (error) {
      label = DEFAULT_QUEST_ERR_MESSAGE;
    }
    return handleSnackbar(label);
  };

  const handleLevelError = (level) => {
    const label = ERRORS_LABELS[REQUIREMENTS_NOT_MET_ERRORS.LEVEL].replace("{requiredLevel}", level);
    return handleSnackbar(label);
  };

  const handleMaxSubsError = () => {
    const label = ERRORS_LABELS[REQUIREMENTS_NOT_MET_ERRORS.ONLY_ONCE];
    return handleSnackbar(label);
  };

  const handleMissingQuestError = async (conditions) => {
    const condition = conditions?.find((condition) => condition.type === "quest") || {};
    const { questId } = condition?.conditionData;
    try {
      const { data } = await getQuestById({
        variables: {
          questId,
        },
      });
      setSnackbarAlertAutoHideDuration(60000);
      return handleSnackbar(
        <span>
          You need to complete{" "}
          <UnderlinedLink href={`/quests/view/${data?.getQuestById?.id}`}>{data?.getQuestById?.title}</UnderlinedLink>{" "}
          before taking this quest
        </span>
      );
    } catch (error) {
      return handleSnackbar(DEFAULT_QUEST_ERR_MESSAGE);
    }
  };

  const handleErrorToDisplayInfo = (error, questInfo) => {
    if (error === REQUIREMENTS_NOT_MET_ERRORS.DISCORD_ROLE) return handleDiscordRoleError(questInfo?.conditions);

    if (error === REQUIREMENTS_NOT_MET_ERRORS.LEVEL) return handleLevelError(questInfo?.level);

    if (error === REQUIREMENTS_NOT_MET_ERRORS.ONLY_ONCE) return handleMaxSubsError();

    if (error === REQUIREMENTS_NOT_MET_ERRORS.QUEST) return handleMissingQuestError(questInfo?.conditions);
  };

  const handleError = ({ error, questInfo }) => {
    if (ERROR_TO_DISPLAY_MORE_INFO.includes(error)) {
      return handleErrorToDisplayInfo(error, questInfo);
    }
    let label = ERRORS_LABELS[error];

    if (error === "discord_user_not_in_guild") {
      label = ERRORS_LABELS.discord_user_not_in_guild_on_quest_start;
    }
    handleSnackbar(label);
    localStorage.removeItem("cmtyUserToken");
  };

  return { handleError };
}
