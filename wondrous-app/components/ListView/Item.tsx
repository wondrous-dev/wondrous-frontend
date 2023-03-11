import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { useMe } from 'components/Auth/withAuth';
import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import { ButtonPrimary } from 'components/Common/button';
import Compensation from 'components/Common/Compensation';
import DeleteEntityModal from 'components/Common/DeleteEntityModal';
import Dropdown from 'components/Common/Dropdown';
import DropdownItem from 'components/Common/DropdownItem';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import MakePaymentModal from 'components/Common/Payment/PaymentModal';
import SmartLink from 'components/Common/SmartLink';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { ArchivedTaskUndo, DueDateText } from 'components/Common/Task/styles';
import { CreateEntity } from 'components/CreateEntity';
import { Claim } from 'components/Icons/claimTask';
import { SubtaskLightIcon } from 'components/Icons/subtask';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import Tooltip from 'components/Tooltip';
import { format } from 'date-fns';
import { ARCHIVE_TASK, UNARCHIVE_TASK, UPDATE_TASK_ASSIGNEE } from 'graphql/mutations/task';
import { GET_USER_PERMISSION_CONTEXT, SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import { GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { useRouter } from 'next/router';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import palette from 'theme/palette';
import { delQuery } from 'utils';
import {
  ENTITIES_TYPES,
  PAGE_PATHNAME,
  PERMISSIONS,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_REVIEW,
  TASK_TYPE,
} from 'utils/constants';
import { parseUserPermissionContext, transformTaskToTaskCard } from 'utils/helpers';

import { ARCHIVE_MILESTONE, UNARCHIVE_MILESTONE } from 'graphql/mutations';
import {
  ListViewItemActions,
  ListViewItemBodyWrapper,
  ListViewItemDataContainer,
  ListViewItemIconsWrapper,
  MoreOptions,
  Type,
} from './styles';

function ListViewItem({ task, entityType, isDragDisabled }) {
  const router = useRouter();
  const showTaskType = router.pathname === PAGE_PATHNAME.search_result;
  const [data, setData] = useState(task);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const [editTask, setEditTask] = useState(false);
  const [archiveTask, setArchiveTask] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const user = useMe();
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);

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
      let approvedTaskSubmission = null;
      taskSubmissions?.map((taskSubmission) => {
        if (taskSubmission?.approvedAt) {
          approvedTaskSubmission = taskSubmission;
          setApprovedSubmission(taskSubmission);
        }
      });
      if (approvedTaskSubmission) {
        setShowPaymentModal(true);
      } else {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage('Need to make a submission to pay');
        setSnackbarAlertSeverity('error');
      }
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: (err) => {},
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

  const taskType = useMemo(() => {
    if (entityType === ENTITIES_TYPES.MILESTONE) {
      return ENTITIES_TYPES.MILESTONE;
    }
    return isProposal ? 'taskProposal' : 'task';
  }, [isProposal]);

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

  const [archiveMilestoneMutation, { data: archiveMilestoneData }] = useMutation(ARCHIVE_MILESTONE, {
    refetchQueries: [
      'getMilestoneById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getOrgBoardMilestones',
      'getPodBoardMilestones',
      SEARCH_USER_CREATED_TASKS,
    ],
  });
  const [unarchiveMilestoneMutation, { data: unarchiveMilestoneData }] = useMutation(UNARCHIVE_MILESTONE, {
    refetchQueries: [
      'getMilestoneById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getOrgBoardMilestones',
      'getPodBoardMilestones',
      'getMilestoneById',
      SEARCH_USER_CREATED_TASKS,
    ],
  });

  const handleUnarchive = () => {
    setSnackbarAlertOpen(false);

    if (entityType === ENTITIES_TYPES.MILESTONE) {
      return unarchiveMilestoneMutation({
        variables: {
          milestoneId: id,
        },
      });
    }
    return unarchiveTaskMutation({
      variables: {
        taskId: id,
      },
    });
  };

  const handleMutation = () => {
    if (entityType === ENTITIES_TYPES.MILESTONE) {
      return archiveMilestoneMutation({
        variables: {
          milestoneId: id,
        },
      });
    }
    return archiveTaskMutation({
      variables: {
        taskId: id,
      },
    });
  };
  const handleOnArchive = () => {
    handleMutation().then((result) => {
      setData(null);
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(
        <>
          Task archived successfully! <ArchivedTaskUndo onClick={handleUnarchive}>Undo</ArchivedTaskUndo>
        </>
      );
    });
  };

  const handleGoBackToTask = () => {
    setShowPaymentModal(false);
    getTaskSubmissionsForTask({
      variables: {
        taskId: task?.id,
      },
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
      <DeleteEntityModal
        open={deleteTask}
        onClose={() => {
          setDeleteTask(false);
        }}
        entityType={type}
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
            const query = {
              ...router.query,
              [taskType]: task?.id,
            };

            router.push({ query }, undefined, { scroll: false, shallow: true });
          }
        }}
      >
        {showPaymentModal ? (
          <MakePaymentModal
            handleGoBack={handleGoBackToTask}
            open={showPaymentModal}
            submissionOrApplication={approvedSubmission}
            handleClose={() => {}}
            setShowPaymentModal={setShowPaymentModal}
            taskOrGrant={task}
          />
        ) : null}

        <ListViewItemBodyWrapper isDragDisabled={isDragDisabled}>
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
                alt="Assignee profile picture"
              />
            ) : (
              <DefaultUserImage
                style={{
                  minWidth: '26px',
                  minHeight: '26px',
                  borderRadius: '13px',
                  marginRight: '4px',
                }}
              />
            )}
            <Typography
              sx={{
                color: palette.white,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '15px',
                paddingRight: '5px',
              }}
            >
              {title}
            </Typography>
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
            {rewards && rewards?.length > 0 && <Compensation rewards={rewards} />}
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
            {!assigneeId && status !== TASK_STATUS_DONE && task.type === TASK_TYPE && !task?.isProposal && (
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
                        Edit {entityType || 'task'}
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
                        Archive {entityType || 'task'}
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
                          Delete {entityType || 'task'}
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

export default memo(ListViewItem);
