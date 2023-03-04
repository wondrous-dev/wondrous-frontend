import { useState, useEffect, forwardRef } from 'react';
import { useRouter } from 'next/router';
import TaskSubtasks from 'components/Common/TaskSubtask';
import { TaskApplicationList } from 'components/Common/TaskApplication';
import TaskSubmission from 'components/Common/TaskSubmission';
import { usePodBoard } from 'utils/hooks';
import { ENTITIES_TYPES, PERMISSIONS, TASK_STATUS_REQUESTED } from 'utils/constants';
import MilestoneTasks from 'components/Common/MilestoneTask';
import CommentList from 'components/Comment';
import { useLazyQuery } from '@apollo/client';
import { GET_SUBTASK_COUNT_FOR_TASK } from 'graphql/queries';
import {
  TaskModalFooter,
  TaskSectionFooterTitleDiv,
  TaskSubmissionTab,
  TaskTabText,
  TaskSectionContent,
  TabItemCount,
} from './styles';
import { tabs } from './constants';
import { selectTabsPerType } from './utils';

interface Props {
  fullScreen: boolean;
  isTaskProposal: boolean;
  isMilestone: boolean;
  isSubtask: boolean;
  isBounty: boolean;
  activeTab: string;
  setActiveTab: (tab) => any;
  fetchedTask: any;
  taskApplicationCount: number | null;
  canApply: boolean;
  canClaim: boolean;
  canViewApplications: boolean;
  board: any;
  boardColumns: any;
  permissions: any[];
  user: any;
  taskSubmissionsForTask: any;
  getTaskSubmissionsForTask: any;
  handleClose: () => any;
  setFetchedTask: (task) => any;
  setShowPaymentModal: (value: boolean) => any;
  taskSubmissionsForTaskLoading: boolean;
  entityType: string;
}

const TaskViewModalFooter = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const [getSubtaskCount, { data: subTaskCountData }] = useLazyQuery(GET_SUBTASK_COUNT_FOR_TASK);
  const {
    fullScreen,
    isTaskProposal,
    isMilestone,
    isSubtask,
    isBounty,
    activeTab,
    setActiveTab,
    fetchedTask,
    taskApplicationCount,
    canApply,
    canClaim,
    canViewApplications,
    board,
    boardColumns,
    permissions,
    user,
    taskSubmissionsForTask,
    getTaskSubmissionsForTask,
    handleClose,
    setFetchedTask,
    setShowPaymentModal,
    taskSubmissionsForTaskLoading,
    entityType,
  } = props;

  const podBoard = usePodBoard();
  const router = useRouter();
  useEffect(() => {
    if (isMilestone) {
      setActiveTab(tabs.tasks);
    } else if (isTaskProposal || router?.query?.taskCommentId || router?.query?.milestoneCommentId) {
      setActiveTab(tabs.discussion);
    } else {
      setActiveTab(tabs.submissions);
    }
  }, [isMilestone, isTaskProposal, router?.query?.taskCommentId, router?.query?.milestoneCommentId]);

  useEffect(() => {
    if (fetchedTask?.id && !isSubtask) {
      getSubtaskCount({
        variables: {
          taskId: fetchedTask?.id,
        },
      });
    }
  }, [fetchedTask?.id, isSubtask]);
  const canCreate =
    permissions.includes(PERMISSIONS.CREATE_TASK) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    fetchedTask?.createdBy === user?.id;

  const subTaskCount = subTaskCountData?.getSubtaskCountForTask?.total;
  const canMoveProgress =
    (podBoard && permissions.includes(PERMISSIONS.MANAGE_BOARD)) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    fetchedTask?.createdBy === user?.id ||
    (fetchedTask?.assigneeId && fetchedTask?.assigneeId === user?.id);

  const canReview = permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.REVIEW_TASK);
  if (!process.env.NEXT_PUBLIC_PRODUCTION) {
    // console.log('permission context in task modal', userPermissionsContext);
    // console.log('user permissions in task modal', permissions);
    // console.log('canEdit', canEdit);
    // console.log('can Review', canReview);
  }

  const canSubmit = fetchedTask?.assigneeId === user?.id || isBounty;

  return (
    <TaskModalFooter fullScreen={fullScreen}>
      <TaskSectionFooterTitleDiv>
        {selectTabsPerType(isTaskProposal, isMilestone, isSubtask, isBounty).map((tab, index) => {
          const active = tab === activeTab;
          return (
            <TaskSubmissionTab key={index} isActive={active} onClick={() => setActiveTab(tab)}>
              <TaskTabText isActive={active}>
                {tab}{' '}
                {tab === tabs.discussion && <TabItemCount isActive={active}>{fetchedTask?.commentCount}</TabItemCount>}
                {tab === tabs.subTasks && <TabItemCount isActive={active}>{subTaskCount}</TabItemCount>}
              </TaskTabText>
            </TaskSubmissionTab>
          );
        })}
      </TaskSectionFooterTitleDiv>
      <TaskSectionContent ref={ref}>
        {activeTab === tabs.applications && fetchedTask?.id && (
          <TaskApplicationList
            count={taskApplicationCount}
            task={fetchedTask}
            canApply={canApply}
            canClaim={canClaim}
            canViewApplications={canViewApplications}
          />
        )}
        {activeTab === tabs.submissions && (
          <TaskSubmission
            assigneeProfilePicture={fetchedTask?.profilePicture}
            assigneeUsername={fetchedTask?.assigneeUsername}
            board={board}
            boardColumns={boardColumns}
            canMoveProgress={canMoveProgress}
            canReview={canReview}
            canSubmit={canSubmit}
            fetchedTask={fetchedTask}
            fetchedTaskSubmissions={taskSubmissionsForTask?.getTaskSubmissionsForTask}
            getTaskSubmissionsForTask={getTaskSubmissionsForTask}
            handleClose={handleClose}
            isBounty={isBounty}
            orgId={fetchedTask?.orgId}
            setFetchedTask={setFetchedTask}
            setShowPaymentModal={setShowPaymentModal}
            taskId={fetchedTask?.id}
            taskSubmissionLoading={taskSubmissionsForTaskLoading}
          />
        )}
        {activeTab === tabs.subTasks && <TaskSubtasks taskId={fetchedTask?.id} canCreate={canCreate} />}
        {activeTab === tabs.discussion && <CommentList task={fetchedTask} entityType={entityType} />}
        {activeTab === tabs.tasks && !!fetchedTask && <MilestoneTasks canCreate={canCreate} milestone={fetchedTask} />}
      </TaskSectionContent>
    </TaskModalFooter>
  );
});

TaskViewModalFooter.displayName = 'TaskViewModalFooter';
export default TaskViewModalFooter;
