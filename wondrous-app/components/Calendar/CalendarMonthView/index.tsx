import setDate from 'date-fns/setDate';
import startOfMonth from 'date-fns/startOfMonth';
import React, { useContext, useEffect, useState } from 'react';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import getWeeksInMonth from 'date-fns/getWeeksInMonth';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';
import subDays from 'date-fns/subDays';
import addDays from 'date-fns/addDays';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import palette from 'theme/palette';
import { ViewType } from 'types/common';
import { CALENDAR_CONFIG } from 'utils/constants';
import styles from 'components/Calendar/CalendarMonthView/styles';
import SmartLink from 'components/Common/SmartLink';
import { TaskInterface } from 'types/task';
import { delQuery } from 'utils/index';
import { CalendarContext } from 'utils/contexts';
import ViewTasksModal from './ViewTasksModal';

const CalendarMonthView = () => {
  const {
    taskStatusIcon,
    router,
    viewStartDate,
    viewEndDate,
    tasksMap,
    handleTaskClick,
    getUserTaskBoardTasksCalendar,
    loggedInUser,
  } = useContext(CalendarContext);
  const { weekStartsOn, weekDays, maxTasksForMonthView } = CALENDAR_CONFIG;
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<TaskInterface[]>([]);
  const [firstDayOfCalendar, setFirstDayOfCalendar] = useState<Date>(null);
  const [lastDayOfCalendar, setLastDayOfCalendar] = useState<Date>(null);

  const weeks = getWeeksInMonth(viewStartDate);
  const startDayOfWeek = startOfMonth(viewStartDate).getDay();
  const lastWeekDayIndex = weekStartsOn === 0 ? 6 : 7;
  const closeViewTasksModal = () => {
    setSelectedDate(null);
    setSelectedDateTasks([]);
  };

  const dayStartIndex = format(new Date(viewStartDate), 'i');
  const dayEndIndex = format(viewEndDate, 'i');

  useEffect(() => {
    if (dayStartIndex !== '7') {
      setFirstDayOfCalendar(subDays(new Date(viewStartDate), +dayStartIndex));
    } else {
      setFirstDayOfCalendar(new Date(viewStartDate));
    }

    if (dayEndIndex !== '6') {
      setLastDayOfCalendar(addDays(viewEndDate, +dayEndIndex === 7 ? 6 : 6 - +dayEndIndex));
    } else {
      setLastDayOfCalendar(new Date(viewEndDate));
    }

    // getUserTaskBoardTasksCalendar({
    //   variables: {
    //     userId: loggedInUser?.orgId,
    //     fromDate: firstDayOfCalendar,
    //     toDate: lastDayOfCalendar,
    //   },
    // });
  }, [viewStartDate]);

  return (
    <>
      <Grid container wrap="wrap" columns={7} sx={styles.wrapper}>
        {weekDays.map((weekDay) => (
          <Grid key={weekDay} item xs={1}>
            <Grid item display="flex" justifyContent="center" alignItems="center" sx={styles.weekDay}>
              {weekDay}
            </Grid>
          </Grid>
        ))}

        {new Array(weeks).fill(weeks).map((week, weekIndex) =>
          weekDays.map((weekDay, weekDayIndex) => {
            const day = weekIndex * 7 + weekDayIndex + 1 - startDayOfWeek;
            const key = `day-${day - weekIndex * 7 + weekDayIndex}`;
            const date = setDate(viewStartDate, day);
            const dateIsToday = isToday(date);
            const dateFormat = isFirstDayOfMonth(date) ? 'LLL d' : 'd';
            const tasks = tasksMap[format(date, 'yyyy-MM-dd')] ?? [];

            return (
              <Grid
                key={key}
                item
                xs={1}
                className={dateIsToday ? 'ColumnToday' : ''}
                sx={{
                  borderRight: weekDayIndex === lastWeekDayIndex ? 'none' : `1px solid ${palette.grey101}`,
                  ...styles.column,
                }}
              >
                <Grid
                  className="ColumnHeader"
                  container
                  item
                  justifyContent="center"
                  alignItems="center"
                  sx={styles.columnHeader}
                >
                  <Box className="ColumnHeaderText" sx={{ color: palette.grey57 }}>
                    {format(date, dateFormat)}
                  </Box>
                </Grid>

                {/* Contains tasks and more button */}
                <Grid container wrap="nowrap" direction="column" className="ColumnBody" sx={styles.columnBody}>
                  {tasks.slice(0, maxTasksForMonthView).map((task) => {
                    const viewUrl = `${delQuery(router.asPath)}?task=${task?.id}&view=${ViewType.Calendar}`;

                    return (
                      <SmartLink
                        key={task.title}
                        href={viewUrl}
                        preventLinkNavigation
                        onClick={(task) => handleTaskClick(task)}
                      >
                        <Grid key={task.title} wrap="nowrap" mb="10px" container height="16px">
                          <Box>{taskStatusIcon[task.status]}</Box>
                          <Typography noWrap sx={styles.taskTitle}>
                            {task.title}
                          </Typography>
                        </Grid>
                      </SmartLink>
                    );
                  })}
                  {tasks.length > maxTasksForMonthView ? (
                    <Button
                      variant="text"
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedDateTasks(tasks);
                      }}
                      sx={styles.moreButton}
                    >
                      {tasks.length - maxTasksForMonthView} more
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            );
          })
        )}
      </Grid>

      <ViewTasksModal
        selectedDate={selectedDate}
        tasks={selectedDateTasks}
        open={!!selectedDate}
        onClose={closeViewTasksModal}
      />
    </>
  );
};

export default CalendarMonthView;
