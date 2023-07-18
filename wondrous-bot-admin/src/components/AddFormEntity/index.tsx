import { Grid, Typography, Box } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Header } from "./styles";
import SelectComponent from "components/Shared/Select";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ButtonIconWrapper } from "components/Shared/styles";
import { DragDropContext, Draggable } from "react-beautiful-dnd";

import DeleteIcon from "components/Icons/Delete";
import StrictModeDroppable from "components/StrictModeDroppable";
import { RESPOND_TYPES, TYPES } from "utils/constants";
import TypeComponent from "./components/TypeComponent";
import Switch from "components/Shared/Switch";
import { Label } from "./components/styles";
import StepAttachments from "components/StepAttachments";
import { useContext, useState } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { CONFIG_COMPONENTS } from "utils/configComponents";
import { useMutation } from "@apollo/client";
import { REMOVE_QUEST_STEP_MEDIA } from "graphql/mutations";
import { PricingOptionsTitle, getPlan } from "components/Pricing/PricingOptionsListItem";
import { usePaywall, useSubscription } from "utils/hooks";
import EcosystemFeature from "components/PremiumFeatureDialog/ecosystem";

const COMPONENT_OPTIONS = [
  {
    label: "Text",
    value: TYPES.TEXT_FIELD,
  },
  {
    label: "Multiple Choice",
    value: TYPES.MULTI_QUIZ,
  },
  {
    label: "Number",
    value: TYPES.NUMBER,
  },
  {
    label: "Attachments",
    value: TYPES.ATTACHMENTS,
  },
  {
    label: "Like A Tweet",
    value: TYPES.LIKE_TWEET,
  },
  {
    label: "Follow A Twitter Account",
    value: TYPES.FOLLOW_TWITTER,
  },
  {
    label: "Reply To A Tweet",
    value: TYPES.REPLY_TWEET,
  },
  {
    label: "Retweet A Tweet",
    value: TYPES.RETWEET,
  },
  {
    label: "Tweet With A Mention Or Hashtag",
    value: TYPES.TWEET_WITH_PHRASE,
  },
  {
    label: "Vote On Snapshot Proposal",
    value: TYPES.SNAPSHOT_PROPOSAL_VOTE,
  },
  {
    label: "Vote On Snapshot Space",
    value: TYPES.SNAPSHOT_SPACE_VOTE,
  },
  {
    label: "Send A Message in Discord Channel",
    value: TYPES.DISCORD_MESSAGE_IN_CHANNEL,
  },
  {
    label: "Verify Discord event attendance",
    value: TYPES.DISCORD_EVENT_ATTENDANCE,
  },
  {
    label: "Data Collection",
    value: TYPES.DATA_COLLECTION,
  },
  {
    label: "Verify Token Holding",
    value: TYPES.VERIFY_TOKEN_HOLDING,
  },
  {
    label: "Verify Youtube Subscription",
    value: TYPES.SUBSCRIBE_YT_CHANNEL,
  },
  {
    label: "Verify Youtube Like",
    value: TYPES.LIKE_YT_VIDEO,
  },
  {
    label: "Click on link",
    value: TYPES.LINK_CLICK,
  },
];
if (!import.meta.env.VITE_PRODUCTION) {
  COMPONENT_OPTIONS.push({
    label: "+ Add custom on chain action",
    value: TYPES.CUSTOM_ONCHAIN_ACTION,
  });
}
const AddFormEntity = ({ steps, setSteps, handleRemove, refs, setRemovedMediaSlugs }) => {
  if (import.meta.env.NODE_ENV !== "production") {
    COMPONENT_OPTIONS.push({
      label: "+ Add custom on chain action",
      value: TYPES.CUSTOM_ONCHAIN_ACTION,
    });
  }
  const { errors, setErrors } = useContext(CreateQuestContext);
  const [openEcosystemDialog, setOpenEcosystemDialog] = useState(false);
  const subscription = useSubscription();
  const plan = getPlan(subscription?.tier);
  const { setPaywall, setPaywallMessage } = usePaywall();
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(steps);
    const [removed]: any = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    const orderedItems = reorderedItems.map((item: any, idx) => ({
      ...item,
      order: idx + 1,
    }));
    setSteps(orderedItems);
  };

  const handleChangeType = (type, order, idx) => {
    if (!type) return;
    if (
      !import.meta.env.VITE_PRODUCTION &&
      (plan === PricingOptionsTitle.Basic || plan === PricingOptionsTitle.Hobby) &&
      (type === TYPES.SUBSCRIBE_YT_CHANNEL || type === TYPES.LIKE_YT_VIDEO || type === TYPES.CUSTOM_ONCHAIN_ACTION)
    ) {
      setPaywall(true);
      setPaywallMessage("This feature is only available on the Pro plan and above");
      return;
    }
    if (
      (plan === PricingOptionsTitle.Premium || plan === PricingOptionsTitle.Ecosystem) &&
      type === TYPES.CUSTOM_ONCHAIN_ACTION
    ) {
      setOpenEcosystemDialog(true);
      return;
    }
    setErrors((prev) => {
      return {
        ...prev,
        steps: {
          ...prev.steps,
          [idx]: null,
        },
      };
    });

    const MULTICHOICE_DEFAULT_VALUE = {
      question: "",
      withCorrectAnswers: false,
      multiSelectValue: TYPES.MULTI_QUIZ,
      answers: [
        {
          value: "",
          isCorrect: true,
        },
      ],
    };

    const newConfiguration = steps.reduce((acc, next) => {
      if (next.order === order) {
        acc = [
          ...acc,
          {
            type,
            order,
            required: true,
            value: type === TYPES.MULTI_QUIZ ? MULTICHOICE_DEFAULT_VALUE : "",
          },
        ];
        return acc;
      }
      acc.push(next);
      return acc;
    }, []);
    setSteps(newConfiguration);
  };

  const handleRequiredChange = (required, order) => {
    const newConfiguration = steps.reduce((acc, next) => {
      if (next.order === order) {
        acc = [
          ...acc,
          {
            ...next,
            required: required === false ? false : true,
          },
        ];
        return acc;
      }
      acc.push(next);
      return acc;
    }, []);
    setSteps(newConfiguration);
  };

  const handleChange = (value, order, idx) => {
    setErrors((prev) => {
      return {
        ...prev,
        steps: {
          ...prev.steps,
          [idx]: null,
        },
      };
    });

    const newConfiguration = steps.reduce((acc, next) => {
      if (next.order === order) {
        acc = [
          ...acc,
          {
            ...next,
            value,
          },
        ];
        return acc;
      }
      acc.push(next);
      return acc;
    }, []);
    setSteps(newConfiguration);
  };

  const handleMedia = (value, order) => {
    const newConfiguration = steps.reduce((acc, next) => {
      if (next.order === order) {
        acc = [
          ...acc,
          {
            ...next,
            mediaUploads: value,
          },
        ];
        return acc;
      }
      acc.push(next);
      return acc;
    }, []);
    setSteps(newConfiguration);
  };

  const removeMediaItem = (slug, questStepId) => {
    setRemovedMediaSlugs((prev) => ({
      ...prev,
      [questStepId]: [...(prev[questStepId] ? prev[questStepId] : []), slug],
    }));
  };

  return (
    <Grid
      display="flex"
      gap="24px"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
    >
      <EcosystemFeature open={openEcosystemDialog} onClose={() => setOpenEcosystemDialog(false)} />
      <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
        {steps?.length} Quest Steps
      </Typography>
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId="droppableId">
          {(provided) => (
            <Grid
              display="flex"
              flexDirection="column"
              justifyContent="center"
              gap="24px"
              alignItems="center"
              width="100%"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {steps?.map((item, idx) => {
                const Component = CONFIG_COMPONENTS[item.type];
                if (!Component) return null;
                return (
                  <Box width="100%" height="100%" ref={(ref) => (refs.current[idx] = ref)}>
                    <Draggable key={idx} draggableId={`${idx}`} index={idx}>
                      {(provided, snapshot) => (
                        <Grid
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          width="100%"
                          isDragging={snapshot.isDragging}
                        >
                          <PanelComponent
                            renderHeader={() => (
                              <Header display="flex" justifyContent="space-between" alignItems="center">
                                <Grid display="flex" gap="18px" alignItems="center">
                                  <DragIndicatorIcon
                                    sx={{
                                      color: "#2A8D5C",
                                    }}
                                  />
                                  <Typography
                                    color="#2A8D5C"
                                    fontFamily="Poppins"
                                    fontWeight={700}
                                    fontSize="12px"
                                    lineHeight="14px"
                                    whiteSpace="nowrap"
                                  >
                                    Step {idx + 1}
                                  </Typography>
                                  <SelectComponent
                                    options={COMPONENT_OPTIONS}
                                    background="#C1B6F6"
                                    value={item.type}
                                    onChange={(value) => handleChangeType(value, item.order, idx)}
                                  />
                                </Grid>
                                <Grid display="flex" alignItems="center" gap="14px">
                                  <Box display="flex" gap="10px" alignItems="center">
                                    <Switch
                                      value={item.required === false ? false : true}
                                      onChange={(value) => {
                                        handleRequiredChange(value, item.order);
                                      }}
                                    />
                                    <Label
                                      style={{
                                        marginRight: "8px",
                                      }}
                                    >
                                      Required
                                    </Label>
                                  </Box>
                                  <ButtonIconWrapper onClick={() => handleRemove(idx)}>
                                    <DeleteIcon />
                                  </ButtonIconWrapper>
                                </Grid>
                              </Header>
                            )}
                            renderBody={() => (
                              <>
                                <Component
                                  onChange={(value) => handleChange(value, item.order, idx)}
                                  error={errors?.steps?.[idx]}
                                  value={item.value}
                                  stepType={item.type}
                                />
                                {RESPOND_TYPES[item.type] ? (
                                  <TypeComponent respondType={RESPOND_TYPES[item.type]} />
                                ) : null}
                                <StepAttachments
                                  step={item}
                                  removeMedia={(slug) => removeMediaItem(slug, item._id)}
                                  handleChange={(value) => handleMedia(value, item.order)}
                                />
                              </>
                            )}
                          />
                        </Grid>
                      )}
                    </Draggable>
                  </Box>
                );
              })}
            </Grid>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </Grid>
  );
};

export default AddFormEntity;
