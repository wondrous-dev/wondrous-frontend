import React, { useCallback, useContext, useState } from 'react';

import {
  ENTITIES_TYPES,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
} from '../../utils/constants';
import { groupBy, shrinkNumber } from '../../utils/helpers';
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
  DeliverableContainer,
  DeliverableItem,
  DeliverablesIconContainer,
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

const STATUS_ICONS = {
  [TASK_STATUS_TODO]: <TodoWithBorder />,
  [TASK_STATUS_IN_PROGRESS]: <InProgressWithBorder />,
  [TASK_STATUS_DONE]: <DoneWithBorder />,
};

const DELIVERABLES_ICONS = {
  audio: <AudioIcon />,
  image: <ImageIcon />,
  link: <StyledLinkIcon />,
  video: <PlayIcon />,
};

let windowOffset = 0;
export const Table = ({ columns }) => {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [openedTask, setOpenedTask] = useState(null);
  const [editableTask, setEditableTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isArchiveModalOpen, setArchiveModalOpen] = useState(false);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const orgBoardContext = useContext(OrgBoardContext);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;

  // console.log(columns, 'columns');

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

  return (
    <StyledTableContainer>
      {openedTask ? <TaskViewModal open={true} handleClose={() => setOpenedTask(null)} task={openedTask} /> : null}
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
            <StyledTableCell width="190px">Deliverables</StyledTableCell>
            <StyledTableCell align="center" width="88px">
              Reward
            </StyledTableCell>
            <StyledTableCell align="center" width="80px">
              Decision
            </StyledTableCell>
            <StyledTableCell width="54px"></StyledTableCell>
          </StyledTableRow>
        </StyledTableHead>

        <StyledTableBody>
          {columns.map((column) => {
            return column.tasks.map((task, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="center">
                  {task.orgProfilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={task.orgProfilePicture} alt={task.orgName} width={17} height={17} />
                  ) : (
                    <WonderCoin />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <AvatarList
                    align="center"
                    users={[
                      {
                        avatar: {
                          url: task.assigneeProfilePicture,
                        },
                        id: task.assigneeId,
                        goTo: function () {},
                        initials: task.assigneeUsername,
                      },
                    ]}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">{STATUS_ICONS[task.status]}</StyledTableCell>
                <StyledTableCell>
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskDescription>{task.description}</TaskDescription>
                </StyledTableCell>
                <StyledTableCell>
                  <DeliverableContainer>
                    {Object.entries(groupBy(task?.media || [], 'type')).map(([key, value]: [string, any], index) => {
                      return (
                        <DeliverableItem key={index}>
                          <DeliverablesIconContainer>{DELIVERABLES_ICONS[key]}</DeliverablesIconContainer>
                          {value?.length}
                        </DeliverableItem>
                      );
                    })}
                  </DeliverableContainer>
                </StyledTableCell>
                <StyledTableCell>
                  <RewardContainer>
                    <Reward>
                      <RewardRed />
                      <RewardAmount>{shrinkNumber((task.rewards || [])[0]?.rewardAmount)}</RewardAmount>
                    </Reward>
                  </RewardContainer>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <DropDownButtonDecision />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <MoreOptions>
                    <DropDown DropdownHandler={TaskMenuIcon} fill="#1F1F1F">
                      <DropDownItem
                        key={'task-menu-edit-' + task.id}
                        onClick={() => editTask(task)}
                        color="#C4C4C4"
                        fontSize="13px"
                        fontWeight="normal"
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
                      >
                        Archive task
                      </DropDownItem>
                    </DropDown>
                  </MoreOptions>
                </StyledTableCell>
              </StyledTableRow>
            ));
          })}
        </StyledTableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
