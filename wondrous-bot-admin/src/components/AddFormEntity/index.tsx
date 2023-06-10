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
import { useContext } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { CONFIG_COMPONENTS } from "utils/configComponents";

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
    label: "Data Collection",
    value: TYPES.DATA_COLLECTION,
  },
];

const AddFormEntity = ({ steps, setSteps, handleRemove, refs }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(steps);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setSteps(reorderedItems);
  };

  const handleChangeType = (type, id, idx) => {
    if (!type) return;
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
      if (next.id === id) {
        acc = [
          ...acc,
          {
            type,
            id,
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

  const handleRequiredChange = (required, id) => {
    const newConfiguration = steps.reduce((acc, next) => {
      if (next.id === id) {
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

  const handleChange = (value, id, idx) => {
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
      if (next.id === id) {
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

  const handleMedia = (value, id) => {
    const newConfiguration = steps.reduce((acc, next) => {
      if (next.id === id) {
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
    // debugger
    setSteps(newConfiguration);
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
                  <Box width="100%" height="100%" ref={(ref) => refs.current[idx] = ref}>
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
                                  onChange={(value) => handleChangeType(value, item.id, idx)}
                                />
                              </Grid>
                              <Grid display="flex" alignItems="center" gap="14px">
                                <Box display="flex" gap="10px" alignItems="center">
                                  <Switch
                                    value={item.required === false ? false : true}
                                    onChange={(value) => {
                                      handleRequiredChange(value, item.id);
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
                                onChange={(value) => handleChange(value, item.id, idx)}
                                error={errors?.steps?.[idx]}
                                value={item.value}
                                stepType={item.type}
                              />
                              {RESPOND_TYPES[item.type] ? (
                                <TypeComponent respondType={RESPOND_TYPES[item.type]} />
                              ) : null}
                              <StepAttachments
                                step={item}
                                handleChange={(value) => handleMedia(value, item.id)}
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
