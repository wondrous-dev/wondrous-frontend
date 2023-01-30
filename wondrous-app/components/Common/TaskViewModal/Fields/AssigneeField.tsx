import { useMutation } from '@apollo/client';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { TaskApplicationButton } from 'components/Common/TaskApplication';
import { filterOrgUsers, useGetOrgUsers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { Claim } from 'components/Icons/claimTask';
import { REMOVE_TASK_ASSIGNEE, UPDATE_TASK_ASSIGNEE, UPDATE_TASK_PROPOSAL_ASSIGNEE } from 'graphql/mutations';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { transformTaskProposalToTaskProposalCard } from 'utils/helpers';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, TaskSectionInfoTakeTask, TaskSectionInfoTakeTaskText } from '../styles';
import { useUpdateTaskCardCache } from '../utils';
import { AssigneeReviewerViewContent, ReviewerAssigneeAutocomplete, TaskFieldEditableContent } from './Shared';

interface OrgUser {
  value: string;
  label?: string;
  profilePicture?: string;
}

const AssigneeContent = ({
  boardColumns,
  canApply,
  canClaim,
  canEdit,
  fetchedTask,
  handleOnCompleted,
  isTaskProposal,
  onCorrectPage,
  updateProposalItem,
  user,
}) => {
  const router = useRouter();
  const [updateTaskProposalAssignee] = useMutation(UPDATE_TASK_PROPOSAL_ASSIGNEE);
  const { data: orgUsersData, search, fetchMoreOrgUsers, hasMoreOrgUsers } = useGetOrgUsers(fetchedTask?.orgId);
  const [removeTaskAssignee] = useMutation(REMOVE_TASK_ASSIGNEE);

  const filteredOrgUsersData = filterOrgUsers({ orgUsersData }).map((orgUser: OrgUser) => ({
    ...orgUser,
    hide: orgUser?.value === user?.id,
  }));
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  const handleUpdateTaskAssignee = (assigneeId) => {
    updateTaskAssignee({
      variables: {
        taskId: fetchedTask?.id,
        assigneeId,
      },
      onCompleted: (data) => handleOnCompleted(data?.updateTaskAssignee),
    });
  };

  if (!fetchedTask?.assigneeId && canApply) {
    return <TaskApplicationButton task={fetchedTask} canApply={canApply} title="Apply to task" />;
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

  if (fetchedTask?.assigneeId) {
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
        EditableContent={({ toggleEditMode }) => (
          <ReviewerAssigneeAutocomplete
            options={filteredOrgUsersData}
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
            onAssignToSelfClick={() => console.log('on assign to self click')}
            onChange={(value) => {
              search(value);
              console.log('on change', value);
            }}
          />
        )}
      />
    );
    // return (
    //   <Field
    //     option={{
    //       ...fetchedTask?.assignee,
    //       id: fetchedTask?.assigneeId,
    //     }}
    //     canEdit={canEdit}
    //     options={filteredOrgUsersData}
    //     onDelete={() =>
    //       removeTaskAssignee({
    //         variables: {
    //           taskId: fetchedTask?.id,
    //         },
    //       })
    //     }
    //     selfUser={user}
    //     onSelect={(value) => handleUpdateTaskAssignee(value?.value)}
    //     onAssignToSelf={() => handleUpdateTaskAssignee(user?.id)}
    //     renderInputProps={{
    //       onChange: (e) => search(e.target.value),
    //     }}
    //   />
    // );
  }
  return null;
};

const AssigneeField = ({
  boardColumns,
  canApply,
  canClaim,
  canEdit,
  fetchedTask,
  handleClose,
  isTaskProposal,
  orgId,
  podId,
  shouldDisplay,
  updateProposalItem,
  user,
  userId,
}) => {
  const onCorrectPage = fetchedTask?.orgId === orgId || fetchedTask?.podId === podId || fetchedTask?.userId === userId;
  const handleUpdateTaskCardCache = useUpdateTaskCardCache();
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const handleOnCompleted = (data) => {
    handleUpdateTaskCardCache({ data });
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage('Assignee updated successfully.');
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
        handleOnCompleted={handleOnCompleted}
        isTaskProposal={isTaskProposal}
        onCorrectPage={onCorrectPage}
        updateProposalItem={updateProposalItem}
        user={user}
      />

      {/* <TaskSectionInfoDiv key={fetchedTask?.assigneeUsername}>
        <TaskSectionImageContent
          hasContent={fetchedTask?.assigneeUsername}
          ContentComponent={TaskViewModalUserChip}
          ContentComponentProps={{
            user: fetchedTask?.assignee,
            handleRemove: (e) => {
              e.preventDefault();
              e.stopPropagation();
              removeTaskAssignee({
                variables: {
                  taskId: fetchedTask?.id,
                },
                onCompleted: (data) => handleOnCompleted(data?.removeTaskAssignee),
              });
            },
            canEdit,
            onClick: () => {
              handleClose();
              router.push(`/profile/${fetchedTask?.assigneeUsername}/about`, undefined, {
                shallow: true,
              });
            },
          }}
          DefaultContent={AssigneeDefaultContent}
          DefaultContentProps={{
            boardColumns,
            canApply,
            canClaim,
            canEdit,
            fetchedTask,
            handleOnCompleted,
            isTaskProposal,
            onCorrectPage,
            router,
            updateProposalItem,
            user,
          }}
        />
      </TaskSectionInfoDiv> */}
    </TaskSectionDisplayDiv>
  );
};

export default AssigneeField;
