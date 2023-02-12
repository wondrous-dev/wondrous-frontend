import { useLazyQuery, useMutation } from '@apollo/client';
import { useTaskApplicationCount } from 'components/Common/TaskApplication';
import { CreateEntity } from 'components/CreateEntity';
import Tooltip from 'components/Tooltip';
import { differenceInDays } from 'date-fns';
import { ARCHIVE_TASK } from 'graphql/mutations/task';
import { SEARCH_USER_CREATED_TASKS } from 'graphql/queries';
import {
  GET_MINT_TASK_TOKEN_DATA,
  GET_TASK_BY_ID,
  GET_TASK_REVIEWERS,
  GET_TASK_SUBMISSIONS_FOR_TASK,
} from 'graphql/queries/task';
import { GET_TASK_PROPOSAL_BY_ID } from 'graphql/queries/taskProposal';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useSnapshot } from 'services/snapshot';
import { formatDateDisplay, getProposalStatus } from 'utils/board';
import {
  BOUNTY_TYPE,
  ENTITIES_TYPES,
  MILESTONE_TYPE,
  PERMISSIONS,
  PRIVACY_LEVEL,
  STATUS_OPEN,
  TaskMintStatus,
  TASK_STATUS_ARCHIVED,
  TASK_TYPE,
} from 'utils/constants';
import { ApprovedSubmissionContext, TaskContext } from 'utils/contexts';
import {
  cutString,
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
} from 'utils/helpers';
import { useBoards, useCanViewTask, useColumns, useGlobalContext, useIsMobile } from 'utils/hooks';

import VoteResults from 'components/Common/Votes';

import { useMe } from 'components/Auth/withAuth';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { MilestoneProgressViewModal } from 'components/Common/MilestoneProgress';
import MakePaymentModal from 'components/Common/Payment/PaymentModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { flexDivStyle, rejectIconStyle } from 'components/Common/TaskSummary';
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
import { useHotkeys } from 'react-hotkeys-hook';
import { HOTKEYS } from 'utils/hotkeyHelper';
import ViewNftFields from '../TaskMint/ViewNftFields';
import TaskViewNft from '../TaskViewNft';
import ActionModals from './ActionModalsComponent';
import { tabs } from './constants';
import { Description, ModalFields, Title } from './Fields';
import { GithubButtons, LockedTaskMessage, useManageProposals, Menu, TaskSectionImageContent } from './helpers';
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
  TaskModalTitleDescriptionMedia,
  TaskSectionDisplayCreator,
  TaskSectionDisplayData,
  TaskSectionDisplayDivWrapper,
  TaskSectionInfoCreatorDaysAgo,
  TaskSectionInfoCreatorTask,
  TaskSectionInfoTextCreator,
  TaskStatusHeaderText,
} from './styles';
import TaskViewModalFooter from './Footer';
import { openSnapshot } from './utils';
import { useTaskViewModalState } from './Fields/hooks/useTaskViewModalState';

interface ITaskListModalProps {
  open: boolean;
  handleClose: () => any;
  taskId: string;
  isTaskProposal?: boolean;
  back?: boolean;
}

