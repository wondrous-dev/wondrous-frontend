import { useLazyQuery, useMutation } from '@apollo/client';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Box } from '@mui/material';
import MilestoneTasks from 'components/Common/MilestoneTask';
import { TaskApplicationButton, TaskApplicationList, useTaskApplicationCount } from 'components/Common/TaskApplication';
import TaskSubmission from 'components/Common/TaskSubmission';
import { CreateEntity } from 'components/CreateEntity';
import { Claim } from 'components/Icons/claimTask';
import ErrorIcon from 'components/Icons/errorIcon.svg';
import MoreIcon from 'components/Icons/more';
import { RichTextViewer } from 'components/RichText';
import { GithubLink, GithubLinkText } from 'components/Settings/Github/styles';
import Tooltip from 'components/Tooltip';
import { format, formatDistance } from 'date-fns';
import {
  ARCHIVE_TASK,
  COMPLETE_BOUNTY,
  COMPLETE_MILESTONE,
  REMOVE_TASK_ASSIGNEE,
  UNARCHIVE_TASK,
  UPDATE_TASK_ASSIGNEE,
} from 'graphql/mutations/task';
import {
  APPROVE_TASK_PROPOSAL,
  REQUEST_CHANGE_TASK_PROPOSAL,
  UPDATE_TASK_PROPOSAL_ASSIGNEE,
} from 'graphql/mutations/taskProposal';
import { GET_ORG_LABELS } from 'graphql/queries';
import { GET_TASK_BY_ID, GET_TASK_REVIEWERS, GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { GET_TASK_PROPOSAL_BY_ID } from 'graphql/queries/taskProposal';
import { isEmpty, keys } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSnapshot } from 'services/snapshot';
import {
  addTaskItem,
  getProposalStatus,
  updateCompletedItem,
  updateInProgressTask,
  updateInReviewItem,
  updateProposalItem,
  updateTaskItem,
} from 'utils/board';
import {
  BOUNTY_TYPE,
  ENTITIES_TYPES,
  LINK,
  MILESTONE_TYPE,
  PERMISSIONS,
  PRIVACY_LEVEL,
  STATUS_APPROVED,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_TODO,
  TASK_TYPE,
} from 'utils/constants';
import { ApprovedSubmissionContext } from 'utils/contexts';
import {
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
} from 'utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';

