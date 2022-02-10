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

const STATUS_ICONS = {
  [TASK_STATUS_TODO]: <TodoWithBorder />,
  [TASK_STATUS_REQUESTED]: <TodoWithBorder />,
  [TASK_STATUS_IN_PROGRESS]: <InProgressWithBorder />,
  [TASK_STATUS_IN_REVIEW]: <InProgressWithBorder />,
  [TASK_STATUS_DONE]: <DoneWithBorder />,
  [TASK_STATUS_AWAITING_PAYMENT]: <DoneWithBorder />,
  [TASK_STATUS_ARCHIVED]: <DoneWithBorder />,
};

const DELIVERABLES_ICONS = {
  audio: <AudioIcon />,
  image: <ImageIcon />,
  link: <StyledLinkIcon />,
  video: <PlayIcon />,
};

let windowOffset = 0;
export const Table = ({ columns, onLoadMore, hasMore }) => {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [editableTask, setEditableTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
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
        task = [...column.section.tasks, ...column.tasks].find((task) => task.id === taskId);

        return task;
      });

      if (task) {
        openTask(task);
        setOnce(false);
      }
    }
  }, [columns, router?.query?.task || router?.query?.taskProposal]);

  const [updateTaskStatusMutation] = useMutation(UPDATE_TASK_STATUS, {
    // onCompleted: (data) => {
    //   if (data.updateTaskStatus.status === TASK_STATUS_ARCHIVED) {
    //
    //   }
    // },
  });

  async function editTask(task) {
    let populatedTask = { ...task };
    const isTaskProposal = task.type === Constants.TASK_STATUS_REQUESTED;

    if (!isTaskProposal) {
      const {
        data: { getTaskReviewers },
      } = await apolloClient.query({
        query: GET_TASK_REVIEWERS,
        variables: {
          taskId: task?.id,
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

  function openTask(task) {
    setOnce(false);
    router.replace(`${delQuery(router.asPath)}?task=${task?.id}&view=${router.query.view || 'grid'}`);
    setSelectedTask(task);
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
        task={selectedTask}
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
              Assigned
            </StyledTableCell>
            <StyledTableCell align="center" width="77px">
              Status
            </StyledTableCell>
            <StyledTableCell width="383px">Task</StyledTableCell>
            {/*<StyledTableCell width="190px">Deliverables</StyledTableCell>*/}
            <StyledTableCell align="center" width="88px">
              Reward
            </StyledTableCell>
            {/*<StyledTableCell align="center" width="80px">*/}
            {/*  Decision*/}
            {/*</StyledTableCell>*/}
            <StyledTableCell width="54px"></StyledTableCell>
          </StyledTableRow>
        </StyledTableHead>

        <StyledTableBody>
          {columns.map((column) => {
            let tasks = [...column.section.tasks, ...column.tasks];

            // Don't show archived tasks
            if (column.section.title === COLUMN_TITLE_ARCHIVED) {
              tasks = column.tasks;
            }

            return tasks.map((task, index) => {
              // Parse permissions here as well
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

              const statusIcon = STATUS_ICONS[task.status || column.section.filter.taskType];

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
                      <Link passHref={true} href={`/profile/${task.assigneeUsername}/about`}>
                        <Initials>{task.assigneeUsername}</Initials>
                      </Link>
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">{statusIcon}</StyledTableCell>
                  <StyledTableCell className="clickable" onClick={() => openTask(task)}>
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
                  {/*<StyledTableCell align="center">*/}
                  {/*  <DropDownButtonDecision />*/}
                  {/*</StyledTableCell>*/}
                  <StyledTableCell align="center">
                    <MoreOptions disabled={!canManageTask}>
                      <DropDown DropdownHandler={TaskMenuIcon} fill="#1F1F1F">
                        <DropDownItem
                          key={'task-menu-edit-' + task.id}
                          onClick={() => editTask(task)}
                          color="#C4C4C4"
                          fontSize="13px"
                          fontWeight="normal"
                          textAlign="left"
                        >
                          Edit task
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
                          Archive task
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
