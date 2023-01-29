import { Typography, Grid } from '@mui/material';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import TaskViewModalAutocomplete, { ProfilePicture } from 'components/Common/TaskViewModalAutocomplete';
import { StyledTextField } from 'components/Common/TaskViewModalAutocomplete/styles';
import CloseModalIcon from 'components/Icons/closeModal';
import EditIcon from 'components/Icons/editIcon';
import { useRef, useState } from 'react';
import typography from 'theme/typography';
import palette from 'theme/palette';
import { useOutsideAlerter } from 'utils/hooks';
import { TaskSectionInfoText, ViewFieldContainer, ViewFieldWrapper } from '../styles';

export const TaskFieldEditableContent = ({ EditableContent, ViewContent, onClose = null }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const ref = useRef();
  const toggleEditMode = () =>
    setIsEditMode((prev) => {
      if (prev && onClose) onClose();
      return !prev;
    });

  useOutsideAlerter(ref, toggleEditMode);

  if (isEditMode) {
    return (
      <Grid ref={ref} width="100%" height="100%">
        <EditableContent toggleEditMode={toggleEditMode} />
      </Grid>
    );
  }
  return <ViewContent toggleEditMode={toggleEditMode} />;
};

export const UserChip = ({ user }) => (
  <Grid display="flex" gap="6px" alignItems="center">
    <UserProfilePicture avatar={user?.profilePicture} />
    <Typography color={palette.white} fontWeight={500} fontSize="13px" fontFamily={typography.fontFamily}>
      {user?.username}
    </Typography>
  </Grid>
);

export const Field = ({
  option,
  canEdit,
  options,
  onDelete,
  selfUser,
  onSelect,
  onAssignToSelf,
  renderInputProps = {},
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const ref = useRef();

  const handleClick = () => {
    if (canEdit) setIsEditMode((prev) => !prev);
  };

  useOutsideAlerter(ref, () => {
    setIsEditMode(false);
  });

  const defaultValue = {
    id: option?.id,
    label: option?.username,
    profilePicture: option?.profilePicture,
  };

  return (
    <ViewFieldContainer isEditMode={isEditMode} ref={isEditMode ? ref : null}>
      {isEditMode ? (
        <TaskViewModalAutocomplete
          options={options}
          closeAction={handleClick}
          defaultValue={defaultValue}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              autoFocus
              sx={{
                '.MuiOutlinedInput-root': {
                  paddingRight: '4px !important',
                },
              }}
              placeholder="Assign user"
              InputProps={{
                ...params.InputProps,
                ...(params.inputProps.value === defaultValue.label
                  ? {
                      endAdornment: (
                        <CloseModalIcon
                          style={{
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            onDelete();
                            setIsEditMode(false);
                          }}
                        />
                      ),
                      startAdornment: (
                        <Grid sx={{ marginRight: '6px' }}>
                          <ProfilePicture profilePicture={defaultValue.profilePicture} />
                        </Grid>
                      ),
                    }
                  : {}),
              }}
              {...renderInputProps}
            />
          )}
          onChange={(_, value, reason) => {
            if (reason === 'selectOption') {
              onSelect(value);
              setIsEditMode(false);
            }
          }}
          ListboxProps={{
            AssignToSelfProps: {
              user: selfUser,
              onClick: () => {
                onAssignToSelf();
                onDelete();
              },
            },
          }}
        />
      ) : (
        <ViewFieldWrapper key={option.id} canEdit={canEdit} onClick={handleClick}>
          <UserChip user={option} />
          <EditIcon stroke={palette.grey58} className="edit-icon-field" />
        </ViewFieldWrapper>
      )}
    </ViewFieldContainer>
  );
};

export const InfoText = ({ content = null }) => <TaskSectionInfoText>{content || 'None'}</TaskSectionInfoText>;
