import Grid from '@mui/material/Grid';
import TaskPriorityToggleButton from 'components/Common/TaskPriorityToggleButton';
import EditIcon from 'components/Icons/editIcon';
import palette from 'theme/palette';
import { PRIORITIES } from 'utils/constants';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, TaskSectionInfoText, ViewFieldWrapper } from '../styles';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper } from './styles';

const ViewContent = ({ priorityValue, canEdit, toggleEditMode }) =>
  priorityValue ? (
    <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
      <Grid display="flex" gap="6px" alignItems="center" justifyContent="center">
        <IconWrapper>{priorityValue.icon ? priorityValue.icon : null}</IconWrapper>
        <TaskSectionInfoText>{priorityValue.label}</TaskSectionInfoText>
      </Grid>
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </ViewFieldWrapper>
  ) : null;

const EditableContent = ({ toggleEditMode, value }) => {
  const handleChange = (_, value) => {
    console.log('IMPLEMENT API CALL HERE');
    toggleEditMode();
  };
  return <TaskPriorityToggleButton value={value} setValue={handleChange} />;
};
const PriorityField = ({ priority, canEdit }) => {
  const priorityValue = PRIORITIES.find((prio) => prio.value === priority);

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Priority</TaskSectionLabel>
      <TaskFieldEditableContent
        ViewContent={({ toggleEditMode }) => (
          <ViewContent priorityValue={priorityValue} canEdit={canEdit} toggleEditMode={toggleEditMode} />
        )}
        EditableContent={({ toggleEditMode }) => <EditableContent toggleEditMode={toggleEditMode} value={priority} />}
      />
    </TaskSectionDisplayDiv>
  );
};
export default PriorityField;
