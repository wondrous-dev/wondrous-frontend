import { useLazyQuery } from '@apollo/client';
import TaskViewModal from 'components/Common/TaskViewModal';
import {
  TaskTemplateArrowIcon,
  TaskTemplateLabelWrapper,
} from 'components/CreateEntity/CreateEntityModal/TaskTemplatePicker/styles';
import { StyledList, StyledPopper } from 'components/DropDownDecision/DropDownPopper/styles';
import CalendarViewModal from 'components/CalendarView/CalendarViewModal/CalendarViewModal';
import { format } from 'date-fns';
import {
  GET_ORG_BY_ID,
  GET_ORG_FROM_USERNAME,
  GET_ORG_TASK_BOARD_CALENDAR,
  GET_POD_TASK_BOARD_CALENDAR,
} from 'graphql/queries';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DAYS_OF_WEEK, MONTHS_OF_YEAR, STATUSES_ON_ENTITY_TYPES } from 'utils/constants';
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
  CalendarViewShowDate,
  CalendarViewStatusNotifier,
  CalendarViewTaskContainer,
  CalendarViewTaskIcon,
  CalendarViewTaskLabel,
  CalendarViewTaskShowMore,
  CalendarViewWarningIcon,
  CalendarViewWeekendContainer,
  CalendarViewWeekendIconCheckmark,
} from './styles';

const calendarViews = { MONTH: 'MONTH', WEEK: 'WEEK' };

const CalendarView = (props) => {
  const router = useRouter();
  const { orgId, username, podId } = router.query;
  const [orgData, setOrgData] = useState(null);
  const { columns, onCalendarDateChange, entityType, calendarFilters, statuses } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarView, setCalendarView] = useState('MONTH');
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
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;

  const prevColumnState = usePrevious(columns);

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
    } else if (!orgId && username && !orgData) {
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

  const getTasks = (days, tasks) => {
    const holdTasks = [];
    if (tasks) {
      if (calendarView === 'WEEK') {
        for (let i = 0; i < tasks.length; i++) {
          for (let j = 0; j < days.length; j++) {
            const holdDate = new Date(tasks[i].dueDate);
            if (
              days?.[j]?.day.getDate() === holdDate.getDate() &&
              days?.[j]?.day.getMonth() === holdDate.getMonth() &&
              days?.[j]?.day.getFullYear() === holdDate.getFullYear()
            ) {
              days[j].tasks.push(tasks[i]);
            }
          }
        }
      } else {
        const holdCurrentDaysOfMonth = days;
        for (let i = 0; i < tasks.length; i++) {
          for (let j = 0; j < days.length; j++) {
            const holdDate = new Date(tasks[i].dueDate);
            if (
              days?.[j]?.day.getDate() === holdDate.getDate() &&
              days?.[j]?.day.getMonth() === holdDate.getMonth() &&
              days?.[j]?.day.getFullYear() === holdDate.getFullYear()
            ) {
              holdCurrentDaysOfMonth[j].tasks.push(tasks[i]);
            }
          }
        }
        setCurrentDaysOfMonth(holdCurrentDaysOfMonth);
      }
    }
  };

  const getDaysOfWeek = (tasks) => {
    const daysOfWeek = [];
    const trackedDate = trackDate;

    const dayOfWeek = trackDate.getDay();
    for (let i = dayOfWeek; i >= 0; i -= 1) {
      const holdDay = new Date(trackedDate);
      holdDay.setDate(holdDay.getDate() - i);
      daysOfWeek.push({ date: holdDay.getDate(), tasks: [], day: holdDay });
    }
    for (let i = 0; i < 6 - dayOfWeek; i += 1) {
      let holdDay = new Date(trackedDate);
      holdDay = new Date(holdDay.setDate(holdDay.getDate() + 1 + i));
      daysOfWeek.push({ date: holdDay.getDate(), tasks: [], day: holdDay });
    }
    setWeek(daysOfWeek);
    getTasks(daysOfWeek, tasks);
  };

  const getDaysOfMonth = (tasks) => {
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
    getTasks(daysOfMonth, tasks);
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
      getDaysOfWeek(columns);
    } else if (calendarView === 'MONTH') {
      getDaysOfMonth(columns);
    }
  }, [day, month, calendarView, columns]);

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
          <CalendarViewShowDate>{`${MONTHS_OF_YEAR[month]} ${year}`}</CalendarViewShowDate>
          <CalendarLeftArrowIcon
            onClick={() => {
              const holdDate = new Date(trackDate).setDate(new Date(trackDate).getDate() - 7);

              if (calendarView === 'WEEK') {
                const compareDates = new Date(holdDate);
                if (compareDates.getMonth() !== trackDate.getMonth()) {
                  onCalendarDateChange(new Date(compareDates.getFullYear(), compareDates.getMonth(), 1));
                }
                setWeek(null);
                setCurrentDaysOfMonth(null);
                setTrackDate(new Date(holdDate));
                setMonth(new Date(holdDate).getMonth());
                setYear(new Date(holdDate).getFullYear());
                setDay(new Date(holdDate).getDate());
              }
              if (calendarView === 'MONTH') {
                setWeek(null);
                setCurrentDaysOfMonth(null);
                onCalendarDateChange(new Date(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, 1));

                setMonth(month === 0 ? 11 : month - 1);
                setYear(month === 0 ? year - 1 : year);
              }
            }}
          />
          <CalendarRightArrowIcon
            onClick={() => {
              const holdDate = new Date(trackDate).setDate(new Date(trackDate).getDate() + 7);
              if (calendarView === 'WEEK') {
                const compareDates = new Date(holdDate);
                if (compareDates.getMonth() !== trackDate.getMonth()) {
                  onCalendarDateChange(new Date(compareDates.getFullYear(), compareDates.getMonth(), 1));
                }
                setWeek(null);
                setCurrentDaysOfMonth(null);
                setTrackDate(new Date(holdDate));
                setMonth(new Date(holdDate).getMonth());
                setYear(new Date(holdDate).getFullYear());
                setDay(new Date(holdDate).getDate());
              }
              if (calendarView === 'MONTH') {
                setWeek(null);
                setCurrentDaysOfMonth(null);
                onCalendarDateChange(new Date(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, 1));
                setMonth(month === 11 ? 0 : month + 1);
                setYear(month === 11 ? year + 1 : year);
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
              {DAYS_OF_WEEK.map((day) => (
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
              {DAYS_OF_WEEK.map((day, i) => {
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
