import { Box, Grid, Typography } from "@mui/material";
import { RoundedSecondaryButton, SharedSecondaryButton } from "components/Shared/styles";
import { useContext, useMemo, useState } from "react";
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
import { ATTACH_QUEST_STEPS_MEDIA, CREATE_QUEST, UPDATE_QUEST } from "graphql/mutations";
import { GET_QUEST_REWARDS } from "graphql/queries";
import GlobalContext from "utils/context/GlobalContext";
import { useNavigate } from "react-router";
import { questValidator, ValidationError } from "services/validators";
import { getPathArray } from "utils/common";
import { set } from "lodash";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { transformAndUploadMedia } from "utils/media";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { PAYMENT_OPTIONS } from "./RewardUtils";

const DEFAULT_STATE_VALUE = {
  level: "1",
  timeBound: false,
  maxSubmission: null,
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
  defaultQuestSteps = [],
  postUpdate = null,
  title,
}) => {
  const navigate = useNavigate();
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [getQuestRewards, { data: questRewardsData }] = useLazyQuery(GET_QUEST_REWARDS);
  const [attachQuestStepsMedia] = useMutation(ATTACH_QUEST_STEPS_MEDIA, {
    refetchQueries: ["getQuestById"],
  });

  const { activeOrg } = useContext(GlobalContext);

  const [steps, setSteps] = useState(defaultQuestSteps);
  const [isSaving, setIsSaving] = useState(false);
  const [questSettings, setQuestSettings] = useState(defaultQuestSettings);
  const handleAdd = (type) => {
    setSteps([
      ...steps,
      {
        id: steps.length + 1,
        type,
        value: "",
        required: true,
        mediaUploads: [],
      },
    ]);
  };

  const [createQuest] = useMutation(CREATE_QUEST, {
    onCompleted: ({ createQuest }) => {
      handleUpdateQuestStepsMedia(createQuest.id, createQuest?.steps, steps);
      navigate(`/quests/${createQuest.id}`);
    },
    refetchQueries: ["getQuestsForOrg"],
  });
  const [updateQuest] = useMutation(UPDATE_QUEST, {
    onCompleted: ({ updateQuest }) => {
      handleUpdateQuestStepsMedia(updateQuest.id, updateQuest?.steps, steps);
      postUpdate?.();
    },
    refetchQueries: ["getQuestsForOrg", "getQuestRewards"],
  });

  const handleRemove = (index) => {
    const newItems = [...steps];
    newItems.splice(index, 1);
    setSteps(newItems);
  };

  const handleUpdateQuestStepsMedia = async (questId, questSteps, localSteps) => {
    const stepsMedia = await Promise.all(
      localSteps.map(async (step, idx) => {
        return await handleMediaUpload(step.mediaUploads);
      })
    );

    const stepsData = localSteps.reduce((acc, next, idx) => {
      if (next.mediaUploads.length > 0) {
        const questStep = questSteps.find((step) => step.order === idx + 1);
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
    const { questConditions, requireReview, maxSubmission, isActive, startAt, endAt, level, timeBound, isOnboarding } =
      questSettings;
    const filteredQuestConditions = questConditions?.filter((condition) => condition.type && condition.conditionData);

    const body = {
      title,
      orgId: activeOrg.id,
      isOnboarding,
      requireReview,
      maxSubmission: maxSubmission ? parseInt(maxSubmission, 10) : null,
      conditionLogic: "and",
      questConditions: filteredQuestConditions,
      status: status || (isActive ? QUEST_STATUSES.OPEN : QUEST_STATUSES.INACTIVE),
      startAt: startAt && timeBound ? startAt.utcOffset(0).startOf("day").toISOString() : null,
      endAt: endAt && timeBound ? endAt.utcOffset(0).endOf("day").toISOString() : null,
      pointReward: questSettings.rewards[0].value,
      level: level ? parseInt(level, 10) : null,
      rewards: questSettings.rewards?.slice(1)?.map((reward: any) => {
        if (reward?.type === PAYMENT_OPTIONS.DISCORD_ROLE) {
          return {
            discordRewardData: {
              discordRoleId: reward?.discordRewardData?.discordRoleId,
              discordGuildId: reward?.discordRewardData?.discordGuildId,
              discordRoleName: reward?.discordRewardData?.discordRoleName,
            },
            type: reward?.type,
          };
        } else if (reward?.type === PAYMENT_OPTIONS.NFT) {
          return {
            type: reward?.type,
            paymentMethodId: reward?.paymentMethodId,
            amount: Number(reward?.amount),
          };
        }
      }),
      steps: steps.reduce((acc, next, index) => {
        const step: any = {
          type: next.type,
          order: index + 1,
          mediaUploads: [],
          required: next.required === false ? false : true,
          prompt: next.value?.question || next?.value?.prompt || next.value || null,
        };
        if (next.type === TYPES.MULTI_QUIZ || next.type === TYPES.SINGLE_QUIZ) {
          (step.type = next.value.multiSelectValue),
            (step.options = next.value.answers.map((answer, idx) => {
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
            discordChannelName: next.value?.discordChannelName,
          };
        } else if (next.type === TYPES.JOIN_DISCORD_COMMUNITY_CALL) {
          step.prompt = next.value?.prompt;
          step["additionalData"] = {
            discordChannelName: next.value?.discordChannelName,
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
    } catch (err) {
      const errors = {};
      if (err instanceof ValidationError) {
        err.inner.forEach((error) => {
          console.log(error.path, "ERR PATH");
          const path = getPathArray(error.path);
          set(errors, path, error.message);
        });
        setErrors(errors);
        setIsSaving(false);
      } else console.log(err, "Error outside of validation service");
    }
  };

  useMemo(() => setRefValue({ handleSave }), [setRefValue, handleSave]);
  useEffect(() => {
    if (questId) {
      getQuestRewards({
        variables: {
          questId,
        },
      });
    }
  }, [questId]);
  const questRewards = questRewardsData?.getQuestRewards;
  useEffect(() => {
    if (questRewards?.length > 0) {
      setQuestSettings((prev) => {
        return {
          ...prev,
          rewards: [...prev.rewards, ...questRewards],
        };
      });
    }
  }, [questRewards?.length]);
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
            <AddFormEntity steps={steps} setSteps={setSteps} handleRemove={handleRemove} />
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
