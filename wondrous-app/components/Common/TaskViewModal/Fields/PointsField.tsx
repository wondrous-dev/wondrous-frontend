import { Grid } from '@mui/material';
import { CreateEntityTextfieldInputPointsComponent } from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityTextfield,
} from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import palette from 'theme/palette';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, TaskSectionInfoPointsIcon, TaskSectionInfoText, ViewFieldWrapper } from '../styles';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper } from './styles';

const ViewContent = ({ points, toggleEditMode, canEdit }) => (
  <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
    <Grid display="flex" gap="6px" alignItems="center" justifyContent="center">
      <IconWrapper>
        <TaskSectionInfoPointsIcon />
      </IconWrapper>
      <TaskSectionInfoText>{points}</TaskSectionInfoText>
    </Grid>
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </ViewFieldWrapper>
);

// TODO: IMPLEMENT API
const EditContent = ({ toggleEditMode, canEdit, points }) => (
  <CreateEntityTextfield
    autoComplete="off"
    autoFocus={points}
    name="points"
    onChange={(value) => console.log(value)}
    fullWidth
    value={points}
    InputProps={{
      inputComponent: CreateEntityTextfieldInputPointsComponent,
      endAdornment: (
        <CreateEntityAutocompletePopperRenderInputAdornment
          position="end"
          onClick={() => {
            console.log('set fields to null');
          }}
        >
          <CreateEntityAutocompletePopperRenderInputIcon />
        </CreateEntityAutocompletePopperRenderInputAdornment>
      ),
    }}
  />
);

const PointsField = ({ shouldDisplay, points, canEdit }) => {
  if (!shouldDisplay) return null;
  const onClose = () => console.log('implement API');
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Points</TaskSectionLabel>
      <TaskFieldEditableContent
        onClose={onClose}
        ViewContent={({ toggleEditMode }) => (
          <ViewContent points={points} toggleEditMode={toggleEditMode} canEdit={canEdit} />
        )}
        EditableContent={({ toggleEditMode }) => (
          <EditContent points={points} toggleEditMode={toggleEditMode} canEdit={canEdit} />
        )}
      />
    </TaskSectionDisplayDiv>
  );
};

export default PointsField;
