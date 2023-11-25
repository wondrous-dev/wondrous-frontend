import { Box, Grid, Typography } from "@mui/material";
import { RoundedSecondaryButton, SharedSecondaryButton } from "components/Shared/styles";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { CampaignOverviewHeader, CampaignOverview } from "./CampaignOverview";
import PanelComponent from "./PanelComponent";
import { Panel } from "./styles";
import AddFormEntity from "components/AddFormEntity";
import { BG_TYPES, QUEST_STATUSES, TYPES } from "utils/constants";
import PageWrapper from "components/Shared/PageWrapper";
import Modal from "components/Shared/Modal";
import { useMutation } from "@apollo/client";
import { ATTACH_QUEST_STEPS_MEDIA, CREATE_QUEST, REMOVE_QUEST_STEP_MEDIA, UPDATE_QUEST } from "graphql/mutations";
import GlobalContext from "utils/context/GlobalContext";
import { useNavigate } from "react-router";
import { questValidator } from "services/validators";
import { handleMediaUpload } from "utils/media";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { transformQuestConfig } from "utils/transformQuestConfig";
import useAlerts from "utils/hooks";
import { DEFAULT_QUEST_SETTINGS_STATE_VALUE } from "./utils";
import { useTour } from "@reactour/tour";
import ErrorField from "components/Shared/ErrorField";
import QuestRewardComponent from "components/Rewards/QuestRewardComponent";
import { constructRequestBody, handleSaveError, processSave } from "./helpers";

