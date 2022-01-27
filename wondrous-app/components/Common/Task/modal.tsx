import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { format, formatDistance } from 'date-fns';
import { useInView } from 'react-intersection-observer';

import {
  PodNameTypography,
  TaskActionMenu,
  TaskModal,
  TaskModalHeader,
  TaskTitleDiv,
  TaskTitleTextDiv,
  TaskTitleText,
  TaskDescriptionText,
  TaskSectionDisplayDiv,
  TaskSectionDisplayLabel,
  TaskSectionDisplayText,
  TaskSectionInfoText,
  TaskSectionInfoDiv,
  TaskModalFooter,
  TaskSectionFooterTitleDiv,
  TaskSubmissionTab,
  TaskTabText,
  TaskSectionContent,
  TaskLink,
  TaskMediaContainer,
  TaskListModalHeader,
  TaskStatusHeaderText,
  ArchivedTaskUndo,
} from './styles';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_TASK_BY_ID, GET_TASK_REVIEWERS, GET_TASK_SUBMISSIONS_FOR_TASK } from '../../../graphql/queries/task';
import { SafeImage } from '../Image';
import {
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskSubmissionToTaskSubmissionCard,
  transformTaskToTaskCard,
} from '../../../utils/helpers';
import { RightCaret } from '../Image/RightCaret';
import CreatePodIcon from '../../Icons/createPod';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks';
import {
  BOUNTY_TYPE,
  ENTITIES_TYPES,
  IMAGE_FILE_EXTENSIONS_TYPE_MAPPING,
  PERMISSIONS,
  STATUS_OPEN,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  MILESTONE_TYPE,
  TASK_STATUS_TODO,
} from '../../../utils/constants';
import { DropDown, DropDownItem } from '../dropdown';
import { TaskMenuIcon } from '../../Icons/taskMenu';
import { White } from '../../../theme/colors';
import { useMe } from '../../Auth/withAuth';
import { GetStatusIcon, renderMentionString } from '../../../utils/common';
import {
  AssigneeIcon,
  ImageIcon,
  LinkIcon,
  NotesIcon,
  ProposerIcon,
  RejectIcon,
  ReviewerIcon,
} from '../../Icons/taskModalIcons';
import DefaultUserImage from '../Image/DefaultUserImage';
import EditLayoutBaseModal from '../../CreateEntity/editEntityModal';
import { ArchiveTaskModal } from '../ArchiveTaskModal';
import { SnackbarAlertContext } from '../SnackbarAlert';
import {
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormPreviewButton,
  CreateModalOverlay,
  TakeTaskButton,
} from '../../CreateEntity/styles';
import { useRouter } from 'next/router';
import { UPDATE_TASK_STATUS, UPDATE_TASK_ASSIGNEE } from '../../../graphql/mutations/task';
import { UPDATE_TASK_PROPOSAL_ASSIGNEE } from '../../../graphql/mutations/taskProposal';
import { GET_PREVIEW_FILE } from '../../../graphql/queries/media';
import { GET_TASK_PROPOSAL_BY_ID } from '../../../graphql/queries/taskProposal';
import { TaskSubmissionContent } from './submission';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_SUBMISSIONS,
  GET_ORG_TASK_BOARD_TASKS,
} from '../../../graphql/queries/taskBoard';
import { AvatarList } from '../AvatarList';
import { APPROVE_TASK_PROPOSAL, REQUEST_CHANGE_TASK_PROPOSAL } from '../../../graphql/mutations/taskProposal';
import {
  addTaskItem,
  removeProposalItem,
  updateInProgressTask,
  updateProposalItem,
  updateTaskItem,
} from '../../../utils/board';
import { flexDivStyle, rejectIconStyle } from '../TaskSummary';
import { CompletedIcon } from '../../Icons/statusIcons';
import { TaskListCard } from '.';
import { LoadMore } from '../KanbanBoard/styles';
import { CommentList } from '../../Comment';
import { DAOIcon } from '../../Icons/dao';
import { OrganisationsCardNoLogo } from '../../profile/about/styles';
import { MilestoneTaskList } from '../MilestoneTaskList';
import { MilestoneTaskBreakdown } from '../MilestoneTaskBreakdown';
import Link from 'next/link';
import { TaskList } from '../TaskList';

