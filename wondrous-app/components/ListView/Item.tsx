import ItemMemo from 'components/ListView/ItemMemo';
import useTaskActions from 'hooks/useTaskActions';
import { useState, useContext, useEffect } from 'react';
import { TASK_STATUS_DONE, ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext, transformTaskToTaskCard } from 'utils/helpers';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { UPDATE_TASK_ASSIGNEE, ARCHIVE_TASK, UNARCHIVE_TASK } from 'graphql/mutations/task';
import { useMe } from 'components/Auth/withAuth';
import { delQuery } from 'utils';
import { useRouter } from 'next/router';
import { useLocation } from 'utils/useLocation';

export default function ListViewItem({ task, entityType }) {
  let windowOffset = 0;
  const router = useRouter();
  const [data, setData] = useState(task);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isTaskSubmissionLoading, setTaskSubmissionLoading] = useState(false);
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const { editTask, deleteTask, archiveTask } = useTaskActions();
  const [claimed, setClaimed] = useState(false);
  const user = useMe();

  const location = useLocation();
  const {
    assigneeProfilePicture,
    title,
    totalSubtaskCount,
    commentCount,
    rewards,
    dueDate,
    orgId,
    podId,
    approvedSubmissionsCount,
    id,
    assigneeId,
    isProposal,
    type,
    createdBy,
  } = data || {};

  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);

  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const userPermissionsContext = userPermissionsContextData?.getUserPermissionContext
    ? JSON.parse(userPermissionsContextData?.getUserPermissionContext)
    : null;

  const claimAction = (taskId) => {
    updateTaskAssignee({
      variables: {
        taskId,
        assigneeId: user?.id,
      },
      onCompleted: (data) => {
        const task = data?.updateTaskAssignee;
        const transformedTask = transformTaskToTaskCard(task, {});
        setData(transformedTask);
      },
    });
  };

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId,
    podId,
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

  const handlePaymentModal = () => {
    getTaskSubmissionsForTask({
      variables: {
        taskId: id,
      },
    });
  };

  useEffect(() => {
    setData(task);
  }, [task]);

  const canArchive =
    permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    createdBy === user?.id;

  const canDelete = canArchive && (type === ENTITIES_TYPES.TASK || type === ENTITIES_TYPES.MILESTONE);

  const displayPayButton =
    !!approvedSubmissionsCount &&
    task?.status === TASK_STATUS_DONE &&
    hasPermissionToPay &&
    (!task.paymentStatus || task.paymentStatus === 'unpaid') &&
    task?.rewards?.length > 0;

  const taskType = isProposal ? 'taskProposal' : 'task';

  let viewUrl = `${delQuery(router.asPath)}?${taskType}=${task?.id}&view=${router.query.view || 'grid'}`;

  if (entityType) {
    viewUrl += `&entity=${entityType}`;
  }

  return data ? (
    <ItemMemo
      approvedSubmission={approvedSubmission}
      archiveTask={() => archiveTask(task)}
      assigneeId={assigneeId}
      assigneeProfilePicture={assigneeProfilePicture}
      canArchive={canArchive}
      canDelete={canDelete}
      claimAction={claimAction}
      claimed={claimed}
      commentCount={commentCount}
      deleteTask={() => deleteTask(task)}
      displayPayButton={displayPayButton}
      dueDate={dueDate}
      editTask={() => editTask(task)}
      getTaskSubmissionsForTask={getTaskSubmissionsForTask}
      handlePaymentModal={handlePaymentModal}
      id={id}
      isTaskSubmissionLoading={isTaskSubmissionLoading}
      rewards={rewards}
      setClaimed={setClaimed}
      setShowPaymentModal={setShowPaymentModal}
      showPaymentModal={showPaymentModal}
      task={task}
      title={title}
      totalSubtaskCount={totalSubtaskCount}
      viewUrl={viewUrl}
      onNavigate={() => {
        if (!showPaymentModal) {
          location.push(viewUrl);
          windowOffset = window.scrollY;
          document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
        }
      }}
    />
  ) : null;
}
