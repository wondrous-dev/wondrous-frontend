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
import { useContext, useMemo, useState } from 'react';
import palette from 'theme/palette';
import { TaskSectionLabel } from '../helpers';
import { AddButtonGrid, AddReviewerButton, ReviewerWrapper, TaskSectionDisplayDiv } from '../styles';
import { FIELDS, useSubmit } from './hooks/useSubmit';
import { AssigneeReviewerViewContent, ReviewerAssigneeAutocomplete, TaskFieldEditableContent } from './Shared';

export function ReviewerField({ reviewerData, shouldDisplay, canEdit, fetchedTask, user }) {
  const eligibleReviewers = useGetEligibleReviewers(fetchedTask?.orgId, fetchedTask?.podId);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const { submit, error } = useSubmit({ field: FIELDS.REVIEWERS, refetchQueries: ['getTaskReviewers'] });

  const handleUpdateReviewers = async (reviewerIds) => {
    await submit(reviewerIds);
  };

  const { getTaskReviewers: taskReviewers } = reviewerData || {};
  const withTaskReviewers = Boolean(taskReviewers?.length);
  const taskReviewerIds = taskReviewers?.map(({ id }) => id);

  const filteredEligibleReviewers = useMemo(
    () =>
      eligibleReviewers.map((reviewer) => ({
        ...reviewer,
        value: reviewer.id,
        hide: taskReviewerIds?.includes(reviewer.id) || reviewer.id === user?.id,
      })),
    [eligibleReviewers, taskReviewerIds, user?.id]
  );

  if (!shouldDisplay) {
    return null;
  }
  const showAddButton =
    canEdit &&
    withTaskReviewers &&
    withTaskReviewers < eligibleReviewers?.length &&
    !isEmpty(filteredEligibleReviewers);
  const selfReviewer = !taskReviewerIds?.includes(user?.id) && user;

  const handleAssignToSelfClick = () => handleUpdateReviewers([...taskReviewerIds, user?.id]);

  const handleSelect = (value) => {
    handleUpdateReviewers([...taskReviewerIds, value?.id]);
  };

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
                editableContent={({ toggleEditMode }) => (
                  <ReviewerAssigneeAutocomplete
                    options={filteredEligibleReviewers}
                    currentOption={{
                      ...taskReviewer,
                      value: taskReviewer.id,
                      label: taskReviewer.username,
                    }}
                    assignToSelfUser={selfReviewer}
                    onAssignToSelfClick={handleAssignToSelfClick}
                    onSelect={(value: any) => {
                      console.log(value, 'value on editables');
                      handleUpdateReviewers([...taskReviewerIds.filter((id) => id !== taskReviewer.id), value?.id]);
                    }}
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
            onAssignToSelfClick={handleAssignToSelfClick}
            onSelect={handleSelect}
            onDelete={() => setShowAutocomplete(false)}
          />
        ) : null}
        {error}
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
