import { Grid, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { ListboxComponent, RenderOption } from 'components/Common/TaskViewModalAutocomplete';
import {
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  CreateEntityAutocompletePopper,
  CreateEntityAutocompletePopperRenderInput,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityDefaultUserImage,
  CreateEntityLabelAddButton,
} from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { Dispatch, useEffect, useRef, useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { User } from 'types/User';
import { useOutsideAlerter } from 'utils/hooks';
import { TaskSectionInfoText, ViewFieldWrapper } from '../styles';

interface TaskFieldEditableContentProps {
  editableContent: React.FC<{ toggleEditMode: () => void }>;
  ViewContent: React.FC<{ toggleEditMode: () => void }>;
  onClose?: (value?: any) => void;
  canAddItem?: boolean;
  addContent?: React.FC<{ toggleAddMode: () => void }>;
  addItemLabel?: React.FC<{}>;
}

export const TaskFieldEditableContent = ({
  editableContent,
  ViewContent,
  addContent = () => null,
  onClose = null,
  canAddItem = false,
  addItemLabel = null,
}: TaskFieldEditableContentProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const ref = useRef();
  const toggleEditMode = () =>
    setIsEditMode((prev) => {
      if (prev && onClose) onClose();
      return !prev;
    });

  const toggleAddMode = () => setIsAddMode((prev) => !prev);

  useOutsideAlerter(
    ref,
    () => {
      if (isEditMode) {
        toggleEditMode();
      }
      if (isAddMode) {
        toggleAddMode();
      }
    },
    [isEditMode, isAddMode]
  );

  if (isAddMode) {
    return (
      <Grid ref={ref} width="100%" height="100%">
        {addContent({ toggleAddMode: toggleAddMode })}
      </Grid>
    );
  }

  if (canAddItem) {
    return (
      <>
        {addItemLabel?.({})}
        <CreateEntityLabelAddButton onClick={toggleAddMode} data-cy="button-add-assignee">
          <CreateEntityAddButtonIcon />
          <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
        </CreateEntityLabelAddButton>
      </>
    );
  }
  if (isEditMode) {
    return (
      <Grid ref={ref} width="100%" height="100%">
        {editableContent({ toggleEditMode: toggleEditMode })}
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

export const AssigneeReviewerViewContent = ({ option, canEdit, toggleEditMode, children = null }) => (
  <Grid width="100%" display="flex" alignItems="center" gap="6px">
    <ViewFieldWrapper key={option.id} canEdit={canEdit} onClick={toggleEditMode}>
      <UserChip user={option} />
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </ViewFieldWrapper>
    {children}
  </Grid>
);

export const InfoText = ({ content = null }) => <TaskSectionInfoText>{content || 'None'}</TaskSectionInfoText>;

interface Option {
  value: string;
  label: string;
  profilePicture: string;
  hide?: boolean;
}
interface IReviewerAssigneeAutocompleteProps {
  options: Option[];
  currentOption: Option;
  assignToSelfUser: User;
  onAssignToSelfClick: () => void;
  onChange?: (value: string) => void;
  listBoxProps?: any;
  onDelete?: () => void;
  onSelect?: (value: string) => void;
}

export const ReviewerAssigneeAutocomplete = ({
  options,
  currentOption,
  assignToSelfUser,
  onAssignToSelfClick,
  onChange,
  listBoxProps = {},
  onDelete,
  onSelect,
}: IReviewerAssigneeAutocompleteProps) => (
  <>
    <CreateEntityAutocompletePopper
      openOnFocus
      options={options}
      disablePortal
      fullWidth
      value={currentOption?.value}
      ListboxComponent={ListboxComponent}
      ListboxProps={{
        AssignToSelfProps: {
          user: assignToSelfUser,
          onClick: onAssignToSelfClick,
        },
        ...listBoxProps,
      }}
      isOptionEqualToValue={(option, value) => option.value === value}
      renderInput={(params) => {
        const item = options.find((option) => option.value === params.inputProps.value);
        return (
          <CreateEntityAutocompletePopperRenderInput
            {...params}
            inputProps={{
              ...params.inputProps,
              value: item?.label,
            }}
            autoFocus
            ref={params.InputProps.ref}
            disableUnderline
            fullWidth
            placeholder="Enter username..."
            startAdornment={
              <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                {item?.profilePicture ? (
                  <SafeImage useNextImage={false} src={item.profilePicture} alt="Profile picture" />
                ) : (
                  <CreateEntityDefaultUserImage />
                )}
              </CreateEntityAutocompletePopperRenderInputAdornment>
            }
            endAdornment={
              <CreateEntityAutocompletePopperRenderInputAdornment position="end" onClick={onDelete}>
                <CreateEntityAutocompletePopperRenderInputIcon />
              </CreateEntityAutocompletePopperRenderInputAdornment>
            }
          />
        );
      }}
      renderOption={RenderOption}
      onChange={(event, value, reason) => {
        event.stopPropagation();
        if (onChange) onChange(value);
        if (reason === 'selectOption') {
          return onSelect(value);
        }
      }}
      blurOnSelect
      error={false}
    />
    {/* {hasError && <CreateEntityError>{hasError}</CreateEntityError>} */}
  </>
);