import RecurringIcon from '../../../public/images/icons/recurring.svg';
import { useMe } from '../../Auth/withAuth';
import { CommentList } from '../../Comment';
import {
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormPreviewButton,
} from '../../CreateEntity/styles';
import { CheckedBoxIcon } from '../../Icons/checkedBox';
import { DAOIcon } from '../../Icons/dao';
import { CompletedIcon } from '../../Icons/statusIcons';
import { SubtaskDarkIcon } from '../../Icons/subtask';
import { RejectIcon } from '../../Icons/taskModalIcons';
import { ArchiveTaskModal } from '../ArchiveTaskModal';
import { CompleteModal } from '../CompleteModal';
import { DeleteTaskModal } from '../DeleteTaskModal';
import DefaultUserImage from '../Image/DefaultUserImage';
import { MilestoneProgressViewModal } from '../MilestoneProgress';
import { MakePaymentModal } from '../Payment/PaymentModal';
import { SnackbarAlertContext } from '../SnackbarAlert';
import { TaskSubtasks } from '../TaskSubtask';
import { flexDivStyle, rejectIconStyle } from '../TaskSummary';
import WalletModal from '../Wallet/WalletModal';
import {
  ActionButton,
  ArchivedTaskUndo,
  ConnectToWalletButton,
  GithubBlock,
  SubtaskIconWrapper,
  Tag,
  TaskBorder,
  TaskCardOrgNoLogo,
  TaskCardOrgPhoto,
  TaskCardPodIcon,
  TaskDescriptionText,
  TaskDescriptionTextShowAllText,
  TaskMediaWrapper,
  TaskModal,
  TaskModalCard,
  TaskModalFooter,
  TaskModalHeader,
  TaskModalHeaderArrow,
  TaskModalHeaderBackToList,
  TaskModalHeaderCloseModal,
  TaskModalHeaderIconWrapper,
  TaskModalHeaderMenu,
  TaskModalHeaderMenuButton,
  TaskModalHeaderMenuItem,
  TaskModalHeaderOpenInFullIcon,
  TaskModalHeaderPrivacyIcon,
  TaskModalHeaderShare,
  TaskModalHeaderTypography,
  TaskModalHeaderWrapper,
  TaskModalHeaderWrapperRight,
  TaskModalSnapshot,
  TaskModalSnapshotLogo,
  TaskModalSnapshotText,
  TaskModalTaskData,
  TaskModalTaskStatusMoreInfo,
  TaskModalTitle,
  TaskModalTitleDescriptionMedia,
  TaskSectionContent,
  TaskSectionDisplayContentWrapper,
  TaskSectionDisplayCreator,
  TaskSectionDisplayData,
  TaskSectionDisplayDiv,
  TaskSectionDisplayDivWrapper,
  TaskSectionDisplayLabel,
  TaskSectionDisplayLabelText,
  TaskSectionFooterTitleDiv,
  TaskSectionImageContentImage,
  TaskSectionImageContentSafeImage,
  TaskSectionImageContentWrapper,
  TaskSectionInfoCalendar,
  TaskSectionInfoClose,
  TaskSectionInfoCreatorDaysAgo,
  TaskSectionInfoCreatorTask,
  TaskSectionInfoDiv,
  TaskSectionInfoMilestoneIcon,
  TaskSectionInfoPaymentAmount,
  TaskSectionInfoPaymentMethodChain,
  TaskSectionInfoPaymentMethodIcon,
  TaskSectionInfoPaymentWrapper,
  TaskSectionInfoPoints,
  TaskSectionInfoPointsIcon,
  TaskSectionInfoRecurringIcon,
  TaskSectionInfoTakeTask,
  TaskSectionInfoTakeTaskText,
  TaskSectionInfoText,
  TaskSectionInfoTextCreator,
  TaskSectionInfoTextMilestone,
  TaskSectionInfoTextUnderlined,
  TaskSectionTagWrapper,
  TaskStatusHeaderText,
  TaskSubmissionTab,
  TaskTabText,
  WalletError,
  WalletErrorText,
} from './styles';
import { TaskMenuStatus } from './taskMenuStatus';

const tabs = {
  submissions: 'Submissions',
  subTasks: 'Subtasks',
  discussion: 'Discussion',
  tasks: 'Tasks',
  applications: 'Applications',
};

const tabsPerType = {
  proposalTabs: [tabs.discussion],
  milestoneTabs: [tabs.tasks, tabs.discussion],
  subtaskTabs: [tabs.submissions, tabs.discussion],
  bountyTabs: [tabs.submissions, tabs.discussion],
  taskTabs: [tabs.applications, tabs.submissions, tabs.subTasks, tabs.discussion],
};

