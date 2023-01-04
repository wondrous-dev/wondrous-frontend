import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import format from 'date-fns/format';
import getWeeksInMonth from 'date-fns/getWeeksInMonth';
import Grid from '@mui/material/Grid';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';
import isToday from 'date-fns/isToday';
import React, { useMemo, useState } from 'react';
import setDate from 'date-fns/setDate';
import startOfMonth from 'date-fns/startOfMonth';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

import palette from 'theme/palette';
import SmartLink from 'components/Common/SmartLink';
import styles from 'components/Calendar/CalendarMonthView/styles';
import { CALENDAR_CONFIG } from 'utils/constants';
import { TaskInterface } from 'types/task';
import TaskStatus from 'components/Icons/TaskStatus';
import ViewTasksModal from 'components/Calendar/CalendarMonthView/ViewTasksModal';

type Props = {
  startDate: Date;
  tasksMap: {
    [key: string]: TaskInterface[];
  };
};

const CalendarMonthView = ({ startDate, tasksMap }: Props) => {
  const router = useRouter();
  const { weekStartsOn, weekDays, maxTasksForMonthView } = CALENDAR_CONFIG;
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [taskForSelectedDate, setTaskForSelectedDate] = useState<TaskInterface[]>([]);
  const lastWeekDayIndex = weekStartsOn === 0 ? 6 : 7;
  const days: Array<{
    key: string;
    date: Date;
    dateIsToday: boolean;
    isFirstDayOfMonth: boolean;
    weekDayIndex: number;
  }> = useMemo(() => {
    const weeks = getWeeksInMonth(startDate);
    const startDayOfWeek = startOfMonth(startDate).getDay();

    return new Array(weeks).fill(weeks).reduce((weekAcc, week, weekIndex) => {
      return weekDays.reduce((dayAcc, weekDay, weekDayIndex) => {
        const day = weekIndex * 7 + weekDayIndex + 1 - startDayOfWeek;
        const date = setDate(startDate, day);
        const key = `day-${format(date, 'yyyy-MM-dd')}`;
        const dateIsToday = isToday(date);

        return [
          ...dayAcc,
          {
            key,
            date,
            dateIsToday,
            weekDayIndex,
            isFirstDayOfMonth: isFirstDayOfMonth(date),
          },
        ];
      }, weekAcc);
    }, []);
  }, [startDate]);

  const closeViewTasksModal = () => {
    setSelectedDate(null);
    setTaskForSelectedDate([]);
  };

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

        {days.map(({ key, date, dateIsToday, isFirstDayOfMonth, weekDayIndex }) => {
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
                  {format(date, isFirstDayOfMonth ? 'LLL d' : 'd')}
                </Box>
              </Grid>

              {/* Contains tasks and more button */}
              <Grid container wrap="nowrap" direction="column" className="ColumnBody" sx={styles.columnBody}>
                {tasks.slice(0, maxTasksForMonthView).map((task) => (
                  <SmartLink
                    asLink
                    key={task.id}
                    href={`${router.asPath}&task=${task.id}`}
                    preventLinkNavigation
                    onNavigate={() => {
                      const query = {
                        ...router.query,
                        task: task.id,
                      };

                      router.push({ query }, undefined, { scroll: false, shallow: true });
                    }}
                  >
                    <Grid key={task.title} wrap="nowrap" mb="10px" container height="16px">
                      <Box>
                        <TaskStatus
                          style={{
                            width: '16px',
                            height: '16px',
                          }}
                          status={task?.status}
                        />
                      </Box>
                      <Typography noWrap sx={styles.taskTitle}>
                        {task.title}
                      </Typography>
                    </Grid>
                  </SmartLink>
                ))}
                {tasks.length > maxTasksForMonthView ? (
                  <Button
                    variant="text"
                    onClick={() => {
                      setSelectedDate(date);
                      setTaskForSelectedDate(tasks);
                    }}
                    sx={styles.moreButton}
                  >
                    {tasks.length - maxTasksForMonthView} more
                  </Button>
                ) : null}
              </Grid>
            </Grid>
          );
        })}
      </Grid>

      <ViewTasksModal
        selectedDate={selectedDate}
        tasks={taskForSelectedDate}
        open={!!selectedDate}
        onClose={closeViewTasksModal}
      />
    </>
  );
};

export default CalendarMonthView;