export const TaskViewModal = ({ open, handleClose, taskId, isTaskProposal = false, back }: ITaskListModalProps) => {
  const {
    editTask,
    setEditTask,
    fullScreen,
    setFullScreen,
    activeTab,
    setActiveTab,
    archiveTask,
    setArchiveTask,
    deleteTask,
    setDeleteTask,
    initialStatus,
    setInitialStatus,
    showPaymentModal,
    setShowPaymentModal,
    completeModal,
    setCompleteModal,
    isViewNft,
    setIsViewNft,
    fetchedTask,
    setFetchedTask,
    approvedSubmission,
    setApprovedSubmission,
  } = useTaskViewModalState();
  const isMilestone = fetchedTask?.type === MILESTONE_TYPE;
  const isSubtask = fetchedTask?.parentTaskId !== null;
  const isBounty = fetchedTask?.type === BOUNTY_TYPE;
  const entityType = isTaskProposal ? ENTITIES_TYPES.PROPOSAL : fetchedTask?.type;
  const globalContext = useGlobalContext();
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const board: any = useBoards();
  const { data: taskApplicationCount } = useTaskApplicationCount(fetchedTask?.id);

  const [getTaskMintTokenData, tokenData] = useLazyQuery(GET_MINT_TASK_TOKEN_DATA);
  const userPermissionsContext = getUserPermissionContext();
  const boardColumns = useColumns();
  const [getTaskSubmissionsForTask, { data: taskSubmissionsForTask, loading: taskSubmissionsForTaskLoading }] =
    useLazyQuery(GET_TASK_SUBMISSIONS_FOR_TASK);
  const router = useRouter();
  const isMobile = useIsMobile();

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

  const [getTaskProposalById, { refetch: refetchProposal }] = useLazyQuery(GET_TASK_PROPOSAL_BY_ID, {
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

  useEffect(() => {
    if (isMobile && fullScreen) {
      setFullScreen(false);
    }
  }, [isMobile]);

  const { approveProposal, closeProposal } = useManageProposals({
    fetchedTask,
    entityType: board?.entityType,
    handleClose,
  });
  useHotkeys(HOTKEYS.CREATE_COMMENT, () => {
    setActiveTab(tabs.discussion);
  });

  useEffect(() => {
    if (open) {
      if (initialStatus !== TASK_STATUS_ARCHIVED && fetchedTask?.status !== initialStatus) {
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

  useEffect(() => {
    if (isMobile) {
      setFullScreen(false);
    }
  }, [isMobile]);

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
  const userInOrg =
    userPermissionsContext?.orgPermissions && fetchedTask?.orgId in userPermissionsContext.orgPermissions;

  const proposalStatus = getProposalStatus(fetchedTask);

  const canEdit =
    !isViewNft &&
    (isTaskProposal ? proposalStatus === STATUS_OPEN : true) &&
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

  return (
    <ApprovedSubmissionContext.Provider
      value={{
        setApprovedSubmission,
      }}
    >
      <>
        {showPaymentModal && approvedSubmission ? (
          <MakePaymentModal
            handleGoBack={handleGoBackToTask}
            open={showPaymentModal}
            submissionOrApplication={approvedSubmission}
            setShowPaymentModal={setShowPaymentModal}
            taskOrGrant={fetchedTask}
          />
        ) : null}

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
        <TaskContext.Provider
          value={{ fetchedTask, refetch: isTaskProposal ? refetchProposal : refetch, tokenData, entityType }}
        >
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
                                  router.push(`/pod/${fetchedTask?.podId}/home`, undefined, {
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
                          <Title title={fetchedTask?.title} canEdit={canEdit} />
                          {!isViewNft ? (
                            <TaskModalTaskStatusMoreInfo>
                              {fetchedTask?.snapshotId && (
                                <TaskModalSnapshot onClick={handleSnapshot}>
                                  <TaskModalSnapshotLogo />
                                  <TaskModalSnapshotText>Snapshot Proposal</TaskModalSnapshotText>
                                </TaskModalSnapshot>
                              )}
                              {isMilestone && (
                                <MilestoneProgressViewModal milestoneId={fetchedTask?.id} isMilestone={isMilestone} />
                              )}
                            </TaskModalTaskStatusMoreInfo>
                          ) : null}
                          <Description
                            canEdit={canEdit}
                            description={fetchedTask?.description}
                            orgId={fetchedTask?.org.id}
                            editGridStyle={{
                              height: 'unset',
                            }}
                          />
                          <TaskMediaWrapper media={fetchedTask?.media} />
                          {!fullScreen && <TaskBorder />}
                          {isTaskProposal && (
                            <VoteResults
                              userInOrg={userInOrg}
                              fullScreen={fullScreen}
                              proposalStatus={proposalStatus}
                              proposal={fetchedTask}
                            />
                          )}
                        </TaskModalTitleDescriptionMedia>
                        <TaskSectionDisplayDivWrapper fullScreen={fullScreen}>
                          <TaskSectionDisplayData>
                            <ModalFields
                              fetchedTask={fetchedTask}
                              isViewNft={isViewNft}
                              setIsViewNft={setIsViewNft}
                              canEdit={canEdit}
                              isTaskProposal={isTaskProposal}
                              canArchive={canArchive}
                              isMilestone={isMilestone}
                              reviewerData={reviewerData}
                              canApply={canApply}
                              canClaim={canClaim}
                              showAssignee={showAssignee}
                              canViewApplications={canViewApplications}
                              taskApplicationCount={taskApplicationCount}
                              handleReviewButton={handleReviewButton}
                              handleClose={handleClose}
                              entityType={entityType}
                              getTaskById={getTaskById}
                              isSubtask={isSubtask}
                            />
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
