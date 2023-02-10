import { useMutation } from '@apollo/client';
import { TaskApplicationButton } from 'components/Common/TaskApplication';
import { filterOrgUsers, useGetOrgUsers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { Claim } from 'components/Icons/claimTask';
import { REMOVE_TASK_ASSIGNEE, UPDATE_TASK_PROPOSAL_ASSIGNEE } from 'graphql/mutations';
import { useRouter } from 'next/router';
import { updateProposalItem } from 'utils/board';
import { transformTaskProposalToTaskProposalCard } from 'utils/helpers';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, TaskSectionInfoTakeTask, TaskSectionInfoTakeTaskText } from '../styles';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { useUpdateTaskCardCache } from './hooks/useUpdateCache';
import { AssigneeReviewerViewContent, ReviewerAssigneeAutocomplete, TaskFieldEditableContent } from './Shared';

interface OrgUser {
  value: string;
  label: string;
  profilePicture: string;
}

const AssigneeContent = ({
  boardColumns,
  canApply,
  canClaim,
  canEdit,
  fetchedTask,
  isTaskProposal,
  onCorrectPage,
  user,
}) => {
  const router = useRouter();
  const { error, submit } = useSubmit({ field: FIELDS.ASSIGNEE });
  const [updateTaskProposalAssignee] = useMutation(UPDATE_TASK_PROPOSAL_ASSIGNEE);
  const { data: orgUsersData, search, fetchMoreOrgUsers, hasMoreOrgUsers } = useGetOrgUsers(fetchedTask?.orgId);
  const [removeTaskAssignee] = useMutation(REMOVE_TASK_ASSIGNEE);
  const filteredOrgUsersData = filterOrgUsers({ orgUsersData }).map((orgUser: OrgUser) => ({
    ...orgUser,
    hide: orgUser?.value === user?.id,
  }));
  const handleUpdateTaskAssignee = async (assigneeId) => await submit(assigneeId);

  if (fetchedTask?.assigneeId || (canEdit && canClaim)) {
    return (
      <TaskFieldEditableContent
        ViewContent={({ toggleEditMode }) => (
          <AssigneeReviewerViewContent
            canEdit={canEdit}
            option={{
              ...fetchedTask?.assignee,
              value: fetchedTask?.assigneeId,
            }}
            toggleEditMode={toggleEditMode}
          />
        )}
        canAddItem={canEdit && canClaim && !fetchedTask?.assigneeId}
        addContent={({ toggleAddMode }) => (
          <ReviewerAssigneeAutocomplete
            options={filteredOrgUsersData}
            error={error}
            currentOption={null}
            listBoxProps={{
              handleFetchMore: fetchMoreOrgUsers,
              hasMore: hasMoreOrgUsers,
            }}
            onDelete={toggleAddMode}
            assignToSelfUser={user}
            onAssignToSelfClick={() => {
              handleUpdateTaskAssignee(user?.id);
              toggleAddMode();
            }}
            onChange={(value) => {
              search(value);
            }}
            onSelect={(value: OrgUser) => {
              handleUpdateTaskAssignee(value?.value);
              toggleAddMode();
            }}
          />
        )}
        editableContent={({ toggleEditMode }) => (
          <ReviewerAssigneeAutocomplete
            options={filteredOrgUsersData}
            error={error}
            currentOption={{
              ...fetchedTask.assignee,
              value: fetchedTask.assigneeId,
              label: fetchedTask.assignee?.username,
            }}
            listBoxProps={{
              handleFetchMore: fetchMoreOrgUsers,
              hasMore: hasMoreOrgUsers,
            }}
            onDelete={() => {
              removeTaskAssignee({
                variables: {
                  taskId: fetchedTask?.id,
                },
              });
              toggleEditMode();
            }}
            assignToSelfUser={user}
            onAssignToSelfClick={() => {
              handleUpdateTaskAssignee(user?.id);
              toggleEditMode();
            }}
            onChange={(value) => {
              search(value);
            }}
            onSelect={(value: OrgUser) => {
              handleUpdateTaskAssignee(value?.value);
              toggleEditMode();
            }}
          />
        )}
      />
    );
  }

  if (!fetchedTask?.assigneeId && canClaim) {
    return (
      <TaskSectionInfoTakeTask
        onClick={() => {
          if (!user) {
            router.push('/signup', undefined, {
              shallow: true,
            });
          } else if (isTaskProposal) {
            updateTaskProposalAssignee({
              variables: {
                proposalId: fetchedTask?.id,
                assigneeId: user?.id,
              },
              onCompleted: (data) => {
                const taskProposal = data?.updateTaskProposalAssignee;
                if (boardColumns?.setColumns && onCorrectPage) {
                  const transformedTaskProposal = transformTaskProposalToTaskProposalCard(taskProposal, {});
                  let columns = [...boardColumns?.columns];
                  columns = updateProposalItem(transformedTaskProposal, columns);
                  boardColumns?.setColumns(columns);
                }
              },
            });
          } else {
            handleUpdateTaskAssignee(user?.id);
          }
        }}
      >
        <Claim />
        <TaskSectionInfoTakeTaskText>Claim this task</TaskSectionInfoTakeTaskText>
      </TaskSectionInfoTakeTask>
    );
  }
  if (!fetchedTask?.assigneeId && canApply) {
    return <TaskApplicationButton task={fetchedTask} canApply={canApply} title="Apply to task" />;
  }

  return null;
};

const AssigneeField = ({
  boardColumns,
  canApply,
  canClaim,
  canEdit,
  fetchedTask,
  isTaskProposal,
  orgId,
  podId,
  shouldDisplay,
  user,
  userId,
}) => {
  const onCorrectPage = fetchedTask?.orgId === orgId || fetchedTask?.podId === podId || fetchedTask?.userId === userId;
  const handleUpdateTaskCardCache = useUpdateTaskCardCache();
  const handleOnCompleted = (data) => {
    handleUpdateTaskCardCache({ data });
  };
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Assignee</TaskSectionLabel>
      <AssigneeContent
        boardColumns={boardColumns}
        canApply={canApply}
        canClaim={canClaim}
        canEdit={canEdit}
        fetchedTask={fetchedTask}
        isTaskProposal={isTaskProposal}
        onCorrectPage={onCorrectPage}
        user={user}
      />
    </TaskSectionDisplayDiv>
  );
};

export default AssigneeField;
