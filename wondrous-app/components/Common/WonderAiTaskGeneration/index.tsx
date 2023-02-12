import Grid from '@mui/material/Grid';
import { useContext, useEffect, useState } from 'react';
import RobotHand from 'components/Common/WonderAiTaskGeneration/images/robot-hand.svg';
import SmallRobotIcon from 'components/Common/WonderAiTaskGeneration/images/small-robot-icon.svg';
import TrashIcon from 'components/Common/WonderAiTaskGeneration/images/trash-icon.svg';
import { Editor, Transforms } from 'slate';
import { CreateEntitySelectArrowIcon } from 'components/CreateEntity/CreateEntityModal/styles';
import {
  PromptBox,
  PromptBoxDescription,
  PromptBoxTitle,
  PromptContainer,
  PromptGenerationPopperOptionText,
  PromptGenerationTypePopperOption,
  PromptGenerationTypeSelect,
  PromptGenerationTypeSelected,
  PromptInputDiv,
  PromptInput,
  EntityInput,
  RightPanelSection,
  ActionButton,
  ActionButtonText,
  HelperFlexDiv,
  HelperText,
  SuggestionRowContainer,
  SuggestionRowText,
  LoadingText,
  LoadingDiv,
  RegenerateText,
  HeaderText,
  GeneratedTaskRowContainer,
  GeneratedTaskRowText,
  BottomSelectBarContainer,
  BottomSelectCountText,
  ClearSelectionButton,
  GeneratedClickableTaskRow,
  StyledCircularProgress,
} from 'components/Common/WonderAiTaskGeneration/styles';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_GPT_TASKS, GENERATE_GPT_TASKS } from 'graphql/mutations';
import { useIsMobile, useOrgBoard, usePodBoard } from 'utils/hooks';
import { CircularProgress } from '@mui/material';
import palette from 'theme/palette';
import { entityTypeData } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { ENTITIES_TYPES } from 'utils/constants';
import Checkbox from 'components/Checkbox';
import { deserializeRichText, extractMentions, useEditor } from 'components/RichText';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { GET_GPT_ENTITY_DESCRIPTION } from 'graphql/queries/gptEntityDescription';
import { ErrorText } from '..';
import RightPanel from './rightPanel';
import { SnackbarAlertContext } from '../SnackbarAlert';

type CreateTaskProps = {
  orgId: string;
  podId: string;
  milestone?: any;
  parentTask?: any;
  generatedTasks: any;
  entityDescription: string;
};

const GENERATION_TYPES = [
  {
    value: 'milestoneWithTasks',
    label: 'Milestone with tasks',
  },
  {
    value: 'tasksWithSubtasks',
    label: 'Tasks with subtasks',
  },
];

const SUGGESTION_PROMPT_LIST = [
  'Create a SEO strategy',
  'Create a design sprint',
  'Create an engineering sprint',
  'Create a design system',
  'Create a pitch deck',
];

const SuggestionRow = ({ suggestion, setActionPrompt }) => (
  <SuggestionRowContainer onClick={() => setActionPrompt(suggestion)}>
    <SuggestionRowText>{suggestion}</SuggestionRowText>
  </SuggestionRowContainer>
);

const resetEditor = (editor, newValue) => {
  if (editor.children.length > 0) {
    // Delete all entries leaving 1 empty node
    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    });

    // Removes empty node
    Transforms.removeNodes(editor, {
      at: [0],
    });
  }
  if (newValue) {
    // Insert array of children nodes
    Transforms.insertNodes(editor, newValue);
  }
};

