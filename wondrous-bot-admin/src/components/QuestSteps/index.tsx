import { SELECT_TYPES, TYPES } from "utils/constants";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Web3Connect } from "./Steps/VerifyButton";
import { GET_QUEST_BY_ID, USER_CAN_START_QUEST } from "graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import TakeQuestContext from "utils/context/TakeQuestContext";
import SubmitQuest from "./SubmitQuest";
import { SUBMIT_QUEST } from "graphql/mutations";
import { ErrorText } from "components/Shared/styles";
import EditModal from "./EditModal";
import QuestStepComponent from "./QuestStepComponent";
import { transformAndUploadMedia, transformAndUploadTelegramMedia } from "utils/media";

const handleMediaUpload = async (mediaUploads) =>
Promise.all(
  mediaUploads.map(async (file) => {
    try {
      const { filename, fileType } = await transformAndUploadTelegramMedia({ file });
      return {
        uploadSlug: filename,
        type: fileType,
        name: file.name,
      };
    } catch (error) {
      return null;
    }
  })
);


const ErrorHelpers = ({ error, callback, telegramUserId }) => {
  const errorCode = error?.graphQLErrors?.[0]?.extensions?.errorCode;
  const errorMessage = error?.graphQLErrors?.[0]?.extensions?.message;

  if (!error) return null;

  if (errorCode === "no_active_wallet") {
    return (
      <>
        <ErrorText>
          There is a token reward with this quest! Please connect your wallet first and then click submit again.
        </ErrorText>
        <Web3Connect telegramUserId={telegramUserId} callback={callback} />
      </>
    );
  }
  if (errorMessage?.includes("You already minted a POAP for this drop")) {
    return <ErrorText>{errorMessage}</ErrorText>;
  }
  return <ErrorText>Something went wrong</ErrorText>;
};

