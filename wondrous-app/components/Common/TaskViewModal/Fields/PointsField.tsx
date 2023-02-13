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
import { useCallback, useRef, useState } from 'react';
import palette from 'theme/palette';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, TaskSectionInfoPointsIcon, TaskSectionInfoText, ViewFieldWrapper } from '../styles';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper } from './styles';

const ViewContent = ({ points, toggleEditMode, canEdit }) => (
  <ViewFieldWrapper $canEdit={canEdit} onClick={toggleEditMode}>
    <Grid display="flex" gap="6px" alignItems="center" justifyContent="center">
      <IconWrapper>
        <TaskSectionInfoPointsIcon />
      </IconWrapper>
      <TaskSectionInfoText>{points}</TaskSectionInfoText>
    </Grid>
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </ViewFieldWrapper>
);

const EditContent = ({ toggleEditMode, points, setValue, error }) => (
  <Grid display="flex" direction="column" gap="4px">
    <CreateEntityTextfield
      autoComplete="off"
      autoFocus
      name="points"
      onChange={(e) => setValue(parseInt(e.target.value))}
      fullWidth
      defaultValue={points}
      InputProps={{
        inputComponent: CreateEntityTextfieldInputPointsComponent,
        endAdornment: (
          <CreateEntityAutocompletePopperRenderInputAdornment
            position="end"
            onClick={async () => {
              await setValue(null);
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

const PointsField = ({ shouldDisplay, points = null, canEdit }) => {
  const { submit, error } = useSubmit({ field: FIELDS.POINTS });

  const stateRef = useRef(points);

  const setValue = (value) => (stateRef.current = value);

  const onClose = async () => await submit(stateRef.current);

  if (!shouldDisplay) return null;

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Points</TaskSectionLabel>
      <TaskFieldEditableContent
        onClose={() => onClose()}
        canAddItem={canEdit && stateRef.current === null}
        addContent={({ toggleAddMode }) => (
          <EditContent error={error} toggleEditMode={toggleAddMode} points={stateRef.current} setValue={setValue} />
        )}
        viewContent={({ toggleEditMode }) => (
          <ViewContent points={stateRef.current} toggleEditMode={toggleEditMode} canEdit={canEdit} />
        )}
        editableContent={({ toggleEditMode }) => (
          <EditContent setValue={setValue} error={error} points={points} toggleEditMode={toggleEditMode} />
        )}
      />
    </TaskSectionDisplayDiv>
  );
};

export default PointsField;
