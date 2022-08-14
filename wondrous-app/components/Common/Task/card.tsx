import TaskCardMemo from 'components/Common/Task/TaskCardMemo';
// eslint-disable-next-line import/no-named-as-default
import TaskProposalCardMemo from 'components/Common/Task/TaskProposalCardMemo';
import { useState } from 'react';

import { parseUserPermissionContext } from 'utils/helpers';
import palette from 'theme/palette';
import { getProposalStatus } from 'utils/board';
import * as Constants from 'utils/constants';
import { useRouter } from 'next/router';
import { useColumns, useUserProfile } from 'utils/hooks';
import { PERMISSIONS } from 'utils/constants';
import { GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useLocation } from 'utils/useLocation';

let windowOffset = 0;

export function TaskCard({
  id,
  task,
  isMilestone,
  userList,
  isSubtask,
  rewards,
  type,
  createdBy,
  isBounty,
  viewUrl,
  goToPod,
  assigneeId,
  updateTaskAssignee,
  user,
  commentCount,
  canArchive,
  setEditTask,
  setArchiveTask,
  canDelete,
  setDeleteTask,
  boardType,
}) {
  const location = useLocation();
  const boardColumns = useColumns();
  const [claimed, setClaimed] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const totalSubtask = task?.totalSubtaskCount;
  const [displayActions, setDisplayActions] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isTaskSubmissionLoading, setTaskSubmissionLoading] = useState(false);
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const coverMedia = task?.media?.find((media) => media.type === 'image');
  const userProfile = useUserProfile();

  const router = useRouter();
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const userPermissionsContext = userPermissionsContextData?.getUserPermissionContext
    ? JSON.parse(userPermissionsContextData?.getUserPermissionContext)
    : null;

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  });

  const hasPermissionToPay =
    permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);
  const [getTaskSubmissionsForTask] = useLazyQuery(GET_TASK_SUBMISSIONS_FOR_TASK, {
    onCompleted: (data) => {
      const taskSubmissions = data?.getTaskSubmissionsForTask;
      taskSubmissions?.map((taskSubmission) => {
        if (taskSubmission?.approvedAt) {
          setApprovedSubmission(taskSubmission);
        }
      });
      setTaskSubmissionLoading(false);
      setShowPaymentModal(true);
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      setTaskSubmissionLoading(false);
    },
  });

  // refactor this. move this logic in a separate hook
  const displayPayButton =
    !!task?.approvedSubmissionsCount &&
    task?.status === Constants.TASK_STATUS_DONE &&
    hasPermissionToPay &&
    (!task.paymentStatus || task.paymentStatus === 'unpaid') &&
    task?.rewards?.length > 0;

  const handlePaymentModal = () => {
    getTaskSubmissionsForTask({
      variables: {
        taskId: task?.id,
      },
    });
  };
  const isUser = boardType === Constants.BOARD_TYPE.assignee;
  const isPod = boardType === Constants.BOARD_TYPE.pod;

  const canClaim =
    task?.taskApplicationPermissions?.canClaim &&
    !assigneeId &&
    !isBounty &&
    !isMilestone &&
    task?.status !== Constants.TASK_STATUS_DONE;
  const canApply = !canClaim && task?.taskApplicationPermissions?.canApply;

  const onNavigate = (e) => {
    // TODO refactor this
    if (!showPaymentModal && !isApplicationModalOpen) {
      location.push(viewUrl);
      windowOffset = window.scrollY;
      document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
    }
  };

  return (
    <TaskCardMemo
      approvedSubmission={approvedSubmission}
      boardColumns={boardColumns}
      canApply={canApply}
      canArchive={canArchive}
      canClaim={canClaim}
      canDelete={canDelete}
      claimed={claimed}
      commentCount={commentCount}
      coverMedia={coverMedia}
      createdBy={createdBy}
      displayActions={displayActions}
      displayPayButton={displayPayButton}
      getTaskSubmissionsForTask={getTaskSubmissionsForTask}
      goToPod={goToPod}
      handlePaymentModal={handlePaymentModal}
      id={id}
      isBounty={isBounty}
      isMilestone={isMilestone}
      isPod={isPod}
      isSubtask={isSubtask}
      isTaskSubmissionLoading={isTaskSubmissionLoading}
      isUser={isUser}
      onNavigate={onNavigate}
      rewards={rewards}
      router={router}
      setArchiveTask={setArchiveTask}
      setClaimed={setClaimed}
      setDeleteTask={setDeleteTask}
      setDisplayActions={setDisplayActions}
      setEditTask={setEditTask}
      setIsApplicationModalOpen={setIsApplicationModalOpen}
      setShowPaymentModal={setShowPaymentModal}
      showPaymentModal={showPaymentModal}
      task={task}
      totalSubtask={totalSubtask}
      type={type}
      updateTaskAssignee={updateTaskAssignee}
      user={user}
      userList={userList}
      userProfile={userProfile}
      viewUrl={viewUrl}
    />
  );
}

export function ProposalCard({ openModal, title, description, task, goToPod, proposalRequestChange, viewUrl }) {
  const coverMedia = task?.media?.find((media) => media.type === 'image');

  const proposalStatus = getProposalStatus(task);
  const PROPOSAL_STATUS_MAP = {
    [Constants.STATUS_APPROVED]: {
      labelsAndActions: [
        {
          title: 'Approved',
          borderColor: palette.green800,
          color: palette.green800,
        },
      ],
    },
    // [Constants.STATUS_OPEN]: {
    //   labelsAndActions: [
    //     {
    //       title: 'Reject',
    //       action: () => {
    //         if (proposalRequestChange) {
    //           proposalRequestChange(task.id, proposalStatus);
    //         }
    //       },
    //     },
    //   ],
    // },
    [Constants.STATUS_CLOSED]: {
      labelsAndActions: [
        {
          title: 'Rejected',
          borderColor: palette.red300,
          color: palette.red300,
        },
      ],
    },
  };
  const labelsAndActions = PROPOSAL_STATUS_MAP[proposalStatus]?.labelsAndActions;
  const location = useLocation();

  return (
    <TaskProposalCardMemo
      coverMedia={coverMedia}
      description={description}
      goToPod={goToPod}
      labelsAndActions={labelsAndActions}
      proposalStatus={proposalStatus}
      task={task}
      title={title}
      viewUrl={viewUrl}
      onNavigate={() => {
        location.push(viewUrl);
        windowOffset = window.scrollY;
        document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
      }}
    />
  );
}
export default function Card(props) {
  const { task } = props;
  return task.isProposal ? <ProposalCard {...props} /> : <TaskCard {...props} />;
}
