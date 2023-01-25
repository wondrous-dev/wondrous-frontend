import Grid from '@mui/material/Grid';
import DropdownSelect from 'components/Common/DropdownSelect';
import { useMemo, useState } from 'react';
import RobotHand from 'components/Common/WonderAiTaskGeneration/images/robot-hand.svg';
import SmallRobotIcon from 'components/Common/WonderAiTaskGeneration/images/small-robot-icon.svg';
import TrashIcon from 'components/Common/WonderAiTaskGeneration/images/trash-icon.svg';
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

const SELECTED_TASK_TYPE = 'selectedTaskType';

const SuggestionRow = ({ suggestion, setActionPrompt }) => (
  <SuggestionRowContainer onClick={() => setActionPrompt(suggestion)}>
    <SuggestionRowText>{suggestion}</SuggestionRowText>
  </SuggestionRowContainer>
);

const GeneratedTaskRow = ({
  task,
  selectedList,
  setSelectedList,
  index,
  setTaskViewIndex,
  setTaskToView,
  setTaskViewType,
  setClickSelectedList,
}) => {
  const checked = selectedList.find((item) => item.title === task.title);
  const onRowClick = () => {
    setTaskToView(task);
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
            const newList = selectedList.filter((item) => item.title !== task.title);
            setSelectedList([...newList]);
          } else {
            setSelectedList([...selectedList, task]);
          }
        }}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <GeneratedTaskRowText onClick={onRowClick}>{task.title}</GeneratedTaskRowText>
      <div
        style={{
          flex: 1,
        }}
        onClick={onRowClick}
      />
      <TrashIcon onClick={() => console.log('huh')} />
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
  const [generateGPTTasks, { loading: generatedGPTTaskLoading, error: generatedGPTTaskError }] =
    useMutation(GENERATE_GPT_TASKS);
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
        setGeneratedTaskList(res?.data?.generateGPTTasks);
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
              <RegenerateText onClick={handleGenerateGPTTasks}>Regenerate</RegenerateText>
            )}
          </HelperFlexDiv>
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
                    } else {
                      setTaskToView({
                        ...initialMilestoneValues,
                        title: actionPrompt,
                      });
                    }
                    setTaskToViewType(ENTITIES_TYPES.MILESTONE);
                  } else {
                    if (parentTask) {
                      setTaskToView(parentTask);
                    } else {
                      setTaskToView({
                        ...initialTaskValues,
                        title: actionPrompt,
                      });
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
                />
              ))}
            </>
          ) : (
            <>
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
              setField={(field, value) => {
                if (taskToViewType === ENTITIES_TYPES.MILESTONE) {
                  setMilestoneField(field, value);
                } else if (taskToViewType === ENTITIES_TYPES.TASK) {
                  setParentTaskField(field, value);
                } else if (clickSelectedList) {
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
