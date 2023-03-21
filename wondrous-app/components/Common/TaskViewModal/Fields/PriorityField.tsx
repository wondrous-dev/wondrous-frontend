import Grid from '@mui/material/Grid';
import TaskPriorityToggleButton from 'components/Common/TaskPriorityToggleButton';
import { CreateEntityError } from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import palette from 'theme/palette';
import { PRIORITIES } from 'utils/constants';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, TaskSectionInfoText, ViewFieldHoverWrapper, ViewFieldWrapper } from '../styles';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper } from './styles';

const ViewContent = ({ priorityValue, canEdit, toggleEditMode }) =>
  priorityValue ? (
    <ViewFieldHoverWrapper $canEdit={canEdit} onClick={toggleEditMode}>
      <ViewFieldWrapper>
        <Grid display="flex" gap="6px" alignItems="center" justifyContent="center">
          <IconWrapper>{priorityValue.icon ? priorityValue.icon : null}</IconWrapper>
          <TaskSectionInfoText>{priorityValue.label}</TaskSectionInfoText>
        </Grid>
      </ViewFieldWrapper>
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </ViewFieldHoverWrapper>
  ) : null;

const EditableContent = ({ toggleEditMode, value }) => {
  const { submit, error } = useSubmit({ field: FIELDS.PRIORITY });

  const handleChange = async (_, value) => {
    await submit(value);
    toggleEditMode();
  };
  return (
    <Grid display="flex" direction="column" gap="4px">
      <TaskPriorityToggleButton value={value} setValue={handleChange} />
      {error ? <CreateEntityError>{error}</CreateEntityError> : null}
    </Grid>
  );
};
const PriorityField = ({ priority, canEdit, shouldDisplay }) => {
  if (!shouldDisplay) return null;
  const priorityValue = PRIORITIES.find((prio) => prio.value === priority);

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Priority</TaskSectionLabel>
      <TaskFieldEditableContent
        viewContent={({ toggleEditMode }) => (
          <ViewContent priorityValue={priorityValue} canEdit={canEdit} toggleEditMode={toggleEditMode} />
        )}
        addContent={({ toggleAddMode }) => <EditableContent toggleEditMode={toggleAddMode} value={null} />}
        canAddItem={canEdit && !priorityValue}
        content={priorityValue?.label}
        editableContent={({ toggleEditMode }) => <EditableContent toggleEditMode={toggleEditMode} value={priority} />}
      />
    </TaskSectionDisplayDiv>
  );
};
export default PriorityField;
