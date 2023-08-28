import { SELECT_STEP_TYPES, TYPES } from "utils/constants";
import { StepTextField } from "./Steps";
import { Grid, Typography } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { useEffect, useState } from "react";
import { StepModal } from "./StepModal";
import OptionSelect from "./Steps/OptionSelect";
import AttachmentType from "./Steps/Attachment";
import { VerifyButton } from "./Steps/VerifyButton";
import { GET_QUEST_BY_ID, USER_CAN_START_QUEST } from "graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { transformAndUploadMedia } from "utils/media";
import TakeQuestContext from "utils/context/TakeQuestContext";
import { useTakeQuest } from "utils/hooks";
import SubmitQuest from "./SubmitQuest";
import { SUBMIT_QUEST } from "graphql/mutations";

const handleMediaUpload = async (mediaUploads) =>
  Promise.all(
    mediaUploads.map(async (file) => {
      try {
        const { filename, fileType } = await transformAndUploadMedia({ file });
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

const COMPONENTS_CONFIG: any = {
  [TYPES.TEXT_FIELD]: StepTextField,
  [TYPES.MULTI_QUIZ]: OptionSelect,
  [TYPES.SINGLE_QUIZ]: OptionSelect,
  [TYPES.NUMBER]: (props) => <StepTextField type="number" {...props} />,
  [TYPES.ATTACHMENTS]: AttachmentType,
  [TYPES.LINK_CLICK]: VerifyButton,
  [TYPES.SUBSCRIBE_YT_CHANNEL]: VerifyButton,
  [TYPES.LIKE_YT_VIDEO]: VerifyButton,

  [TYPES.SNAPSHOT_PROPOSAL_VOTE]: VerifyButton,
  [TYPES.SNAPSHOT_SPACE_VOTE]: VerifyButton,
  [TYPES.VERIFY_TOKEN_HOLDING]: VerifyButton,
  [TYPES.DATA_COLLECTION]: () => null,
};

const QuestStep = ({ step, value, isActive, nextStepId, isWebView = false }) => {
  const Component: React.FC<any> = COMPONENTS_CONFIG[step?.type];
  const [isActionDisabled, setIsActionDisabled] = useState(false);
  const { onChange } = useTakeQuest();
  if (!isActive) return null;
  if (Component) {
    return (
      <PanelComponent
        renderHeader={() => (
          <Grid
            padding="14px"
            bgcolor="#F7F7F7"
            sx={{
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <Typography fontFamily="Poppins" color="black" fontSize="14px" fontWeight={600} lineHeight="15px">
              Quest Portal
            </Typography>
          </Grid>
        )}
        renderBody={() => (
          <StepModal step={step} nextStepId={nextStepId} disabled={!value || isActionDisabled}>
            <Component
              step={step}
              value={value}
              isActionDisabled={isActionDisabled}
              setIsActionDisabled={setIsActionDisabled}
              onChange={(value) => onChange({ id: step.id, value })}
              placeholder="Enter answer"
            />
          </StepModal>
        )}
      />
    );
  }
  return null;
};

const QuestStepsList = () => {
  let { id } = useParams();

  const [submitQuest] = useMutation(SUBMIT_QUEST);

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
      } else if (SELECT_STEP_TYPES.includes(step.type)) {
        questSubmissions.push({
          stepId: step.id,
          order: step.order,
          skipped: isQuestSkipped,
          selectedValues: isQuestSkipped ? null : answer,
        });
      } else if (step.type === TYPES.ATTACHMENTS) {
        //TODO: fix upload media from web app , probably separate endpoint
        // const stepsMedia = isQuestSkipped ? [null] : await handleMediaUpload(answer);
        // console.log(stepsMedia, 'STEPS MEDIA')
        // questSubmissions.push({
        //   stepId: step.id,
        //   order: step.order,
        //   skipped: isQuestSkipped,
        //   attachments: isQuestSkipped ? null : stepsMedia.map((media) => ({
        //     filename: media.name,
        //     type: media.type,
        //     uploadSlug: media.uploadSlug
        //   }))
        // })
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

    const { data: submitQuestResultData } = await submitQuest({
      variables: submissionInput,
    });

    //TODO: handle reward && next screen
    //   const stepsSubmission = camelToSnakeArr(questSubmissions);
    // const submissionInput = {
    // 	quest_id: questId,
    // 	telegram_user_id: ctx.from.id,
    // 	telegram_username: ctx.from.username,
    // 	steps_data: stepsSubmission
    // };
  };

  const steps = data?.getQuestById?.steps || [];

  const nextStep = () => {
    const currentStepIdx = steps?.findIndex((step) => step.id === activeStepId);
    const nextStepId = steps[currentStepIdx + 1]?.id;

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
      }}
    >
      <Grid display="flex" flexDirection="column" justifyContent="center" gap="24px" alignItems="center" width="100%">
        {showSubmitView ? (
          <SubmitQuest handleSubmit={handleSubmit} />
        ) : (
          <>
            {data?.getQuestById?.steps?.map((step, idx) => {
              return (
                <QuestStep
                  value={responses[step.id]}
                  isActive={activeStepId === step.id}
                  step={step}
                  key={step.id}
                  nextStepId={steps[idx + 1]}
                />
              );
            })}
          </>
        )}
      </Grid>
    </TakeQuestContext.Provider>
  );
};

export default QuestStepsList;
