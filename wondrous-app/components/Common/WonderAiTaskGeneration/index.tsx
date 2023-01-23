import Grid from '@mui/material/Grid';
import DropdownSelect from 'components/Common/DropdownSelect';
import { useState } from 'react';
import RobotHand from 'components/Common/WonderAiTaskGeneration/images/robot-hand.svg';
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
} from 'components/Common/WonderAiTaskGeneration/styles';

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

const WonderAiTaskGeneration = () => {
  const [promptGenerationType, setPromptGenerationType] = useState(GENERATION_TYPES[0]?.value);
  const [actionPrompt, setActionPrompt] = useState('');
  // TODO: read from database
  const [entityDescription, setEntityDescription] = useState('');
  const [formErrors, setFormErrors] = useState({
    actionPrompt: null,
    entityDescription: null,
  });
  const [taskToView, setTaskToView] = useState(null);
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
                onChange={(event) => setActionPrompt(event.target.value)}
                placeholder="Enter desired action"
                value={actionPrompt}
                error={formErrors.actionPrompt}
              />
            </PromptInputDiv>
            <PromptInputDiv>
              <EntityInput
                autoComplete="off"
                name="entity-description"
                onChange={(event) => setEntityDescription(event.target.value)}
                placeholder="Describe your team - e.g. the marketing team for a social token."
                value={entityDescription}
                error={formErrors.entityDescription}
              />
              <ActionButton>
                <ActionButtonText>Generate</ActionButtonText>
              </ActionButton>
            </PromptInputDiv>
          </PromptBox>
        </PromptContainer>
      </Grid>
      <Grid sm={0} md={4} lg={5} item>
        <RightPanelSection>{taskToView ? <></> : <RobotHand />}</RightPanelSection>
      </Grid>
    </Grid>
  );
};

export default WonderAiTaskGeneration;