const filterInput = (task) => {
  if (!task) return null;
  const {
    chooseGithubIssue,
    chooseGithubPullRequest,
    githubIssue,
    githubRepo,
    recurringSchema,
    GR15DEISelected,
    proposalVoteType,
    customProposalChoices,
    recurrenceType,
    recurrenceValue,
    ...finalValues
  } = task;
  const categories = task?.categories?.map((category) => category.id || category);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const points = parseInt(task.points, 10);
  const rewards = isEmpty(task?.rewards)
    ? []
    : [{ ...task?.rewards[0], rewardAmount: parseFloat(task?.rewards[0].rewardAmount) }];
  const userMentions = extractMentions(task?.description);
  const input = {
    ...finalValues,
    reviewerIds: task?.reviewerIds,
    points,
    rewards,
    timezone,
    userMentions,
    categories,
    description: JSON.stringify(task.description),
    ...(recurrenceType &&
      recurrenceValue && {
        recurringSchema: {
          [recurrenceType]: recurrenceValue,
        },
      }),
  };
  return input;
};

const GeneratedTaskRow = ({
  task,
  selectedList,
  setSelectedList,
  generatedTaskList,
  setGeneratedTaskList,
  index,
  setTaskViewIndex,
  setTaskToView,
  setTaskViewType,
  setClickSelectedList,
  editor,
}) => {
  const checked = selectedList.some((item) => item?.tempId === task.tempId);
  const onRowClick = () => {
    setTaskToView(task);
    resetEditor(editor, task?.description);
    setTaskViewIndex(index);
    setTaskViewType(ENTITIES_TYPES.TASK);
    setClickSelectedList(true);
  };

  return (
    <GeneratedTaskRowContainer key={task?.tempId}>
      <Checkbox
        checked={!!checked}
        onChange={() => {
          if (checked) {
            const newList = selectedList.filter((item) => !item || item.tempId !== task.tempId);
            setSelectedList([...newList]);
          } else {
            setSelectedList([...selectedList, task]);
          }
        }}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <GeneratedClickableTaskRow onClick={onRowClick}>
        <GeneratedTaskRowText>{task.title}</GeneratedTaskRowText>
        <div
          style={{
            flex: 1,
          }}
        />
      </GeneratedClickableTaskRow>
      <TrashIcon
        onClick={() => {
          const newList = generatedTaskList.filter((item) => item.tempId !== task.tempId);
          const newSelectedList = selectedList.filter((item) => !item || item.tempId !== task.tempId);
          setGeneratedTaskList([...newList]);
          setSelectedList([...newSelectedList]);
        }}
      />
    </GeneratedTaskRowContainer>
  );
};

