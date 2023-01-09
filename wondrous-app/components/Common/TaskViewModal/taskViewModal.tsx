import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useTaskApplicationCount } from 'components/Common/TaskApplication';
import TaskMenuStatus from 'components/Common/TaskMenuStatus';
import { CreateEntity } from 'components/CreateEntity';
import Tooltip from 'components/Tooltip';
import { differenceInDays } from 'date-fns';
import { ARCHIVE_TASK } from 'graphql/mutations/task';
import { APPROVE_TASK_PROPOSAL, CLOSE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import { SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import {
  GET_MINT_TASK_TOKEN_DATA,
  GET_TASK_BY_ID,
  GET_TASK_REVIEWERS,
  GET_TASK_SUBMISSIONS_FOR_TASK,
} from 'graphql/queries/task';
import { GET_TASK_PROPOSAL_BY_ID } from 'graphql/queries/taskProposal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnapshot } from 'services/snapshot';
import {
  addTaskItem,
  formatDateDisplay,
  getProposalStatus,
  updateCompletedItem,
  updateInProgressTask,
  updateInReviewItem,
  updateProposalItem,
  updateTaskItem,
} from 'utils/board';
import {
  BOUNTY_TYPE,
  CATEGORY_LABELS,
  ENTITIES_TYPES,
  GR15DEICategoryName,
  MILESTONE_TYPE,
  PERMISSIONS,
  PRIVACY_LEVEL,
  STATUS_APPROVED,
  TaskMintStatus,
  TASK_STATUS_ARCHIVED,
  TASK_TYPE,
} from 'utils/constants';
import { ApprovedSubmissionContext, TaskContext } from 'utils/contexts';
import {
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
  cutString,
} from 'utils/helpers';
import { useCanViewTask, useColumns, useOrgBoard, usePodBoard, useUserBoard, useGlobalContext } from 'utils/hooks';

import VoteResults from 'components/Common/Votes';
import TaskMintComponent from 'components/Common/TaskMint';

import { useHotkeys } from 'react-hotkeys-hook';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { useMe } from 'components/Auth/withAuth';
import {
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormPreviewButton,
} from 'components/CreateEntity/styles';
import { CheckedBoxIcon } from 'components/Icons/checkedBox';
import { DAOIcon } from 'components/Icons/dao';
import { CompletedIcon } from 'components/Icons/statusIcons';
import { SubtaskDarkIcon } from 'components/Icons/subtask';
import { RejectIcon } from 'components/Icons/taskModalIcons';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { MilestoneProgressViewModal } from 'components/Common/MilestoneProgress';
import { MakePaymentModal } from 'components/Common/Payment/PaymentModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { flexDivStyle, rejectIconStyle } from 'components/Common/TaskSummary';
import { delQuery } from 'utils/index';
import ActionModals from './actionModals';
import { tabs } from './constants';
import {
  GithubButtons,
  LockedTaskMessage,
  Menu,
  Rewards,
  TaskDescriptionTextWrapper,
  TaskSectionImageContent,
} from './helpers';
import {
  SubtaskIconWrapper,
  SubtaskTitleWrapper,
  TaskBorder,
  TaskCardOrgNoLogo,
  TaskCardOrgPhoto,
  TaskCardPodIcon,
  TaskMediaWrapper,
  TaskModal,
  TaskModalCard,
  TaskModalHeader,
  TaskModalHeaderArrow,
  TaskModalHeaderBackToList,
  TaskModalHeaderCloseModal,
  TaskModalHeaderIconWrapper,
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
  TaskSectionDisplayCreator,
  TaskSectionDisplayData,
  TaskSectionDisplayDivWrapper,
  TaskSectionInfoCreatorDaysAgo,
  TaskSectionInfoCreatorTask,
  TaskSectionInfoTextCreator,
  TaskStatusHeaderText,
} from './styles';
import {
  ApplicationField,
  AssigneeField,
  CategoryField,
  DueDateField,
  InitativesField,
  MilestoneField,
  PointsField,
  PriorityField,
  ProposerField,
  ReviewerField,
  TagsField,
} from './taskViewModalFields';
import WatchersField from './taskViewModalFields/WatchersField';
import TaskViewModalFooter from './taskViewModalFooter';
import { hasGR15DEIIntiative, openSnapshot } from './utils';
import TaskViewNft from '../TaskViewNft';
import ViewNftFields from '../TaskMint/ViewNftFields';

interface ITaskListModalProps {
  open: boolean;
  handleClose: () => any;
  taskId: string;
  isTaskProposal?: boolean;
  back?: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export const TaskViewModal = ({ open, handleClose, taskId, isTaskProposal = false, back }: ITaskListModalProps) => {
  const [fetchedTask, setFetchedTask] = useState(null);
  const isMilestone = fetchedTask?.type === MILESTONE_TYPE;
  const isSubtask = fetchedTask?.parentTaskId !== null;
  const isBounty = fetchedTask?.type === BOUNTY_TYPE;
  const entityType = isTaskProposal ? ENTITIES_TYPES.PROPOSAL : fetchedTask?.type;
  const [approvedSubmission, setApprovedSubmission] = useState(null);
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const globalContext = useGlobalContext();
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const getBoard = useCallback(() => orgBoard || podBoard || userBoard, [orgBoard, userBoard, podBoard]);
  const board = getBoard();
  const {
    loading: taskApplicationCountLoading,
    error: taskApplicationCountError,
    data: taskApplicationCount,
  } = useTaskApplicationCount(fetchedTask?.id);

  const [getTaskMintTokenData, tokenData] = useLazyQuery(GET_MINT_TASK_TOKEN_DATA);
  const userPermissionsContext = getUserPermissionContext();
  const boardColumns = useColumns();
  const [getTaskSubmissionsForTask, { data: taskSubmissionsForTask, loading: taskSubmissionsForTaskLoading }] =
    useLazyQuery(GET_TASK_SUBMISSIONS_FOR_TASK);
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);
  const [completeModal, setCompleteModal] = useState(false);
  const router = useRouter();
  const { query } = router;
  const [editTask, setEditTask] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [archiveTask, setArchiveTask] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [initialStatus, setInitialStatus] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isViewNft, setIsViewNft] = useState(!!router?.query?.viewNft);

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: fetchedTask?.orgId,
    podId: fetchedTask?.podId,
  });
  const { canViewTask } = useCanViewTask(fetchedTask, userPermissionsContext, permissions);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [getReviewers, { data: reviewerData }] = useLazyQuery(GET_TASK_REVIEWERS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const sectionRef = useRef(null);
  const user = useMe();
  const { orgSnapshot, getOrgSnapshotInfo, snapshotConnected, snapshotSpace, isTest } = useSnapshot();
  const [getTaskById, { refetch, startPolling, stopPolling }] = useLazyQuery(GET_TASK_BY_ID, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const taskData = data?.getTaskById;
      if (taskData) {
        const taskMintStatus = taskData?.taskMint?.status;
        if (taskMintStatus === TaskMintStatus.IN_PROGRESS) {
          startPolling(4000);
        }
        if (taskMintStatus === TaskMintStatus.COMPLETED) {
          stopPolling();
        }
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
      stopPolling();
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

  const [archiveTaskMutation, { data: archiveTaskData }] = useMutation(ARCHIVE_TASK, {
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
      console.error('Something went wrong with archiving tasks');
    },
    onCompleted: () => {
      // TODO: Move columns
      // let columns = [...boardColumns?.columns]
    },
  });

  useHotkeys(HOTKEYS.CREATE_COMMENT, () => {
    setActiveTab(tabs.discussion);
  });

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
    if (isViewNft !== !!router?.query?.viewNft) {
      setIsViewNft(!!router?.query?.viewNft);
    }
  }, [router?.query?.viewNft]);

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
  const handleGoBackToTask = () => {
    setShowPaymentModal(false);
    getTaskSubmissionsForTask({
      variables: {
        taskId: fetchedTask?.id,
      },
    });
  };
  if (showPaymentModal && approvedSubmission) {
    return (
      <MakePaymentModal
        handleGoBack={handleGoBackToTask}
        open={showPaymentModal}
        reward={fetchedTask?.rewards[0]}
        handleClose={handleClose}
        approvedSubmission={approvedSubmission}
        setShowPaymentModal={setShowPaymentModal}
        fetchedTask={fetchedTask}
      />
    );
  }
  const userInOrg =
    userPermissionsContext?.orgPermissions && fetchedTask?.orgId in userPermissionsContext.orgPermissions;

  const canEdit =
    !isViewNft &&
    (permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      permissions.includes(PERMISSIONS.EDIT_TASK) ||
      fetchedTask?.createdBy === user?.id ||
      (fetchedTask?.assigneeId && fetchedTask?.assigneeId === user?.id));

  const canViewApplications =
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    (fetchedTask?.createdBy === user?.id && fetchedTask?.type === TASK_TYPE);

  const showAssignee = !isTaskProposal && !isMilestone && !isBounty;
  const canArchive =
    (!isViewNft && permissions.includes(PERMISSIONS.MANAGE_BOARD)) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    fetchedTask?.createdBy === user?.id;

  const canDelete =
    canArchive &&
    (fetchedTask?.type === ENTITIES_TYPES.TASK || fetchedTask?.type === ENTITIES_TYPES.MILESTONE || isTaskProposal);
  const canApproveProposal =
    permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.CREATE_TASK);

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

  const closeProposal = () => {
    closeTaskProposal({
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
      refetchQueries: ['GetOrgTaskBoardProposals', 'getUserTaskBoardProposals'],
    });
    document.body.setAttribute('style', `position: relative;`);
    handleClose();
  };
  const canClaim =
    fetchedTask?.taskApplicationPermissions?.canClaim &&
    !isViewNft &&
    ((fetchedTask?.orgId &&
      userPermissionsContext?.orgPermissions &&
      fetchedTask?.orgId in userPermissionsContext?.orgPermissions) ||
      fetchedTask?.privacyLevel === PRIVACY_LEVEL.public);

  const canApply = !canClaim && fetchedTask?.taskApplicationPermissions?.canApply;

  const taskCreatedBefore = differenceInDays(new Date(), new Date(fetchedTask?.createdAt));

  const handleReviewButton = () => {
    if (activeTab !== tabs.applications) {
      setActiveTab(tabs.applications);
    }
    sectionRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSnapshot = () => openSnapshot(orgSnapshot, fetchedTask, isTest);

  const handleModalClose = () => {
    setFetchedTask(null);
    handleClose();
  };

  const remaininTaskCategories = fetchedTask?.categories
    ?.filter((category) => category?.name !== GR15DEICategoryName)
    .map((category) => {
      const newCategory = {
        ...category,
        name: CATEGORY_LABELS[category?.name],
      };
      return newCategory;
    });
  return (
    <ApprovedSubmissionContext.Provider
      value={{
        setApprovedSubmission,
      }}
    >
      <>
        {!isViewNft && (
          <ActionModals
            completeModal={completeModal}
            setCompleteModal={setCompleteModal}
            taskType={taskType}
            fetchedTask={fetchedTask}
            archiveTask={archiveTask}
            archiveTaskMutation={archiveTaskMutation}
            handleOnCloseArchiveTaskModal={handleOnCloseArchiveTaskModal}
            deleteTask={deleteTask}
            setDeleteTask={setDeleteTask}
            handleClose={handleClose}
            setSnackbarAlertOpen={setSnackbarAlertOpen}
            setSnackbarAlertMessage={setSnackbarAlertMessage}
          />
        )}
        <TaskContext.Provider value={{ fetchedTask, refetch, tokenData }}>
          <TaskModal open={open} onClose={handleModalClose}>
            <TaskModalCard fullScreen={fullScreen}>
              {!!fetchedTask && canViewTask !== null && (
                <>
                  {canViewTask ? (
                    <>
                      <TaskModalHeader>
                        <TaskModalHeaderWrapper>
                          <TaskModalHeaderIconWrapper
                            onClick={() => {
                              handleClose();
                              router.push(`/organization/${fetchedTask?.orgUsername}/home`, undefined, {
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
                          {isSubtask && fetchedTask?.type === TASK_TYPE && (
                            <>
                              <TaskModalHeaderArrow />
                              <Tooltip title="Parent Task" placement="top">
                                <SubtaskTitleWrapper
                                  onClick={() => {
                                    const query = {
                                      ...router.query,
                                      task: fetchedTask?.parentTaskId,
                                    };

                                    router.push({ query }, undefined, { scroll: false, shallow: true });
                                  }}
                                >
                                  <TaskModalHeaderIconWrapper>
                                    <CheckedBoxIcon />
                                  </TaskModalHeaderIconWrapper>
                                  <TaskModalHeaderTypography>
                                    {cutString(fetchedTask?.parentTask?.title, 20)}
                                  </TaskModalHeaderTypography>
                                </SubtaskTitleWrapper>
                              </Tooltip>
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
                                tooltipTitle={
                                  fetchedTask?.privacyLevel !== PRIVACY_LEVEL.public ? 'Members only' : 'Public'
                                }
                              />
                            </>
                          )}
                        </TaskModalHeaderWrapper>
                        <TaskModalHeaderWrapperRight>
                          {back && (
                            <TaskModalHeaderBackToList onClick={handleClose}>Back to list</TaskModalHeaderBackToList>
                          )}
                          <TaskModalHeaderShare fetchedTask={fetchedTask} />
                          <TaskModalHeaderOpenInFullIcon
                            isFullScreen={fullScreen}
                            onClick={() => setFullScreen(!fullScreen)}
                          />
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
                      <TaskModalTaskData hideRowGap={isViewNft || isTaskProposal} fullScreen={fullScreen}>
                        <TaskModalTitleDescriptionMedia fullScreen={fullScreen}>
                          <TaskModalTitle>{fetchedTask?.title}</TaskModalTitle>
                          {!isViewNft ? (
                            <TaskModalTaskStatusMoreInfo>
                              {fetchedTask?.snapshotId && (
                                <TaskModalSnapshot onClick={handleSnapshot}>
                                  <TaskModalSnapshotLogo />
                                  <TaskModalSnapshotText>Snapshot Proposal</TaskModalSnapshotText>
                                </TaskModalSnapshot>
                              )}
                              {canEdit && <TaskMenuStatus task={fetchedTask} isTaskProposal={isTaskProposal} />}
                              {isMilestone && (
                                <MilestoneProgressViewModal milestoneId={fetchedTask?.id} isMilestone={isMilestone} />
                              )}
                            </TaskModalTaskStatusMoreInfo>
                          ) : null}
                          <TaskDescriptionTextWrapper text={fetchedTask?.description} key={fetchedTask?.id} />
                          <TaskMediaWrapper media={fetchedTask?.media} />
                          {!fullScreen && <TaskBorder />}
                          {isTaskProposal && (
                            <VoteResults
                              userInOrg={userInOrg}
                              fullScreen={fullScreen}
                              proposalStatus={getProposalStatus(fetchedTask)}
                              proposal={fetchedTask}
                            />
                          )}
                        </TaskModalTitleDescriptionMedia>
                        <TaskSectionDisplayDivWrapper fullScreen={fullScreen}>
                          <TaskSectionDisplayData>
                            <TaskMintComponent
                              assigneeId={fetchedTask?.assigneeId}
                              taskStatus={fetchedTask?.status}
                              taskMintData={fetchedTask?.taskMint}
                              isViewNft={isViewNft}
                              setIsViewNft={setIsViewNft}
                              taskId={fetchedTask?.id}
                            />
                            <ReviewerField
                              shouldDisplay={!isTaskProposal && !isMilestone}
                              reviewerData={reviewerData}
                              handleClose={handleClose}
                              canEdit={canEdit}
                              fetchedTask={fetchedTask}
                              user={user}
                            />
                            <AssigneeField
                              boardColumns={boardColumns}
                              canApply={canApply}
                              canClaim={canClaim}
                              canEdit={canEdit}
                              fetchedTask={fetchedTask}
                              handleClose={handleClose}
                              isTaskProposal={isTaskProposal}
                              orgId={board?.orgId}
                              podId={board?.podId}
                              shouldDisplay={showAssignee}
                              updateProposalItem={updateProposalItem}
                              user={user}
                              userId={board?.userId}
                            />
                            {!isViewNft && <WatchersField fetchedTask={fetchedTask} />}
                            <ApplicationField
                              shouldDisplay={
                                canViewApplications && taskApplicationCount?.getTaskApplicationsCount?.total > 0
                              }
                              taskApplicationCount={taskApplicationCount}
                              handleReviewButton={handleReviewButton}
                            />
                            <ProposerField
                              shouldDisplay={isTaskProposal && !isMilestone}
                              creatorProfilePicture={fetchedTask?.creatorProfilePicture}
                              creatorUsername={fetchedTask?.creatorUsername}
                              handleClose={handleClose}
                            />
                            <DueDateField
                              dueDate={fetchedTask?.dueDate}
                              shouldDisplay={fetchedTask?.dueDate}
                              recurringSchema={fetchedTask?.recurringSchema}
                              shouldUnclaimOnDueDateExpiry={fetchedTask?.shouldUnclaimOnDueDateExpiry}
                            />
                            <Rewards fetchedTask={fetchedTask} user={user} />
                            <PointsField shouldDisplay={!!fetchedTask?.points} points={fetchedTask?.points} />
                            <MilestoneField
                              shouldDisplay={!!fetchedTask?.milestoneId}
                              milestoneId={fetchedTask?.milestoneId}
                              getTaskById={getTaskById}
                              milestoneTitle={fetchedTask?.milestone?.title || fetchedTask?.milestoneTitle}
                            />
                            <PriorityField priority={fetchedTask?.priority} />
                            <CategoryField
                              shouldDisplay={remaininTaskCategories?.length > 0}
                              labels={remaininTaskCategories}
                            />
                            <TagsField shouldDisplay={fetchedTask?.labels?.length > 0} labels={fetchedTask?.labels} />
                            <InitativesField shouldDisplay={hasGR15DEIIntiative(fetchedTask?.categories)} />
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
                                      <CreateFormCancelButton onClick={closeProposal}>Reject</CreateFormCancelButton>
                                    )}
                                    <CreateFormPreviewButton onClick={approveProposal}>Approve</CreateFormPreviewButton>
                                  </CreateFormButtonsBlock>
                                )}
                              </CreateFormFooterButtons>
                            )}
                            {isViewNft ? (
                              <ViewNftFields
                                taskId={fetchedTask?.id}
                                onClose={() => setIsViewNft(false)}
                                taskTitle={fetchedTask?.title}
                              />
                            ) : null}
                            <GithubButtons fetchedTask={fetchedTask} />
                          </TaskSectionDisplayData>
                          <TaskSectionDisplayCreator>
                            {fetchedTask?.creatorUsername && !isTaskProposal && (
                              <TaskSectionImageContent
                                hasContent={fetchedTask?.creatorUsername}
                                imgSrc={fetchedTask?.creatorProfilePicture}
                                DefaultImageComponent={() => <DefaultUserImage />}
                                ContentComponent={() => (
                                  <TaskSectionInfoTextCreator>
                                    {fetchedTask?.creatorUsername}{' '}
                                    <TaskSectionInfoCreatorTask>
                                      created this {fetchedTask?.type}{' '}
                                    </TaskSectionInfoCreatorTask>
                                    {fetchedTask?.createdAt && (
                                      <TaskSectionInfoCreatorDaysAgo>
                                        {formatDateDisplay(fetchedTask?.createdAt, true)}
                                        {/* {taskCreatedBefore >= 7 ? (
                                      <>on {format(new Date(fetchedTask?.createdAt), 'MM/dd/yyyy')}</>
                                    ) : (
                                      formatDistance(new Date(fetchedTask?.createdAt), new Date(), {
                                        addSuffix: true,
                                      })
                                    )} */}
                                      </TaskSectionInfoCreatorDaysAgo>
                                    )}
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
                        {isViewNft ? (
                          <TaskViewNft
                            taskId={fetchedTask?.id}
                            getTaskMintTokenData={getTaskMintTokenData}
                            tokenData={tokenData}
                          />
                        ) : (
                          <TaskViewModalFooter
                            fullScreen={fullScreen}
                            canApply={canApply}
                            canClaim={canClaim}
                            ref={sectionRef}
                            board={board}
                            permissions={permissions}
                            taskApplicationCount={taskApplicationCount?.getTaskApplicationsCount?.total}
                            isTaskProposal={isTaskProposal}
                            isBounty={isBounty}
                            isMilestone={isMilestone}
                            isSubtask={isSubtask}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            fetchedTask={fetchedTask}
                            user={user}
                            canViewApplications={canViewApplications}
                            boardColumns={boardColumns}
                            taskSubmissionsForTask={taskSubmissionsForTask}
                            getTaskSubmissionsForTask={getTaskSubmissionsForTask}
                            handleClose={handleClose}
                            setFetchedTask={setFetchedTask}
                            setShowPaymentModal={setShowPaymentModal}
                            taskSubmissionsForTaskLoading={taskSubmissionsForTaskLoading}
                          />
                        )}
                      </TaskModalTaskData>
                    </>
                  ) : (
                    <LockedTaskMessage handleClose={handleModalClose} />
                  )}
                </>
              )}
            </TaskModalCard>
          </TaskModal>
        </TaskContext.Provider>
      </>
    </ApprovedSubmissionContext.Provider>
  );
};
