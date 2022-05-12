import { useApolloClient, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { UPDATE_TASK_ASSIGNEE, UPDATE_TASK_STATUS } from 'graphql/mutations';
import { GET_TASK_REVIEWERS } from 'graphql/queries';
import { ViewType } from 'types/common';
import { delQuery } from 'utils';
import { updateInProgressTask, updateTaskItem } from 'utils/board';
import { renderMentionString } from 'utils/common';
import * as Constants from 'utils/constants';
import {
  COLUMN_TITLE_ARCHIVED,
  ENTITIES_TYPES,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_TODO,
} from 'utils/constants';
import { cutString, parseUserPermissionContext, shrinkNumber, transformTaskToTaskCard } from 'utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { useLocation } from 'utils/useLocation';
import { useMe } from '../Auth/withAuth';
import { ArchiveTaskModal } from '../Common/ArchiveTaskModal';
import { AvatarList } from '../Common/AvatarList';
import { DropDown, DropDownItem } from '../Common/dropdown';
import { SafeImage } from '../Common/Image';
import { LoadMore } from '../Common/KanbanBoard/styles';
import { KudosForm } from '../Common/KudosForm';
import { SnackbarAlertContext } from '../Common/SnackbarAlert';
import { TaskViewModal } from '../Common/Task/modal';
import { ArchivedTaskUndo, ClaimButton } from '../Common/Task/styles';
import EditLayoutBaseModal from '../CreateEntity/editEntityModal';
import { CreateModalOverlay } from '../CreateEntity/styles';
import { DropDownButtonDecision } from '../DropDownDecision/DropDownButton';
import { Claim } from '../Icons/claimTask';
import ImageIcon from '../Icons/image';
import AudioIcon from '../Icons/MediaTypesIcons/audio';
import PlayIcon from '../Icons/play';
import { TaskMenuIcon } from '../Icons/taskMenu';
import TaskStatus from '../Icons/TaskStatus';
import {
  Box,
  Initials,
  MoreOptions,
  Reward,
  RewardAmount,
  RewardContainer,
  StyledLinkIcon,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  TaskDescription,
  TaskTitle,
} from './styles';
import { Red800 } from 'theme/colors';
import { DeleteTaskModal } from 'components/Common/DeleteTaskModal';

const DELIVERABLES_ICONS = {
  audio: <AudioIcon />,
  image: <ImageIcon />,
  link: <StyledLinkIcon />,
  video: <PlayIcon />,
};

const STATUS_BY_TYPENAME = {
  TaskSubmissionCard: TASK_STATUS_IN_REVIEW,
  TaskProposalCard: TASK_STATUS_REQUESTED,
};

let windowOffset = 0;
export const Table = (props) => {
  const { columns, onLoadMore, hasMore, allTasks, limit, isAdmin } = props;
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [editableTask, setEditableTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [isArchiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isKudosModalOpen, setKudosModalOpen] = useState(false);
  const [kudosTask, setKudosTask] = useState(null);
  const [ref, inView] = useInView({});
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const user = useMe();
  const board = orgBoard || podBoard || userBoard;
  const boardColumns = useColumns();
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  let tasksCount = 0;
  const location = useLocation();

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);

  const [updateTaskStatusMutation] = useMutation(UPDATE_TASK_STATUS);

  async function editTask(task, status = '') {
    let populatedTask = { ...task };
    const isTaskProposal =
      status === Constants.TASK_STATUS_REQUESTED || status === Constants.TASK_STATUS_PROPOSAL_REQUEST;

    if (!isTaskProposal) {
      const isTaskSubmission =
        status === Constants.TASK_STATUS_IN_REVIEW || status === Constants.TASK_STATUS_SUBMISSION_REQUEST;
      const {
        data: { getTaskReviewers },
      } = await apolloClient.query({
        query: GET_TASK_REVIEWERS,
        variables: {
          taskId: !isTaskSubmission ? task?.id : task?.taskId,
        },
      });

      populatedTask.reviewers = getTaskReviewers || [];
    }

    setEditableTask(populatedTask);
  }

  async function handleNewStatus(task, status) {
    updateTaskStatusMutation({
      variables: {
        taskId: task?.taskId ?? task?.id,
        input: {
          newStatus: status,
        },
      },
    });
  }
  const [updateTaskAssignee] = useMutation(UPDATE_TASK_ASSIGNEE);
  async function archiveTask(task) {
    const newColumns = [...boardColumns.columns];
    const column = newColumns.find((column) => column.tasks.includes(task));
    let taskIndex;

    await apolloClient.mutate({
      mutation: UPDATE_TASK_STATUS,
      variables: {
        taskId: task?.taskId ?? task?.id,
        input: {
          newStatus: TASK_STATUS_ARCHIVED,
        },
      },
      refetchQueries: () => [
        'getSubmissionsUserCanReview',
        'getWorkFlowBoardReviewableItemsCount',
        'getUserTaskBoardTasks',
      ],
    });

    if (column) {
      taskIndex = column.tasks.indexOf(selectedTask);
      column.tasks.splice(taskIndex, 1);
      boardColumns?.setColumns(newColumns);
    }

    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage(
      <>
        Task archived successfully!{' '}
        <ArchivedTaskUndo
          onClick={() => {
            handleNewStatus(selectedTask, selectedTask.status);
            setSnackbarAlertOpen(false);
            setSelectedTask(null);

            if (taskIndex > -1) {
              column.tasks.splice(taskIndex, 0, task);
              boardColumns?.setColumns([...newColumns]);
            }
          }}
        >
          Undo
        </ArchivedTaskUndo>
      </>
    );
  }

  function openTask(e, taskUrl) {
    const isCommandKeyPressed = e.metaKey || e.ctrlKey;

    if (!isCommandKeyPressed) {
      location.replace(taskUrl);
    }
  }

  const taskType = (selectedTask) => {
    const typeName = selectedTask?.__typename;
    const taskType = {
      TaskProposalCard: 'task proposal',
      TaskSubmissionCard: 'task',
    };
    return taskType[typeName] ?? selectedTask?.type;
  };

  const handleKudosFormOnClose = () => {
    setKudosModalOpen(false);
    setKudosTask(null);
  };

  useEffect(() => {
    if (
      (location.params.task || location.params.taskProposal) &&
      (location.params.view == ViewType.List || location.params.view == ViewType.Admin)
    ) {
      setPreviewModalOpen(true);
    } else {
      setPreviewModalOpen(false);
    }
  }, [location.params.task, location.params.taskProposal, location.params.view]);

  return (
    <>
      <TaskViewModal
        open={isPreviewModalOpen}
        handleClose={() => {
          location.replace(`${delQuery(router.asPath)}?view=${location.params.view ?? ViewType.Grid}`);
        }}
        isTaskProposal={!!location.params.taskProposal}
        taskId={(location.params.taskProposal ?? location.params.task)?.toString()}
      />
      {isArchiveModalOpen && selectedTask?.id ? (
        <ArchiveTaskModal
          taskId={selectedTask?.id}
          open={isArchiveModalOpen}
          taskType={taskType(selectedTask)}
          onClose={() => setArchiveModalOpen(false)}
          onArchive={() => archiveTask(selectedTask)}
        />
      ) : null}
      {isDeleteModalOpen && selectedTask?.id ? (
        <DeleteTaskModal
          taskId={selectedTask?.id}
          open={isDeleteModalOpen}
          taskType={taskType(selectedTask)}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={() => {
            setSnackbarAlertMessage('Deleted successfully!');
            setSnackbarAlertOpen(true);
          }}
        />
      ) : null}
      {editableTask ? (
        <CreateModalOverlay
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={open}
          onClose={() => {
            setEditableTask(false);
          }}
        >
          <EditLayoutBaseModal
            open={open}
            entityType={ENTITIES_TYPES.TASK}
            handleClose={() => setEditableTask(false)}
            cancelEdit={() => setEditableTask(false)}
            existingTask={editableTask}
            isTaskProposal={editableTask.type === Constants.TASK_STATUS_REQUESTED}
          />
        </CreateModalOverlay>
      ) : null}
      <KudosForm onClose={handleKudosFormOnClose} open={isKudosModalOpen} submission={kudosTask} />

      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell align="center" width="56px">
                DAO
              </StyledTableCell>
              <StyledTableCell align="center" width="105px">
                {isAdmin ? 'Created by' : 'Assigned'}
              </StyledTableCell>
              <StyledTableCell align="center" width="77px">
                Status
              </StyledTableCell>
              <StyledTableCell width="383px">Task</StyledTableCell>
              {/*<StyledTableCell width="190px">Deliverables</StyledTableCell>*/}
              <StyledTableCell align="center" width="88px">
                Reward
              </StyledTableCell>
              {isAdmin && (
                <StyledTableCell align="center" width="80px">
                  Decision
                </StyledTableCell>
              )}
              <StyledTableCell width="54px"></StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            {columns.map((column, index) => {
              let tasks = [...column.tasks];
              if (column?.section?.tasks) tasks = [...tasks, ...column?.section?.tasks];
              // Don't show archived tasks
              if (column?.section?.title === COLUMN_TITLE_ARCHIVED) {
                tasks = column.tasks;
              }

              return tasks.map((task, index) => {
                if (limit && tasksCount >= limit) {
                  return;
                }
                tasksCount++;
                const status = task?.status ?? column?.section?.filter?.taskType ?? column?.status;
                const dropdownItemLabel =
                  status === Constants.TASK_STATUS_PROPOSAL_REQUEST || status === Constants.TASK_STATUS_REQUESTED
                    ? 'task proposal'
                    : 'task';
                const permissions = parseUserPermissionContext({
                  userPermissionsContext,
                  orgId: task?.orgId,
                  podId: task?.podId,
                });

                const reward = (task.rewards || [])[0];

                const canManageTask =
                  permissions.includes(Constants.PERMISSIONS.MANAGE_BOARD) ||
                  permissions.includes(Constants.PERMISSIONS.FULL_ACCESS) ||
                  task?.createdBy === user?.id;

                const username =
                  task?.__typename === 'TaskSubmissionCard' || task?.__typename === 'TaskProposalCard'
                    ? task?.creatorUsername
                    : task.assigneeUsername;
                const userProfilePicture =
                  task?.__typename === 'TaskSubmissionCard' || task?.__typename === 'TaskProposalCard'
                    ? task?.creatorProfilePicture
                    : task.assigneeProfilePicture;

                const view = location.params.view ?? ViewType.List;
                let taskUrl = `${delQuery(router.asPath)}?task=${task?.id}&view=${view}`;

                if (status === TASK_STATUS_REQUESTED || status === TASK_STATUS_PROPOSAL_REQUEST) {
                  taskUrl = `${delQuery(router.asPath)}?taskProposal=${task?.id}&view=${view}`;
                } else if (status === TASK_STATUS_IN_REVIEW || status === TASK_STATUS_SUBMISSION_REQUEST) {
                  taskUrl = `${delQuery(router.asPath)}?task=${task?.taskId}&view=${view}`;
                }

                return (
                  <StyledTableRow key={task.id}>
                    <StyledTableCell align="center">
                      {task.orgProfilePicture ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <SafeImage
                          src={task?.orgProfilePicture}
                          style={{
                            width: '17px',
                            height: '17px',
                            borderRadius: '17px',
                          }}
                        />
                      ) : null}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        {userProfilePicture && (
                          <AvatarList
                            align="center"
                            users={[
                              {
                                avatar: {
                                  url: userProfilePicture,
                                },
                                id: username,
                                initials: username,
                              },
                            ]}
                          />
                        )}
                        <Link passHref={true} href={`/profile/${username}/about`}>
                          <Initials>{username}</Initials>
                        </Link>
                      </div>
                      {!task?.assigneeId &&
                        (status === TASK_STATUS_TODO || status === TASK_STATUS_IN_PROGRESS) &&
                        task?.type === 'task' && (
                          <>
                            <ClaimButton
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateTaskAssignee({
                                  variables: {
                                    taskId: task?.id,
                                    assigneeId: user?.id,
                                  },
                                  onCompleted: (data) => {
                                    const task = data?.updateTaskAssignee;
                                    const transformedTask = transformTaskToTaskCard(task, {});
                                    if (board?.setColumns) {
                                      let columns = [...board?.columns];
                                      if (transformedTask.status === Constants.TASK_STATUS_IN_PROGRESS) {
                                        columns = updateInProgressTask(transformedTask, columns);
                                      } else if (transformedTask.status === Constants.TASK_STATUS_TODO) {
                                        columns = updateTaskItem(transformedTask, columns);
                                      }
                                      board.setColumns(columns);
                                    }
                                  },
                                });
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
                            </ClaimButton>
                          </>
                        )}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <TaskStatus status={status} />
                    </StyledTableCell>
                    <StyledTableCell className="clickable" onClick={(e) => openTask(e, taskUrl)}>
                      <TaskTitle>
                        <Link href={taskUrl}>{task.title}</Link>
                      </TaskTitle>
                      <TaskDescription
                        style={{
                          maxWidth: '600px',
                        }}
                      >
                        {renderMentionString({
                          content: cutString(task?.description),
                          router,
                        })}
                      </TaskDescription>
                    </StyledTableCell>
                    {/*<StyledTableCell>*/}
                    {/*  <DeliverableContainer>*/}
                    {/*    {Object.entries(groupBy(task?.media || [], 'type')).map(([key, value]: [string, any], index) => {*/}
                    {/*      return (*/}
                    {/*        <DeliverableItem key={index}>*/}
                    {/*          <DeliverablesIconContainer>{DELIVERABLES_ICONS[key]}</DeliverablesIconContainer>*/}
                    {/*          {value?.length}*/}
                    {/*        </DeliverableItem>*/}
                    {/*      );*/}
                    {/*    })}*/}
                    {/*  </DeliverableContainer>*/}
                    {/*</StyledTableCell>*/}
                    <StyledTableCell>
                      <RewardContainer>
                        {reward ? (
                          <Reward>
                            <SafeImage
                              src={reward.icon}
                              style={{
                                width: '16px',
                                height: '16px',
                              }}
                            />
                            <RewardAmount>{shrinkNumber(reward?.rewardAmount)}</RewardAmount>
                          </Reward>
                        ) : (
                          <Box color="#fff">None</Box>
                        )}
                      </RewardContainer>
                    </StyledTableCell>
                    {isAdmin && (
                      <StyledTableCell align="center">
                        <DropDownButtonDecision
                          task={task}
                          status={column.status}
                          openKudos={setKudosModalOpen}
                          setKudosTask={setKudosTask}
                        />
                      </StyledTableCell>
                    )}
                    <StyledTableCell align="center">
                      <MoreOptions disabled={!canManageTask}>
                        <DropDown DropdownHandler={TaskMenuIcon} fill="#1F1F1F">
                          <DropDownItem
                            key={'task-menu-edit-' + task.id}
                            onClick={() => editTask(task, status)}
                            color="#C4C4C4"
                            fontSize="13px"
                            fontWeight="normal"
                            textAlign="left"
                          >
                            Edit {dropdownItemLabel}
                          </DropDownItem>
                          <DropDownItem
                            key={'task-menu-report-' + task.id}
                            onClick={() => {
                              setSelectedTask(task);
                              setArchiveModalOpen(true);
                            }}
                            color="#C4C4C4"
                            fontSize="13px"
                            fontWeight="normal"
                            textAlign="left"
                          >
                            Archive {dropdownItemLabel}
                          </DropDownItem>
                          {(task?.type === Constants.TASK_TYPE || task?.type === Constants.MILESTONE_TYPE) && (
                            <DropDownItem
                              key={'task-menu-delete-' + task.id}
                              onClick={() => {
                                setSelectedTask(task);
                                setDeleteModalOpen(true);
                              }}
                              color={Red800}
                              fontSize="13px"
                              fontWeight="normal"
                              textAlign="left"
                            >
                              Delete {dropdownItemLabel}
                            </DropDownItem>
                          )}
                        </DropDown>
                      </MoreOptions>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              });
            })}
          </StyledTableBody>
        </StyledTable>

        <LoadMore ref={ref} hasMore={hasMore} />
      </StyledTableContainer>
    </>
  );
};
