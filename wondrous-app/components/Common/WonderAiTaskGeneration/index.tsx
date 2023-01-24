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
} from 'components/Common/WonderAiTaskGeneration/styles';
import { useMutation } from '@apollo/client';
import { GENERATE_GPT_TASKS } from 'graphql/mutations';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { CircularProgress } from '@mui/material';
import palette from 'theme/palette';
import { ErrorText } from '..';

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

const WonderAiTaskGeneration = () => {
  const [promptGenerationType, setPromptGenerationType] = useState(GENERATION_TYPES[0]?.value);
  const [actionPrompt, setActionPrompt] = useState('');
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  // TODO: read from database
  const [entityDescription, setEntityDescription] = useState('');
  const [formErrors, setFormErrors] = useState({
    actionPrompt: null,
    entityDescription: null,
  });
  const [taskToView, setTaskToView] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [
    generateGPTTasks,
    { data: generatedGPTTaskData, loading: generatedGPTTaskLoading, error: generatedGPTTaskError },
  ] = useMutation(GENERATE_GPT_TASKS);
  const generatedTaskList = generatedGPTTaskData?.generateGPTTasks || [];

  const handleGenerateGPTTasks = () => {
    if (!actionPrompt) {
      setFormErrors({ ...formErrors, actionPrompt: 'This field is required' });
    } else {
      generateGPTTasks({
        variables: {
          input: {
            actionPrompt,
            entityDescription,
            orgId: orgBoard?.orgId || podBoard?.pod?.orgId,
            ...(podBoard?.podId && { podId: podBoard?.podId }),
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
          </HelperFlexDiv>
          {generatedTaskList?.length > 0 ? (
            <></>
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
        <RightPanelSection>{taskToView ? <></> : <RobotHand />}</RightPanelSection>
      </Grid>
    </Grid>
  );
};

export default WonderAiTaskGeneration;
