import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { RoundedSecondaryButton, SharedSecondaryButton } from "components/Shared/styles";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { CampaignOverviewHeader, CampaignOverview } from "./CampaignOverview";
import PanelComponent from "./PanelComponent";
import { Panel } from "./styles";
import AddFormEntity from "components/AddFormEntity";
import { BG_TYPES, QUEST_STATUSES, TYPES } from "utils/constants";
import { RewardComponent, RewardOverviewHeader } from "./RewardComponent";
import PageWrapper from "components/Shared/PageWrapper";
import Modal from "components/Shared/Modal";
import { useMutation } from "@apollo/client";
import { ATTACH_QUEST_STEPS_MEDIA, CREATE_QUEST, REMOVE_QUEST_STEP_MEDIA, UPDATE_QUEST } from "graphql/mutations";
import GlobalContext from "utils/context/GlobalContext";
import { useNavigate } from "react-router";
import { questValidator, ValidationError } from "services/validators";
import { getPathArray } from "utils/common";
import { set } from "lodash";
import { transformAndUploadMedia } from "utils/media";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { PAYMENT_OPTIONS } from "./RewardUtils";
import { transformQuestConfig } from "utils/transformQuestConfig";
import useAlerts from "utils/hooks";

const DEFAULT_STATE_VALUE = {
  level: "1",
  timeBound: false,
  maxSubmission: null,
  maxApproval: null,
  requireReview: false,
  isActive: false,
  isOnboarding: false,
  startAt: null,
  endAt: null,
  questConditions: [],
  rewards: [
    {
      value: 0,
      type: "points",
    },
  ],
};

