import { Badge } from '@mui/material';
import { CommentList } from 'components/Comment';
import MilestoneTasks from 'components/Common/MilestoneTask';
import { TaskApplicationList } from 'components/Common/TaskApplication';
import TaskSubmission from 'components/Common/TaskSubmission';
import TaskSubtasks from 'components/Common/TaskSubtask';
import { useRouter } from 'next/router';
import { forwardRef, useEffect } from 'react';
import { PERMISSIONS, TASK_STATUS_REQUESTED } from 'utils/constants';
import { useHotkey, usePodBoard } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { tabs } from './constants';
import {
  TaskModalFooter,
  TaskSectionContent,
  TaskSectionFooterTitleDiv,
  TaskSubmissionTab,
  TaskTabText,
} from './styles';
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
}

const TaskViewModalFooter = forwardRef<HTMLDivElement, Props>((props, ref) => {
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
  } = props;

  const podBoard = usePodBoard();
  const router = useRouter();
  useEffect(() => {
    if (isMilestone) {
      setActiveTab(tabs.tasks);
    } else if (isTaskProposal || router?.query?.taskCommentId) {
      setActiveTab(tabs.discussion);
    } else {
      setActiveTab(tabs.submissions);
    }
  }, [isMilestone, isTaskProposal, router?.query?.taskCommentId]);
  const showBadge = useHotkey();
  const canCreate =
    permissions.includes(PERMISSIONS.CREATE_TASK) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    fetchedTask?.createdBy === user?.id;

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
              <Badge
                badgeContent={HOTKEYS.CREATE_COMMENT}
                color="primary"
                invisible={!showBadge || tab !== 'Discussion'}
              >
                <TaskTabText isActive={active}>{tab}</TaskTabText>
              </Badge>
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
        {activeTab === tabs.discussion && (
          <CommentList task={fetchedTask} taskType={isTaskProposal ? TASK_STATUS_REQUESTED : 'task'} />
        )}
        {activeTab === tabs.tasks && !!fetchedTask && <MilestoneTasks canCreate={canCreate} milestone={fetchedTask} />}
      </TaskSectionContent>
    </TaskModalFooter>
  );
});

TaskViewModalFooter.displayName = 'TaskViewModalFooter';
export default TaskViewModalFooter;
