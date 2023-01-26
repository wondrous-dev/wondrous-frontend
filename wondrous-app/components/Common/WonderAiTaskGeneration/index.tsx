import Grid from '@mui/material/Grid';
import DropdownSelect from 'components/Common/DropdownSelect';
import { useMemo, useState } from 'react';
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
} from 'components/Common/WonderAiTaskGeneration/styles';
import { useMutation } from '@apollo/client';
import { GENERATE_GPT_TASKS } from 'graphql/mutations';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { CircularProgress } from '@mui/material';
import palette from 'theme/palette';
import { entityTypeData } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { ENTITIES_TYPES } from 'utils/constants';
import Checkbox from 'components/Checkbox';
import { deserializeRichText, useEditor } from 'components/RichText';
import { ErrorText, Flex } from '..';
import RightPanel from './rightPanel';

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

  // Insert array of children nodes
  Transforms.insertNodes(editor, newValue);
};

const GeneratedTaskRow = ({
  task,
  selectedList,
  setSelectedList,
  index,
  setTaskViewIndex,
  setTaskToView,
  setTaskViewType,
  setClickSelectedList,
  editor,
}) => {
  const checked = selectedList.find((item) => item.title === task.title);
  const onRowClick = () => {
    setTaskToView(task);
    resetEditor(editor, task?.description);
    setTaskViewIndex(index);
    setTaskViewType(ENTITIES_TYPES.TASK);
    setClickSelectedList(true);
  };

  return (
    <GeneratedTaskRowContainer>
      <Checkbox
        checked={checked}
        onChange={() => {
          if (checked) {
            const newList = selectedList.filter((item, index) => index !== task.tempId);
            setSelectedList([...newList]);
          } else {
            setSelectedList([...selectedList, task.tempId]);
          }
        }}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={onRowClick}
      >
        <GeneratedTaskRowText>{task.title}</GeneratedTaskRowText>
        <div
          style={{
            flex: 1,
          }}
        />
        <TrashIcon onClick={() => console.log('huh')} />
      </div>
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
  });
  const [taskToView, setTaskToView] = useState(null);
  const [taskToViewType, setTaskToViewType] = useState(null);
  const [taskViewIndex, setTaskViewIndex] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [generatedTaskList, setGeneratedTaskList] = useState([]);
  const [errors, setErrors] = useState({});
  const orgId = orgBoard?.orgId || podBoard?.pod?.orgId;
  const podId = podBoard?.podId;
  const [
    generateGPTTasks,
    { loading: generatedGPTTaskLoading, error: generatedGPTTaskError, reset: generatedGPTTaskReset },
  ] = useMutation(GENERATE_GPT_TASKS);
  const setMilestoneField = (field, value) => {
    setMilestone({
      ...milestone,
      [field]: value,
    });
  };
  const setParentTaskField = (field, value) => {
    setParentTask({
      ...parentTask,
    });
  };

  const handleGenerateGPTTasks = () => {
    if (!actionPrompt) {
      setFormErrors({ ...formErrors, actionPrompt: 'This field is required' });
    } else {
      generatedGPTTaskReset();
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
        }));
        setGeneratedTaskList(formattedlist);
      });
    }
  };

  return (
    <Grid container>
      <Grid md={8} lg={7} item>
        <PromptContainer>
          <PromptBox>
            <PromptBoxTitle fontSize={18}>{`Unleash your communities' potential with AI.`}</PromptBoxTitle>
            <PromptBoxDescription>
              {`Write a prompt describing your intended action and what your org/pod does to generate a ${
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
              />
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
            {generatedGPTTaskError && <ErrorText>There seems to be an error on our end - please try again!</ErrorText>}
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
                }}
              >
                Regenerate
              </RegenerateText>
            )}
          </HelperFlexDiv>
          {generatedGPTTaskLoading ? (
            <LoadingDiv>
              <CircularProgress
                style={{
                  color: palette.highlightPurple,
                }}
                size={20}
              />
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
                    />
                  ))}
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
      <Grid sm={0} md={4} lg={5} item>
        <RightPanelSection>
          {taskToView ? (
            <RightPanel
              entityType={taskToViewType}
              editor={editor}
              setField={(field, value) => {
                console.log('what the', clickSelectedList);
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
                    if (task.tempId === taskViewIndex) {
                      return {
                        ...task,
                        [field]: value,
                      };
                    }
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
    </Grid>
  );
};

export default WonderAiTaskGeneration;
