import { Grid } from '@mui/material';
import { CreateEntityTextfieldInputPointsComponent } from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityError,
  CreateEntityTextfield,
} from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { debounce } from 'lodash';
import { useState } from 'react';
import palette from 'theme/palette';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, TaskSectionInfoPointsIcon, TaskSectionInfoText, ViewFieldWrapper } from '../styles';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
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

const EditContent = ({ toggleEditMode, points }) => {
  const { submit, error } = useSubmit({ field: FIELDS.POINTS });

  const debounceUpdate = debounce(submit, 500);
  return (
    <Grid display="flex" direction="column" gap="4px">
      <CreateEntityTextfield
        autoComplete="off"
        autoFocus
        name="points"
        onChange={async (e) => await debounceUpdate(parseInt(e.target.value, 10))}
        fullWidth
        defaultValue={points}
        InputProps={{
          inputComponent: CreateEntityTextfieldInputPointsComponent,
          endAdornment: (
            <CreateEntityAutocompletePopperRenderInputAdornment
              position="end"
              onClick={async () => {
                await submit(null);
                toggleEditMode();
              }}
            >
              <CreateEntityAutocompletePopperRenderInputIcon />
            </CreateEntityAutocompletePopperRenderInputAdornment>
          ),
        }}
      />
      {error ? <CreateEntityError>{error}</CreateEntityError> : null}
    </Grid>
  );
};

const PointsField = ({ shouldDisplay, points = null, canEdit }) => {
  if (!shouldDisplay) return null;

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Points</TaskSectionLabel>
      <TaskFieldEditableContent
        canAddItem={canEdit && points === null}
        addContent={({ toggleAddMode }) => {
          return <EditContent toggleEditMode={toggleAddMode} points={points} />;
        }}
        ViewContent={({ toggleEditMode }) => (
          <ViewContent points={points} toggleEditMode={toggleEditMode} canEdit={canEdit} />
        )}
        editableContent={({ toggleEditMode }) => <EditContent points={points} toggleEditMode={toggleEditMode} />}
      />
    </TaskSectionDisplayDiv>
  );
};

export default PointsField;
