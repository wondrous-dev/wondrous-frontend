import { Box, Grid, Typography } from "@mui/material";
import { RoundedSecondaryButton, SharedSecondaryButton } from "components/Shared/styles";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { CampaignOverviewHeader, CampaignOverview } from "./CampaignOverview";
import PanelComponent from "./PanelComponent";
import { Panel } from "./styles";
import AddFormEntity from "components/AddFormEntity";
import { BG_TYPES, CUSTOM_INTEGRATIONS, QUEST_STATUSES, TYPES } from "utils/constants";
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
import ErrorField from "components/Shared/ErrorField";
import QuestRewardComponent from "components/Rewards/QuestRewardComponent";
import { constructRequestBody, handleSaveError, processSave } from "./helpers";
import { useTour } from "@reactour/tour";
import useDynamicSteps from "components/TutorialComponent/Tutorials/CreateQuestTutorial/useDynamicSteps";
import { COMPONENT_CATEGORIES, COMPONENT_OPTIONS } from "components/AddFormEntity/constants";
import ComponentOptionsModal from "components/AddFormEntity/components/ComponentOptionsModal/ComponentOptionsModal";

const CreateTemplate = ({
  setRefValue,
  defaultQuestSettings = DEFAULT_QUEST_SETTINGS_STATE_VALUE,
  questId = null,
  postUpdate = null,
  getQuestById = null,
  defaultSteps = [],
}) => {
  const navigate = useNavigate();
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [attachQuestStepsMedia] = useMutation(ATTACH_QUEST_STEPS_MEDIA, {
    refetchQueries: ["getQuestById"],
  });

  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAutoHideDuration } = useAlerts();

  const { activeOrg } = useContext(GlobalContext);

  const [steps, setSteps] = useState(defaultSteps);
  const refs = useRef([]);

  useDynamicSteps({ steps, getQuestById, defaultSteps });
  useEffect(() => {
    if (getQuestById) {
      setSteps(transformQuestConfig(getQuestById?.steps));
    }
  }, [getQuestById]);

  const [removeQuestStepMedia] = useMutation(REMOVE_QUEST_STEP_MEDIA);

  const [isSaving, setIsSaving] = useState(false);
  const [questSettings, setQuestSettings] = useState({ ...defaultQuestSettings });
  const [removedMediaSlugs, setRemovedMediaSlugs] = useState({});

  const [openComponentOptionsModal, setOpenComponentOptionsModal] = useState(false);

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

  const handleUpdateQuestStepsMedia = async (questId, questSteps, localSteps) => {
    const stepsMedia = await Promise.all(
      localSteps.map(async (step) => {
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

  const componentOptions = useMemo(() => {
    let defaultOptions = [...COMPONENT_OPTIONS];
    if (activeOrg?.id in CUSTOM_INTEGRATIONS) {
      const customIntegrations = CUSTOM_INTEGRATIONS[activeOrg?.id];
      customIntegrations?.integrations.forEach((integration) => {
        defaultOptions.push({ ...integration, icon: activeOrg?.profilePicture, category: COMPONENT_CATEGORIES.CUSTOM });
      });
    }
    return defaultOptions;
  }, [activeOrg?.id]);

  return (
    <>
      <ComponentOptionsModal
        open={openComponentOptionsModal}
        onClose={() => setOpenComponentOptionsModal(false)}
        onClick={(value) => handleAdd(value)}
        options={componentOptions}
      />
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
          <SharedSecondaryButton sx={{ marginLeft: "8px" }} onClick={() => handleSave(QUEST_STATUSES.OPEN)}>
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
              panelProps={{
                "data-tour": "tutorial-quest-settings",
              }}
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
                data-tour="tutorial-add-quest-step"
                padding="14px 24px"
                onClick={() => setOpenComponentOptionsModal(true)}
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
          </Grid>
        </Grid>
      </PageWrapper>
    </>
  );
};

export default CreateTemplate;