const CreateTemplate = ({
  setRefValue,
  displaySavePanel,
  defaultQuestSettings = DEFAULT_STATE_VALUE,
  questId = null,
  postUpdate = null,
  title,
  getQuestById = null,
}) => {
  const navigate = useNavigate();
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [attachQuestStepsMedia] = useMutation(ATTACH_QUEST_STEPS_MEDIA, {
    refetchQueries: ["getQuestById"],
  });

  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAutoHideDuration } = useAlerts();

  const { activeOrg } = useContext(GlobalContext);

  const [steps, setSteps] = useState([]);
  const refs = useRef([]);

  useEffect(() => {
    if (getQuestById) {
      setSteps(transformQuestConfig(getQuestById?.steps));
    }
  }, [getQuestById]);

  const [removeQuestStepMedia] = useMutation(REMOVE_QUEST_STEP_MEDIA);

  const [isSaving, setIsSaving] = useState(false);
  const [questSettings, setQuestSettings] = useState(defaultQuestSettings);
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

  const handleSave = async (status = null) => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
    const {
      questConditions,
      requireReview,
      maxSubmission,
      isActive,
      maxApproval,
      startAt,
      endAt,
      level,
      timeBound,
      isOnboarding,
    } = questSettings;
    const filteredQuestConditions = questConditions?.filter((condition) => condition.type && condition.conditionData);

    const body = {
      title,
      orgId: activeOrg.id,
      isOnboarding,
      requireReview,
      maxSubmission: maxSubmission ? parseInt(maxSubmission, 10) : null,
      maxApproval: maxApproval ? parseInt(maxApproval, 10) : null,
      conditionLogic: "and",
      questConditions: filteredQuestConditions,
      status: status || (isActive ? QUEST_STATUSES.OPEN : QUEST_STATUSES.INACTIVE),
      startAt: startAt && timeBound ? startAt.utcOffset(0).startOf("day").toISOString() : null,
      endAt: endAt && timeBound ? endAt.utcOffset(0).endOf("day").toISOString() : null,
      pointReward: questSettings.rewards[0].value,
      level: level ? parseInt(level, 10) : null,
      // TODO: refactor this
      rewards: questSettings.rewards
        ?.map((reward: any) => {
          if (reward?.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
            return {
              discordRewardData: {
                discordRoleId: reward?.discordRewardData?.discordRoleId,
                discordGuildId: reward?.discordRewardData?.discordGuildId,
                discordRoleName: reward?.discordRewardData?.discordRoleName,
              },
              type: reward?.type,
            };
          } else if (reward?.type === PAYMENT_OPTIONS.TOKEN) {
            return {
              type: reward?.type,
              paymentMethodId: reward?.paymentMethodId,
              amount: Number(reward?.amount),
            };
          } else if (reward?.type === PAYMENT_OPTIONS.POAP) {
            const { __typename, ...rewardData } = reward?.poapRewardData;
            return {
              type: reward?.type,
              poapRewardData: rewardData,
            };
          }
        })
        .filter((reward) => reward),
      steps: steps.reduce((acc, next, index) => {
        const step: any = {
          id: next?._id,
          type: next.type,
          order: index + 1,
          mediaUploads: [],
          required: next.required === false ? false : true,
          prompt: next.value?.question || next?.value?.prompt || next.value || null,
        };
        if (next.type === TYPES.MULTI_QUIZ || next.type === TYPES.SINGLE_QUIZ) {
          (step.type = next.value.multiSelectValue),
            (step.options = next.value?.answers?.map((answer, idx) => {
              return {
                position: idx,
                text: answer.value?.trim(),
                ...(next.value.withCorrectAnswers ? { correct: answer.isCorrect } : {}),
              };
            }));
          step.prompt = next.value.question;
        } else if ([TYPES.LIKE_TWEET, TYPES.RETWEET, TYPES.REPLY_TWEET].includes(next.type)) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            tweetLink: next.value?.tweetLink,
          };
        } else if (next.type === TYPES.FOLLOW_TWITTER) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            tweetHandle: next.value?.tweetHandle,
          };
        } else if (next.type === TYPES.TWEET_WITH_PHRASE) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            tweetPhrase: next.value?.tweetPhrase,
          };
        } else if (next.type === TYPES.LIKE_YT_VIDEO) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            ytVideoLink: next.value?.ytVideoLink,
          };
        } else if (next.type === TYPES.SUBSCRIBE_YT_CHANNEL) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            ytChannelLink: next.value?.ytChannelLink,
          };
        } else if (next.type === TYPES.LINK_CLICK) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            linkClickUrl: next.value?.linkClickUrl,
          };
        } else if (next.type === TYPES.SNAPSHOT_PROPOSAL_VOTE) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            snapshotProposalLink: next.value?.snapshotProposalLink,
          };
        } else if (next.type === TYPES.SNAPSHOT_SPACE_VOTE) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            snapshotSpaceLink: next.value?.snapshotSpaceLink,
            snapshotVoteTimes: Number(next.value?.snapshotVoteTimes),
          };
        } else if (next.type === TYPES.DISCORD_MESSAGE_IN_CHANNEL) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            discordMessageType: next.value?.discordMessageType,
            discordChannelName: next.value?.discordChannelName?.trim(),
          };
        } else if (next.type === TYPES.DISCORD_EVENT_ATTENDANCE) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            discordEventId: next.value?.discordEventId,
            minDuration: next.value?.minDuration,
          };
        } else if (next.type === TYPES.VERIFY_TOKEN_HOLDING) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            tokenAddress: next.value?.verifyTokenAddress,
            tokenSymbol: next.value?.verifyTokenSymbol,
            tokenLogoUrl: next.value?.verifyTokenLogoUrl,
            tokenDecimals: next.value?.verifyTokenDecimals,
            tokenChain: next.value?.verifyTokenChain,
            tokenAmount: next.value?.verifyTokenAmount,
            tokenType: next.value?.verifyTokenType,
            tokenId: next.value?.verifyTokenId,
            tokenName: next.value?.verifyTokenName,
          };
        } else if (next.type === TYPES.DATA_COLLECTION) {
          step.prompt = next.value?.prompt;
          step.options = next?.value?.options
            ? next.value.options.map((option, idx) => ({
                position: idx,
                text: option,
              }))
            : null;
          step["additionalData"] = {
            ...next.value?.dataCollectionProps,
          };
        }
        return [...acc, step];
      }, []),
    };
    try {
      await questValidator(body);
      if (!questSettings.isActive && !isSaving) {
        return setIsSaving(true);
      }

      handleMutation({ body });

      const hasMediaToUpload = steps.some(
        (step) => step.mediaUploads.filter((media) => media instanceof File).length > 0
      );

      const hasMediaToRemove = Object.values(removedMediaSlugs).flat().length > 0;
      if (hasMediaToUpload || hasMediaToRemove) {
        setSnackbarAlertMessage("Wrapping up with your media. Please keep this window open");
        setSnackbarAlertAutoHideDuration(2000);
        setSnackbarAlertOpen(true);
      }
    } catch (err) {
      const errors: any = {};
      if (err instanceof ValidationError) {
        err.inner.forEach((error) => {
          console.log(error.path, "ERR PATH");
          const path = getPathArray(error.path);
          set(errors, path, error.message);
        });
        // this is a hacky way to scroll to the title
        if (errors?.title) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } else {
          const stepsFirstErrorIndex = errors?.steps?.findIndex((err) => !!err);
          if (stepsFirstErrorIndex !== -1) {
            refs?.current[stepsFirstErrorIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
        setErrors(errors);
        setIsSaving(false);
      } else console.log(err, "Error outside of validation service");
    }
  };

  useMemo(() => setRefValue({ handleSave }), [setRefValue, handleSave]);

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
              renderHeader={() => <RewardOverviewHeader />}
              renderBody={() => <RewardComponent rewards={questSettings.rewards} setQuestSettings={setQuestSettings} />}
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
                Add new block
              </Typography>
            </Panel>
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
