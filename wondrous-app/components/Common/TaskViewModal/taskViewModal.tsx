import { useLazyQuery, useMutation } from '@apollo/client';
import { useTaskApplicationCount } from 'components/Common/TaskApplication';
import { CreateEntity } from 'components/CreateEntity';
import Tooltip from 'components/Tooltip';
import { format, formatDistance } from 'date-fns';
import { ARCHIVE_TASK } from 'graphql/mutations/task';
import { APPROVE_TASK_PROPOSAL, CLOSE_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import { GET_ORG_LABELS } from 'graphql/queries';
import { GET_TASK_BY_ID, GET_TASK_REVIEWERS, GET_TASK_SUBMISSIONS_FOR_TASK } from 'graphql/queries/task';
import { GET_TASK_PROPOSAL_BY_ID } from 'graphql/queries/taskProposal';
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
  TASK_TYPE,
} from 'utils/constants';
import { ApprovedSubmissionContext } from 'utils/contexts';
import {
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
} from 'utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';

import { useMe } from '../../Auth/withAuth';
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
import DefaultUserImage from '../Image/DefaultUserImage';
import { MilestoneProgressViewModal } from '../MilestoneProgress';
import { MakePaymentModal } from '../Payment/PaymentModal';
import { SnackbarAlertContext } from '../SnackbarAlert';
import { flexDivStyle, rejectIconStyle } from '../TaskSummary';
import {
  SubtaskIconWrapper,
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
import { TaskMenuStatus } from './taskMenuStatus';
import VoteResults from 'components/Common/Votes';
import { ProposalVoteType } from 'utils/constants';
import { TaskDescriptionTextWrapper, TaskSectionImageContent, Rewards, GithubButtons, Menu } from './helpers';
import { openSnapshot } from './utils';
import { tabs } from './constants';
import ActionModals from './actionModals';
import TaskViewModalFooter from './taskViewModalFooter';
import {
  ReviewerField,
  AssigneeField,
  ApplicationField,
  ProposerField,
  VotesField,
  DueDateField,
  PointsField,
  MilestoneField,
  TagsField,
} from './taskViewModalFields';

interface ITaskListModalProps {
  open: boolean;
  handleClose: () => any;
  taskId: string;
  isTaskProposal?: boolean;
  back?: boolean;
  disableEnforceFocus?: boolean;
  shouldFocusAfterRender?: boolean;
}

export const TaskViewModal = (props: ITaskListModalProps) => {
  const { open, handleClose, taskId, isTaskProposal, back } = props;
  const [fetchedTask, setFetchedTask] = useState(null);
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
  const {
    loading: taskApplicationCountLoading,
    error: taskApplicationCountError,
    data: taskApplicationCount,
  } = useTaskApplicationCount(fetchedTask?.id);

  const userPermissionsContext = getUserPermissionContext();
  const boardColumns = useColumns();
  const [getTaskSubmissionsForTask, { data: taskSubmissionsForTask, loading: taskSubmissionsForTaskLoading }] =
    useLazyQuery(GET_TASK_SUBMISSIONS_FOR_TASK);
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);
  const [completeModal, setCompleteModal] = useState(false);
  const router = useRouter();
  const [editTask, setEditTask] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
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
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: fetchedTask?.orgId,
    podId: fetchedTask?.podId,
  });

  const canEdit =
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    fetchedTask?.createdBy === user?.id ||
    (fetchedTask?.assigneeId && fetchedTask?.assigneeId === user?.id);
  const canViewApplications =
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    (fetchedTask?.createdBy === user?.id && fetchedTask?.type === TASK_TYPE);

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

  const totalVotes =
    Number(fetchedTask?.votes?.counts[ProposalVoteType.APPROVE]) +
    Number(fetchedTask?.votes?.counts[ProposalVoteType.REJECT]);

  const handleSnapshot = () => openSnapshot(orgSnapshot, fetchedTask, isTest);
  return (
    <ApprovedSubmissionContext.Provider
      value={{
        setApprovedSubmission,
      }}
    >
      <>
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
                  entityType={entityType}
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
                    <TaskModalSnapshot onClick={handleSnapshot}>
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
                  <ReviewerField
                    shouldDisplay={!isTaskProposal && !isMilestone}
                    reviewerData={reviewerData}
                    handleClose={handleClose}
                  />
                  <AssigneeField
                    shouldDisplay={showAssignee}
                    fetchedTask={fetchedTask}
                    canEdit={canEdit}
                    setFetchedTask={setFetchedTask}
                    updateInReviewItem={updateInReviewItem}
                    boardColumns={boardColumns}
                    handleClose={handleClose}
                    user={user}
                    canClaim={canClaim}
                    isTaskProposal={isTaskProposal}
                    updateProposalItem={updateProposalItem}
                    updateInProgressTask={updateInProgressTask}
                    updateTaskItem={updateTaskItem}
                    updateCompletedItem={updateCompletedItem}
                    canApply={canApply}
                    orgId={board?.orgId}
                    podId={board?.podId}
                    userId={board?.userId}
                  />
                  <ApplicationField
                    shouldDisplay={canViewApplications && taskApplicationCount?.getTaskApplicationsCount?.total > 0}
                    taskApplicationCount={taskApplicationCount}
                    handleReviewButton={handleReviewButton}
                  />
                  <ProposerField
                    shouldDisplay={isTaskProposal && !isMilestone}
                    creatorProfilePicture={fetchedTask?.creatorProfilePicture}
                    creatorUsername={fetchedTask?.creatorUsername}
                    handleClose={handleClose}
                  />
                  <VotesField
                    shouldDisplay={isTaskProposal && !isMilestone}
                    totalVotes={totalVotes}
                    hasContent={fetchedTask?.votes}
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
                  <TagsField shouldDisplay={fetchedTask?.labels?.length > 0} labels={fetchedTask?.labels} />
                  {isTaskProposal && (
                    <>
                      <VoteResults
                        totalVotes={totalVotes}
                        fullScreen={fullScreen}
                        votes={fetchedTask?.votes}
                        proposalStatus={getProposalStatus(fetchedTask)}
                        taskId={fetchedTask?.id}
                      />
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
                    </>
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
            </TaskModalTaskData>
          </TaskModalCard>
        </TaskModal>
      </>
    </ApprovedSubmissionContext.Provider>
  );
};