const initialMilestoneValues = entityTypeData[ENTITIES_TYPES.MILESTONE].initialValues;
const initialTaskValues = entityTypeData[ENTITIES_TYPES.TASK].initialValues;
const WonderAiTaskGeneration = () => {
  const [promptGenerationType, setPromptGenerationType] = useState(GENERATION_TYPES[0]?.value);

  const [actionPrompt, setActionPrompt] = useState('');
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const [milestone, setMilestone] = useState(null);
  const [parentTask, setParentTask] = useState(null);
  const [clickSelectedList, setClickSelectedList] = useState(false);
  const editor = useEditor();
  // TODO: read from database
  const [entityDescription, setEntityDescription] = useState('');
  const [formErrors, setFormErrors] = useState({
    actionPrompt: null,
    entityDescription: null,
    selectedList: null,
  });
  const router = useRouter();
  const [taskToView, setTaskToView] = useState(null);
  const [taskToViewType, setTaskToViewType] = useState(null);
  const [taskViewIndex, setTaskViewIndex] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [generatedTaskList, setGeneratedTaskList] = useState([]);
  const [errors, setErrors] = useState({});
  const orgId = orgBoard?.orgId || podBoard?.pod?.orgId;
  const podId = podBoard?.podId;
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [getGptEntityDescription, { data: getGptEntityDescriptionData }] = useLazyQuery(GET_GPT_ENTITY_DESCRIPTION);
  const [generateGPTTasks, { loading: generatedGPTTaskLoading, error: generatedGPTTaskError }] =
    useMutation(GENERATE_GPT_TASKS);
  const [createGPTTasks, { loading: createGPTTaskLoading, error: createGPTTaskError }] = useMutation(CREATE_GPT_TASKS);
  const setMilestoneField = (field, value) => {
    setMilestone({
      ...milestone,
      [field]: value,
    });
  };
  const setParentTaskField = (field, value) => {
    setParentTask({
      ...parentTask,
      [field]: value,
    });
  };

  const handleGenerateGPTTasks = () => {
    if (!actionPrompt) {
      setFormErrors({ ...formErrors, actionPrompt: 'This field is required' });
    } else {
      generateGPTTasks({
        variables: {
          input: {
            actionPrompt,
            entityDescription,
            orgId,
            ...(podId && { podId }),
          },
        },
      }).then((res) => {
        const formattedlist = res?.data?.generateGPTTasks?.map((task, index) => ({
          ...initialTaskValues,
          title: task.title,
          description: deserializeRichText(task.description),
          tempId: index,
          orgId,
          podId,
        }));
        setGeneratedTaskList(formattedlist);
        setSelectedList(formattedlist);
        setMilestone({
          ...initialMilestoneValues,
          title: actionPrompt,
          orgId,
          podId,
        });
        setParentTask({
          ...initialTaskValues,
          title: actionPrompt,
          orgId,
          podId,
        });
      });
    }
  };

  const handleBatchTaskAdd = () => {
    const tasksToAdd = [];
    if (selectedList?.length > 0) {
      selectedList.forEach((task) => {
        const { tempId, ...taskToAdd } = task;
        tasksToAdd.push(filterInput(taskToAdd));
      });
      const input: CreateTaskProps = {
        orgId,
        podId,
        generatedTasks: tasksToAdd,
        ...(entityDescription && { entityDescription }),
      };
      if (promptGenerationType === GENERATION_TYPES[0]?.value) {
        input.milestone = filterInput(milestone);
      } else {
        input.parentTask = filterInput(parentTask);
      }

      createGPTTasks({
        variables: {
          input,
        },
      }).then((res) => {
        if (res?.data?.createGPTTasks?.success) {
          // redirect
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(<>Redirecting to work board!</>);
          if (podId) {
            router.push(`/pod/${podBoard?.podId}/home`);
          } else if (orgId) {
            router.push(`/organization/${orgBoard?.orgData?.username}/home`);
          }
        }
      });
    } else {
      setFormErrors({ ...formErrors, selectedList: 'Please select at least one task or regenerate tasks' });
    }
  };

  useEffect(() => {
    if (podId) {
      getGptEntityDescription({
        variables: {
          podId,
        },
      });
    } else if (orgId) {
      getGptEntityDescription({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId, podId]);
  const savedEntityDescription = getGptEntityDescriptionData?.getGptEntityDescription?.description;

  useEffect(() => {
    if (savedEntityDescription) {
      setEntityDescription(savedEntityDescription);
    }
  }, [savedEntityDescription]);
  const isMobile = useIsMobile();
  return (
    <Grid container>
      <Grid md={8} lg={7} item>
        <PromptContainer>
          <PromptBox>
            <PromptBoxTitle fontSize={18}>{`Unleash your communities' potential with AI.`}</PromptBoxTitle>
            <PromptBoxDescription>
              {`Write a prompt describing work you want done and your org/pod to generate a ${
                promptGenerationType === GENERATION_TYPES[0]?.value
                  ? 'milestone containing tasks.'
                  : 'task containing subtasks.'
              }`}{' '}
              The more specific the better!
            </PromptBoxDescription>
            <PromptInputDiv>
              <PromptGenerationTypeSelect
                name="prompt-generation-type"
                value={promptGenerationType}
                renderValue={(selectedItem) => (
                  <PromptGenerationTypeSelected>
                    <PromptGenerationPopperOptionText>{selectedItem?.label}</PromptGenerationPopperOptionText>
                    <CreateEntitySelectArrowIcon />
                  </PromptGenerationTypeSelected>
                )}
                onChange={(selectedItem) => {
                  setPromptGenerationType(selectedItem);
                  if (selectedItem === GENERATION_TYPES[0]?.value) {
                    setMilestone(parentTask);
                  } else {
                    setParentTask(milestone);
                  }
                }}
              >
                {GENERATION_TYPES.map(({ value, label }) => (
                  <PromptGenerationTypePopperOption key={value} value={value}>
                    <PromptGenerationPopperOptionText>{label}</PromptGenerationPopperOptionText>
                  </PromptGenerationTypePopperOption>
                ))}
              </PromptGenerationTypeSelect>
              {!isMobile && (
                <PromptInput
                  autoComplete="off"
                  name="prompt"
                  onChange={(event) => {
                    setActionPrompt(event.target.value);
                    setFormErrors({ ...formErrors, actionPrompt: null });
                  }}
                  placeholder="Enter prompt here"
                  value={actionPrompt}
                  error={formErrors.actionPrompt}
                />
              )}
            </PromptInputDiv>
            {formErrors.actionPrompt && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <ErrorText>{formErrors.actionPrompt}</ErrorText>
              </div>
            )}
            {isMobile && (
              <PromptInputDiv>
                <PromptInput
                  autoComplete="off"
                  name="prompt"
                  onChange={(event) => {
                    setActionPrompt(event.target.value);
                    setFormErrors({ ...formErrors, actionPrompt: null });
                  }}
                  placeholder="Enter desired action"
                  value={actionPrompt}
                  error={formErrors.actionPrompt}
                  style={{
                    flex: 1,
                    marginLeft: '0',
                  }}
                />
              </PromptInputDiv>
            )}
            <PromptInputDiv>
              <EntityInput
                autoComplete="off"
                name="entity-description"
                onChange={(event) => setEntityDescription(event.target.value)}
                placeholder="Describe your team - e.g. the marketing team for a social token."
                value={entityDescription}
                error={formErrors.entityDescription}
              />
              <ActionButton onClick={handleGenerateGPTTasks}>
                <ActionButtonText>Generate</ActionButtonText>
              </ActionButton>
            </PromptInputDiv>
            {generatedGPTTaskError && (
              <ErrorText>
                There seems to be an error - this could be due to high usage or an unclear prompt. Please try again!
              </ErrorText>
            )}
            {formErrors?.selectedList && <ErrorText>Please select at least one task or regenerate the list</ErrorText>}
          </PromptBox>
          <HelperFlexDiv>
            <SmallRobotIcon />
            <HelperText>
              {generatedTaskList?.length > 0
                ? `WonderBot generated ${generatedTaskList?.length} tasks for your review`
                : 'Here’s some suggestions to get you started!'}
            </HelperText>
            <div
              style={{
                flex: 1,
              }}
            />
            {generatedTaskList?.length > 0 && (
              <RegenerateText
                onClick={() => {
                  handleGenerateGPTTasks();
                  setFormErrors({ ...formErrors, selectedList: null });
                }}
              >
                Regenerate
              </RegenerateText>
            )}
          </HelperFlexDiv>
          {generatedGPTTaskLoading ? (
            <LoadingDiv>
              <StyledCircularProgress size={20} />
              <LoadingText>Generating tasks...this may take some time</LoadingText>
            </LoadingDiv>
          ) : (
            <>
              {generatedTaskList?.length > 0 ? (
                <>
                  <HeaderText>{promptGenerationType === GENERATION_TYPES[0]?.value ? 'Milestone' : 'Task'}</HeaderText>
                  <SuggestionRowContainer
                    style={{
                      marginLeft: '-8px',
                    }}
                    onClick={() => {
                      if (promptGenerationType === GENERATION_TYPES[0]?.value) {
                        if (milestone) {
                          setTaskToView(milestone);
                          resetEditor(editor, milestone?.value);
                        } else {
                          setTaskToView({
                            ...initialMilestoneValues,
                            title: actionPrompt,
                          });
                          resetEditor(editor, initialMilestoneValues?.description);
                        }
                        setTaskToViewType(ENTITIES_TYPES.MILESTONE);
                      } else {
                        if (parentTask) {
                          setTaskToView(parentTask);
                          resetEditor(editor, parentTask?.value);
                        } else {
                          setTaskToView({
                            ...initialTaskValues,
                            title: actionPrompt,
                          });
                          resetEditor(editor, initialTaskValues?.description);
                        }
                        setTaskToViewType(ENTITIES_TYPES.TASK);
                      }
                      setClickSelectedList(false);
                    }}
                  >
                    <SuggestionRowText>{actionPrompt}</SuggestionRowText>
                  </SuggestionRowContainer>
                  <HeaderText
                    style={{
                      marginBottom: '8px',
                    }}
                  >
                    {promptGenerationType === GENERATION_TYPES[0]?.value ? 'Tasks' : 'Subtasks'}
                  </HeaderText>
                  {generatedTaskList?.map((task, index) => (
                    <GeneratedTaskRow
                      task={task}
                      selectedList={selectedList}
                      setSelectedList={setSelectedList}
                      index={index}
                      setTaskViewIndex={setTaskViewIndex}
                      setTaskToView={setTaskToView}
                      setTaskViewType={setTaskToViewType}
                      setClickSelectedList={setClickSelectedList}
                      editor={editor}
                      generatedTaskList={generatedTaskList}
                      setGeneratedTaskList={setGeneratedTaskList}
                    />
                  ))}
                  <BottomSelectBarContainer>
                    {!isMobile && (
                      <>
                        <BottomSelectCountText>{`Creating ${selectedList?.length} items`}</BottomSelectCountText>
                        <div
                          style={{
                            flex: 1,
                          }}
                        />
                      </>
                    )}

                    <ClearSelectionButton onClick={() => setSelectedList([])}>
                      <ActionButtonText>Clear Selection</ActionButtonText>
                    </ClearSelectionButton>
                    {createGPTTaskLoading ? (
                      <CircularProgress />
                    ) : (
                      <ActionButton onClick={handleBatchTaskAdd}>
                        {' '}
                        <ActionButtonText>Add selected items to board</ActionButtonText>
                      </ActionButton>
                    )}
                  </BottomSelectBarContainer>
                </>
              ) : (
                <>
                  {SUGGESTION_PROMPT_LIST.map((suggestion) => (
                    <SuggestionRow suggestion={suggestion} setActionPrompt={setActionPrompt} />
                  ))}
                </>
              )}
            </>
          )}
        </PromptContainer>
      </Grid>
      {!isMobile && (
        <Grid sm={0} md={4} lg={5} item>
          <RightPanelSection>
            {taskToView ? (
              <RightPanel
                entityType={taskToViewType}
                editor={editor}
                setField={(field, value) => {
                  if (clickSelectedList) {
                    const newTaskList = generatedTaskList.map((task, index) => {
                      if (index === taskViewIndex) {
                        return {
                          ...task,
                          [field]: value,
                        };
                      }
                      return task;
                    });

                    setGeneratedTaskList(newTaskList);
                    const newSelectedList = selectedList.map((task, index) => {
                      if (task?.tempId === taskViewIndex) {
                        return {
                          ...task,
                          [field]: value,
                        };
                      }
                      return task;
                    });
                    setSelectedList(newSelectedList);
                  } else {
                    if (taskToViewType === ENTITIES_TYPES.MILESTONE) {
                      setMilestoneField(field, value);
                    }
                    if (taskToViewType === ENTITIES_TYPES.TASK) {
                      setParentTaskField(field, value);
                    }
                  }

                  setTaskToView({
                    ...taskToView,
                    [field]: value,
                  });
                }}
                orgId={orgId}
                podId={podId}
                existingTask={taskToView}
                errors={errors}
                setErrors={setErrors}
              />
            ) : (
              <RobotHand />
            )}
          </RightPanelSection>
        </Grid>
      )}
    </Grid>
  );
};

export default WonderAiTaskGeneration;
