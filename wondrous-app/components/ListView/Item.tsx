import { useState, useContext } from 'react';
import { Chevron } from 'components/Icons/sections';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListViewItemHeader,
  ListViewItemCount,
  ListViewItemStatus,
  IconWrapper,
  ListViewItemBodyWrapper,
  ListViewItemDataContainer,
  ListViewItemIconsWrapper,
  ListViewItemActions,
} from './styles';
import {
  TASK_STATUS_TODO,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_DONE,
  ENTITIES_TYPES,
  PERMISSIONS,
  PAYMENT_STATUS,
} from 'utils/constants';
import { ToDo, InProgress, Done, InReview } from 'components/Icons';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateLayoutBaseModal from 'components/CreateEntity/createEntityModal';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { SubtaskLightIcon } from 'components/Icons/subtask';
import { Grey57 } from 'theme/colors';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { Compensation } from 'components/Common/Compensation';
import { format } from 'date-fns';
import { DueDateText, ActionButton } from 'components/Common/Task/styles';
import { Claim } from 'components/Icons/claimTask';
import { parseUserPermissionContext } from 'utils/helpers';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { useMutation } from '@apollo/client';
import { updateInProgressTask, updateTaskItem } from 'utils/board';
import { UPDATE_TASK_ASSIGNEE, ARCHIVE_TASK, UNARCHIVE_TASK } from 'graphql/mutations/task';
import { transformTaskToTaskCard } from 'utils/helpers';
import { useMe } from 'components/Auth/withAuth';
import SmartLink from 'components/Common/SmartLink';
import { delQuery } from 'utils';
import { useRouter } from 'next/router';
import { useLocation } from 'utils/useLocation';
import { MakePaymentModal } from 'components/Common/Payment/PaymentModal';
import EditLayoutBaseModal from 'components/CreateEntity/editEntityModal';
import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import { DeleteTaskModal } from 'components/Common/DeleteTaskModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';

export default function ListViewItem({ task, entityType }) {
  let windowOffset = 0;
  const router = useRouter();
  const [data, setData] = useState(task);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isTaskSubmissionLoading, setTaskSubmissionLoading] = useState(false);
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const [editTask, setEditTask] = useState(false);
  const [archiveTask, setArchiveTask] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const user = useMe();
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

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
    paymentStatus,
    id,
    assigneeId,
    isProposal,
    status,
  } = data;

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
    orgId: orgId,
    podId: podId,
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

  console.log(status);
  const displayPayButton =
    !!approvedSubmissionsCount &&
    task?.status === TASK_STATUS_DONE &&
    hasPermissionToPay &&
    (!task.paymentStatus || task.paymentStatus === 'unpaid') &&
    task?.rewards?.length > 0;

  const taskType = isProposal ? 'taskProposal' : 'task';

  let viewUrl = `${delQuery(router.asPath)}?${taskType}=${task?.id}&view=${router.query.view || 'grid'}`;

  if (entityType) {
    viewUrl = viewUrl + `&entity=${entityType}`;
  }

  return (
    <>
      <CreateModalOverlay
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={editTask}
        onClose={() => {
          setEditTask(false);
        }}
      >
        <EditLayoutBaseModal
          open={open}
          entityType={data?.type}
          handleClose={() => {
            setEditTask(false);
          }}
          cancelEdit={() => setEditTask(false)}
          existingTask={{
            ...data,
          }}
          isTaskProposal={false}
        />
      </CreateModalOverlay>
      <ArchiveTaskModal
        open={archiveTask}
        onClose={() => setArchiveTask(false)}
        onArchive={() => {}}
        taskType={data?.type}
        taskId={task?.id}
      />
      <DeleteTaskModal
        open={deleteTask}
        onClose={() => {
          setDeleteTask(false);
        }}
        taskType={task?.type}
        taskId={task?.id}
        onDelete={() => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(`Deleted successfully!`);
        }}
      />

      <SmartLink
        href={viewUrl}
        preventLinkNavigation
        onNavigate={() => {
          if (!showPaymentModal) {
            location.push(viewUrl);
            windowOffset = window.scrollY;
            document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
          }
        }}
      >
        {showPaymentModal && !isTaskSubmissionLoading ? (
          <MakePaymentModal
            getTaskSubmissionsForTask={getTaskSubmissionsForTask}
            open={showPaymentModal}
            approvedSubmission={approvedSubmission}
            handleClose={() => {}}
            setShowPaymentModal={setShowPaymentModal}
            fetchedTask={task}
          />
        ) : null}

        <ListViewItemBodyWrapper>
          <ListViewItemDataContainer>
            {assigneeProfilePicture ? (
              <SafeImage
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '13px',
                  marginRight: '4px',
                }}
                src={assigneeProfilePicture}
              />
            ) : (
              <DefaultUserImage
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '13px',
                  marginRight: '4px',
                }}
              />
            )}
            {title}
            {!!totalSubtaskCount && (
              <ListViewItemIconsWrapper>
                <SubtaskLightIcon fill="none" stroke={Grey57} height="30" width="30" viewBox="0 3 20 20" />
                {totalSubtaskCount}
              </ListViewItemIconsWrapper>
            )}
            {!!commentCount && (
              <ListViewItemIconsWrapper>
                <TaskCommentIcon />
                {commentCount}
              </ListViewItemIconsWrapper>
            )}
          </ListViewItemDataContainer>
          <ListViewItemActions>
            {dueDate && <DueDateText>{format(new Date(dueDate), 'MMM d')}</DueDateText>}
            {rewards && rewards?.length > 0 && <Compensation pillStyle={{ padding: '10px' }} rewards={rewards} />}
            {displayPayButton && (
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaymentModal();
                }}
              >
                Pay
              </ActionButton>
            )}
            {!assigneeId && status !== TASK_STATUS_DONE && (
              <>
                {claimed ? (
                  <ActionButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Claimed
                  </ActionButton>
                ) : (
                  <ActionButton
                    style={{
                      marginRight: '8px',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      claimAction(id);
                      setClaimed(true);
                    }}
                  >
                    <Claim />
                    <span
                      style={{
                        marginLeft: '4px',
                      }}
                    >
                      Claim
                    </span>
                  </ActionButton>
                )}
              </>
            )}
            {status === TASK_STATUS_IN_REVIEW && <ActionButton type="button">Review</ActionButton>}
          </ListViewItemActions>
        </ListViewItemBodyWrapper>
      </SmartLink>
    </>
  );
}
