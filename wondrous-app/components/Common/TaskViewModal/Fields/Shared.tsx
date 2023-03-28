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
  CreateEntityError,
  CreateEntityLabelAddButton,
} from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { useRef, useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { User } from 'types/User';
import { useOutsideAlerter } from 'utils/hooks';
import usePlate from 'hooks/usePlate';
import {
  TaskSectionInfoText,
  ViewFieldHoverWrapper,
  ViewFieldWrapper,
  AssigneeReviewerContentWrapper,
} from '../styles';
import { UserChipWrapper } from './styles';

interface TaskFieldEditableContentProps {
  editableContent: React.FC<{ toggleEditMode: () => void; toggleOutsideAlerter: () => void }>;
  viewContent: React.FC<{ toggleEditMode: () => void }>;
  onClose?: (value?: any) => void;
  canAddItem?: boolean;
  addContent?: null | React.FC<{ toggleAddMode: () => void; toggleOutsideAlerter: () => void }>;
  editGridStyle?: any;
  content?: string | number | boolean | null;
}

export const EmptyLabel = () => (
  <Grid
    container
    width="fit-content"
    alignItems="center"
    justifyContent="center"
    bgcolor={palette.grey87}
    color={palette.grey58}
    borderRadius="4px"
    padding="4px"
    height="28px"
    lineHeight="0"
    fontWeight="500"
  >
    Empty
  </Grid>
);

export const TaskFieldEditableContent = ({
  editableContent,
  viewContent,
  addContent = null,
  onClose = null,
  canAddItem = false,
  editGridStyle = {},
  content = null,
}: TaskFieldEditableContentProps) => {
  const { isComboboxOpen } = usePlate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isOutsideAlerterDisabled, setDisableOutsideAlerter] = useState(false);

  const ref = useRef();
  const toggleEditMode = () =>
    setIsEditMode((prev) => {
      if (prev && onClose) onClose();
      return !prev;
    });

  const toggleAddMode = () =>
    setIsAddMode((prev) => {
      if (prev && onClose) onClose();
      return !prev;
    });

  const toggleOutsideAlerter = () => setDisableOutsideAlerter((prev) => !prev);

  useOutsideAlerter(
    ref,
    () => {
      if (isOutsideAlerterDisabled) return;
      if (isEditMode && !isComboboxOpen) {
        toggleEditMode();
      }
      if (isAddMode) {
        toggleAddMode();
      }
    },
    [isEditMode, isAddMode, isOutsideAlerterDisabled, isComboboxOpen]
  );

  if (isAddMode) {
    return (
      <Grid ref={ref} width="100%" height="100%">
        {addContent({ toggleAddMode, toggleOutsideAlerter })}
      </Grid>
    );
  }

  if (!content && addContent) {
    if (canAddItem) {
      return (
        <CreateEntityLabelAddButton onClick={toggleAddMode} data-cy="button-add-assignee">
          <CreateEntityAddButtonIcon />
          <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
        </CreateEntityLabelAddButton>
      );
    }
    return <EmptyLabel />;
  }

  if (isEditMode) {
    return (
      <Grid
        ref={ref}
        {...{
          width: '100%',
          height: '100%',
          ...editGridStyle,
        }}
      >
        {editableContent({ toggleEditMode, toggleOutsideAlerter })}
      </Grid>
    );
  }
  // return <ViewContent toggleEditMode={toggleEditMode} />;
  return <>{viewContent({ toggleEditMode })}</>;
};

export const UserChip = ({ user }) => (
  <UserChipWrapper
    display="flex"
    gap="6px"
    alignItems="center"
    href={`/profile/${user?.username}/about`}
    onClick={(e) => e.stopPropagation()}
  >
    <UserProfilePicture
      avatar={user?.profilePicture}
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '13px',
        marginRight: '4px',
      }}
    />
    <Typography color={palette.white} fontWeight={500} fontSize="13px" fontFamily={typography.fontFamily}>
      {user?.username}
    </Typography>
  </UserChipWrapper>
);

export const AssigneeReviewerViewContent = ({ option, canEdit, toggleEditMode, children = null }) => (
  <AssigneeReviewerContentWrapper $canEdit={canEdit}>
    <ViewFieldHoverWrapper $canEdit={canEdit} onClick={toggleEditMode}>
      <ViewFieldWrapper key={option.id}>
        <UserChip user={option} />
      </ViewFieldWrapper>
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </ViewFieldHoverWrapper>
    {children}
  </AssigneeReviewerContentWrapper>
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
  onSelect?: (value: string | Option) => void;
  error?: string;
  disabled?: boolean;
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
  error = null,
  disabled = false,
}: IReviewerAssigneeAutocompleteProps) => (
  <>
    <CreateEntityAutocompletePopper
      disabled={disabled}
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
            onChange={(e) => {
              if (onChange) {
                onChange(e.target.value);
              }
            }}
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
    {error ? <CreateEntityError>{error}</CreateEntityError> : null}
  </>
);