const QuestStepsList = () => {
  let { id } = useParams();

  const [submitQuest, { data: submittedQuestData, error }] = useMutation(SUBMIT_QUEST);

  const [activeStepId, setActiveStepId] = useState(null);
  const [responses, setResponses] = useState({});
  const [showSubmitView, setShowSubmitView] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const webApp = (window as any)?.Telegram?.WebApp;
  const [getQuestById, { data, loading, refetch }] = useLazyQuery(GET_QUEST_BY_ID, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      document.title = data?.getQuestById?.title;
    },
  });

  const [canUserStartQuest, { data: canStartData, error: canStartError }] = useLazyQuery(USER_CAN_START_QUEST, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!webApp?.initDataUnsafe?.user?.id) {
      return;
    }
    webApp?.expand();
    handleStart();
  }, [webApp?.initDataUnsafe?.user?.id, webApp?.initDataUnsafe?.user?.username]);

  const handleStart = async () => {
    const { data } = await canUserStartQuest({
      variables: {
        questId: id,
        telegramUserId: webApp?.initDataUnsafe?.user?.id?.toString(),
        telegramUsername: webApp?.initDataUnsafe?.user?.username,
      },
    });
    if (data?.userCanStartQuest?.canStart) {
      const { data: questData } = await getQuestById({
        variables: {
          questId: id,
        },
      });
      if (questData?.getQuestById?.id) {
        setActiveStepId(questData.getQuestById?.steps?.[0]?.id);
      }
    }
  };

  const onChange = ({ id, value, skip = false }) =>
    setResponses({
      ...responses,
      [id]: skip ? null : value,
    });

  const handleSubmit = async () => {
    const questSubmissions = [];

    for (const step of data?.getQuestById.steps) {
      const answer = responses[step.id];
      const isQuestSkipped = responses[step.id] === null;
      if (step.type === TYPES.TEXT_FIELD) {
        questSubmissions.push({
          stepId: step.id,
          content: isQuestSkipped ? null : answer,
          skipped: isQuestSkipped,
          order: step.order,
        });
      } else if (step.type === TYPES.NUMBER) {
        questSubmissions.push({
          stepId: step.id,
          content: answer,
          order: step.order,
        });
      } else if (SELECT_TYPES.includes(step.type)) {
        questSubmissions.push({
          stepId: step.id,
          order: step.order,
          skipped: isQuestSkipped,
          selectedValues: isQuestSkipped ? null : answer,
        });
      } else if (step.type === TYPES.ATTACHMENTS) {
        //TODO: fix upload media from web app , probably separate endpoint
        const stepsMedia = isQuestSkipped ? [null] : await handleMediaUpload(answer);
        console.log(stepsMedia, 'STEPS MEDIA')
        questSubmissions.push({
          stepId: step.id,
          order: step.order,
          skipped: isQuestSkipped,
          attachments: isQuestSkipped ? null : stepsMedia.map((media) => ({
            filename: media.name,
            type: media.type,
            uploadSlug: media.uploadSlug
          }))
        })
      } else if ([TYPES.LIKE_YT_VIDEO, TYPES.SUBSCRIBE_YT_CHANNEL].includes(step.type)) {
        questSubmissions.push({
          stepId: step.id,
          order: step.order,
          skipped: isQuestSkipped,
          verified: isQuestSkipped ? false : true,
        });
      } else if ([TYPES.SNAPSHOT_PROPOSAL_VOTE, TYPES.SNAPSHOT_SPACE_VOTE].includes(step.type)) {
        questSubmissions.push({
          stepId: step.id,
          order: step.order,
          skipped: isQuestSkipped,
          verified: isQuestSkipped ? false : true,
        });
      }
    }
    const submissionInput = {
      questId: data?.getQuestById?.id,
      telegramUserId: webApp?.initDataUnsafe?.user?.id?.toString(),
      telegramUsername: webApp?.initDataUnsafe?.user?.username,
      stepsData: questSubmissions,
    };

    try {
      const { data: submitQuestResultData } = await submitQuest({
        variables: submissionInput,
      });
      if (isEditMode) setIsEditMode(false);
    } catch (error) {}
    //TODO: handle reward && next screen
  };

  const steps = data?.getQuestById?.steps || [];

  const nextStep = () => {
    const currentStepIdx = steps?.findIndex((step) => step.id === activeStepId);
    const nextStepId = steps[currentStepIdx + 1]?.id;

    if (isEditMode) {
      setIsEditMode(false);
      return setShowSubmitView(true);
    }
    if (!nextStepId) {
      return setShowSubmitView(true);
    }
    setActiveStepId(steps[currentStepIdx + 1]?.id);
  };

  const prevStep = () => {
    const currentStepIdx = steps?.findIndex((step) => step.id === activeStepId);
    setActiveStepId(steps[currentStepIdx - 1]?.id);
  };
  return (
    <TakeQuestContext.Provider
      value={{
        onChange,
        nextStep,
        prevStep,
        handleSubmit,
        telegramUser: webApp?.initDataUnsafe?.user,
        isWebView: webApp?.isWebView,
        quest: data?.getQuestById,
        setIsEditMode,
        setShowSubmitView,
        isEditMode,
        webApp
      }}
    >
      <Grid display="flex" flexDirection="column" justifyContent="center" gap="24px" alignItems="center" width="100%">
        {showSubmitView && !isEditMode ? (
          <SubmitQuest
            handleSubmit={handleSubmit}
            submittedQuestData={submittedQuestData}
            errorComponents={() => (
              <ErrorHelpers telegramUserId={webApp?.initDataUnsafe?.user?.id} callback={handleSubmit} error={error} />
            )}
          />
        ) : (
          <>
            {isEditMode ? (
              <EditModal responses={responses} />
            ) : (
              data?.getQuestById?.steps?.map((step, idx) => {
                return (
                  <QuestStepComponent
                    value={responses[step.id]}
                    isActive={activeStepId === step.id}
                    step={step}
                    key={step.id}
                    nextStepId={steps[idx + 1]}
                  />
                );
              })
            )}
          </>
        )}
      </Grid>
    </TakeQuestContext.Provider>
  );
};

export default QuestStepsList;