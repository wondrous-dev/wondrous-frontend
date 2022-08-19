/* eslint-disable react/jsx-key */
import { useMe } from 'components/Auth/withAuth';
import { StyledModal } from 'components/Common/InviteLinkModal/styles';
import {
  TaskTemplateArrowIcon,
  TaskTemplateLabelWrapper,
} from 'components/CreateEntity/CreateEntityModal/TaskTemplatePicker/styles';
import { DropDownPopper } from 'components/DropDownDecision/DropDownPopper';
import {
  StyledList,
  StyledListItem,
  StyledListItemIcon,
  StyledListItemText,
  StyledPopper,
} from 'components/DropDownDecision/DropDownPopper/styles';
import RightArrowIcon from 'components/Icons/rightArrow';
import { Arrow } from 'components/Icons/sections';
import TaskStatus from 'components/Icons/TaskStatus';
import { UPDATE_TASK_STATUS } from 'graphql/mutations';
import React, { useEffect, useState } from 'react';
import apollo from 'services/apollo';
import { ENTITIES_TYPES, PERMISSIONS, TASK_STATUS_IN_REVIEW } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import usePrevious, { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import {
  CalendaListItem,
  CalendarDayOfWeekBar,
  CalendarLeftArrowIcon,
  CalendarRightArrowIcon,
  CalendarTopBar,
  CalendarTopBarLeftSide,
  CalendarViewContainer,
  CalendarViewDayContainer,
  CalendarViewDayTopBar,
  CalendarViewDMonthContainer,
  CalendarViewLabel,
  CalendarViewMonthDayToggle,
  CalendarViewStatusNotifier,
  CalendarViewTaskContainer,
  CalendarViewTaskIcon,
  CalendarViewTaskLabel,
  CalendarViewTaskShowMore,
  CalendarViewWarningIcon,
  CalendarViewWeekendContainer,
  CalendarViewWeekendIconCheckmark,
} from './styles';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const calendarViews = { MONTH: 'MONTH', WEEK: 'WEEK' };

const CalendarView = (props) => {
  //   const getCurrDay = new Date().getDate();
  const { columns, onLoadMore, hasMore, setColumns, onCalendarDateChange } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarView, setCalendarView] = useState('MONTH');
  const [tasks, setTasks] = useState([]);

  const [open, setOpen] = useState(Boolean(anchorEl));
  const [trackDate, setTrackDate] = useState(new Date());
  const [day, setDay] = useState(new Date().getDate());
  const [currentDaysOfMonth, setCurrentDaysOfMonth] = useState([]);
  const [week, setWeek] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const user = useMe();
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || userBoard || podBoard;
  const isProposalEntity = board?.entityType === ENTITIES_TYPES.PROPOSAL;
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  const checkPermissions = (task) => {
    const permissions = parseUserPermissionContext({
      userPermissionsContext,
      orgId: task?.orgId,
      podId: task?.podId,
    });
    const canEdit =
      permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
      permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      task?.createdBy === user?.id ||
      (task?.assigneeId && task?.assigneeId === user?.id);

    return canEdit && user && task;
  };

  const prevColumnState = usePrevious(columns);
  const updateTaskStatus = async (taskToBeUpdated, aboveOrder, belowOrder) => {
    let currentBoard: String;
    if (orgBoard) {
      currentBoard = 'org';
    }
    if (podBoard) {
      currentBoard = 'pod';
    }
    if (userBoard) {
      currentBoard = 'assignee';
    }
    try {
      const {
        data: { updateTask: task },
      } = await apollo.mutate({
        mutation: UPDATE_TASK_STATUS,
        variables: {
          taskId: taskToBeUpdated.id,
          input: {
            newStatus: taskToBeUpdated.status,
            board: currentBoard,
            aboveOrder,
            belowOrder,
          },
        },
        refetchQueries: () => [
          'getUserTaskBoardTasks',
          'getOrgTaskBoardTasks',
          'getPodTaskBoardTasks',
          'getPerStatusTaskCountForMilestone',
          'getPerStatusTaskCountForUserBoard',
          'getPerStatusTaskCountForOrgBoard',
          'getPerStatusTaskCountForPodBoard',
        ],
      });

      return true;
    } catch (err) {
      if (err?.graphQLErrors && err?.graphQLErrors.length > 0) {
        if (err?.graphQLErrors[0].extensions?.errorCode === 'must_go_through_submission') {
          //   setDndErrorModal(true);
          setColumns(prevColumnState);
        }
      }
    }
  };

  const getDaysOfWeek = () => {
    const daysOfWeek = [];
    let trackedDate = trackDate;

    const dayOfWeek = trackDate.getDay();
    for (let i = dayOfWeek; i >= 0; i--) {
      let holdDay = new Date(trackedDate);
      holdDay.setDate(holdDay.getDate() - i);
      daysOfWeek.push({ date: holdDay.getDate(), tasks: [], day: holdDay });
    }
    for (let i = 0; i < 6 - dayOfWeek; i++) {
      let holdDay = new Date(trackedDate);
      holdDay = new Date(holdDay.setDate(holdDay.getDate() + 1 + i));
      daysOfWeek.push({ date: holdDay.getDate(), tasks: [], day: holdDay });
    }
    setWeek(daysOfWeek);
    getTasks(daysOfWeek);
  };

  const getDaysOfMonth = () => {
    const daysOfMonth = [];
    const dayOfWeek = new Date(year, month, 1).getDay();

    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const numDay = new Date(year, month, 0).getDate();
      const numDate = new Date(year, month - 1, numDay - i);

      daysOfMonth.push({ date: numDay - i, tasks: [], day: numDate });
    }
    let lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDateOfMonth; i++) {
      const currentMonthDay = new Date(year, month, i);
      daysOfMonth.push({ date: i, tasks: [], day: currentMonthDay });
    }
    const lastDayOfMonth = new Date(year, month + 1, 0).getDay();
    for (let i = 0; i < 6 - lastDayOfMonth; i++) {
      const numDay = new Date(year, month + 1, 1 + i).getDate();
      const numDate = new Date(year, month + 1, 1 + i);
      daysOfMonth.push({ date: numDay, tasks: [], day: numDate });
    }
    console.log(daysOfMonth);
    setCurrentDaysOfMonth(daysOfMonth);
    getTasks(daysOfMonth);
  };

  const getTasks = (days) => {
    let holdTasks = [];
    if (columns) {
      if (calendarView === 'WEEK') {
        for (let i = 0; i < columns.length; i++) {
          for (let j = 0; j < days.length; j++) {
            const holdDate = new Date(columns[i].dueDate);
            if (
              days?.[j]?.day.getDate() === holdDate.getDate() &&
              days?.[j]?.day.getMonth() === holdDate.getMonth() &&
              days?.[j]?.day.getFullYear() === holdDate.getFullYear()
            ) {
              days[j].tasks.push(columns[i]);
            }
          }
        }
      } else {
        let holdCurrentDaysOfMonth = days;
        console.log(days);
        for (let i = 0; i < columns.length; i++) {
          for (let j = 0; j < days.length; j++) {
            const holdDate = new Date(columns[i].dueDate);
            if (
              days?.[j]?.day.getDate() === holdDate.getDate() &&
              days?.[j]?.day.getMonth() === holdDate.getMonth() &&
              days?.[j]?.day.getFullYear() === holdDate.getFullYear()
            ) {
              holdCurrentDaysOfMonth[j].tasks.push(columns[i]);
            }
          }
        }
        console.log('I AM CURRENT DAYS OF MONTH, ', holdCurrentDaysOfMonth);
        setCurrentDaysOfMonth(holdCurrentDaysOfMonth);
      }
    }
  };

  useEffect(() => {
    if (calendarView === 'WEEK') {
      getDaysOfWeek();
    } else if (calendarView === 'MONTH') {
      getDaysOfMonth();
    }
  }, [day, month, calendarView]);

  return (
    <div style={{ width: '100%', marginBottom: '50px' }}>
      <CalendarTopBar>
        <CalendarTopBarLeftSide>
          <CalendarViewLabel>{`${monthsOfYear[month]} ${year}`}</CalendarViewLabel>
          <CalendarLeftArrowIcon
            onClick={() => {
              const holdDate = new Date(trackDate).setDate(new Date(trackDate).getDate() - 7);

              if (calendarView === 'WEEK') {
                setTrackDate(new Date(holdDate));
                setMonth(new Date(holdDate).getMonth());
                setYear(new Date(holdDate).getFullYear());
                setDay(new Date(holdDate).getDate());
              }
              if (calendarView === 'MONTH') {
                setMonth(month === 0 ? 11 : month - 1);
                setYear(month === 0 ? year - 1 : year);
                onCalendarDateChange(new Date(year, month, 1));
                setCurrentDaysOfMonth(null);
              }
            }}
          />
          <CalendarRightArrowIcon
            onClick={() => {
              const holdDate = new Date(trackDate).setDate(new Date(trackDate).getDate() + 7);
              if (calendarView === 'WEEK') {
                setTrackDate(new Date(holdDate));
                setMonth(new Date(holdDate).getMonth());
                setYear(new Date(holdDate).getFullYear());
                setDay(new Date(holdDate).getDate());
              }
              if (calendarView === 'MONTH') {
                setMonth(month === 11 ? 0 : month + 1);
                setYear(month === 11 ? year + 1 : year);
                onCalendarDateChange(new Date(year, month, 1));
                setCurrentDaysOfMonth(null);
              }
            }}
          />
          <CalendarViewMonthDayToggle open={open} onClick={handleClick}>
            <TaskTemplateLabelWrapper>
              <CalendarViewLabel>{calendarView}</CalendarViewLabel>
            </TaskTemplateLabelWrapper>

            <TaskTemplateArrowIcon />
          </CalendarViewMonthDayToggle>
          <StyledPopper
            open={open}
            onClose={() => setOpen(false)}
            anchorEl={anchorEl}
            placement="bottom-start"
            modifiers={{
              flip: {
                enabled: false,
              },
              preventOverflow: {
                enabled: false,
                boundariesElement: 'scrollParent',
              },
            }}
          >
            <StyledList>
              {Object.keys(calendarViews).map((decision, i) => (
                <CalendaListItem
                  key={i}
                  toggle={decision === calendarView}
                  onClick={() => {
                    setCalendarView(decision);
                    setMonth(new Date().getMonth());
                    setYear(new Date().getFullYear());
                  }}
                >
                  <CalendarViewLabel>{decision}</CalendarViewLabel>
                </CalendaListItem>
              ))}
              <CalendarViewWeekendContainer>
                <CalendarViewWeekendIconCheckmark />
                <CalendarViewLabel>Show weekends</CalendarViewLabel>
              </CalendarViewWeekendContainer>
            </StyledList>
          </StyledPopper>
        </CalendarTopBarLeftSide>

        <CalendarViewStatusNotifier>
          <CalendarViewWarningIcon />
          <CalendarViewLabel>Only tasks with due dates are displayed</CalendarViewLabel>
        </CalendarViewStatusNotifier>
      </CalendarTopBar>
      {calendarView === 'MONTH' ? (
        <div>
          <CalendarViewContainer>
            <CalendarDayOfWeekBar>
              {daysOfWeek.map((day) => (
                <CalendarViewLabel key={day}>{day}</CalendarViewLabel>
              ))}
            </CalendarDayOfWeekBar>
          </CalendarViewContainer>
          <CalendarViewDMonthContainer view={calendarView}>
            {currentDaysOfMonth?.map((taskObject, index) => {
              console.log(taskObject);
              return (
                <CalendarViewDayContainer key={taskObject?.date}>
                  <CalendarViewDayTopBar>
                    <CalendarViewLabel>{taskObject?.date}</CalendarViewLabel>
                  </CalendarViewDayTopBar>
                  {taskObject?.tasks?.map((task, index) => {
                    const content = (
                      <CalendarViewTaskContainer>
                        <CalendarViewTaskIcon
                          status={task?.status}
                          //   style={{ width: '20px', height: '20px', marginRight: '8px' }}
                        />
                        <CalendarViewTaskLabel>{task.title}</CalendarViewTaskLabel>
                      </CalendarViewTaskContainer>
                    );
                    const showMore = <CalendarViewTaskShowMore>Show more...</CalendarViewTaskShowMore>;
                    if (index < 3) {
                      return content;
                    } else if (index === 3) {
                      return showMore;
                    } else {
                      return null;
                    }
                  })}
                </CalendarViewDayContainer>
              );
            })}
          </CalendarViewDMonthContainer>
        </div>
      ) : (
        <div>
          <CalendarViewContainer>
            <CalendarDayOfWeekBar>
              {daysOfWeek.map((day, i) => (
                <CalendarViewLabel key={day}>{`${day} ${week?.[i]?.date}`}</CalendarViewLabel>
              ))}
            </CalendarDayOfWeekBar>
          </CalendarViewContainer>
          <CalendarViewDMonthContainer view={calendarView}>
            {week?.map((dayOfWeek, index) => {
              return (
                <CalendarViewDayContainer view={calendarView}>
                  {dayOfWeek?.tasks?.map((task, index) => {
                    const content = (
                      <CalendarViewTaskContainer
                      // onClick={() => {
                      //   console.log(task);
                      // }}
                      >
                        <CalendarViewTaskIcon
                          status={task?.status}
                          //   style={{ width: '20px', height: '20px', marginRight: '8px' }}
                        />
                        <CalendarViewTaskLabel>{task.title}</CalendarViewTaskLabel>
                      </CalendarViewTaskContainer>
                    );
                    const showMore = <CalendarViewTaskShowMore>Show more...</CalendarViewTaskShowMore>;
                    if (index < 30) {
                      return content;
                    } else if (index === 30) {
                      return showMore;
                    } else {
                      return null;
                    }
                  })}
                </CalendarViewDayContainer>
              );
            })}
          </CalendarViewDMonthContainer>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
