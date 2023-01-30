import { useMutation } from '@apollo/client';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { useGetEligibleReviewers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityLabelAddButton,
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
} from 'components/CreateEntity/CreateEntityModal/styles';
import PlusIcon from 'components/Icons/plus';
import { UPDATE_TASK_REVIEWERS } from 'graphql/mutations';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';
import palette from 'theme/palette';
import { TaskSectionLabel } from '../helpers';
import { AddButtonGrid, AddReviewerButton, ReviewerWrapper, TaskSectionDisplayDiv } from '../styles';
import { AssigneeReviewerViewContent, ReviewerAssigneeAutocomplete, TaskFieldEditableContent } from './Shared';

export function ReviewerField({ reviewerData, handleClose, shouldDisplay, canEdit = false, fetchedTask, user }) {
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
    () =>
      eligibleReviewers.map((reviewer) => ({
        ...reviewer,
        value: reviewer.id,
        hide: taskReviewerIds.includes(reviewer.id) || reviewer.id === user?.id,
      })),
    [eligibleReviewers, taskReviewerIds, user?.id]
  );

  const showAutocompleteField = canEdit && (showAutocomplete || !withTaskReviewers);
  const showAddButton =
    canEdit &&
    withTaskReviewers &&
    withTaskReviewers < eligibleReviewers?.length &&
    !isEmpty(filteredEligibleReviewers);
  const selfReviewer = !taskReviewerIds?.includes(user?.id) && user;

  if (!shouldDisplay) {
    return null;
  }

  return (
    <TaskSectionDisplayDiv alignItems="start">
      <TaskSectionLabel>Reviewer</TaskSectionLabel>
      <ReviewerWrapper showFullWidth>
        {withTaskReviewers
          ? taskReviewers.map((taskReviewer, index) => (
              <TaskFieldEditableContent
                ViewContent={({ toggleEditMode }) => (
                  <AssigneeReviewerViewContent canEdit={canEdit} option={taskReviewer} toggleEditMode={toggleEditMode}>
                    {showAddButton && !showAutocomplete && index === taskReviewerIds?.length - 1 && (
                      <AddButtonGrid item container width="max-content">
                        <AddReviewerButton onClick={() => setShowAutocomplete(!showAutocomplete)}>
                          <PlusIcon fill={palette.white} />
                        </AddReviewerButton>
                      </AddButtonGrid>
                    )}
                  </AssigneeReviewerViewContent>
                )}
                EditableContent={({ toggleEditMode }) => (
                  <ReviewerAssigneeAutocomplete
                    options={filteredEligibleReviewers}
                    currentOption={{
                      ...taskReviewer,
                      value: taskReviewer.id,
                      label: taskReviewer.username,
                    }}
                    assignToSelfUser={selfReviewer}
                    onAssignToSelfClick={() => console.log('on assign to self click')}
                    onChange={(value) => console.log('on change')}
                    onDelete={() => handleUpdateReviewers(taskReviewerIds.filter((id) => id !== taskReviewer.id))}
                  />
                )}
              />
            ))
          : null}
        {showAutocomplete && canEdit ? (
          <ReviewerAssigneeAutocomplete
            options={filteredEligibleReviewers}
            currentOption={null}
            assignToSelfUser={selfReviewer}
            onAssignToSelfClick={() => console.log('on assign to self click')}
            onChange={(value) => handleUpdateReviewers([...taskReviewerIds, value?.id])}
            onDelete={() => setShowAutocomplete(false)}
          />
        ) : null}
        {!taskReviewerIds?.length && !showAutocomplete && canEdit ? (
          <CreateEntityLabelAddButton onClick={() => setShowAutocomplete(true)} data-cy="button-add-assignee">
            <CreateEntityAddButtonIcon />
            <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
          </CreateEntityLabelAddButton>
        ) : null}
      </ReviewerWrapper>
    </TaskSectionDisplayDiv>
  );
}

export default ReviewerField;
