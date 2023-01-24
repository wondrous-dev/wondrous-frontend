import Grid from '@mui/material/Grid';
import DropdownSelect from 'components/Common/DropdownSelect';
import { useMemo, useState } from 'react';
import RobotHand from 'components/Common/WonderAiTaskGeneration/images/robot-hand.svg';
import SmallRobotIcon from 'components/Common/WonderAiTaskGeneration/images/small-robot-icon.svg';
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
} from 'components/Common/WonderAiTaskGeneration/styles';
import { useMutation } from '@apollo/client';
import { GENERATE_GPT_TASKS } from 'graphql/mutations';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { CircularProgress } from '@mui/material';
import palette from 'theme/palette';
import { entityTypeData } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { ENTITIES_TYPES } from 'utils/constants';
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

const initialMilestoneValues = entityTypeData[ENTITIES_TYPES.MILESTONE].initialValues;
const WonderAiTaskGeneration = () => {
  const [promptGenerationType, setPromptGenerationType] = useState(GENERATION_TYPES[0]?.value);
  const [actionPrompt, setActionPrompt] = useState('');
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const [milestone, setMilestone] = useState(null);
  const [parentTask, setParentTask] = useState(null);
  // TODO: read from database
  const [entityDescription, setEntityDescription] = useState('');
  const [formErrors, setFormErrors] = useState({
    actionPrompt: null,
    entityDescription: null,
  });
  const [taskToView, setTaskToView] = useState(null);
  const [taskToViewType, setTaskToViewType] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [fieldFunction, setFieldFunction] = useState(null);
  const [errors, setErrors] = useState({});
  const orgId = orgBoard?.orgId || podBoard?.pod?.orgId;
  const podId = podBoard?.podId;
  const [
    generateGPTTasks,
    { data: generatedGPTTaskData, loading: generatedGPTTaskLoading, error: generatedGPTTaskError },
  ] = useMutation(GENERATE_GPT_TASKS);
  const generatedTaskList = generatedGPTTaskData?.generateGPTTasks || [];
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
              The more specific you are, the better the AI will be able to generate tasks.
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
                  if (milestone) {
                    setTaskToView(milestone);
                  } else {
                    setTaskToView({
                      ...initialMilestoneValues,
                      title: actionPrompt,
                    });
                  }
                  setTaskToViewType(ENTITIES_TYPES.MILESTONE);
                  setFieldFunction(() => (field, value) => setMilestoneField(field, value));
                }}
              >
                <SuggestionRowText>{actionPrompt}</SuggestionRowText>
              </SuggestionRowContainer>
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
                } else {
                  setParentTaskField(field, value);
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
