import React, { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

import {
  COLUMN_TITLE_ARCHIVED,
  ENTITIES_TYPES,
  PERMISSIONS,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_AWAITING_PAYMENT,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_TODO,
} from '../../utils/constants';
import { cutString, groupBy, parseUserPermissionContext, shrinkNumber } from '../../utils/helpers';
import { AvatarList } from '../Common/AvatarList';
import { DropDown, DropDownItem } from '../Common/dropdown';
import { DropDownButtonDecision } from '../DropDownDecision/DropDownButton';
import { DoneWithBorder, InProgressWithBorder, TodoWithBorder, WonderCoin } from '../Icons';
import ImageIcon from '../Icons/image';
import AudioIcon from '../Icons/MediaTypesIcons/audio';
import PlayIcon from '../Icons/play';
import { RewardRed } from '../Icons/reward';
import { TaskMenuIcon } from '../Icons/taskMenu';
import {
  Box,
  DeliverableContainer,
  DeliverableItem,
  DeliverablesIconContainer,
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
import { TaskViewModal } from '../Common/Task/modal';
import { delQuery } from '../../utils';
import { useRouter } from 'next/router';
import * as Constants from '../../utils/constants';
import { CreateModalOverlay } from '../CreateEntity/styles';
import EditLayoutBaseModal from '../CreateEntity/editEntityModal';
import { ArchiveTaskModal } from '../Common/ArchiveTaskModal';
import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { UPDATE_TASK_STATUS } from '../../graphql/mutations';
import {
  GET_ORG_TASK_BOARD_TASKS,
  GET_TASK_BY_ID,
  GET_TASK_REVIEWERS,
  GET_TASK_SUBMISSIONS_FOR_TASK,
} from '../../graphql/queries';
import { SnackbarAlertContext } from '../Common/SnackbarAlert';
import { ArchivedTaskUndo } from '../Common/Task/styles';
import { OrgBoardContext } from '../../utils/contexts';
import { useOrgBoard, usePodBoard, useUserBoard } from '../../utils/hooks';
import { LoadMore } from '../Common/KanbanBoard/styles';
import { SafeImage } from '../Common/Image';
import { useMe } from '../Auth/withAuth';
import { USDCoin } from '../Icons/USDCoin';
import Ethereum from '../Icons/ethereum';
import { Compensation } from '../Common/Compensation';
import { Matic } from '../Icons/matic';
import { renderMentionString } from '../../utils/common';
import TaskStatus from '../Icons/TaskStatus';

const DELIVERABLES_ICONS = {
  audio: <AudioIcon />,
  image: <ImageIcon />,
  link: <StyledLinkIcon />,
  video: <PlayIcon />,
};

let windowOffset = 0;
export const Table = (props) => {
  const { columns, onLoadMore, hasMore, isAdmin = false } = props;
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [editableTask, setEditableTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState(null);
  const [once, setOnce] = useState(false);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [isArchiveModalOpen, setArchiveModalOpen] = useState(false);
  const [ref, inView] = useInView({});
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const orgBoardContext = useContext(OrgBoardContext);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const user = useMe();
  const board = orgBoard || podBoard || userBoard;
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);

  useEffect(() => {
    const taskId = router?.query?.task || router?.query?.taskProposal;

    if (taskId && !once) {
      let task;
      columns.find((column) => {
        const section = column?.section?.task;
        if (section) {
          task = [...section, ...column.tasks];
        } else {
          task = [...column.tasks];
        }
        return task.find((task) => task.id === taskId);
      });
    }
  }, [columns, router?.query?.task || router?.query?.taskProposal]);

  const [updateTaskStatusMutation] = useMutation(UPDATE_TASK_STATUS, {
    // onCompleted: (data) => {
    //   if (data.updateTaskStatus.status === TASK_STATUS_ARCHIVED) {
    //
    //   }
    // },
  });

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
        taskId: task?.id,
        input: {
          newStatus: status,
        },
      },
    });
  }

  async function archiveTask(task) {
    const newColumns = [...columns];
    const column = newColumns.find((column) => column.tasks.includes(task));
    let taskIndex;

    await apolloClient.mutate({
      mutation: UPDATE_TASK_STATUS,
      variables: {
        taskId: task?.id,
        input: {
          newStatus: TASK_STATUS_ARCHIVED,
        },
      },
    });

    if (column) {
      taskIndex = column.tasks.indexOf(selectedTask);
      column.tasks.splice(taskIndex, 1);
      board.setColumns(newColumns);
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
              board.setColumns([...newColumns]);
            }
          }}
        >
          Undo
        </ArchivedTaskUndo>
      </>
    );
  }

  function openTask(task, taskType = '') {
    setOnce(false);
    router.replace(`${delQuery(router.asPath)}?task=${task?.id}&view=${router.query.view || 'grid'}`);
    setSelectedTask(task);
    setSelectedTaskType(taskType);
    setPreviewModalOpen(true);
  }

  return (
    <StyledTableContainer>
      <TaskViewModal
        open={isPreviewModalOpen}
        handleClose={() => {
          setPreviewModalOpen(false);
          router.push(`${delQuery(router.asPath)}?view=list`, undefined, {
            shallow: true,
          });
        }}
        task={selectedTaskType !== Constants.TASK_STATUS_SUBMISSION_REQUEST && selectedTask}
        isTaskProposal={selectedTaskType === Constants.TASK_STATUS_PROPOSAL_REQUEST}
        taskId={selectedTaskType === Constants.TASK_STATUS_SUBMISSION_REQUEST ? selectedTask?.taskId : selectedTask?.id}
      />
      <ArchiveTaskModal
        open={isArchiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        onArchive={() => archiveTask(selectedTask)}
      />

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
          {columns.map((column) => {
            let tasks = [...column.tasks];
            if (column?.section?.tasks) tasks = [...tasks, ...column?.section?.tasks];

            // Don't show archived tasks
            if (column?.section?.title === COLUMN_TITLE_ARCHIVED) {
              tasks = column.tasks;
            }

            return tasks.map((task, index) => {
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
                    {task.assigneeProfilePicture ? (
                      <AvatarList
                        align="center"
                        users={[
                          {
                            avatar: {
                              url: task.assigneeProfilePicture,
                            },
                            id: task.assigneeUsername,
                            initials: task.assigneeUsername,
                          },
                        ]}
                      />
                    ) : (
                      <Link passHref={true} href={`/profile/${task?.assigneeUsername ?? task?.creatorUsername}/about`}>
                        <Initials>{task?.assigneeUsername ?? task?.creatorUsername}</Initials>
                      </Link>
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <TaskStatus status={status} />
                  </StyledTableCell>
                  <StyledTableCell className="clickable" onClick={() => openTask(task, column?.status)}>
                    <TaskTitle>{task.title}</TaskTitle>
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
                          <RewardAmount>{shrinkNumber(reward.rewardAmount)}</RewardAmount>
                        </Reward>
                      ) : (
                        <Box color="#fff">None</Box>
                      )}
                    </RewardContainer>
                  </StyledTableCell>
                  {isAdmin && (
                    <StyledTableCell align="center">
                      {/* TODO: change the design for disabled button */}
                      <DropDownButtonDecision disabled={!canManageTask} taskId={task.id} status={column.status} />
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
                          {/* BUG: @junius When a proposal or submission was clicked, it produces an error  */}
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
                          {/* BUG: @junius When a proposal or submission was clicked, it produces an error */}
                          Archive {dropdownItemLabel}
                        </DropDownItem>
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
  );
};
