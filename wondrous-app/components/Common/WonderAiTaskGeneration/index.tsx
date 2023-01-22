import Grid from '@mui/material/Grid';
import DropdownSelect from 'components/Common/DropdownSelect';
import { useState } from 'react';
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
} from './styles';

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

  return (
    <Grid container>
      <Grid md={7} item>
        <PromptContainer>
          <PromptBox>
            <PromptBoxTitle fontSize={18}>{`Unleash your communities' potential with AI.`}</PromptBoxTitle>
            <PromptBoxDescription>
              {`Write a prompt describing your intended action to generate a ${
                promptGenerationType === GENERATION_TYPES[0]?.value
                  ? 'milestone containing tasks'
                  : 'task containing subtasks'
              }`}{' '}
              .
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
                placeholder="What does your org/pod do? I.e. the marketing team for a social token. Be specific!  "
                value={entityDescription}
                error={formErrors.entityDescription}
              />
            </PromptInputDiv>
          </PromptBox>
        </PromptContainer>
      </Grid>
      <Grid md={5} item>
        <div />
      </Grid>
    </Grid>
  );
};

export default WonderAiTaskGeneration;
