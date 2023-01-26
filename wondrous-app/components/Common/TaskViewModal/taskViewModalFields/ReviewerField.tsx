import { useMutation } from '@apollo/client';
import { Grid } from '@mui/material';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import TaskViewModalAutocomplete, { ProfilePicture } from 'components/Common/TaskViewModalAutocomplete';
import { StyledTextField } from 'components/Common/TaskViewModalAutocomplete/styles';
import { useGetEligibleReviewers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import CloseModalIcon from 'components/Icons/closeModal';
import EditIcon from 'components/Icons/editIcon';
import PlusIcon from 'components/Icons/plus';
import { UPDATE_TASK_REVIEWERS } from 'graphql/mutations';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useMemo, useRef, useState } from 'react';
import palette from 'theme/palette';
import { useOutsideAlerter } from 'utils/hooks';
import { TaskSectionLabel } from '../helpers';
import {
  AddButtonGrid,
  AddReviewerButton,
  ReviewerWrapper,
  TaskSectionDisplayDiv,
  ViewFieldContainer,
  ViewFieldWrapper,
} from '../styles';
import { UserChip } from '../taskViewModalFields';

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

export function ReviewerField({ reviewerData, handleClose, shouldDisplay, canEdit = false, fetchedTask, user }) {
  const router = useRouter();
  const eligibleReviewers = useGetEligibleReviewers(fetchedTask?.orgId, fetchedTask?.podId);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [updateTask] = useMutation(UPDATE_TASK_REVIEWERS);
  const handleUpdateReviewers = (reviewerIds) => {
    setShowAutocomplete(false);
    updateTask({
      variables: { taskId: fetchedTask?.id, reviewerIds },
      refetchQueries: ['getTaskReviewers'],
      onCompleted: () => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage('Reviewer updated successfully.');
      },
    });
  };
  const { getTaskReviewers: taskReviewers } = reviewerData || {};
  const withTaskReviewers = Boolean(taskReviewers?.length);
  const taskReviewerIds = taskReviewers?.map(({ id }) => id);

  const filteredEligibleReviewers = useMemo(
    () => eligibleReviewers.filter(({ id }) => !taskReviewerIds?.includes(id) && id !== user?.id),
    [eligibleReviewers, taskReviewerIds, user?.id]
  );

  const showAutocompleteField = canEdit && (showAutocomplete || !withTaskReviewers);
  const showNone = !canEdit && !withTaskReviewers;
  const showAddButton =
    canEdit &&
    withTaskReviewers &&
    withTaskReviewers < eligibleReviewers?.length &&
    !isEmpty(filteredEligibleReviewers);
  const selfReviewer = !taskReviewerIds?.includes(user?.id) && user;
  const handleOnClick = (username) => () => {
    handleClose();
    router.push(`/profile/${username}/about`);
  };

  if (!shouldDisplay) {
    return null;
  }
  return (
    <TaskSectionDisplayDiv alignItems="start">
      <TaskSectionLabel>Reviewer</TaskSectionLabel>
      <ReviewerWrapper showAutocomplete={showAutocomplete}>
        {withTaskReviewers
          ? taskReviewers.map((taskReviewer) => (
              <Field
                option={taskReviewer}
                canEdit={canEdit}
                options={filteredEligibleReviewers}
                selfUser={selfReviewer}
                onSelect={(value) =>
                  handleUpdateReviewers([...taskReviewerIds, value?.id].filter((id) => id !== taskReviewer.id))
                }
                onAssignToSelf={() => handleUpdateReviewers([...taskReviewerIds, user?.id])}
                onDelete={() => handleUpdateReviewers(taskReviewerIds.filter((id) => id !== taskReviewer.id))}
              />
            ))
          : null}
        {showAutocomplete ? (
          <TaskViewModalAutocomplete
            options={filteredEligibleReviewers}
            closeAction={() => setShowAutocomplete(false)}
            onChange={(_, value, reason) => {
              if (reason === 'selectOption') {
                handleUpdateReviewers([...taskReviewerIds, value?.id]);
              }
            }}
            ListboxProps={{
              AssignToSelfProps: {
                user: selfReviewer,
                onClick: () => handleUpdateReviewers([...taskReviewerIds, user?.id]),
              },
            }}
          />
        ) : null}
        {showAddButton && !showAutocomplete && (
          <AddButtonGrid item container width="max-content">
            <AddReviewerButton onClick={() => setShowAutocomplete(!showAutocomplete)}>
              <PlusIcon fill={palette.white} />
            </AddReviewerButton>
          </AddButtonGrid>
        )}
        {/* <Grid item width="100%">
          <TaskViewModalAutocomplete
            options={filteredEligibleReviewers}
            onChange={(_, value, reason) => {
              if (reason === 'selectOption') {
                handleUpdateReviewers([...taskReviewerIds, value?.id]);
              }
            }}
            ListboxProps={{
              AssignToSelfProps: {
                user: selfReviewer,
                onClick: () => handleUpdateReviewers([...taskReviewerIds, user?.id]),
              },
            }}
          />
        </Grid> */}
      </ReviewerWrapper>

      {/* <TaskSectionDisplayContentWrapper>
          <ReviewerWrapper showAddButton={showAddButton}>
            {withTaskReviewers &&
              taskReviewers.map((taskReviewer) => (
                <Grid key={taskReviewer.id} item container width="100%">
                  <TaskSectionImageContent
                    hasContent={taskReviewer.id}
                    ContentComponent={TaskViewModalUserChip}
                    ContentComponentProps={{
                      user: taskReviewer,
                      handleRemove: (e) => {
                        e.stopPropagation();
                        handleUpdateReviewers(taskReviewerIds.filter((id) => id !== taskReviewer.id));
                      },
                      canEdit,
                      onClick: handleOnClick(taskReviewer?.username),
                    }}
                  />
                </Grid>
              ))}
            {showAutocompleteField && (
              <Grid item width="100%">
                <TaskViewModalAutocomplete
                  options={filteredEligibleReviewers}
                  onChange={(_, value, reason) => {
                    if (reason === 'selectOption') {
                      handleUpdateReviewers([...taskReviewerIds, value?.id]);
                    }
                  }}
                  ListboxProps={{
                    AssignToSelfProps: {
                      user: selfReviewer,
                      onClick: () => handleUpdateReviewers([...taskReviewerIds, user?.id]),
                    },
                  }}
                />
              </Grid>
            )}
            {showNone && <TaskSectionInfoText>None</TaskSectionInfoText>}
            {showAddButton && (
              <Grid item container width="max-content">
                <AddReviewerButton onClick={() => setShowAutocomplete(!showAutocomplete)}>
                  <PlusIcon fill={palette.white} />
                </AddReviewerButton>
              </Grid>
            )}
          </ReviewerWrapper>
        </TaskSectionDisplayContentWrapper> */}
    </TaskSectionDisplayDiv>
  );
}

export default ReviewerField;
