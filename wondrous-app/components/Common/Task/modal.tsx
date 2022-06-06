import React, { useContext, useCallback, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { format, formatDistance } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';

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
  TaskIconWrapper,
  SubtaskIconWrapper,
  RightArrow,
  RightArrowWrapper,
  TaskUserDiv,
  MakeSubmissionDiv,
  TaskListModalContentWrapper,
  Tag,
} from './styles';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_TASK_BY_ID, GET_TASK_REVIEWERS, GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { SafeImage } from '../Image';
import {
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
} from 'utils/helpers';
import TagsIcon from '../../Icons/tagsIcon';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import {
  BOUNTY_TYPE,
  ENTITIES_TYPES,
  PERMISSIONS,
  STATUS_OPEN,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_DONE,
  MILESTONE_TYPE,
  TASK_TYPE,
  TASK_STATUS_TODO,
  PRIVACY_LEVEL,
  STATUS_APPROVED,
  LINK,
} from 'utils/constants';
import { DropDown, DropDownItem } from '../dropdown';
import { TaskMenuIcon } from '../../Icons/taskMenu';
import { Red400, Red800, White } from '../../../theme/colors';
import { useMe } from '../../Auth/withAuth';
import { GetStatusIcon, renderMentionString } from 'utils/common';

import Tooltip from 'components/Tooltip';
import {
  AssigneeIcon,
  ImageIcon,
  MilestoneIcon,
  ProposerIcon,
  RejectIcon,
  ReviewerIcon,
  TokenIcon,
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
import {
  UPDATE_TASK_STATUS,
  UPDATE_TASK_ASSIGNEE,
  ARCHIVE_TASK,
  UNARCHIVE_TASK,
  COMPLETE_MILESTONE,
  COMPLETE_BOUNTY,
} from 'graphql/mutations/task';
import { UPDATE_TASK_PROPOSAL_ASSIGNEE } from 'graphql/mutations/taskProposal';
import { GET_PREVIEW_FILE } from 'graphql/queries/media';
import { GET_TASK_PROPOSAL_BY_ID } from 'graphql/queries/taskProposal';
import { TaskSubmissionContent } from './submission';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_SUBMISSIONS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_SUBMISSIONS,
  GET_POD_TASK_BOARD_TASKS,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_SUBMISSIONS,
  GET_USER_TASK_BOARD_TASKS,
} from 'graphql/queries/taskBoard';

