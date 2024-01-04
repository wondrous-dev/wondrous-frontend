import { Grid, Typography, Box } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Header } from "./styles";
import { ButtonIconWrapper } from "components/Shared/styles";
import { DragDropContext, Draggable } from "react-beautiful-dnd";

import DeleteIcon from "components/Icons/Delete";
import StrictModeDroppable from "components/StrictModeDroppable";
import { CUSTOM_INTEGRATIONS, RESPOND_TYPES, TYPES } from "utils/constants";
import TypeComponent from "./components/TypeComponent";
import Switch from "components/Shared/Switch";
import { Label } from "./components/styles";
import StepAttachments from "components/StepAttachments";
import { useContext, useMemo, useState } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { CONFIG_COMPONENTS } from "utils/configComponents";
import { useSubscriptionPaywall } from "utils/hooks";
import EcosystemFeature from "components/PremiumFeatureDialog/ecosystem";
import AutocompleteOptionsComponent from "./components/AutocompleteComponent";
import GlobalContext from "utils/context/GlobalContext";
import { COMPONENT_OPTIONS, MULTICHOICE_DEFAULT_VALUE } from "./constants";

const AddFormEntity = ({ steps, setSteps, handleRemove, refs, setRemovedMediaSlugs }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const { activeOrg } = useContext(GlobalContext);
  const [openEcosystemDialog, setOpenEcosystemDialog] = useState(false);
  const { setPaywall, setPaywallMessage, isBasicPLan, isHobbyPlan, isEcosystemPlan, isPremiumPlan, setOnCancel, setCanBeClosed } =
    useSubscriptionPaywall();

  const componentOptions = useMemo(() => {
    let defaultOptions = [...COMPONENT_OPTIONS];
    if (activeOrg?.id in CUSTOM_INTEGRATIONS) {
      const customIntegrations = CUSTOM_INTEGRATIONS[activeOrg?.id];
      customIntegrations?.integrations.forEach((integration) => {
        defaultOptions.push(integration);
      });
    }
    return [
      ...defaultOptions,
      {
        label: "+ Add custom on chain action",
        value: TYPES.CUSTOM_ONCHAIN_ACTION,
      },
    ];
  }, [activeOrg?.id]);

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
      (isBasicPLan || isHobbyPlan) &&
      (type === TYPES.SUBSCRIBE_YT_CHANNEL || type === TYPES.LIKE_YT_VIDEO || type === TYPES.CUSTOM_ONCHAIN_ACTION)
    ) {
      setPaywall(true);
      setPaywallMessage("This feature is only available on the Pro plan and above");
      return;
    }
    if ((isPremiumPlan || isEcosystemPlan) && type === TYPES.CUSTOM_ONCHAIN_ACTION) {
      setOpenEcosystemDialog(true);
      return;
    }
    if (type === TYPES.REFERRAL && idx > 0) {
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
      <Typography
        fontFamily="Poppins"
        fontWeight={600}
        fontSize="18px"
        lineHeight="24px"
        color="black"
        ref={(ref) => (refs.current[0] = ref)}
      >
        {steps?.length} {steps?.length === 1 ? "Quest Step" : "Quest Steps"}
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
                const isQuiz = item.type === TYPES.MULTI_QUIZ || item.type === TYPES.SINGLE_QUIZ;

                const Component = CONFIG_COMPONENTS[item?.type];

                if (!Component) return null;
                return (
                  <Box width="100%" height="100%" ref={(ref) => (refs.current[idx + 1] = ref)} data-tour={idx === 0 ? "tour-quest-step" : null}>
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
                                  <AutocompleteOptionsComponent
                                    options={componentOptions}
                                    value={item.type}
                                    autocompletProps={{
                                      'data-tour': idx === 0 ? "tour-quest-step-type" : null,
                                    }}
                                    onChange={(value) => handleChangeType(value, item.order, idx)}
                                    setSteps={setSteps}
                                    order={idx + 1}
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
