import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { Grid, Typography } from "@mui/material";
import CreateTemplate from "components/CreateTemplate";
import DeleteQuestButton from "components/DeleteQuestButton";
import PageHeader from "components/PageHeader";
import ShareComponent from "components/Share";

import { SharedSecondaryButton } from "components/Shared/styles";
import ViewQuestResults from "components/ViewQuestResults";
import Modal from "components/Shared/Modal";
import { GET_QUEST_BY_ID, GET_QUEST_REWARDS } from "graphql/queries";
import { START_PREVIEW_QUEST } from "graphql/mutations";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QUEST_STATUSES, TUTORIALS, DISCORD_CONNECT_TYPES } from "utils/constants";
import { transformQuestConfig } from "utils/transformQuestConfig";
import CreateQuestContext from "utils/context/CreateQuestContext";
import QuestTitle from "components/QuestTitle";
import { getDiscordUrl } from "utils/discord";
import { getBaseUrl } from "utils/common";
import { useTour } from "@reactour/tour";
import { useMe } from "components/Auth";
import useAlerts from "utils/hooks";
import ShareQuestTweet from "components/ShareQuestTweet";

const QuestResultsPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const { user } = useMe() || {};
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const searchParams = new URLSearchParams(location.search);
  const isEditInQuery = searchParams.get("edit") === "true";
  const discordError = searchParams.get("discordError") === "true";
  const discordUserExists = searchParams.get("discordUserExists") === "true";
  const [isEditMode, setIsEditMode] = useState(isEditInQuery);
  const [connectDiscordModalOpen, setConnectDiscordModalOpen] = useState(false);
  const [notInGuildError, setNotInGuildError] = useState(false);
  let { id } = useParams();
  const handleNavigationToNewQuest = () => navigate("/quests/create");
  const headerActionsRef = useRef(null);
  const { setIsOpen } = useTour();
  const [getQuestRewards, { data: questRewardsData }] = useLazyQuery(GET_QUEST_REWARDS);
  useEffect(() => {
    if (discordError) {
      setSnackbarAlertMessage("Error connecting Discord");
      setSnackbarAlertOpen(true);
    }
    if (discordUserExists) {
      setSnackbarAlertMessage("This Discord account is already connected to another account");
      setSnackbarAlertOpen(true);
    }
  }, [discordError, discordUserExists]);
  useEffect(() => {
    if (id) {
      getQuestRewards({
        variables: {
          questId: id,
          includeConditionRewards: false,
        },
      });
    }
  }, [id]);
  const questRewards = questRewardsData?.getQuestRewards;

  const { ref, inView, entry } = useInView({
    threshold: 1,
  });

  const setRefValue = (value) => (headerActionsRef.current = value);

  const { data: { getQuestById } = {} } = useQuery(GET_QUEST_BY_ID, {
    variables: {
      questId: id,
    },
    fetchPolicy: "network-only",
    skip: !id,
  });
  const [startPreviewQuest] = useMutation(START_PREVIEW_QUEST, {
    onCompleted: (data) => {
      const guildId = data?.startPreviewQuest?.guildId;
      const channelId = data?.startPreviewQuest?.channelId;
      const discordUrl = `https://discord.com/channels/${guildId}/${channelId}`;
      window.open(discordUrl, "_blank");
    },
    onError: (err) => {
      if (err?.graphQLErrors[0]?.extensions?.errorCode === "discord_not_connected") {
        setConnectDiscordModalOpen(true);
      }
      if (err?.graphQLErrors[0]?.extensions?.errorCode === "discord_user_not_in_guild") {
        console.log("not in guild");
        setNotInGuildError(true);
      }
    },
  });

  useEffect(() => {
    if (user && !user?.completedQuestGuides?.includes(TUTORIALS.COMMUNITIES_QUEST)) {
      setIsEditMode(true);
      setIsOpen(true);
    }
  }, [user, isEditMode]);

  const toggleEdit = () => {
    setIsEditMode((prev) => !prev);
  };
  const handlePreviewQuest = () => {
    startPreviewQuest({
      variables: {
        questId: id,
      },
    });
  };

  const questSettings = {
    title: getQuestById?.title || "",
    description: getQuestById?.description || "",
    level: getQuestById?.level ? String(getQuestById?.level) : null,
    timeBound: getQuestById?.startAt || getQuestById?.endAt,
    isOnboarding: getQuestById?.isOnboarding || false,
    maxSubmission: getQuestById?.maxSubmission || null,
    maxApproval: getQuestById?.maxApproval || null,
    requireReview: getQuestById?.requireReview || false,
    isActive: getQuestById?.status === QUEST_STATUSES.OPEN || false,
    startAt: getQuestById?.startAt ? moment(getQuestById?.startAt) : null,
    endAt: getQuestById?.endAt ? moment(getQuestById?.endAt) : null,
    submissionCooldownPeriod: getQuestById?.submissionCooldownPeriod,
    questConditions: getQuestById?.conditions
      ? getQuestById?.conditions?.map((condition) => {
          const { __typename, ...rest } = condition?.conditionData;
          return {
            type: condition?.type,
            conditionData: rest,
          };
        })
      : null,
    rewards: [
      {
        value: getQuestById?.pointReward || 0,
        type: "points",
      },
      ...(questRewards ? questRewards : []),
    ],
  };
  const shareUrl = `${getBaseUrl()}/quest?id=${getQuestById?.id}`;
  return (
    <CreateQuestContext.Provider
      value={{
        errors,
        setErrors,
        isEditMode,
      }}
    >
      <Modal
        open={connectDiscordModalOpen}
        onClose={() => setConnectDiscordModalOpen(false)}
        title={"Connect Discord"}
        maxWidth={600}
        footerRight={
          <SharedSecondaryButton
            onClick={() => {
              const discordUrl = `${getDiscordUrl()}&state=${encodeURIComponent(
                JSON.stringify({
                  callbackType: DISCORD_CONNECT_TYPES.questPreview,
                  questId: id,
                })
              )}`;
              window.location.href = discordUrl;
            }}
          >
            Connect
          </SharedSecondaryButton>
        }
      >
        <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
          To preview this quest, you need to connect your Discord account first!
        </Typography>
      </Modal>
      <Modal open={notInGuildError} onClose={() => setNotInGuildError(false)} title={"Not in Server"} maxWidth={600}>
        <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
          You're Discord user is not a member of the Server!
        </Typography>
      </Modal>
      <PageHeader
        title={isEditMode ? "Edit Quest" : "View Quest"}
        withBackButton
        onBackButtonClick={() => {
          if (isEditMode) {
            toggleEdit();
          }
        }}
        renderActions={() => (
          <Grid display="flex" gap="10px" alignItems="center">
            <DeleteQuestButton questId={getQuestById?.id} />

            {/* 
            ShareComponent is used to share the link to the SSR page. This will work in a local dev environment only with vercel launched.
            */}
            <ShareComponent link={shareUrl} />
            <ShareQuestTweet link={shareUrl} />
            {isEditMode ? (
              <>
                <SharedSecondaryButton $reverse onClick={toggleEdit}>
                  Cancel
                </SharedSecondaryButton>

                <SharedSecondaryButton
                  onClick={async () => {
                    await headerActionsRef.current?.handleSave();
                  }}
                >
                  Save Quest
                </SharedSecondaryButton>
              </>
            ) : (
              <>
                <SharedSecondaryButton onClick={handlePreviewQuest}>Preview Quest</SharedSecondaryButton>
                <SharedSecondaryButton onClick={toggleEdit}>Edit Quest</SharedSecondaryButton>
              </>
            )}
          </Grid>
        )}
      />
      {isEditMode && getQuestById ? (
        <CreateTemplate
          setRefValue={setRefValue}
          displaySavePanel={!inView}
          defaultQuestSettings={questSettings}
          questId={id}
          getQuestById={getQuestById}
          postUpdate={toggleEdit}
        />
      ) : (
        <ViewQuestResults quest={getQuestById} rewards={questSettings.rewards} />
      )}
    </CreateQuestContext.Provider>
  );
};

export default QuestResultsPage;