export const MediaLink = (props) => {
  const { media, style } = props;
  const [getPreviewFile, { data, loading, error }] = useLazyQuery(GET_PREVIEW_FILE, {
    fetchPolicy: 'network-only',
  });
  const fileUrl = data?.getPreviewFile?.url;
  useEffect(() => {
    if (media?.slug) {
      getPreviewFile({
        variables: {
          path: media?.slug,
        },
      });
    }
  }, [media?.slug, getPreviewFile]);
  return (
    <TaskLink style={style} href={fileUrl} target="_blank">
      {media?.name}
    </TaskLink>
  );
};

const LIMIT = 10;

export const TaskListViewModal = (props) => {
  const [fetchedList, setFetchedList] = useState([]);
  const { taskType, entityType, orgId, podId, open, handleClose, count } = props;
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(false);
  const [getOrgTaskProposals, { refetch: refetchOrgProposals, fetchMore: fetchMoreOrgProposals }] = useLazyQuery(
    GET_ORG_TASK_BOARD_PROPOSALS,
    {
      onCompleted: (data) => {
        const proposals = data?.getOrgTaskBoardProposals;
        setFetchedList(proposals);
        setHasMore(data?.hasMore || data?.getOrgTaskBoardProposals.length >= 1);
      },
    }
  );
  const [getOrgTaskSubmissions, { refetch: refetchOrgSubmissions, fetchMore: fetchMoreOrgSubmissions }] = useLazyQuery(
    GET_ORG_TASK_BOARD_SUBMISSIONS,
    {
      onCompleted: (data) => {
        const submissions = data?.getOrgTaskBoardSubmissions;
        setFetchedList(submissions);
        setHasMore(data?.hasMore || data?.getOrgTaskBoardSubmissions.length >= 1);
      },
    }
  );

  const [getOrgArchivedTasks, { refetch: refetchOrgArchivedTasks, fetchMore: fetchMoreOrgArchivedTasks }] =
    useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
      onCompleted: (data) => {
        const tasks = data?.getOrgTaskBoardTasks;
        setFetchedList(tasks);
        setHasMore(data?.hasMore || data?.getOrgTaskBoardTasks.length >= LIMIT);
      },
    });

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      if (taskType === TASK_STATUS_REQUESTED) {
        if (entityType === ENTITIES_TYPES.ORG) {
          fetchMoreOrgProposals({
            variables: {
              offset: fetchedList.length,
              limit: LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getOrgTaskBoardProposals.length >= LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getOrgTaskBoardProposals: prev.getOrgTaskBoardProposals.concat(
                  fetchMoreResult.getOrgTaskBoardProposals
                ),
              };
            },
          }).catch((error) => {
            console.error(error);
          });
        }
      } else if (taskType === TASK_STATUS_IN_REVIEW) {
        if (entityType === ENTITIES_TYPES.ORG) {
          fetchMoreOrgSubmissions({
            variables: {
              offset: fetchedList.length,
              limit: LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getOrgTaskBoardSubmissions.length >= LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }

              return {
                hasMore,
                getOrgTaskBoardSubmissions: prev.getOrgTaskBoardSubmissions.concat(
                  fetchMoreResult.getOrgTaskBoardSubmissions
                ),
              };
            },
          });
        }
      } else if (taskType === TASK_STATUS_ARCHIVED) {
        if (entityType === ENTITIES_TYPES.ORG) {
          fetchMoreOrgArchivedTasks({
            variables: {
              statuses: ['archived'],
              offset: fetchedList.length,
              limit: LIMIT,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getOrgTaskBoardTasks.length >= LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getOrgTaskBoardTasks: prev.getOrgTaskBoardTasks.concat(fetchMoreResult.getOrgTaskBoardTasks),
              };
            },
          });
        }
      }
    }
  }, [
    hasMore,
    entityType,
    fetchMoreOrgProposals,
    taskType,
    fetchedList?.length,
    fetchMoreOrgArchivedTasks,
    fetchMoreOrgSubmissions,
  ]);

  const listInnerRef = useRef();
  useEffect(() => {
    if (open) {
      if (fetchedList?.length === 0 && !hasMore) {
        if (taskType === TASK_STATUS_REQUESTED) {
          if (entityType === ENTITIES_TYPES.ORG) {
            getOrgTaskProposals({
              variables: {
                orgId,
                statuses: [STATUS_OPEN],
              },
            });
          }
        } else if (taskType === TASK_STATUS_IN_REVIEW) {
          if (entityType === ENTITIES_TYPES.ORG) {
            getOrgTaskSubmissions({
              variables: {
                orgId,
                statuses: [STATUS_OPEN],
              },
            });
          }
        } else if (taskType === TASK_STATUS_ARCHIVED) {
          if (entityType === ENTITIES_TYPES.ORG) {
            getOrgArchivedTasks({
              variables: {
                orgId,
                statuses: ['archived'],
                offset: 0,
                limit: LIMIT,
              },
            });
          }
        }
      }
      if (inView && hasMore) {
        handleLoadMore();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, taskType, entityType, inView, open]);

  let text = '';
  let refetch;
  if (taskType === TASK_STATUS_REQUESTED) {
    text = 'Proposals';
    refetch = refetchOrgProposals;
  } else if (taskType === TASK_STATUS_IN_REVIEW) {
    text = 'Submissions';
    refetch = refetchOrgSubmissions;
  } else if (taskType === TASK_STATUS_ARCHIVED) {
    text = 'Tasks';
    refetch = refetchOrgSubmissions;
  }
  return (
    <CreateModalOverlay
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={() => {
        handleClose();
      }}
    >
      <TaskModal>
        <TaskListModalHeader>
          {count} {text}
        </TaskListModalHeader>
        <div
          style={{
            paddingBottom: '30px',
          }}
        >
          {fetchedList?.map((task, index) => {
            return <TaskListCard key={task?.id} taskType={taskType} task={task} />;
          })}
          <LoadMore ref={ref} hasMore={hasMore}></LoadMore>
        </div>
      </TaskModal>
    </CreateModalOverlay>
  );
};
export const TaskViewModal = (props) => {
  const { open, handleClose, task, taskId, isTaskProposal, back } = props;
  const [fetchedTask, setFetchedTask] = useState(null);
  const [fetchedTaskSubmissions, setFetchedTaskSubmissions] = useState([]);
  const [fetchedTaskComments, setFetchedTaskComments] = useState([]);
  const [taskSubmissionLoading, setTaskSubmissionLoading] = useState(!isTaskProposal);
  const [makeSubmission, setMakeSubmission] = useState(false);
  const isMilestone = task?.type === MILESTONE_TYPE;

  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard || userBoard;
  const boardColumns = useColumns();
  const [getTaskSubmissionsForTask] = useLazyQuery(GET_TASK_SUBMISSIONS_FOR_TASK, {
    onCompleted: (data) => {
      const taskSubmissions = data?.getTaskSubmissionsForTask;
      setFetchedTaskSubmissions(taskSubmissions || []);
      setTaskSubmissionLoading(false);
    },
    fetchPolicy: 'network-only',
    onError: (err) => {
      console.log('err', err);
      setTaskSubmissionLoading(false);
    },
  });
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  const [updateTaskProposalAssignee] = useMutation(UPDATE_TASK_PROPOSAL_ASSIGNEE);
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [requestChangeTaskProposal] = useMutation(REQUEST_CHANGE_TASK_PROPOSAL);
  const router = useRouter();
  const [editTask, setEditTask] = useState(false);
  const [submissionSelected, setSubmissionSelected] = useState(isTaskProposal ? false : true);
  const [archiveTask, setArchiveTask] = useState(false);
  const [archiveTaskAlert, setArchiveTaskAlert] = useState(false);
  const [initialStatus, setInitialStatus] = useState('');
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [getReviewers, { data: reviewerData }] = useLazyQuery(GET_TASK_REVIEWERS);
  const user = useMe();
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext || null;
  const [getTaskById] = useLazyQuery(GET_TASK_BY_ID, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    onCompleted: (data) => {
      const taskData = data?.getTaskById;
      if (taskData) {
        setFetchedTask(
          transformTaskToTaskCard(taskData, {
            orgProfilePicture: taskData?.org?.profilePicture,
            orgName: taskData?.org?.name,
            podName: taskData?.pod?.name,
          })
        );
      }
    },
  });

  const [getTaskProposalById] = useLazyQuery(GET_TASK_PROPOSAL_BY_ID, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    onCompleted: (data) => {
      const taskProposalData = data?.getTaskProposalById;
      if (taskProposalData) {
        setFetchedTask(transformTaskProposalToTaskProposalCard(taskProposalData, {}));
      }
    },
  });

  const [updateTaskStatusMutation, { data: updateTaskStatusMutationData }] = useMutation(UPDATE_TASK_STATUS, {
    refetchQueries: () => [
      {
        query: GET_TASK_BY_ID,
        variables: {
          taskId: fetchedTask?.id,
        },
      },
      'getPerStatusTaskCountForOrgBoard',
    ],
    onError: () => {
      console.error('Something went wrong.');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });

  const handleNewStatus = useCallback(
    (newStatus) => {
      updateTaskStatusMutation({
        variables: {
          taskId: fetchedTask?.id,
          input: {
            newStatus,
          },
        },
      });
    },
    [fetchedTask, updateTaskStatusMutation]
  );

  useEffect(() => {
    if (!initialStatus) {
      setInitialStatus(fetchedTask?.status);
    }

    if (updateTaskStatusMutationData?.updateTaskStatus.status === TASK_STATUS_ARCHIVED) {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(
        <>
          Task archived successfully!{' '}
          <ArchivedTaskUndo
            onClick={() => {
              handleNewStatus(initialStatus);
              setSnackbarAlertOpen(false);
            }}
          >
            Undo
          </ArchivedTaskUndo>
        </>
      );
    }
  }, [
    initialStatus,
    setInitialStatus,
    fetchedTask,
    updateTaskStatusMutationData,
    setSnackbarAlertOpen,
    setSnackbarAlertMessage,
    handleNewStatus,
  ]);
  useEffect(() => {
    if (open) {
      if (isTaskProposal) {
        setTaskSubmissionLoading(false);
        setSubmissionSelected(false);
      }
      if (!task && taskId) {
        if (isTaskProposal) {
          getTaskProposalById({
            variables: {
              proposalId: taskId,
            },
          });
        } else {
          getTaskById({
            variables: {
              taskId,
            },
          });
        }
      } else if (task) {
        setFetchedTask(task);
      }

      if (fetchedTask) {
        if (!isTaskProposal) {
          getReviewers({
            variables: {
              taskId: fetchedTask?.id,
            },
          });
          getTaskSubmissionsForTask({
            variables: {
              taskId: fetchedTask?.id,
            },
          });
        }
      }
    }
    // if (boardOrg) {
    //   setOrgBoard(boardOrg)
    // }
  }, [
    taskId,
    task,
    getTaskById,
    fetchedTask,
    userPermissionsContext,
    user?.id,
    getReviewers,
    getTaskSubmissionsForTask,
    isTaskProposal,
    getTaskProposalById,
    open,
  ]);
  const BackToListStyle = {
    color: White,
    width: '100%',
    textAlign: 'right',
    marginRight: '8px',
    textDecoration: 'underline',
    cursor: 'pointer',
  };
  if (editTask) {
    return (
      <>
        <CreateModalOverlay
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={open}
          onClose={() => {
            setEditTask(false);
            handleClose();
          }}
        >
          <EditLayoutBaseModal
            open={open}
            entityType={isMilestone ? ENTITIES_TYPES.MILESTONE : ENTITIES_TYPES.TASK}
            handleClose={() => {
              setEditTask(false);
              handleClose();
            }}
            cancelEdit={() => setEditTask(false)}
            existingTask={
              fetchedTask && {
                ...fetchedTask,
                reviewers: reviewerData?.getTaskReviewers || [],
              }
            }
            isTaskProposal={isTaskProposal}
          />
        </CreateModalOverlay>
      </>
    );
  }

  const canSubmit = fetchedTask?.assigneeId === user?.id;
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: fetchedTask?.orgId,
    podId: fetchedTask?.podId,
  });

  const canCreate =
    permissions.includes(PERMISSIONS.CREATE_TASK) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    fetchedTask?.createdBy === user?.id;
  const canEdit =
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    fetchedTask?.createdBy === user?.id ||
    (fetchedTask?.assigneeId && fetchedTask?.assigneeId === user?.id);
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
  const displayDivProfileImageStyle = {
    width: '26px',
    height: '26px',
    borderRadius: '13px',
    marginRight: '4px',
    cursor: 'pointer',
  };
  const canApproveProposal =
    permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.CREATE_TASK);
  const dropdownItemStyle = {
    marginRight: '12px',
  };
  const isMilestone = task?.type === MILESTONE_TYPE;

  const onCorrectPage =
    fetchedTask?.orgId === board?.orgId || fetchedTask?.podId === board?.podId || fetchedTask?.userId === board?.userId;
  return (
    <>
      <ArchiveTaskModal open={archiveTask} onClose={() => setArchiveTask(false)} onArchive={handleNewStatus} />
      <Modal open={open} onClose={handleClose}>
        <TaskModal>
          <TaskModalHeader>
            {fetchedTask?.orgProfilePicture ? (
              <SafeImage
                src={fetchedTask?.orgProfilePicture}
                style={{
                  width: '29px',
                  height: '28px',
                  borderRadius: '4px',
                  marginRight: '8px',
                }}
              />
            ) : (
              <OrganisationsCardNoLogo style={{ height: '29px', width: '28px' }}>
                <DAOIcon />
              </OrganisationsCardNoLogo>
            )}
            {fetchedTask?.podName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <PodNameTypography>{fetchedTask?.podName}</PodNameTypography>
              </div>
            )}
            {back && (
              <>
                <PodNameTypography style={BackToListStyle} onClick={handleClose}>
                  Back to list
                </PodNameTypography>
              </>
            )}
            {canEdit && fetchedTask?.status !== TASK_STATUS_DONE && (
              <TaskActionMenu right="true">
                <DropDown DropdownHandler={TaskMenuIcon}>
                  <DropDownItem
                    key={'task-menu-edit-' + fetchedTask?.id}
                    onClick={() => setEditTask(true)}
                    style={dropdownItemStyle}
                  >
                    Edit {isTaskProposal ? 'task proposal' : isMilestone ? 'milestone' : 'task'}
                  </DropDownItem>
                  {!isTaskProposal && (
                    <DropDownItem
                      key={'task-menu-archive-' + fetchedTask?.id}
                      onClick={() => {
                        setArchiveTask(true);
                      }}
                      style={dropdownItemStyle}
                    >
                      Archive {isMilestone ? 'milestone' : 'task'}
                    </DropDownItem>
                  )}
                </DropDown>
              </TaskActionMenu>
            )}
          </TaskModalHeader>
          <TaskTitleDiv>
            <GetStatusIcon
              status={fetchedTask?.status}
              style={{
                marginRight: '12px',
              }}
            />
            <TaskTitleTextDiv>
              <TaskTitleText>{fetchedTask?.title}</TaskTitleText>
              <TaskDescriptionText>
                {renderMentionString({
                  content: fetchedTask?.description,
                  router,
                })}
              </TaskDescriptionText>
            </TaskTitleTextDiv>
          </TaskTitleDiv>
          {!isTaskProposal && (
            <TaskSectionDisplayDiv>
              <TaskSectionDisplayLabel>
                <ReviewerIcon />
                <TaskSectionDisplayText>Reviewer</TaskSectionDisplayText>
              </TaskSectionDisplayLabel>
              {reviewerData?.getTaskReviewers?.length > 0 ? (
                reviewerData?.getTaskReviewers.map((taskReviewer) => (
                  <TaskSectionInfoDiv key={taskReviewer?.id}>
                    {taskReviewer?.profilePicture ? (
                      <Link href={`/profile/${taskReviewer?.username}/about`} passHref={true}>
                        <SafeImage style={displayDivProfileImageStyle} src={taskReviewer?.profilePicture} />
                      </Link>
                    ) : (
                      <Link href={`/profile/${taskReviewer?.username}/about`} passHref={true}>
                        <DefaultUserImage style={displayDivProfileImageStyle} />
                      </Link>
                    )}
                    <Link href={`/profile/${taskReviewer?.username}/about`} passHref={true}>
                      <TaskSectionInfoText
                        style={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        {taskReviewer?.username}
                      </TaskSectionInfoText>
                    </Link>
                  </TaskSectionInfoDiv>
                ))
              ) : (
                <TaskSectionInfoText
                  style={{
                    marginTop: '8px',
                    marginLeft: '16px',
                  }}
                >
                  None
                </TaskSectionInfoText>
              )}
            </TaskSectionDisplayDiv>
          )}
          {isTaskProposal && (
            <TaskSectionDisplayDiv>
              <TaskSectionDisplayLabel>
                <ProposerIcon />
                <TaskSectionDisplayText>Proposer</TaskSectionDisplayText>
              </TaskSectionDisplayLabel>
              <TaskSectionInfoDiv key={fetchedTask?.creatorUsername}>
                {fetchedTask?.creatorUsername && (
                  <>
                    {fetchedTask?.creatorProfilePicture ? (
                      <SafeImage style={displayDivProfileImageStyle} src={fetchedTask?.creatorProfilePicture} />
                    ) : (
                      <DefaultUserImage style={displayDivProfileImageStyle} />
                    )}
                    <TaskSectionInfoText>{fetchedTask?.creatorUsername}</TaskSectionInfoText>
                  </>
                )}
                {!fetchedTask?.creatorUsername && (
                  <TaskSectionInfoText
                    style={{
                      marginTop: '8px',
                      marginLeft: '16px',
                    }}
                  >
                    None
                  </TaskSectionInfoText>
                )}
              </TaskSectionInfoDiv>
            </TaskSectionDisplayDiv>
          )}
          {!isTaskProposal && (
            <TaskSectionDisplayDiv>
              <TaskSectionDisplayLabel>
                <AssigneeIcon />
                <TaskSectionDisplayText>Assignee</TaskSectionDisplayText>
              </TaskSectionDisplayLabel>
              <TaskSectionInfoDiv key={fetchedTask?.assigneeUsername}>
                {fetchedTask?.assigneeUsername ? (
                  <>
                    {fetchedTask?.assigneeProfilePicture ? (
                      <Link href={`/profile/${fetchedTask?.assigneeUsername}/about`} passHref={true}>
                        <SafeImage style={displayDivProfileImageStyle} src={fetchedTask?.assigneeProfilePicture} />
                      </Link>
                    ) : (
                      <DefaultUserImage style={displayDivProfileImageStyle} />
                    )}
                    <Link href={`/profile/${fetchedTask?.assigneeUsername}/about`} passHref={true}>
                      <TaskSectionInfoText
                        style={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        {fetchedTask?.assigneeUsername}
                      </TaskSectionInfoText>
                    </Link>
                  </>
                ) : (
                  <>
                    {canCreate ? (
                      <>
                        <TakeTaskButton
                          onClick={() => {
                            if (isTaskProposal) {
                              updateTaskProposalAssignee({
                                variables: {
                                  proposalId: fetchedTask?.id,
                                  assigneeId: user?.id,
                                },
                                onCompleted: (data) => {
                                  const taskProposal = data?.updateTaskProposalAssignee;
                                  if (boardColumns?.setColumns && onCorrectPage) {
                                    const transformedTaskProposal = transformTaskProposalToTaskProposalCard(
                                      taskProposal,
                                      {}
                                    );
                                    let columns = [...boardColumns?.columns];
                                    columns = updateProposalItem(transformedTaskProposal, columns);
                                    boardColumns?.setColumns(columns);
                                  }
                                },
                              });
                            } else {
                              updateTaskAssignee({
                                variables: {
                                  taskId: fetchedTask?.id,
                                  assigneeId: user?.id,
                                },
                                onCompleted: (data) => {
                                  const task = data?.updateTaskAssignee;
                                  const transformedTask = transformTaskToTaskCard(task, {});
                                  if (boardColumns?.setColumns && onCorrectPage) {
                                    let columnNumber = 0;
                                    if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
                                      columnNumber = 1;
                                    }
                                    let columns = [...boardColumns?.columns];
                                    if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
                                      columns = updateInProgressTask(transformedTask, columns);
                                    } else if (transformedTask.status === TASK_STATUS_TODO) {
                                      columns = updateTaskItem(transformedTask, columns);
                                    }
                                    boardColumns.setColumns(columns);
                                  }
                                },
                              });
                            }
                          }}
                        >
                          Self-assign this task
                        </TakeTaskButton>
                      </>
                    ) : (
                      <TaskSectionInfoText
                        style={{
                          marginLeft: '4px',
                          marginTop: '8px',
                        }}
                      >
                        None
                      </TaskSectionInfoText>
                    )}
                  </>
                )}
              </TaskSectionInfoDiv>
            </TaskSectionDisplayDiv>
          )}
          <TaskSectionDisplayDiv>
            <TaskSectionDisplayLabel>
              <ImageIcon />
              <TaskSectionDisplayText>Media</TaskSectionDisplayText>
            </TaskSectionDisplayLabel>
            {Array.isArray(fetchedTask?.media) && fetchedTask?.media.length > 0 ? (
              <TaskMediaContainer>
                {Array.isArray(fetchedTask?.media) &&
                  fetchedTask?.media.map((mediaItem) => <MediaLink key={mediaItem?.slug} media={mediaItem} />)}
              </TaskMediaContainer>
            ) : (
              <TaskSectionInfoText
                style={{
                  marginLeft: '32px',
                  marginTop: '8px',
                }}
              >
                None
              </TaskSectionInfoText>
            )}
          </TaskSectionDisplayDiv>
          <TaskSectionDisplayDiv>
            <TaskSectionDisplayLabel>
              <AssigneeIcon />
              <TaskSectionDisplayText>Due date</TaskSectionDisplayText>
            </TaskSectionDisplayLabel>
            <TaskSectionInfoText
              style={{
                marginTop: '8px',
                marginLeft: '16px',
              }}
            >
              {fetchedTask?.dueDate ? format(new Date(fetchedTask?.dueDate), 'MM/dd/yyyy') : 'None'}
            </TaskSectionInfoText>
          </TaskSectionDisplayDiv>
          {isMilestone && <MilestoneTaskBreakdown milestoneId={task?.id} open={open} />}
          {isTaskProposal && (
            <CreateFormFooterButtons>
              {fetchedTask?.changeRequestedAt && (
                <>
                  <div style={flexDivStyle}>
                    <RejectIcon style={rejectIconStyle} />
                    <TaskStatusHeaderText>Change requested</TaskStatusHeaderText>
                  </div>
                  <div
                    style={{
                      flex: 1,
                    }}
                  />
                </>
              )}
              {fetchedTask?.approvedAt && (
                <>
                  <div style={flexDivStyle}>
                    <CompletedIcon style={rejectIconStyle} />
                    <TaskStatusHeaderText>Approved</TaskStatusHeaderText>
                  </div>
                  <div
                    style={{
                      flex: 1,
                    }}
                  />
                </>
              )}
              {canApproveProposal && !fetchedTask?.approvedAt && (
                <CreateFormButtonsBlock>
                  <CreateFormCancelButton
                    onClick={() => {
                      requestChangeTaskProposal({
                        variables: {
                          proposalId: fetchedTask?.id,
                        },
                        onCompleted: () => {
                          let columns = [...boardColumns?.columns];
                          // Move from proposal to task
                          columns = updateProposalItem(
                            {
                              ...fetchedTask,
                              changeRequestedAt: new Date(),
                            },
                            columns
                          );
                          boardColumns?.setColumns(columns);
                        },
                        refetchQueries: ['GetOrgTaskBoardProposals'],
                      });
                    }}
                  >
                    Request changes
                  </CreateFormCancelButton>
                  <CreateFormPreviewButton
                    onClick={() => {
                      approveTaskProposal({
                        variables: {
                          proposalId: fetchedTask?.id,
                        },
                        onCompleted: (data) => {
                          const taskProposal = data?.approveTaskProposal;
                          let columns = [...boardColumns?.columns];
                          // Move from proposal to task
                          columns = removeProposalItem(fetchedTask?.id, columns);
                          columns = addTaskItem(
                            {
                              ...fetchedTask,
                              id: taskProposal?.associatedTaskId,
                            },
                            columns
                          );
                          boardColumns?.setColumns(columns);
                          document.body.setAttribute('style', `position: relative;`);
                          handleClose();
                        },
                        refetchQueries: ['GetOrgTaskBoardProposals', 'getPerStatusTaskCountForOrgBoard'],
                      });
                    }}
                  >
                    Approve
                  </CreateFormPreviewButton>
                </CreateFormButtonsBlock>
              )}
            </CreateFormFooterButtons>
          )}
          <TaskModalFooter>
            <TaskSectionFooterTitleDiv>
              {!isTaskProposal && (
                <TaskSubmissionTab
                  style={{
                    borderBottom: `2px solid ${submissionSelected ? '#7427FF' : '#4B4B4B'}`,
                  }}
                  onClick={() => setSubmissionSelected(true)}
                >
                  <TaskTabText
                    style={{
                      fontWeight: `${submissionSelected ? '500' : '400'}`,
                    }}
                  >
                    Submissions
                  </TaskTabText>
                </TaskSubmissionTab>
              )}
              {!isMilestone && (
                <TaskSubmissionTab
                  style={{
                    borderBottom: `2px solid ${!submissionSelected ? '#7427FF' : '#4B4B4B'}`,
                  }}
                  onClick={() => setSubmissionSelected(false)}
                >
                  <TaskTabText
                    style={{
                      fontWeight: `${!submissionSelected ? '500' : '400'}`,
                    }}
                  >
                    Discussion
                  </TaskTabText>
                </TaskSubmissionTab>
              )}
              {isMilestone && (
                <TaskSubmissionTab
                  style={{
                    borderBottom: `2px solid ${!submissionSelected ? '#7427FF' : '#4B4B4B'}`,
                  }}
                  onClick={() => setSubmissionSelected(false)}
                >
                  <TaskTabText
                    style={{
                      fontWeight: `${!submissionSelected ? '500' : '400'}`,
                    }}
                  >
                    Tasks
                  </TaskTabText>
                </TaskSubmissionTab>
              )}
            </TaskSectionFooterTitleDiv>
            <TaskSectionContent>
              {submissionSelected && (
                <TaskSubmissionContent
                  taskId={fetchedTask?.id}
                  taskSubmissionLoading={taskSubmissionLoading}
                  canSubmit={canSubmit}
                  fetchedTask={fetchedTask}
                  handleClose={handleClose}
                  setFetchedTask={setFetchedTask}
                  updateTaskStatus={updateTaskStatus}
                  fetchedTaskSubmissions={fetchedTaskSubmissions}
                  board={board}
                  boardColumns={boardColumns}
                  canMoveProgress={canMoveProgress}
                  canReview={canReview}
                  assigneeUsername={fetchedTask?.assigneeUsername}
                  assigneeProfilePicture={fetchedTask?.profilePicture}
                  makeSubmission={makeSubmission}
                  setMakeSubmission={setMakeSubmission}
                  orgId={fetchedTask?.orgId}
                  setFetchedTaskSubmissions={setFetchedTaskSubmissions}
                />
              )}
              {!submissionSelected && !isMilestone && (
                <CommentList task={fetchedTask} taskType={isTaskProposal ? TASK_STATUS_REQUESTED : 'task'} />
              )}
              {!submissionSelected && isMilestone && (
                <MilestoneTaskList milestoneId={task?.id} open={!submissionSelected} />
              )}
            </TaskSectionContent>
          </TaskModalFooter>
        </TaskModal>
      </Modal>
    </>
  );
};