const CreateTemplate = ({
  setRefValue,
  displaySavePanel,
  defaultQuestSettings = DEFAULT_QUEST_SETTINGS_STATE_VALUE,
  questId = null,
  postUpdate = null,
  getQuestById = null,
  defaultSteps = [],
}) => {
  const navigate = useNavigate();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [attachQuestStepsMedia] = useMutation(ATTACH_QUEST_STEPS_MEDIA, {
    refetchQueries: ["getQuestById"],
  });

  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAutoHideDuration } = useAlerts();

  const { activeOrg } = useContext(GlobalContext);

  const [steps, setSteps] = useState(defaultSteps);
  const refs = useRef([]);

  useEffect(() => {
    if (getQuestById) {
      setSteps(transformQuestConfig(getQuestById?.steps));
    }
  }, [getQuestById]);

  const { isOpen, setCurrentStep, setSteps: setTourSteps, steps: tourSteps } = useTour();

  const [removeQuestStepMedia] = useMutation(REMOVE_QUEST_STEP_MEDIA);

  const [isSaving, setIsSaving] = useState(false);
  const [questSettings, setQuestSettings] = useState({ ...defaultQuestSettings });
  const [removedMediaSlugs, setRemovedMediaSlugs] = useState({});
  const handleAdd = (type) => {
    setSteps([
      ...steps,
      {
        order: steps.length + 1,
        type,
        value: "",
        required: true,
        mediaUploads: [],
      },
    ]);
  };

  const [createQuest] = useMutation(CREATE_QUEST, {
    onCompleted: async ({ createQuest }) => {
      handleUpdateQuestStepsMedia(createQuest.id, createQuest?.steps, steps);
      navigate(`/quests/${createQuest.id}`);
    },
    refetchQueries: ["getQuestsForOrg", "getQuestRewards"],
  });
  const [updateQuest] = useMutation(UPDATE_QUEST, {
    onCompleted: async ({ updateQuest }) => {
      handleUpdateQuestStepsMedia(updateQuest.id, updateQuest?.steps, steps);
      postUpdate?.();
    },
    refetchQueries: ["getQuestsForOrg", "getQuestRewards"],
  });

  const handleRemove = (index) => {
    const newItems = [...steps];
    newItems.splice(index, 1);
    setSteps(
      newItems.map((item, idx) => ({
        ...item,
        order: idx + 1,
      }))
    );
  };

  useEffect(() => {
    if (!isOpen) return;
    const newSteps = tourSteps.map((step: any) => {
      if (step.id === "tutorial-quest-rewards") {
        return {
          ...step,
          handleNextAction: () => {
            setIsRewardModalOpen(true);
            setCurrentStep((prev) => prev + 1);
          },
        };
      }
      if (step.id === "tutorial-add-rewards") {
        return {
          ...step,
          handleNextAction: () => {
            setIsRewardModalOpen(false);
            setCurrentStep((prev) => prev + 1);
          },
          handlePrevAction: () => {
            setIsRewardModalOpen(false);
            setCurrentStep((prev) => prev - 1);
          },
        };
      }
      if (step.id === "tutorial-activate-quest") {
        return {
          ...step,
          handlePrevAction: () => {
            setIsRewardModalOpen(true);
            setCurrentStep((prev) => prev - 1);
          },
        };
      }
      return step;
    });
    setTourSteps(newSteps);
  }, [isOpen]);

  const handleUpdateQuestStepsMedia = async (questId, questSteps, localSteps) => {
    const stepsMedia = await Promise.all(
      localSteps.map(async (step, idx) => {
        const filteredMediaUploads = step.mediaUploads.filter((media) => media instanceof File);
        return await handleMediaUpload(filteredMediaUploads);
      })
    );

    await Promise.all(
      Object.keys(removedMediaSlugs).map(async (stepId) => {
        return await removeQuestStepMedia({
          variables: {
            questStepId: stepId,
            slugs: removedMediaSlugs[stepId],
          },
        });
      })
    );

    const stepsData = localSteps.reduce((acc, next, idx) => {
      if (next.mediaUploads.length > 0) {
        const questStep = questSteps.find((step) => step.order === idx + 1);
        if (stepsMedia[idx].length === 0) return acc;
        return [
          ...acc,
          {
            stepId: questStep?.id,
            mediaUploads: stepsMedia[idx],
          },
        ];
      }
      return acc;
    }, []);
    await attachQuestStepsMedia({
      variables: {
        questId,
        stepsData,
      },
    });
  };

  const handleMutation = ({ body }) => {
    if (questId) {
      return updateQuest({
        variables: {
          input: body,
          questId,
        },
      });
    }

    createQuest({
      variables: {
        input: body,
      },
    });
  };

  const handleSave = async (status = null) => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
    const body = constructRequestBody({ questSettings, steps, status, activeOrgId: activeOrg?.id });
    try {
      await questValidator(body);
      await processSave({
        body,
        handleMutation,
        setIsSaving,
        steps,
        removedMediaSlugs,
        setSnackbarAlertOpen,
        setSnackbarAlertMessage,
        setSnackbarAlertAutoHideDuration,
        isActive: questSettings.isActive,
        isSaving,
      });
    } catch (err) {
      handleSaveError({ err, setErrors, refs, setIsSaving });
    }
  };

  useMemo(() => setRefValue({ handleSave }), [setRefValue, handleSave]);

  const hasReferralStep = steps?.some((step) => step.type === TYPES.REFERRAL);
  return (
    <>
      <Modal
        open={isSaving}
        onClose={() => setIsSaving(false)}
        title={"Quest inactive"}
        maxWidth={600}
        footerLeft={
          <SharedSecondaryButton $reverse onClick={() => handleSave(QUEST_STATUSES.INACTIVE)}>
            No, keep inactive
          </SharedSecondaryButton>
        }
        footerRight={
          <SharedSecondaryButton onClick={() => handleSave(QUEST_STATUSES.OPEN)}>
            Yes, activate quest
          </SharedSecondaryButton>
        }
      >
        <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
          This quest has been successfully updated but is currently set to inactive. Do you want to set this quest to
          active?
        </Typography>
      </Modal>
      <PageWrapper
        containerProps={{
          direction: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          minHeight: "100vh",
          padding: {
            xs: "14px 14px 120px 14px",
            sm: "24px 56px 150px 24px",
          },
        }}
        bgType={BG_TYPES.QUESTS}
      >
        <Grid
          display="flex"
          justifyContent="space-between"
          width="100%"
          gap="24px"
          flexDirection={{
            xs: "column",
            lg: "row",
          }}
        >
          <Box flexBasis="40%" display="flex" flexDirection="column" gap="24px">
            <PanelComponent
              renderHeader={() => <CampaignOverviewHeader />}
              renderBody={() => <CampaignOverview questSettings={questSettings} setQuestSettings={setQuestSettings} />}
            />
            <PanelComponent
              panelProps={{
                "data-tour": "tutorial-quest-rewards",
              }}
              renderHeader={null}
              renderBody={() => (
                <QuestRewardComponent
                  rewards={questSettings.rewards}
                  setQuestSettings={setQuestSettings}
                  hasReferralStep={hasReferralStep}
                />
              )}
            />
          </Box>
          <Grid
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            gap="24px"
            alignItems="center"
            width="100%"
          >
            <AddFormEntity
              steps={steps}
              setSteps={setSteps}
              handleRemove={handleRemove}
              refs={refs}
              setRemovedMediaSlugs={setRemovedMediaSlugs}
            />
            {!hasReferralStep && (
              <Panel
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                gap="14px"
                padding="14px 24px"
                onClick={() => handleAdd(TYPES.TEXT_FIELD)}
                sx={{
                  cursor: "pointer",
                }}
              >
                <RoundedSecondaryButton>
                  <AddIcon
                    sx={{
                      color: "black",
                      fontSize: "14px",
                    }}
                  />
                </RoundedSecondaryButton>
                <Typography color="black" fontFamily="Poppins" fontWeight={600} fontSize="15px" lineHeight="15px">
                  Add a step
                </Typography>
                {errors?.steps && typeof errors?.steps === "string" ? <ErrorField errorText={errors?.steps} /> : null}
              </Panel>
            )}

            {displaySavePanel ? (
              <Grid
                position="fixed"
                bgcolor="#FFEBDA"
                width="70%"
                bottom="5%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding="14px"
                borderRadius="16px"
                border="1px solid #000212"
              >
                <SharedSecondaryButton onClick={() => handleSave()}>Save Quest</SharedSecondaryButton>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </PageWrapper>
    </>
  );
};

export default CreateTemplate;
