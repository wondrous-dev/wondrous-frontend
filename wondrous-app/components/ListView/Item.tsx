import { useState, useContext, useEffect } from 'react';
import {
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_DONE,
  ENTITIES_TYPES,
  PERMISSIONS,
  TASK_TYPE,
  PAGE_PATHNAME,
} from 'utils/constants';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { SubtaskLightIcon } from 'components/Icons/subtask';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { Compensation } from 'components/Common/Compensation';
import { format } from 'date-fns';
import { DueDateText, ArchivedTaskUndo } from 'components/Common/Task/styles';
import Tooltip from 'components/Tooltip';
import palette from 'theme/palette';
import { Claim } from 'components/Icons/claimTask';
import { parseUserPermissionContext, transformTaskToTaskCard } from 'utils/helpers';
import { GET_USER_PERMISSION_CONTEXT, SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { UPDATE_TASK_ASSIGNEE, ARCHIVE_TASK, UNARCHIVE_TASK } from 'graphql/mutations/task';
import { useMe } from 'components/Auth/withAuth';
import SmartLink from 'components/Common/SmartLink';
import { delQuery } from 'utils';
import { useRouter } from 'next/router';
import { useLocation } from 'utils/useLocation';
import { MakePaymentModal } from 'components/Common/Payment/PaymentModal';
import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import DeleteTaskModal from 'components/Common/DeleteTaskModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import Dropdown from 'components/Common/Dropdown';
import DropdownItem from 'components/Common/DropdownItem';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import { MoreOptions } from 'components/Table/styles';
import { CreateEntity } from 'components/CreateEntity';
import { ButtonPrimary } from 'components/Common/button';
import {
  ListViewItemBodyWrapper,
  ListViewItemDataContainer,
  ListViewItemIconsWrapper,
  ListViewItemActions,
  Type,
} from './styles';

export default function ListViewItem({ task, entityType }) {
  let windowOffset = 0;
  const router = useRouter();
  const showTaskType = router.pathname === PAGE_PATHNAME.search_result;
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
    type,
    createdBy,
  } = data || {};

  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);

  const [archiveTaskMutation, { data: archiveTaskData }] = useMutation(ARCHIVE_TASK, {
    refetchQueries: [
      'getPerStatusTaskCountForUserBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
      SEARCH_USER_CREATED_TASKS,
    ],
    onError: () => {
      console.error('Something went wrong with archiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });

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

  const [unarchiveTaskMutation, { data: unarchiveTaskData }] = useMutation(UNARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
      SEARCH_USER_CREATED_TASKS,
    ],
    onError: () => {
      console.error('Something went wrong unarchiving tasks');
    },
    onCompleted: (data) => {
      // TODO: Move columns
      setData(data?.unarchiveTask);
    },
  });

  const handleOnArchive = () => {
    archiveTaskMutation({
      variables: {
        taskId: id,
      },
    }).then((result) => {
      setData(null);
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(
        <>
          Task archived successfully!{' '}
          <ArchivedTaskUndo
            onClick={() => {
              setSnackbarAlertOpen(false);
              unarchiveTaskMutation({
                variables: {
                  taskId: id,
                },
              });
            }}
          >
            Undo
          </ArchivedTaskUndo>
        </>
      );
    });
  };

  if (!data) return null;
  return (
    <>
      <CreateEntity
        open={editTask}
        handleCloseModal={() => setEditTask(false)}
        entityType={task?.type}
        handleClose={() => {
          setEditTask(false);
        }}
        cancel={() => setEditTask(false)}
        existingTask={{
          ...task,
        }}
        isTaskProposal={false}
      />
      <ArchiveTaskModal
        open={archiveTask}
        onClose={() => setArchiveTask(false)}
        onArchive={handleOnArchive}
        taskType={type}
        taskId={task?.id}
      />
      <DeleteTaskModal
        open={deleteTask}
        onClose={() => {
          setDeleteTask(false);
        }}
        taskType={type}
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
                useNextImage={false}
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
            {showTaskType && <Type>{task.type}</Type>}
            {!!totalSubtaskCount && (
              <ListViewItemIconsWrapper>
                <SubtaskLightIcon fill="none" stroke={palette.grey57} height="30" width="30" viewBox="0 3 20 20" />
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
              <ButtonPrimary
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaymentModal();
                }}
              >
                Pay
              </ButtonPrimary>
            )}
            {!assigneeId && status !== TASK_STATUS_DONE && task.type === TASK_TYPE && (
              <>
                {claimed ? (
                  <ButtonPrimary
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Claimed
                  </ButtonPrimary>
                ) : (
                  <ButtonPrimary
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      claimAction(id);
                      setClaimed(true);
                    }}
                    startIcon={<Claim />}
                  >
                    Claim
                  </ButtonPrimary>
                )}
              </>
            )}
            {status === TASK_STATUS_IN_REVIEW && <ButtonPrimary>Review</ButtonPrimary>}
            {canArchive && (
              <MoreOptions>
                <Tooltip title="More actions" placement="top">
                  <div>
                    <Dropdown DropdownHandler={TaskMenuIcon} fill="#1F1F1F">
                      <DropdownItem
                        onClick={() => {
                          setEditTask(true);
                        }}
                        color="#C4C4C4"
                        fontSize="13px"
                        fontWeight="normal"
                        textAlign="left"
                      >
                        Edit task
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setArchiveTask(true);
                        }}
                        color="#C4C4C4"
                        fontSize="13px"
                        fontWeight="normal"
                        textAlign="left"
                      >
                        Archive task
                      </DropdownItem>
                      {canDelete && (
                        <DropdownItem
                          key={`task-menu-delete-${task.id}`}
                          onClick={() => {
                            setDeleteTask(true);
                          }}
                          color={palette.red800}
                          fontSize="13px"
                          fontWeight="normal"
                          textAlign="left"
                        >
                          Delete task
                        </DropdownItem>
                      )}
                    </Dropdown>
                  </div>
                </Tooltip>
              </MoreOptions>
            )}
          </ListViewItemActions>
        </ListViewItemBodyWrapper>
      </SmartLink>
    </>
  );
}
