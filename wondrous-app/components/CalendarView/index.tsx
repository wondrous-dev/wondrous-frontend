/* eslint-disable react/jsx-key */
import { useLazyQuery } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import { StyledModal } from 'components/Common/InviteLinkModal/styles';
import TaskViewModal from 'components/Common/TaskViewModal';
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
import { CalendarViewModal } from 'components/organization/wrapper/CalendarViewModal';
import { format } from 'date-fns';
import { UPDATE_TASK_STATUS } from 'graphql/mutations';
import {
  GET_ORG_BY_ID,
  GET_ORG_FROM_USERNAME,
  GET_ORG_TASK_BOARD_CALENDAR,
  GET_POD_TASK_BOARD_CALENDAR,
} from 'graphql/queries';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import apollo from 'services/apollo';
import { ENTITIES_TYPES_FILTER_STATUSES } from 'services/board';
import {
  ENTITIES_TYPES,
  PERMISSIONS,
  PRIVACY_LEVEL,
  STATUSES_ON_ENTITY_TYPES,
  TASK_STATUS_IN_REVIEW,
} from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import usePrevious, { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import {
  CalendaListItem,
  CalendarDayOfMonthLabel,
  CalendarDayOfWeekBar,
  CalendarDayOfWeekLabel,
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
  const router = useRouter();
  const { orgId, username, podId } = router.query;
  const [orgData, setOrgData] = useState(null);
  const { columns, onLoadMore, hasMore, setColumns, onCalendarDateChange, entityType, calendarFilters, statuses } =
    props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarView, setCalendarView] = useState('MONTH');
  const [tasks, setTasks] = useState([]);
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [dateSelected, setDateSelected] = useState();
  const open = Boolean(anchorEl);
  const [trackDate, setTrackDate] = useState(new Date());
  const [day, setDay] = useState(new Date().getDate());
  const [currentDaysOfMonth, setCurrentDaysOfMonth] = useState([]);
  const [week, setWeek] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const user = useMe();
  const [getOrg] = useLazyQuery(GET_ORG_BY_ID, {
    onCompleted: (data) => {
      setOrgData(data?.getOrgById);
    },
    fetchPolicy: 'cache-and-network',
  });
  const [calendarData, setCalendarData] = useState(columns);
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || userBoard || podBoard;
  const isProposalEntity = board?.entityType === ENTITIES_TYPES.PROPOSAL;
  const filters = ENTITIES_TYPES_FILTER_STATUSES({ orgId, enablePodFilter: true });
  const [getOrgCalendarTasks] = useLazyQuery(GET_ORG_TASK_BOARD_CALENDAR, {
    onCompleted: (data) => {
      setCalendarData(data?.getOrgTaskBoardCalendar);
    },
    fetchPolicy: 'cache-and-network',
  });
  const [getPodCalendarTasks] = useLazyQuery(GET_POD_TASK_BOARD_CALENDAR, {
    onCompleted: (data) => {
      setCalendarData(data?.getPodTaskBoardCalendar);
    },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    if (podId) {
      const taskBoardStatuses =
        statuses?.length > 0
          ? statuses.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : // double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;

      getPodCalendarTasks({
        variables: {
          input: {
            podId,
            statuses: taskBoardStatuses,
            offset: 0,
            fromDate: format(new Date(year, month, 1), 'yyyy-MM-dd'),
            toDate: format(new Date(year, month + 1, 1), 'yyyy-MM-dd'),
          },
        },
      });
    } else {
      const taskBoardStatuses =
        calendarFilters.statuses?.length > 0
          ? calendarFilters.statuses.filter((status) => STATUSES_ON_ENTITY_TYPES.DEFAULT.includes(status))
          : // double check in case we add new stuff and have no valid entityType.
            STATUSES_ON_ENTITY_TYPES[entityType] || STATUSES_ON_ENTITY_TYPES.DEFAULT;

      getOrgCalendarTasks({
        variables: {
          orgId: orgData?.id,
          podIds: calendarFilters?.podIds,
          offset: 0,
          statuses: taskBoardStatuses,
          labelId: calendarFilters?.labelId,
          date: calendarFilters?.date,
          fromDate: format(new Date(year, month, 1), 'yyyy-MM-dd'),
          toDate: format(new Date(year, month + 1, 1), 'yyyy-MM-dd'),
        },
      });
    }
  }, [month, day, orgId, orgData, calendarFilters, statuses]);
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;

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
          'getOrgTaskBoardCalendar',
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
  const [getOrgFromUsername] = useLazyQuery(GET_ORG_FROM_USERNAME, {
    onCompleted: (data) => {
      if (data?.getOrgFromUsername) {
        setOrgData(data?.getOrgFromUsername);
      }
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId && !orgData) {
      getOrg({
        variables: {
          orgId,
        },
      });
      // get user task board tasks immediately
    } else if (!orgId && username && !orgData) {
      // Get orgId from username
      getOrgFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [username, orgId, orgData, getOrg, getOrgFromUsername]);

  const handleTaskClose = () => {
    setOpenTaskModal(false);
  };

  const getDaysOfWeek = () => {
    const daysOfWeek = [];
    const trackedDate = trackDate;

    const dayOfWeek = trackDate.getDay();
    for (let i = dayOfWeek; i >= 0; i--) {
      const holdDay = new Date(trackedDate);
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
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
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
    setCurrentDaysOfMonth(daysOfMonth);
    getTasks(daysOfMonth);
  };

  const getTasks = (days) => {
    const holdTasks = [];
    if (calendarData) {
      if (calendarView === 'WEEK') {
        for (let i = 0; i < calendarData.length; i++) {
          for (let j = 0; j < days.length; j++) {
            const holdDate = new Date(calendarData[i].dueDate);
            if (
              days?.[j]?.day.getDate() === holdDate.getDate() &&
              days?.[j]?.day.getMonth() === holdDate.getMonth() &&
              days?.[j]?.day.getFullYear() === holdDate.getFullYear()
            ) {
              days[j].tasks.push(calendarData[i]);
            }
          }
        }
      } else {
        const holdCurrentDaysOfMonth = days;
        for (let i = 0; i < calendarData.length; i++) {
          for (let j = 0; j < days.length; j++) {
            const holdDate = new Date(calendarData[i].dueDate);
            if (
              days?.[j]?.day.getDate() === holdDate.getDate() &&
              days?.[j]?.day.getMonth() === holdDate.getMonth() &&
              days?.[j]?.day.getFullYear() === holdDate.getFullYear()
            ) {
              holdCurrentDaysOfMonth[j].tasks.push(calendarData[i]);
            }
          }
        }
        setCurrentDaysOfMonth(holdCurrentDaysOfMonth);
      }
    }
  };

  const handleSelectTask = (taskID) => {
    setTaskId(taskID);
    setOpenCalendarModal(false);
    setOpenTaskModal(true);
  };

  useEffect(() => {
    setWeek(null);
    setCurrentDaysOfMonth(null);
    if (calendarView === 'WEEK') {
      getDaysOfWeek();
    } else if (calendarView === 'MONTH') {
      getDaysOfMonth();
    }
  }, [day, month, calendarView, calendarData]);

  return (
    <div style={{ width: '100%', marginBottom: '50px' }}>
      <CalendarViewModal
        open={openCalendarModal}
        onClose={() => {
          setOpenCalendarModal(false);
        }}
        handleSelectTask={handleSelectTask}
        day={dateSelected}
      />
      <TaskViewModal
        disableEnforceFocus
        open={openTaskModal}
        shouldFocusAfterRender={false}
        handleClose={handleTaskClose}
        taskId={taskId}
        isTaskProposal={false}
        key={taskId}
      />

      <CalendarTopBar>
        <CalendarTopBarLeftSide>
          <CalendarViewLabel style={{ width: '125px' }}>{`${monthsOfYear[month]} ${year}`}</CalendarViewLabel>
          <CalendarLeftArrowIcon
            onClick={() => {
              const holdDate = new Date(trackDate).setDate(new Date(trackDate).getDate() - 7);

              if (calendarView === 'WEEK') {
                setTrackDate(new Date(holdDate));
                setMonth(new Date(holdDate).getMonth());
                setYear(new Date(holdDate).getFullYear());
                setDay(new Date(holdDate).getDate());
                setWeek(null);
                setCurrentDaysOfMonth(null);
              }
              if (calendarView === 'MONTH') {
                setMonth(month === 0 ? 11 : month - 1);
                setYear(month === 0 ? year - 1 : year);
                onCalendarDateChange(new Date(year, month, 1));
                setWeek(null);
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
                setWeek(null);
                setCurrentDaysOfMonth(null);
              }
              if (calendarView === 'MONTH') {
                setMonth(month === 11 ? 0 : month + 1);
                setYear(month === 11 ? year + 1 : year);
                onCalendarDateChange(new Date(year, month, 1));
                setWeek(null);
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
              const todayDate = new Date();
              return (
                <CalendarViewDayContainer key={taskObject?.date}>
                  <CalendarViewDayTopBar>
                    {taskObject.day.getMonth() === todayDate.getMonth() &&
                    taskObject.day.getDate() === todayDate.getDate() &&
                    taskObject.day.getFullYear() === todayDate.getFullYear() ? (
                      <CalendarDayOfMonthLabel>{taskObject?.date}</CalendarDayOfMonthLabel>
                    ) : (
                      <CalendarViewLabel>{taskObject?.date}</CalendarViewLabel>
                    )}
                  </CalendarViewDayTopBar>
                  {taskObject?.tasks?.map((task, index) => {
                    const content = (
                      <CalendarViewTaskContainer
                        onClick={() => {
                          setOpenTaskModal(true);
                          setTaskId(task?.id);
                        }}
                      >
                        <CalendarViewTaskIcon
                          status={task?.status}
                          //   style={{ width: '20px', height: '20px', marginRight: '8px' }}
                        />
                        <CalendarViewTaskLabel>{task.title}</CalendarViewTaskLabel>
                      </CalendarViewTaskContainer>
                    );
                    const showMore = (
                      <CalendarViewTaskShowMore
                        onClick={() => {
                          setDateSelected(taskObject);
                          setOpenCalendarModal(true);
                        }}
                      >
                        {`${taskObject?.tasks.length - 3} more...`}
                      </CalendarViewTaskShowMore>
                    );
                    if (index < 3) {
                      return content;
                    }
                    if (index === 3) {
                      return showMore;
                    }
                    return null;
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
              {daysOfWeek.map((day, i) => {
                const todayDate = new Date();
                return week?.[i]?.day.getMonth() === todayDate.getMonth() &&
                  week?.[i]?.day.getDate() === todayDate.getDate() &&
                  week?.[i]?.day.getFullYear() === todayDate.getFullYear() ? (
                  <CalendarDayOfWeekLabel key={day}>{`${day} ${week?.[i]?.date}`}</CalendarDayOfWeekLabel>
                ) : (
                  <CalendarDayOfWeekLabel
                    style={{ backgroundColor: '#161616' }}
                    key={day}
                  >{`${day} ${week?.[i]?.date}`}</CalendarDayOfWeekLabel>
                );
              })}
            </CalendarDayOfWeekBar>
          </CalendarViewContainer>
          <CalendarViewDMonthContainer view={calendarView}>
            {week?.map((dayOfWeek, index) => (
              <CalendarViewDayContainer view={calendarView}>
                {dayOfWeek?.tasks?.map((task, index) => {
                  const content = (
                    <CalendarViewTaskContainer
                      style={{ marginBottom: calendarView === 'WEEK' ? '8px' : '2px' }}
                      onClick={() => {
                        setOpenTaskModal(true);
                        setTaskId(task?.id);
                      }}
                    >
                      <CalendarViewTaskIcon status={task?.status} />
                      <CalendarViewTaskLabel style={{ fontSize: calendarView === 'WEEK' ? '14px' : '12px' }}>
                        {task.title}
                      </CalendarViewTaskLabel>
                    </CalendarViewTaskContainer>
                  );
                  const showMore = (
                    <CalendarViewTaskShowMore
                      onClick={() => {
                        setDateSelected(dayOfWeek);
                        setOpenCalendarModal(true);
                      }}
                    >
                      Show more...
                    </CalendarViewTaskShowMore>
                  );
                  if (index < 30) {
                    return content;
                  }
                  if (index === 30) {
                    return showMore;
                  }
                  return null;
                })}
              </CalendarViewDayContainer>
            ))}
          </CalendarViewDMonthContainer>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
