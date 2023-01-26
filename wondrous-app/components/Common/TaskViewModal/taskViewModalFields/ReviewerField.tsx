import { useMutation } from '@apollo/client';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { useGetEligibleReviewers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import EditIcon from 'components/Icons/editIcon';
import PlusIcon from 'components/Icons/plus';
import { UPDATE_TASK_REVIEWERS } from 'graphql/mutations';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { Grid } from '@mui/material';
import palette from 'theme/palette';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, ReviewerWrapper, ViewFieldWrapper, AddButtonGrid, AddReviewerButton } from '../styles';
import { UserChip } from '../taskViewModalFields';

export const EditMode = () => {};

export function ReviewerField({ reviewerData, handleClose, shouldDisplay, canEdit = false, fetchedTask, user }) {
  const router = useRouter();
  const [isEditMode, setEditMode] = useState(false);
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
  const filteredEligibleReviewers = eligibleReviewers
    .filter(({ id }) => !taskReviewerIds?.includes(id))
    .map((i) => {
      if (user?.id === i?.id) return { ...i, hide: true };
      return i;
    });
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
      <ReviewerWrapper>
        {withTaskReviewers
          ? taskReviewers.map((taskReviewer) => (
              <Grid
                width="100%"
                sx={{
                  cursor: 'pointer',
                }}
              >
                <ViewFieldWrapper key={taskReviewer.id} canEdit={canEdit}>
                  <UserChip user={taskReviewer} />
                  <EditIcon stroke={palette.grey58} className="edit-icon-field" />
                </ViewFieldWrapper>
              </Grid>
            ))
          : null}
        {showAddButton && (
          <AddButtonGrid item container width="max-content">
            <AddReviewerButton onClick={() => setShowAutocomplete(!showAutocomplete)}>
              <PlusIcon fill={palette.white} />
            </AddReviewerButton>
          </AddButtonGrid>
        )}
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