const selectTabsPerType = (isTaskProposal, isMilestone, isSubtask, isBounty) => {
  if (isTaskProposal) return tabsPerType.proposalTabs;
  if (isMilestone) return tabsPerType.milestoneTabs;
  if (isSubtask) return tabsPerType.subtaskTabs;
  if (isBounty) return tabsPerType.bountyTabs;
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

const TaskHeaderMenu = ({ canEdit, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (!canEdit) return null;
  return (
    <>
      <Tooltip title="More actions" placement="top">
        <TaskModalHeaderMenuButton onClick={handleClick} open={open}>
          <MoreIcon />
        </TaskModalHeaderMenuButton>
      </Tooltip>
      <TaskModalHeaderMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </TaskModalHeaderMenu>
    </>
  );
};

const TaskDescriptionTextWrapper = ({ text }) => {
  const initialHeight = 100;
  const [showButton, setShowButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const handleExpand = () => setIsExpanded(!isExpanded);
  const checkRichTextHeight = useCallback((node) => {
    if (!node) return;
    const hasExceeded = node?.children?.[0]?.offsetHeight > initialHeight;
    setShowButton(hasExceeded);
    setIsExpanded(!hasExceeded);
  }, []);
  if (!text) return null;
  return (
    <>
      <TaskDescriptionText isExpanded={isExpanded} initialHeight={initialHeight} ref={checkRichTextHeight}>
        <RichTextViewer text={text} />
      </TaskDescriptionText>
      {showButton && (
        <TaskDescriptionTextShowAllText onClick={handleExpand}>
          {isExpanded ? `Hide description` : `Show full description`}
        </TaskDescriptionTextShowAllText>
      )}
    </>
  );
};

const TaskSectionLabel = ({ children }) => (
  <TaskSectionDisplayLabel>
    <TaskSectionDisplayLabelText>{children}</TaskSectionDisplayLabelText>
  </TaskSectionDisplayLabel>
);

const TaskSectionImageContent = ({
  hasContent,
  DefaultContent = null,
  imgSrc = '',
  DefaultImageComponent = null,
  ContentComponent,
  onClick = () => {},
}) => {
  if (!hasContent) return <DefaultContent />;
  const defaultImage = DefaultImageComponent && (
    <TaskSectionImageContentImage>
      <DefaultImageComponent />
    </TaskSectionImageContentImage>
  );
  const image = imgSrc ? (
    <TaskSectionImageContentImage>
      <TaskSectionImageContentSafeImage src={imgSrc} />
    </TaskSectionImageContentImage>
  ) : (
    defaultImage
  );
  return (
    <TaskSectionImageContentWrapper onClick={onClick}>
      {image}
      <ContentComponent />
    </TaskSectionImageContentWrapper>
  );
};

const GithubButtons = ({ fetchedTask }) => {
  const githubIssue = fetchedTask?.githubIssue;
  const githubPullRequest = fetchedTask?.githubPullRequest;
  if (githubIssue || githubPullRequest) {
    return (
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Github</TaskSectionLabel>
        <GithubBlock>
          {githubIssue && (
            <GithubLink href={githubIssue?.url} target="_blank">
              <GitHubIcon />
              <GithubLinkText>Github issue</GithubLinkText>
            </GithubLink>
          )}
          {githubPullRequest && (
            <GithubLink href={githubPullRequest?.url} target="_blank">
              <GitHubIcon />
              <GithubLinkText>{githubPullRequest?.title}</GithubLinkText>
            </GithubLink>
          )}
        </GithubBlock>
      </TaskSectionDisplayDiv>
    );
  }
  return null;
};

const ConnectToWallet = ({ user }) => {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  if (user?.activeEthAddress) return null;
  return (
    <TaskSectionInfoPaymentWrapper>
      <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      <WalletError>
        <ErrorIcon />
        <WalletErrorText>Wallet not connected</WalletErrorText>
      </WalletError>
      <ConnectToWalletButton onClick={() => setWalletModalOpen(true)}>Connect</ConnectToWalletButton>
    </TaskSectionInfoPaymentWrapper>
  );
};

const Rewards = ({ fetchedTask, user }) => {
  const rewards = fetchedTask?.rewards;
  if (isEmpty(rewards)) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Rewards</TaskSectionLabel>
      {rewards.map((reward, index) => {
        const { rewardAmount, symbol, icon, chain } = reward;
        return (
          <TaskSectionImageContent
            key={index}
            hasContent={reward}
            ContentComponent={() => (
              <TaskSectionInfoPaymentWrapper>
                <TaskSectionInfoPaymentMethodIcon src={icon} />
                <TaskSectionInfoPaymentAmount>
                  {rewardAmount} {symbol}
                </TaskSectionInfoPaymentAmount>
                <TaskSectionInfoPaymentMethodChain>paid on {chain}</TaskSectionInfoPaymentMethodChain>
                <ConnectToWallet user={user} />
              </TaskSectionInfoPaymentWrapper>
            )}
          />
        );
      })}
    </TaskSectionDisplayDiv>
  );
};

const Menu = ({
  canArchive,
  canDelete,
  canEdit,
  isBounty,
  isMilestone,
  isTaskProposal,
  setArchiveTask,
  setCompleteModal,
  setDeleteTask,
  setEditTask,
  taskType,
}) => {
  const menuItems = {
    Complete: {
      condition: canEdit && (isMilestone || isBounty),
      onClick: setCompleteModal,
    },
    Edit: {
      condition: canEdit,
      onClick: setEditTask,
    },
    Archive: {
      condition: canArchive && !isTaskProposal,
      onClick: setArchiveTask,
    },
    Delete: {
      condition: canDelete,
      onClick: setDeleteTask,
      warning: true,
    },
  };
  return (
    <TaskHeaderMenu canEdit={canEdit}>
      {keys(menuItems).map((item) => {
        const { condition, onClick, ...props } = menuItems[item];
        return (
          <>
            {condition && (
              <TaskModalHeaderMenuItem key={item} onClick={() => onClick(true)} {...props}>
                {item} {taskType}
              </TaskModalHeaderMenuItem>
            )}
          </>
        );
      })}
    </TaskHeaderMenu>
  );
};

export const TaskViewModal = (props: ITaskListModalProps) => {
  const { open, handleClose, taskId, isTaskProposal, back } = props;
  const [fetchedTask, setFetchedTask] = useState(null);
  const isMilestone = fetchedTask?.type === MILESTONE_TYPE;
  const isTask = fetchedTask?.type === TASK_TYPE;
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
  const {
    loading: taskApplicationCountLoading,
    error: taskApplicationCountError,
    data: taskApplicationCount,
  } = useTaskApplicationCount(fetchedTask?.id);

  const userPermissionsContext = getUserPermissionContext();
  const boardColumns = useColumns();
  const [getTaskSubmissionsForTask, { data: taskSubmissionsForTask, loading: taskSubmissionsForTaskLoading }] =
    useLazyQuery(GET_TASK_SUBMISSIONS_FOR_TASK);
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  const [removeTaskAssignee] = useMutation(REMOVE_TASK_ASSIGNEE);
  const [updateTaskProposalAssignee] = useMutation(UPDATE_TASK_PROPOSAL_ASSIGNEE);
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
  const [fullScreen, setFullScreen] = useState(false);
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
  const sectionRef = useRef(null);
  const user = useMe();
  const { orgSnapshot, getOrgSnapshotInfo, snapshotConnected, snapshotSpace, isTest } = useSnapshot();

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
    if (fetchedTask?.snapshotId && fetchedTask?.orgId && !orgSnapshot) {
      getOrgSnapshotInfo({
        variables: {
          orgId: fetchedTask?.orgId,
        },
      });
    }
  }, [fetchedTask?.snapshotId]);

  useEffect(() => {
    if (isMilestone) {
      setActiveTab(tabs.tasks);
    } else if (isTaskProposal || router?.query?.taskCommentId) {
      setActiveTab(tabs.discussion);
    } else {
      setActiveTab(tabs.submissions);
    }
  }, [isMilestone, isTaskProposal, router?.query?.taskCommentId]);

  const openSnapshot = async () => {
    try {
      const space = orgSnapshot.snapshotEns;
      const proposal = fetchedTask?.snapshotId;
      const url = isTest
        ? `https://demo.snapshot.org/#/${space}/proposal/${proposal}`
        : `https://snapshot.org/#/${space}/proposal/${proposal}`;
      window.open(url);
    } catch (error) {
      console.error(error);
    }
  };

  if (editTask) {
    return (
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
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    fetchedTask?.createdBy === user?.id ||
    (fetchedTask?.assigneeId && fetchedTask?.assigneeId === user?.id);
  const canViewApplications =
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    (fetchedTask?.createdBy === user?.id && fetchedTask?.type === TASK_TYPE);

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
    canArchive &&
    (fetchedTask?.type === ENTITIES_TYPES.TASK || fetchedTask?.type === ENTITIES_TYPES.MILESTONE || isTaskProposal);
  const canApproveProposal =
    permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.CREATE_TASK);

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
  const canClaim =
    fetchedTask?.taskApplicationPermissions?.canClaim &&
    ((fetchedTask?.orgId &&
      userPermissionsContext?.orgPermissions &&
      fetchedTask?.orgId in userPermissionsContext?.orgPermissions) ||
      fetchedTask?.privacyLevel === PRIVACY_LEVEL.public);

  const canApply = !canClaim && fetchedTask?.taskApplicationPermissions?.canApply;

  const handleReviewButton = () => {
    if (activeTab !== tabs.applications) {
      setActiveTab(tabs.applications);
    }
    sectionRef?.current?.scrollIntoView({ behavior: 'smooth' });
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
        <TaskModal
          open={open}
          onClose={() => {
            setFetchedTask(null);
            handleClose();
          }}
        >
          <TaskModalCard fullScreen={fullScreen}>
            <TaskModalHeader>
              <TaskModalHeaderWrapper>
                <TaskModalHeaderIconWrapper
                  onClick={() => {
                    handleClose();
                    router.push(`/organization/${fetchedTask?.orgUsername}/boards`, undefined, {
                      shallow: true,
                    });
                  }}
                >
                  {fetchedTask?.orgProfilePicture ? (
                    <TaskCardOrgPhoto src={fetchedTask?.orgProfilePicture} />
                  ) : (
                    <TaskCardOrgNoLogo>
                      <DAOIcon />
                    </TaskCardOrgNoLogo>
                  )}
                  <TaskModalHeaderTypography>{fetchedTask?.org.name}</TaskModalHeaderTypography>
                </TaskModalHeaderIconWrapper>
                {fetchedTask?.podName && (
                  <>
                    <TaskModalHeaderArrow />
                    <TaskModalHeaderIconWrapper
                      onClick={() => {
                        handleClose();
                        router.push(`/pod/${fetchedTask?.podId}/boards`, undefined, {
                          shallow: true,
                        });
                      }}
                    >
                      <TaskCardPodIcon color={fetchedTask?.podColor} />
                      <TaskModalHeaderTypography>{fetchedTask?.podName}</TaskModalHeaderTypography>
                    </TaskModalHeaderIconWrapper>
                  </>
                )}
                {false && fetchedTask?.type === TASK_TYPE && (
                  <>
                    <TaskModalHeaderArrow />
                    <Link
                      href={`/organization/${fetchedTask?.orgUsername}/boards?task=${
                        isSubtask ? fetchedTask?.parentTaskId : taskId
                      }`}
                      passHref={true}
                    >
                      <Tooltip title="Task" placement="top">
                        <span>
                          <TaskModalHeaderIconWrapper>
                            <CheckedBoxIcon />
                          </TaskModalHeaderIconWrapper>
                        </span>
                      </Tooltip>
                    </Link>
                  </>
                )}
                {isSubtask && fetchedTask?.type === TASK_TYPE && (
                  <>
                    <TaskModalHeaderArrow />
                    <SubtaskIconWrapper>
                      <SubtaskDarkIcon />
                    </SubtaskIconWrapper>
                  </>
                )}
                {fetchedTask?.privacyLevel !== PRIVACY_LEVEL.public && (
                  <>
                    <TaskModalHeaderArrow />
                    <TaskModalHeaderPrivacyIcon
                      isPrivate={fetchedTask?.privacyLevel !== PRIVACY_LEVEL.public}
                      tooltipTitle={fetchedTask?.privacyLevel !== PRIVACY_LEVEL.public ? 'Members only' : 'Public'}
                    />
                  </>
                )}
              </TaskModalHeaderWrapper>
              <TaskModalHeaderWrapperRight>
                {back && <TaskModalHeaderBackToList onClick={handleClose}>Back to list</TaskModalHeaderBackToList>}
                <TaskModalHeaderShare
                  url={`${LINK}/organization/${fetchedTask?.orgUsername}/boards?task=${
                    isSubtask ? fetchedTask?.parentTaskId : taskId
                  }`}
                />
                <TaskModalHeaderOpenInFullIcon onClick={() => setFullScreen(!fullScreen)} />
                <Menu
                  canArchive={canArchive}
                  canDelete={canDelete}
                  canEdit={canEdit}
                  isBounty={isBounty}
                  isMilestone={isMilestone}
                  isTaskProposal={isTaskProposal}
                  setArchiveTask={setArchiveTask}
                  setCompleteModal={setCompleteModal}
                  setDeleteTask={setDeleteTask}
                  setEditTask={setEditTask}
                  taskType={taskType}
                />
                <TaskModalHeaderCloseModal onClick={() => handleClose()} />
              </TaskModalHeaderWrapperRight>
            </TaskModalHeader>
            <TaskModalTaskData fullScreen={fullScreen}>
              <TaskModalTitleDescriptionMedia fullScreen={fullScreen}>
                <TaskModalTitle>{fetchedTask?.title}</TaskModalTitle>
                <TaskModalTaskStatusMoreInfo>
                  {fetchedTask?.snapshotId && (
                    <TaskModalSnapshot onClick={openSnapshot}>
                      <TaskModalSnapshotLogo />
                      <TaskModalSnapshotText>Snapshot Proposal</TaskModalSnapshotText>
                    </TaskModalSnapshot>
                  )}
                  <TaskMenuStatus
                    task={fetchedTask}
                    entityType={entityType}
                    archiveTaskMutation={archiveTaskMutation}
                    canArchive={canArchive}
                    canApproveProposal={canApproveProposal}
                    isTaskProposal={isTaskProposal}
                  />
                  <MilestoneProgressViewModal milestoneId={fetchedTask?.id} isMilestone={isMilestone} />
                </TaskModalTaskStatusMoreInfo>
                <TaskDescriptionTextWrapper text={fetchedTask?.description} key={fetchedTask?.id} />
                <TaskMediaWrapper media={fetchedTask?.media} />
                {!fullScreen && <TaskBorder />}
              </TaskModalTitleDescriptionMedia>
              <TaskSectionDisplayDivWrapper fullScreen={fullScreen}>
                <TaskSectionDisplayData>
                  {!isTaskProposal && !isMilestone && (
                    <TaskSectionDisplayDiv>
                      <TaskSectionLabel>Reviewer</TaskSectionLabel>
                      <TaskSectionDisplayContentWrapper>
                        {reviewerData?.getTaskReviewers?.length > 0 ? (
                          (reviewerData?.getTaskReviewers).map((taskReviewer) => (
                            <TaskSectionImageContent
                              key={taskReviewer.id}
                              hasContent={taskReviewer.id}
                              imgSrc={taskReviewer?.profilePicture}
                              DefaultImageComponent={() => <DefaultUserImage />}
                              ContentComponent={() => (
                                <TaskSectionInfoTextUnderlined>{taskReviewer?.username}</TaskSectionInfoTextUnderlined>
                              )}
                              onClick={() => {
                                handleClose();
                                router.push(`/profile/${taskReviewer?.username}/about`, undefined, {
                                  shallow: true,
                                });
                              }}
                            />
                          ))
                        ) : (
                          <TaskSectionInfoText>None</TaskSectionInfoText>
                        )}
                      </TaskSectionDisplayContentWrapper>
                    </TaskSectionDisplayDiv>
                  )}
                  {showAssignee && (
                    <TaskSectionDisplayDiv>
                      <TaskSectionLabel>Assignee</TaskSectionLabel>
                      <TaskSectionInfoDiv key={fetchedTask?.assigneeUsername}>
                        <TaskSectionImageContent
                          hasContent={fetchedTask?.assigneeUsername}
                          imgSrc={fetchedTask?.assigneeProfilePicture}
                          DefaultImageComponent={() => <DefaultUserImage />}
                          ContentComponent={() => {
                            return (
                              <>
                                <TaskSectionInfoTextUnderlined>
                                  {fetchedTask?.assigneeUsername}
                                </TaskSectionInfoTextUnderlined>
                                {canEdit && (
                                  <TaskSectionInfoClose
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeTaskAssignee({
                                        variables: {
                                          taskId: fetchedTask?.id,
                                        },
                                        onCompleted: (data) => {
                                          const task = data?.removeTaskAssignee;
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
                                    }}
                                  >
                                    <Image src="/images/icons/close.svg" alt="close icon" width={8} height={8} />
                                  </TaskSectionInfoClose>
                                )}
                              </>
                            );
                          }}
                          onClick={() => {
                            handleClose();
                            router.push(`/profile/${fetchedTask?.assigneeUsername}/about`, undefined, {
                              shallow: true,
                            });
                          }}
                          DefaultContent={() => (
                            <>
                              {canClaim ? (
                                <>
                                  <TaskSectionInfoTakeTask
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
                                    <Claim />
                                    <TaskSectionInfoTakeTaskText>Claim this task</TaskSectionInfoTakeTaskText>
                                  </TaskSectionInfoTakeTask>
                                </>
                              ) : (
                                <>
                                  {canApply ? (
                                    <TaskApplicationButton
                                      task={fetchedTask}
                                      canApply={canApply}
                                      title="Apply to task"
                                    />
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
                            </>
                          )}
                        />
                      </TaskSectionInfoDiv>
                    </TaskSectionDisplayDiv>
                  )}
                  {canViewApplications && taskApplicationCount?.getTaskApplicationsCount?.total > 0 && (
                    <TaskSectionDisplayDiv>
                      <TaskSectionLabel>Applications</TaskSectionLabel>
                      <Box display="flex" alignItems="center">
                        <TaskSectionInfoText>
                          <ActionButton type="button" onClick={handleReviewButton}>
                            Review {taskApplicationCount?.getTaskApplicationsCount?.total} applications
                          </ActionButton>
                        </TaskSectionInfoText>
                      </Box>
                    </TaskSectionDisplayDiv>
                  )}

                  {isTaskProposal && !isMilestone && (
                    <TaskSectionDisplayDiv>
                      <TaskSectionLabel>Proposer</TaskSectionLabel>
                      <TaskSectionImageContent
                        hasContent={fetchedTask?.creatorUsername}
                        onClick={() => {
                          handleClose();
                          router.push(`/profile/${fetchedTask?.creatorUsername}/about`, undefined, {
                            shallow: true,
                          });
                        }}
                        ContentComponent={() => (
                          <TaskSectionInfoText>{fetchedTask?.creatorUsername}</TaskSectionInfoText>
                        )}
                        imgSrc={fetchedTask?.creatorProfilePicture}
                        DefaultImageComponent={() => <DefaultUserImage />}
                        DefaultContent={() => <TaskSectionInfoText>None</TaskSectionInfoText>}
                      />
                    </TaskSectionDisplayDiv>
                  )}
                  {fetchedTask?.dueDate && (
                    <TaskSectionDisplayDiv>
                      <TaskSectionLabel>Due Date</TaskSectionLabel>
                      <TaskSectionImageContent
                        hasContent={fetchedTask?.dueDate}
                        ContentComponent={() => (
                          <TaskSectionInfoText>
                            {!isEmpty(fetchedTask?.recurringSchema) && (
                              <Tooltip title="Recurring" placement="right">
                                <TaskSectionInfoRecurringIcon>
                                  <RecurringIcon />
                                </TaskSectionInfoRecurringIcon>
                              </Tooltip>
                            )}
                            {format(new Date(fetchedTask?.dueDate), 'MM/dd/yyyy')}
                          </TaskSectionInfoText>
                        )}
                        DefaultContent={() => null}
                        DefaultImageComponent={() => <TaskSectionInfoCalendar />}
                      />
                    </TaskSectionDisplayDiv>
                  )}
                  <Rewards fetchedTask={fetchedTask} user={user} />
                  {fetchedTask?.points && (
                    <TaskSectionDisplayDiv>
                      <TaskSectionLabel>Points</TaskSectionLabel>
                      <TaskSectionImageContent
                        hasContent={fetchedTask?.points}
                        ContentComponent={() => <TaskSectionInfoPoints>{fetchedTask?.points}</TaskSectionInfoPoints>}
                        DefaultImageComponent={() => <TaskSectionInfoPointsIcon />}
                      />
                    </TaskSectionDisplayDiv>
                  )}
                  {fetchedTask?.milestoneId && (
                    <TaskSectionDisplayDiv>
                      <TaskSectionLabel>Milestone</TaskSectionLabel>
                      <TaskSectionImageContent
                        hasContent={fetchedTask?.milestoneId}
                        ContentComponent={() => (
                          <TaskSectionInfoTextMilestone
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
                          </TaskSectionInfoTextMilestone>
                        )}
                        DefaultImageComponent={() => <TaskSectionInfoMilestoneIcon />}
                      />
                    </TaskSectionDisplayDiv>
                  )}
                  {fetchedTask?.labels?.length > 0 && (
                    <TaskSectionDisplayDiv>
                      <TaskSectionLabel>Tags</TaskSectionLabel>
                      <TaskSectionTagWrapper>
                        {fetchedTask.labels.map((label) => {
                          return (
                            label && (
                              <TaskSectionImageContent
                                key={label.id}
                                hasContent={label}
                                ContentComponent={() => <Tag color={label.color}>{label.name}</Tag>}
                                DefaultContent={() => <TaskSectionInfoText>None</TaskSectionInfoText>}
                              />
                            )
                          );
                        })}
                      </TaskSectionTagWrapper>
                    </TaskSectionDisplayDiv>
                  )}
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
                  <GithubButtons fetchedTask={fetchedTask} />
                </TaskSectionDisplayData>
                <TaskSectionDisplayCreator>
                  {fetchedTask?.creatorUsername && (
                    <TaskSectionImageContent
                      hasContent={fetchedTask?.creatorUsername}
                      imgSrc={fetchedTask?.creatorProfilePicture}
                      DefaultImageComponent={() => <DefaultUserImage />}
                      ContentComponent={() => (
                        <TaskSectionInfoTextCreator>
                          {fetchedTask?.creatorUsername}{' '}
                          <TaskSectionInfoCreatorTask>
                            created this task{isTaskProposal && ' proposal'}{' '}
                          </TaskSectionInfoCreatorTask>
                          <TaskSectionInfoCreatorDaysAgo>
                            {fetchedTask?.createdAt &&
                              formatDistance(new Date(fetchedTask?.createdAt), new Date(), {
                                addSuffix: true,
                              })}
                          </TaskSectionInfoCreatorDaysAgo>
                        </TaskSectionInfoTextCreator>
                      )}
                      onClick={() => {
                        handleClose();
                        router.push(`/profile/${fetchedTask?.creatorUsername}/about`, undefined, {
                          shallow: true,
                        });
                      }}
                    />
                  )}
                </TaskSectionDisplayCreator>
              </TaskSectionDisplayDivWrapper>

              <TaskModalFooter fullScreen={fullScreen}>
                <TaskSectionFooterTitleDiv>
                  {selectTabsPerType(isTaskProposal, isMilestone, isSubtask, isBounty).map((tab, index) => {
                    const active = tab === activeTab;
                    return (
                      <TaskSubmissionTab key={index} isActive={active} onClick={() => setActiveTab(tab)}>
                        <TaskTabText isActive={active}>{tab}</TaskTabText>
                      </TaskSubmissionTab>
                    );
                  })}
                </TaskSectionFooterTitleDiv>
                <TaskSectionContent ref={sectionRef}>
                  {activeTab === tabs.applications && fetchedTask?.id && (
                    <TaskApplicationList
                      count={taskApplicationCount?.getTaskApplicationsCount?.total}
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
                  {activeTab === tabs.subTasks && (
                    <TaskSubtasks taskId={fetchedTask?.id} permissions={permissions} parentTask={fetchedTask} />
                  )}
                  {activeTab === tabs.discussion && (
                    <CommentList task={fetchedTask} taskType={isTaskProposal ? TASK_STATUS_REQUESTED : 'task'} />
                  )}
                  {activeTab === tabs.tasks && (
                    <MilestoneTasks milestoneId={fetchedTask?.id} open={activeTab === tabs.tasks} />
                  )}
                </TaskSectionContent>
              </TaskModalFooter>
            </TaskModalTaskData>
          </TaskModalCard>
        </TaskModal>
      </>
    </ApprovedSubmissionContext.Provider>
  );
};