import { APPROVE_TASK_PROPOSAL, REQUEST_CHANGE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import {
  addTaskItem,
  removeProposalItem,
  updateInProgressTask,
  updateProposalItem,
  updateTaskItem,
  getProposalStatus,
  updateInReviewItem,
  updateCompletedItem,
} from 'utils/board';
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
import PodIcon from '../../Icons/podIcon';
import { CompensationAmount, CompensationPill, IconContainer } from '../Compensation/styles';

import { MakePaymentModal } from '../Payment/PaymentModal';
import { ApprovedSubmissionContext } from 'utils/contexts';
import { TaskSubtasks } from '../TaskSubtask';
import { SubtaskDarkIcon } from '../../Icons/subtask';
import { CheckedBoxIcon } from '../../Icons/checkedBox';

import { DeleteTaskModal } from '../DeleteTaskModal';
import { Share } from '../Share';
import { CompleteModal } from '../CompleteModal';
import { GET_ORG_LABELS } from 'graphql/queries';
import { ToggleBoardPrivacyIcon } from '../PrivateBoardIcon';
import { CreateEntity } from 'components/CreateEntity';

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

const LIMIT = 5;

const TASK_LIST_VIEW_LIMIT = 5;

export const TaskListViewModal = (props) => {
  const [fetchedList, setFetchedList] = useState([]);
  const { taskType, entityType, orgId, podId, loggedInUserId, open, handleClose, count } = props;

  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(true);
  const [getOrgTaskProposals, { refetch: refetchOrgProposals, fetchMore: fetchMoreOrgProposals }] = useLazyQuery(
    GET_ORG_TASK_BOARD_PROPOSALS,
    {
      onCompleted: (data) => {
        const proposals = data?.getOrgTaskBoardProposals;
        setFetchedList(proposals);
        if (hasMore) {
          setHasMore(data?.hasMore || data?.getOrgTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT);
        }
      },
    }
  );
  const [getOrgTaskSubmissions, { refetch: refetchOrgSubmissions, fetchMore: fetchMoreOrgSubmissions }] = useLazyQuery(
    GET_ORG_TASK_BOARD_SUBMISSIONS,
    {
      onCompleted: (data) => {
        const submissions = data?.getOrgTaskBoardSubmissions;
        setFetchedList(submissions);
        if (hasMore) {
          setHasMore(data?.hasMore || data?.getOrgTaskBoardSubmissions.length >= TASK_LIST_VIEW_LIMIT);
        }
      },
    }
  );

  const [getOrgArchivedTasks, { refetch: refetchOrgArchivedTasks, fetchMore: fetchMoreOrgArchivedTasks }] =
    useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
      onCompleted: (data) => {
        const tasks = data?.getOrgTaskBoardTasks;
        setFetchedList(tasks);
        setHasMore(data?.hasMore || data?.getOrgTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT);
      },
    });
  const [getPodTaskProposals, { fetchMore: fetchMorePodProposals }] = useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const tasks = data?.getPodTaskBoardProposals;
      setFetchedList(tasks);
      setHasMore(data?.hasMore || data?.getPodTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT);
    },
  });

  const [getPodTaskSubmissions, { fetchMore: fetchMorePodTaskSubmissions }] = useLazyQuery(
    GET_POD_TASK_BOARD_SUBMISSIONS,
    {
      onCompleted: (data) => {
        const tasks = data?.getPodTaskBoardSubmissions;
        setFetchedList(tasks);
        setHasMore(data?.hasMore || data?.getPodTaskBoardSubmissions?.length >= TASK_LIST_VIEW_LIMIT);
      },
    }
  );

  const [getPodArchivedTasks, { fetchMore: fetchMorePodArchivedTasks }] = useLazyQuery(GET_POD_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      const tasks = data?.getPodTaskBoardTasks;
      setFetchedList(tasks);
      setHasMore(data?.hasMore || data?.getPodTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT);
    },
  });

  const [getUserTaskBoardProposals, { fetchMore: fetchMoreUserTaskProposals }] = useLazyQuery(
    GET_USER_TASK_BOARD_PROPOSALS,
    {
      onCompleted: (data) => {
        const tasks = data?.getUserTaskBoardProposals;
        setFetchedList(tasks);
        setHasMore(data?.hasMore || tasks?.length >= TASK_LIST_VIEW_LIMIT);
      },
    }
  );

  const [getUserTaskBoardSubmissions, { fetchMore: fetchMoreUserTaskSubmissions }] = useLazyQuery(
    GET_USER_TASK_BOARD_SUBMISSIONS,
    {
      onCompleted: (data) => {
        const tasks = data?.getUserTaskBoardSubmissions;
        setFetchedList(tasks);
        setHasMore(data?.hasMore || tasks?.length >= TASK_LIST_VIEW_LIMIT);
      },
    }
  );

  const [getUserArchivedTasks, { fetchMore: fetchMoreUserArchivedTasks }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardTasks;
      setFetchedList(tasks);
      setHasMore(data?.hasMore || tasks?.length >= LIMIT);
    },
  });

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      if (taskType === TASK_STATUS_REQUESTED) {
        if (entityType === ENTITIES_TYPES.ORG) {
          fetchMoreOrgProposals({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getOrgTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT;
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
        } else if (entityType === ENTITIES_TYPES.POD) {
          fetchMorePodProposals({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getPodTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getPodTaskBoardProposals: prev.getPodTaskBoardProposals.concat(
                  fetchMoreResult.getPodTaskBoardProposals
                ),
              };
            },
          });
        } else if (entityType === ENTITIES_TYPES.USER) {
          fetchMoreUserTaskProposals({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getUserTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getUserTaskBoardProposals: prev.getUserTaskBoardProposals.concat(
                  fetchMoreResult.getUserTaskBoardProposals
                ),
              };
            },
          });
        }
      } else if (taskType === TASK_STATUS_IN_REVIEW) {
        if (entityType === ENTITIES_TYPES.ORG) {
          fetchMoreOrgSubmissions({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getOrgTaskBoardSubmissions.length >= TASK_LIST_VIEW_LIMIT;
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
        } else if (entityType === ENTITIES_TYPES.POD) {
          fetchMorePodTaskSubmissions({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getPodTaskBoardSubmissions.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }

              return {
                hasMore,
                getPodTaskBoardSubmissions: prev.getPodTaskBoardSubmissions.concat(
                  fetchMoreResult.getPodTaskBoardSubmissions
                ),
              };
            },
          });
        } else if (entityType === ENTITIES_TYPES.USER) {
          fetchMoreUserTaskSubmissions({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getUserTaskBoardSubmissions.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }

              return {
                hasMore,
                getUserTaskBoardSubmissions: prev.getUserTaskBoardSubmissions.concat(
                  fetchMoreResult.getUserTaskBoardSubmissions
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
              limit: TASK_LIST_VIEW_LIMIT,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getOrgTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT;
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
        } else if (entityType === ENTITIES_TYPES.POD) {
          fetchMorePodArchivedTasks({
            variables: {
              statuses: ['archived'],
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getPodTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getPodTaskBoardTasks: prev.getPodTaskBoardTasks.concat(fetchMoreResult.getPodTaskBoardTasks),
              };
            },
          });
        } else if (entityType === ENTITIES_TYPES.USER) {
          fetchMoreUserArchivedTasks({
            variables: {
              statuses: ['archived'],
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getUserTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getUserTaskBoardTasks: prev.getUserTaskBoardTasks.concat(fetchMoreResult.getUserTaskBoardTasks),
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

  useEffect(() => {
    if (open) {
      if (fetchedList?.length === 0) {
        if (taskType === TASK_STATUS_REQUESTED) {
          if (entityType === ENTITIES_TYPES.ORG) {
            getOrgTaskProposals({
              variables: {
                orgId,
                statuses: [STATUS_OPEN],
              },
            });
          } else if (entityType === ENTITIES_TYPES.POD) {
            getPodTaskProposals({
              variables: {
                input: {
                  podId,
                  statuses: [STATUS_OPEN],
                },
              },
            });
          } else if (entityType === ENTITIES_TYPES.USER) {
            getUserTaskBoardProposals({
              variables: {
                userId: loggedInUserId,
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
          } else if (entityType === ENTITIES_TYPES.POD) {
            getPodTaskSubmissions({
              variables: {
                input: {
                  podId,
                  statuses: [STATUS_OPEN],
                },
              },
            });
          } else if (entityType === ENTITIES_TYPES.USER) {
            getUserTaskBoardSubmissions({
              variables: {
                userId: loggedInUserId,
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
                limit: TASK_LIST_VIEW_LIMIT,
              },
            });
          } else if (entityType === ENTITIES_TYPES.POD) {
            getPodArchivedTasks({
              variables: {
                input: {
                  podId,
                  statuses: ['archived'],
                  offset: 0,
                  limit: TASK_LIST_VIEW_LIMIT,
                },
              },
            });
          } else if (entityType === ENTITIES_TYPES.USER) {
            getUserArchivedTasks({
              variables: {
                userId: loggedInUserId,
                statuses: ['archived'],
                offset: 0,
                limit: TASK_LIST_VIEW_LIMIT,
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
  } else if (taskType === TASK_STATUS_IN_REVIEW) {
    text = 'Submissions';
  } else if (taskType === TASK_STATUS_ARCHIVED) {
    text = 'Tasks';
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
        <TaskListModalContentWrapper>
          {fetchedList?.map((task, index) => {
            return <TaskListCard key={task?.id} taskType={taskType} task={task} />;
          })}
          <LoadMore ref={ref} hasMore={hasMore}></LoadMore>
        </TaskListModalContentWrapper>
      </TaskModal>
    </CreateModalOverlay>
  );
};

const tabs = {
  submissions: 'Submissions',
  subTasks: 'Subtasks',
  discussion: 'Discussion',
  tasks: 'Tasks',
};

const tabsPerType = {
  proposalTabs: [tabs.discussion],
  milestoneTabs: [tabs.tasks, tabs.discussion],
  subtaskTabs: [tabs.submissions, tabs.discussion],
  taskTabs: [tabs.submissions, tabs.subTasks, tabs.discussion],
};

const selectTabsPerType = (isTaskProposal, isMilestone, isSubtask) => {
  if (isTaskProposal) return tabsPerType.proposalTabs;
  if (isMilestone) return tabsPerType.milestoneTabs;
  if (isSubtask) return tabsPerType.subtaskTabs;
  return tabsPerType.taskTabs;
};

interface ITaskListModalProps {
  open: boolean;
  handleClose: () => any;
  taskId: string;
  isTaskProposal?: boolean;
  back?: boolean;
  disableEnforceFocus?: boolean;
  shouldFocusAfterRender?: boolean;
}

const CreatorBlock = ({ profilePicture, username, createdAt, isTaskProposal, handleClose, router }) => {
  return (
    <MakeSubmissionDiv
      style={{
        marginBottom: '16px',
      }}
    >
      <TaskSectionInfoDiv
        style={{
          marginTop: 0,
          width: '100%',
          cursor: 'pointer',
        }}
        onClick={() => {
          handleClose();
          router.push(`/profile/${username}/about`, undefined, {
            shallow: true,
          });
        }}
      >
        <>
          {profilePicture ? (
            <SafeImage
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '13px',
                marginRight: '4px',
              }}
              src={profilePicture}
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
          <TaskSectionInfoText
            style={{
              fontSize: '14px',
              color: White,
              fontWeight: 'regular',
            }}
          >
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              {username}
            </span>{' '}
            created this task{isTaskProposal && ' proposal'}
            <span
              style={{
                marginLeft: '16px',
                color: '#c4c4c4',
              }}
            >
              {createdAt &&
                formatDistance(new Date(createdAt), new Date(), {
                  addSuffix: true,
                })}
            </span>
          </TaskSectionInfoText>
        </>
      </TaskSectionInfoDiv>
    </MakeSubmissionDiv>
  );
};
export const TaskViewModal = (props: ITaskListModalProps) => {
  const { open, handleClose, taskId, isTaskProposal, back } = props;
  const [fetchedTask, setFetchedTask] = useState(null);
  const [fetchedTaskSubmissions, setFetchedTaskSubmissions] = useState([]);
  const [fetchedTaskComments, setFetchedTaskComments] = useState([]);
  const [taskSubmissionLoading, setTaskSubmissionLoading] = useState(!isTaskProposal);
  const [makeSubmission, setMakeSubmission] = useState(false);
  const isMilestone = fetchedTask?.type === MILESTONE_TYPE;
  const isSubtask = fetchedTask?.parentTaskId !== null;
  const isBounty = fetchedTask?.type === BOUNTY_TYPE;
  const entityType = isTaskProposal ? ENTITIES_TYPES.PROPOSAL : fetchedTask?.type;
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const getUserPermissionContext = useCallback(() => {
    return orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  }, [orgBoard, userBoard, podBoard]);
  const getBoard = useCallback(() => {
    return orgBoard || podBoard || userBoard;
  }, [orgBoard, userBoard, podBoard]);
  const board = getBoard();

  const userPermissionsContext = getUserPermissionContext();
  const boardColumns = useColumns();
  const [getTaskSubmissionsForTask] = useLazyQuery(GET_TASK_SUBMISSIONS_FOR_TASK, {
    onCompleted: (data) => {
      const taskSubmissions = data?.getTaskSubmissionsForTask;
      setFetchedTaskSubmissions(taskSubmissions || []);
      setTaskSubmissionLoading(false);
    },
    fetchPolicy: 'network-only',
    onError: (err) => {
      setTaskSubmissionLoading(false);
    },
  });
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  const [updateTaskProposalAssignee] = useMutation(UPDATE_TASK_PROPOSAL_ASSIGNEE);
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [requestChangeTaskProposal] = useMutation(REQUEST_CHANGE_TASK_PROPOSAL);
  const [completeMilestone] = useMutation(COMPLETE_MILESTONE, {
    refetchQueries: () => [
      'getTaskById',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
    ],
  });
  const [completeBounty] = useMutation(COMPLETE_BOUNTY, {
    refetchQueries: () => [
      'getTaskById',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
    ],
  });
  const [completeModal, setCompleteModal] = useState(false);
  const router = useRouter();
  const [editTask, setEditTask] = useState(false);

  const [activeTab, setActiveTab] = useState(null);
  const [archiveTask, setArchiveTask] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [initialStatus, setInitialStatus] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [getReviewers, { data: reviewerData }] = useLazyQuery(GET_TASK_REVIEWERS);
  const [getOrgLabels, { data: orgLabelsData }] = useLazyQuery(GET_ORG_LABELS, {
    fetchPolicy: 'cache-and-network',
  });
  const user = useMe();

  const [getTaskById] = useLazyQuery(GET_TASK_BY_ID, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
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
    onError: () => {
      console.error('Error fetching task');
    },
  });

  const [getTaskProposalById] = useLazyQuery(GET_TASK_PROPOSAL_BY_ID, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const taskProposalData = data?.getTaskProposalById;
      if (taskProposalData) {
        setFetchedTask(transformTaskProposalToTaskProposalCard(taskProposalData, {}));
      }
    },
    onError: () => {
      console.error('Error fetching task proposal');
    },
  });

  useEffect(() => {
    if (fetchedTask) {
      getOrgLabels({
        variables: {
          orgId: fetchedTask.orgId,
        },
      });
    }
  }, [fetchedTask]);

  const [archiveTaskMutation, { data: archiveTaskData }] = useMutation(ARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
    ],
    onError: () => {
      console.error('Something went wrong with archiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });
  const [unarchiveTaskMutation, { data: unarchiveTaskData }] = useMutation(UNARCHIVE_TASK, {
    refetchQueries: [
      'getTaskById',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getOrgTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForPodBoard',
    ],
    onError: () => {
      console.error('Something went wrong unarchiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });

  const completeCallback = useCallback(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (isMilestone) {
      completeMilestone({
        variables: {
          milestoneId: taskId,
          timezone,
        },
      }).then(() => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage(<>Milestone marked as complete :)</>);
      });
    } else if (isBounty) {
      completeBounty({
        variables: {
          bountyId: taskId,
          timezone,
        },
      }).then(() => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage(<>Bounty marked as complete :)</>);
      });
    }
  }, [taskId, isMilestone, isBounty, setSnackbarAlertOpen, setSnackbarAlertMessage]);

  const handleOnArchive = useCallback(() => {
    archiveTaskMutation({
      variables: {
        taskId: fetchedTask?.id,
      },
    }).then((result) => {
      handleClose();
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(
        <>
          Task archived successfully!{' '}
          <ArchivedTaskUndo
            onClick={() => {
              setSnackbarAlertOpen(false);
              unarchiveTaskMutation({
                variables: {
                  taskId: fetchedTask?.id,
                },
              });
            }}
          >
            Undo
          </ArchivedTaskUndo>
        </>
      );
    });
  }, [
    fetchedTask?.id,
    archiveTaskMutation,
    handleClose,
    setSnackbarAlertOpen,
    unarchiveTaskMutation,
    setSnackbarAlertMessage,
  ]);

  useEffect(() => {
    if (open) {
      if (initialStatus !== TASK_STATUS_ARCHIVED) {
        setInitialStatus(fetchedTask?.status);
      }
    }
  }, [
    initialStatus,
    setInitialStatus,
    fetchedTask,
    setSnackbarAlertOpen,
    setSnackbarAlertMessage,
    archiveTaskData,
    handleClose,
    open,
  ]);

  useEffect(() => {
    if (isMilestone) {
      setActiveTab(tabs.tasks);
    } else if (isTaskProposal || router?.query?.taskCommentId) {
      setActiveTab(tabs.discussion);
    } else {
      setActiveTab(tabs.submissions);
    }
  }, [isMilestone, isTaskProposal, router?.query?.taskCommentId]);

  useEffect(() => {
    if (open) {
      if (!fetchedTask || fetchedTask.id !== taskId) {
        if (isTaskProposal) {
          setTaskSubmissionLoading(false);
          getTaskProposalById({
            variables: {
              proposalId: taskId,
            },
          });
        } else if (!isTaskProposal && taskId) {
          getTaskById({
            variables: {
              taskId,
            },
          });
        }
      }

      if (fetchedTask && !isTaskProposal) {
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
  }, [
    taskId,
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

  useEffect(() => {
    if (open) {
      if (initialStatus !== TASK_STATUS_ARCHIVED) {
        setInitialStatus(fetchedTask?.status);
      }
    }
  }, [
    initialStatus,
    setInitialStatus,
    fetchedTask,
    setSnackbarAlertOpen,
    setSnackbarAlertMessage,
    archiveTaskData,
    handleClose,
    open,
  ]);

  useEffect(() => {
    if (isMilestone) {
      setActiveTab(tabs.tasks);
    } else if (isTaskProposal || router?.query?.taskCommentId) {
      setActiveTab(tabs.discussion);
    } else {
      setActiveTab(tabs.submissions);
    }
  }, [isMilestone, isTaskProposal, router?.query?.taskCommentId]);

  const BackToListStyle = {
    color: White,
    width: '100%',
    textAlign: 'right',
    marginRight: '8px',
    textDecoration: 'underline',
    cursor: 'pointer',
  };
  if (editTask) {
    const newModal = [ENTITIES_TYPES.TASK, ENTITIES_TYPES.MILESTONE, ENTITIES_TYPES.BOUNTY].includes(entityType);
    return (
      <>
        <CreateEntity
          open={open}
          handleCloseModal={() => {
            setEditTask(false);
            setFetchedTask(null);
            handleClose();
          }}
          entityType={entityType}
          handleClose={() => {
            setEditTask(false);
            setFetchedTask(null);
            handleClose();
          }}
          cancel={() => setEditTask(false)}
          existingTask={
            fetchedTask && {
              ...fetchedTask,
              reviewers: reviewerData?.getTaskReviewers || [],
            }
          }
          isTaskProposal={isTaskProposal}
        />
      </>
    );
  }

  if (showPaymentModal && approvedSubmission) {
    return (
      <MakePaymentModal
        getTaskSubmissionsForTask={getTaskSubmissionsForTask}
        open={showPaymentModal}
        handleClose={handleClose}
        approvedSubmission={approvedSubmission}
        setShowPaymentModal={setShowPaymentModal}
        fetchedTask={fetchedTask}
      />
    );
  }
  const canSubmit = fetchedTask?.assigneeId === user?.id || isBounty;
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
  const showAssignee = !isTaskProposal && !isMilestone && !isBounty;
  const canArchive =
    permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    fetchedTask?.createdBy === user?.id;
  const canDelete =
    canArchive && (fetchedTask?.type === ENTITIES_TYPES.TASK || fetchedTask?.type === ENTITIES_TYPES.MILESTONE);
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

  const onCorrectPage =
    fetchedTask?.orgId === board?.orgId || fetchedTask?.podId === board?.podId || fetchedTask?.userId === board?.userId;
  const taskType = isTaskProposal ? 'task proposal' : fetchedTask?.type;
  const handleOnCloseArchiveTaskModal = () => {
    setArchiveTask(false);
    setDeleteTask(false);
    if (isTaskProposal) {
      handleClose();
    }
  };

  const approveProposal = () => {
    approveTaskProposal({
      variables: {
        proposalId: fetchedTask?.id,
      },
      onCompleted: (data) => {
        const taskProposal = data?.approveTaskProposal;

        const fetchedTaskProposalStatus = getProposalStatus(fetchedTask);
        let columns = [...boardColumns?.columns];
        if (board?.entityType) {
          const prevStatusIndex = columns.findIndex((column) => column.status === fetchedTaskProposalStatus);
          const approvedColumnIndex = columns.findIndex((column) => column.status === STATUS_APPROVED);
          columns[prevStatusIndex].tasks = columns[prevStatusIndex].tasks.filter((task) => task.id !== taskProposal.id);
          columns[approvedColumnIndex].tasks = [
            { ...taskProposal, approvedAt: new Date(), __typename: 'TaskProposalCard', isProposal: true },
            ...columns[approvedColumnIndex].tasks,
          ];
        } else {
          // keep it for userboard
          // Move from proposal to task
          columns = addTaskItem(
            transformTaskToTaskCard(
              {
                ...fetchedTask,
                id: taskProposal?.associatedTaskId,
                __typename: 'TaskCard',
                type: 'task',
                parentTaskId: null,
              },
              {}
            ),
            columns
          );
        }
        boardColumns?.setColumns(columns);
        document.body.setAttribute('style', `position: relative;`);
        handleClose();
      },
    });
  };

  const requestProposalChanges = () => {
    requestChangeTaskProposal({
      variables: {
        proposalId: fetchedTask?.id,
      },
      onCompleted: () => {
        let columns = [...board?.columns];
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
    document.body.setAttribute('style', `position: relative;`);
    handleClose();
  };

  return (
    <ApprovedSubmissionContext.Provider
      value={{
        setApprovedSubmission,
      }}
    >
      <>
        <CompleteModal
          open={completeModal}
          onClose={() => {
            setCompleteModal(false);
          }}
          taskType={taskType}
          taskId={fetchedTask?.id}
          onComplete={completeCallback}
        />
        <ArchiveTaskModal
          open={archiveTask}
          onClose={handleOnCloseArchiveTaskModal}
          onArchive={handleOnArchive}
          taskType={taskType}
          taskId={fetchedTask?.id}
        />
        <DeleteTaskModal
          open={deleteTask}
          onClose={() => setDeleteTask(false)}
          taskType={taskType}
          taskId={fetchedTask?.id}
          onDelete={() => {
            handleClose();
            setSnackbarAlertOpen(true);
            setSnackbarAlertMessage(`Deleted successfully!`);
          }}
        />
        <Modal
          open={open}
          onClose={() => {
            setFetchedTask(null);
            handleClose();
          }}
        >
          <TaskModal>
            <TaskModalHeader>
              {fetchedTask?.orgProfilePicture ? (
                <div
                  onClick={() => {
                    handleClose();
                    router.push(`/organization/${fetchedTask?.orgUsername}/boards`, undefined, {
                      shallow: true,
                    });
                  }}
                >
                  <SafeImage
                    src={fetchedTask?.orgProfilePicture}
                    style={{
                      width: '29px',
                      height: '28px',
                      borderRadius: '4px',
                      marginRight: '8px',
                    }}
                  />
                </div>
              ) : (
                <>
                  <OrganisationsCardNoLogo style={{ height: '29px', width: '28px' }}>
                    <DAOIcon />
                  </OrganisationsCardNoLogo>
                </>
              )}
              {fetchedTask?.podName && (
                <>
                  <RightArrowWrapper>
                    <RightArrow />
                  </RightArrowWrapper>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleClose();
                      router.push(`/pod/${fetchedTask?.podId}/boards`, undefined, {
                        shallow: true,
                      });
                    }}
                  >
                    <PodIcon
                      style={{
                        width: '26px',
                        height: '26px',
                        marginRight: '4px',
                        marginLeft: '8px',
                      }}
                      color={fetchedTask?.podColor}
                    />
                    <PodNameTypography>{fetchedTask?.podName}</PodNameTypography>
                  </div>
                </>
              )}
              {fetchedTask?.type === TASK_TYPE && (
                <>
                  <RightArrowWrapper>
                    <RightArrow />
                  </RightArrowWrapper>
                  <Link
                    href={`/organization/${fetchedTask?.orgUsername}/boards?task=${
                      isSubtask ? fetchedTask?.parentTaskId : taskId
                    }`}
                    passHref={true}
                  >
                    <Tooltip title="Task" placement="top">
                      <span>
                        <TaskIconWrapper>
                          <CheckedBoxIcon />
                        </TaskIconWrapper>
                      </span>
                    </Tooltip>
                  </Link>
                </>
              )}
              {isSubtask && fetchedTask?.type === TASK_TYPE && (
                <>
                  <RightArrowWrapper>
                    <RightArrow />
                  </RightArrowWrapper>
                  <SubtaskIconWrapper>
                    <SubtaskDarkIcon />
                  </SubtaskIconWrapper>
                </>
              )}
              <ToggleBoardPrivacyIcon
                isPrivate={fetchedTask?.privacyLevel !== PRIVACY_LEVEL.public}
                tooltipTitle={fetchedTask?.privacyLevel !== PRIVACY_LEVEL.public ? 'Members only' : 'Public'}
              />
              {back && (
                <>
                  <PodNameTypography style={BackToListStyle} onClick={handleClose}>
                    Back to list
                  </PodNameTypography>
                </>
              )}
              <TaskActionMenu right="true">
                <Share
                  url={`${LINK}/organization/${fetchedTask?.orgUsername}/boards?task=${
                    isSubtask ? fetchedTask?.parentTaskId : taskId
                  }`}
                />
                {canEdit && (
                  <Tooltip title="More actions" placement="top">
                    <div>
                      <DropDown DropdownHandler={TaskMenuIcon}>
                        {canEdit && (isMilestone || isBounty) && (
                          <DropDownItem style={dropdownItemStyle} onClick={() => setCompleteModal(true)}>
                            Complete {taskType}
                          </DropDownItem>
                        )}
                        {canEdit && (
                          <DropDownItem
                            key={'task-menu-edit-modal-' + fetchedTask?.id}
                            onClick={() => setEditTask(true)}
                            style={dropdownItemStyle}
                          >
                            Edit {taskType}
                          </DropDownItem>
                        )}
                        {canArchive && !isTaskProposal && (
                          <DropDownItem
                            key={'task-menu-archive-' + fetchedTask?.id}
                            onClick={() => {
                              setArchiveTask(true);
                            }}
                            style={dropdownItemStyle}
                          >
                            Archive {taskType}
                          </DropDownItem>
                        )}
                        {canDelete && (
                          <DropDownItem
                            key={'task-menu-delete-' + fetchedTask?.id}
                            onClick={() => {
                              setDeleteTask(true);
                            }}
                            style={dropdownItemStyle}
                            color={Red800}
                          >
                            Delete {taskType}
                          </DropDownItem>
                        )}
                      </DropDown>
                    </div>
                  </Tooltip>
                )}
              </TaskActionMenu>
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
            {!isTaskProposal && !isMilestone && (
              <TaskSectionDisplayDiv>
                <TaskSectionDisplayLabel>
                  <ReviewerIcon />
                  <TaskSectionDisplayText>Reviewer</TaskSectionDisplayText>
                </TaskSectionDisplayLabel>
                {reviewerData?.getTaskReviewers?.length > 0 ? (
                  reviewerData?.getTaskReviewers.map((taskReviewer) => (
                    <TaskSectionInfoDiv key={taskReviewer?.id}>
                      <TaskUserDiv
                        onClick={() => {
                          handleClose();
                          router.push(`/profile/${taskReviewer?.username}/about`, undefined, {
                            shallow: true,
                          });
                        }}
                      >
                        {taskReviewer?.profilePicture ? (
                          <SafeImage style={displayDivProfileImageStyle} src={taskReviewer?.profilePicture} />
                        ) : (
                          <DefaultUserImage style={displayDivProfileImageStyle} />
                        )}

                        <TaskSectionInfoText
                          style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          {taskReviewer?.username}
                        </TaskSectionInfoText>
                      </TaskUserDiv>
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
            {showAssignee && (
              <TaskSectionDisplayDiv>
                <TaskSectionDisplayLabel>
                  <AssigneeIcon />
                  <TaskSectionDisplayText>Assignee</TaskSectionDisplayText>
                </TaskSectionDisplayLabel>
                <TaskSectionInfoDiv key={fetchedTask?.assigneeUsername}>
                  {fetchedTask?.assigneeUsername ? (
                    <TaskUserDiv
                      onClick={() => {
                        handleClose();
                        router.push(`/profile/${fetchedTask?.assigneeUsername}/about`, undefined, {
                          shallow: true,
                        });
                      }}
                    >
                      {fetchedTask?.assigneeProfilePicture ? (
                        <SafeImage
                          style={{
                            ...displayDivProfileImageStyle,
                          }}
                          src={fetchedTask?.assigneeProfilePicture}
                        />
                      ) : (
                        <DefaultUserImage style={displayDivProfileImageStyle} />
                      )}
                      <TaskSectionInfoText
                        style={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        {fetchedTask?.assigneeUsername}
                      </TaskSectionInfoText>
                    </TaskUserDiv>
                  ) : (
                    <>
                      {(fetchedTask?.orgId &&
                        userPermissionsContext?.orgPermissions &&
                        fetchedTask?.orgId in userPermissionsContext?.orgPermissions) ||
                      fetchedTask?.privacyLevel === PRIVACY_LEVEL.public ? (
                        <>
                          <TakeTaskButton
                            onClick={() => {
                              if (!user) {
                                router.push('/signup', undefined, {
                                  shallow: true,
                                });
                              } else {
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
                                      setFetchedTask(transformedTask);
                                      if (boardColumns?.setColumns && onCorrectPage) {
                                        let columns = [...boardColumns?.columns];
                                        if (transformedTask.status === TASK_STATUS_IN_REVIEW) {
                                          columns = updateInReviewItem(transformedTask, columns);
                                        } else if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
                                          columns = updateInProgressTask(transformedTask, columns);
                                        } else if (transformedTask.status === TASK_STATUS_TODO) {
                                          columns = updateTaskItem(transformedTask, columns);
                                        } else if (transformedTask.status === TASK_STATUS_DONE) {
                                          columns = updateCompletedItem(transformedTask, columns);
                                        }
                                        boardColumns.setColumns(columns);
                                      }
                                    },
                                  });
                                }
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
            {Array.isArray(fetchedTask?.media) && fetchedTask?.media.length > 0 && (
              <TaskSectionDisplayDiv>
                <TaskSectionDisplayLabel>
                  <ImageIcon />
                  <TaskSectionDisplayText>Media</TaskSectionDisplayText>
                </TaskSectionDisplayLabel>
                <TaskMediaContainer>
                  {Array.isArray(fetchedTask?.media) &&
                    fetchedTask?.media.map((mediaItem) => (
                      <MediaLink
                        key={mediaItem?.slug}
                        media={mediaItem}
                        style={{
                          marginRight: '8px',
                        }}
                      />
                    ))}
                </TaskMediaContainer>
              </TaskSectionDisplayDiv>
            )}
            {isTaskProposal && !isMilestone && (
              <TaskSectionDisplayDiv>
                <TaskSectionDisplayLabel>
                  <ProposerIcon />
                  <TaskSectionDisplayText>Proposer</TaskSectionDisplayText>
                </TaskSectionDisplayLabel>
                <TaskSectionInfoDiv key={fetchedTask?.creatorUsername}>
                  {fetchedTask?.creatorUsername && (
                    <TaskUserDiv
                      onClick={() => {
                        handleClose();
                        router.push(`/profile/${fetchedTask?.creatorUsername}/about`, undefined, {
                          shallow: true,
                        });
                      }}
                    >
                      {fetchedTask?.creatorProfilePicture ? (
                        <SafeImage style={displayDivProfileImageStyle} src={fetchedTask?.creatorProfilePicture} />
                      ) : (
                        <DefaultUserImage style={displayDivProfileImageStyle} />
                      )}
                      <TaskSectionInfoText>{fetchedTask?.creatorUsername}</TaskSectionInfoText>
                    </TaskUserDiv>
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
            <TaskSectionDisplayDiv>
              <TaskSectionDisplayLabel>
                <AssigneeIcon />
                <TaskSectionDisplayText>Due date</TaskSectionDisplayText>
              </TaskSectionDisplayLabel>
              <Box display="flex" alignItems="center">
                <TaskSectionInfoText
                  style={{
                    marginTop: '8px',
                    marginLeft: '16px',
                  }}
                >
                  {fetchedTask?.dueDate ? format(new Date(fetchedTask?.dueDate), 'MM/dd/yyyy') : 'None'}
                </TaskSectionInfoText>
                {!isEmpty(fetchedTask?.recurringSchema) && (
                  <Tooltip title="Recurring" placement="right">
                    <Box mt={1.5} ml={1}>
                      <Image src="/images/icons/recurring.svg" width={14} height={16} alt="Recurring button" />
                    </Box>
                  </Tooltip>
                )}
              </Box>
            </TaskSectionDisplayDiv>
            <TaskSectionDisplayDiv>
              <TaskSectionDisplayLabel>
                <TagsIcon />
                <TaskSectionDisplayText>Tags</TaskSectionDisplayText>
              </TaskSectionDisplayLabel>
              <TaskSectionInfoText
                as="div"
                style={{
                  marginTop: '8px',
                  marginLeft: '45px',
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                {fetchedTask?.labels?.length
                  ? fetchedTask.labels.map((label) => {
                      return label ? (
                        <Tag color={label.color} key={label.id}>
                          {label.name}
                        </Tag>
                      ) : null;
                    })
                  : 'None'}
              </TaskSectionInfoText>
            </TaskSectionDisplayDiv>
            {fetchedTask?.rewards && fetchedTask?.rewards?.length > 0 && (
              <TaskSectionDisplayDiv>
                <TaskSectionDisplayLabel>
                  <TokenIcon />
                  <TaskSectionDisplayText>Tokens</TaskSectionDisplayText>
                </TaskSectionDisplayLabel>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '20px',
                    marginTop: '8px',
                  }}
                >
                  {fetchedTask?.rewards.map((reward, index) => {
                    const { rewardAmount, symbol, icon, chain } = reward;
                    return (
                      <CompensationPill
                        key={index}
                        style={{
                          background: 'none',
                        }}
                      >
                        <IconContainer>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <SafeImage
                            src={icon}
                            style={{
                              width: '24px',
                              height: '24px',
                            }}
                          />
                        </IconContainer>
                        <CompensationAmount>
                          {rewardAmount} {symbol} paid on {chain}
                        </CompensationAmount>
                      </CompensationPill>
                    );
                  })}
                </div>
              </TaskSectionDisplayDiv>
            )}
            {fetchedTask?.milestoneId && (
              <TaskSectionDisplayDiv>
                <TaskSectionDisplayLabel>
                  <MilestoneIcon />
                  <TaskSectionDisplayText>Milestone</TaskSectionDisplayText>
                </TaskSectionDisplayLabel>
                <TaskSectionInfoText
                  style={{
                    marginTop: '8px',
                    marginLeft: '16px',
                    color: 'rgba(0, 186, 255, 1)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (fetchedTask?.milestoneId) {
                      router.query.task = fetchedTask?.milestoneId;
                      router.push(router);
                      getTaskById({
                        variables: {
                          taskId: fetchedTask?.milestoneId,
                        },
                      });
                    }
                  }}
                >
                  {fetchedTask?.milestone?.title || fetchedTask?.milestoneTitle}
                </TaskSectionInfoText>
              </TaskSectionDisplayDiv>
            )}
            {isMilestone && <MilestoneTaskBreakdown milestoneId={fetchedTask?.id} open={open} />}
            {isTaskProposal && (
              <CreateFormFooterButtons>
                {fetchedTask?.changeRequestedAt && (
                  <>
                    <div style={flexDivStyle}>
                      <RejectIcon style={rejectIconStyle} />
                      <TaskStatusHeaderText>Rejected</TaskStatusHeaderText>
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
                    {!fetchedTask?.changeRequestedAt && (
                      <CreateFormCancelButton onClick={requestProposalChanges}>Reject</CreateFormCancelButton>
                    )}
                    <CreateFormPreviewButton onClick={approveProposal}>Approve</CreateFormPreviewButton>
                  </CreateFormButtonsBlock>
                )}
              </CreateFormFooterButtons>
            )}
            <TaskModalFooter
              style={{
                marginTop: '0',
              }}
            >
              <CreatorBlock
                profilePicture={fetchedTask?.creatorProfilePicture}
                username={fetchedTask?.creatorUsername}
                createdAt={fetchedTask?.createdAt}
                isTaskProposal={isTaskProposal}
                handleClose={handleClose}
                router={router}
              />
              {user && !user.activeEthAddress && (
                <TaskSectionInfoText
                  style={{
                    marginTop: '-8px',
                    marginBottom: '16px',
                    color: Red400,
                  }}
                >
                  Your wallet is not connected. Please link your wallet to receive payment for completing tasks and
                  bounties.
                </TaskSectionInfoText>
              )}
              <TaskSectionFooterTitleDiv>
                {selectTabsPerType(isTaskProposal, isMilestone, isSubtask).map((tab, index) => {
                  const active = tab === activeTab;
                  return (
                    <TaskSubmissionTab key={index} isActive={active} onClick={() => setActiveTab(tab)}>
                      <TaskTabText isActive={active}>{tab}</TaskTabText>
                    </TaskSubmissionTab>
                  );
                })}
              </TaskSectionFooterTitleDiv>
              <TaskSectionContent>
                {activeTab === tabs.submissions && (
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
                    setShowPaymentModal={setShowPaymentModal}
                    getTaskSubmissionsForTask={getTaskSubmissionsForTask}
                    isBounty={isBounty}
                  />
                )}
                {activeTab === tabs.subTasks && <TaskSubtasks taskId={fetchedTask?.id} permissions={permissions} />}
                {activeTab === tabs.discussion && (
                  <CommentList task={fetchedTask} taskType={isTaskProposal ? TASK_STATUS_REQUESTED : 'task'} />
                )}
                {activeTab === tabs.tasks && (
                  <MilestoneTaskList milestoneId={fetchedTask?.id} open={activeTab === tabs.tasks} />
                )}
              </TaskSectionContent>
            </TaskModalFooter>
          </TaskModal>
        </Modal>
      </>
    </ApprovedSubmissionContext.Provider>
  );
};
