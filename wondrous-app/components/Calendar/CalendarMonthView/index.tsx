import setDate from 'date-fns/setDate';
import startOfMonth from 'date-fns/startOfMonth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import getWeeksInMonth from 'date-fns/getWeeksInMonth';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import palette from 'theme/palette';
import { ViewType } from 'types/common';
import { CALENDAR_CONFIG } from 'utils/constants';
import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import styles from 'components/Calendar/CalendarMonthView/styles';
import SmartLink from 'components/Common/SmartLink';
import { TaskFragment } from 'types/task';
import { delQuery } from 'utils/index';
import { useLocation } from 'utils/useLocation';
import ViewTasksModal from './ViewTasksModal';

type Props = {
  viewDate: Date;
  // openTask: (task: TaskFragment) => void;
  tasksMap: {
    [key: string]: TaskFragment[];
  };
};

const CalendarMonthView = ({ viewDate, tasksMap }: Props) => {
  const { weekStartsOn, weekDays, maxTasksForMonthView } = CALENDAR_CONFIG;
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<TaskFragment[]>([]);
  const weeks = getWeeksInMonth(viewDate);
  const startDayOfWeek = startOfMonth(viewDate).getDay();
  const lastWeekDayIndex = weekStartsOn === 0 ? 6 : 7;
  const location = useLocation();
  const router = useRouter();
  const closeViewTasksModal = () => {
    setSelectedDate(null);
    setSelectedDateTasks([]);
  };

  // FIXME
  const taskStatusIcon = {
    created: <ToDo width="16" height="16" />,
    in_progress: <InProgress width="16" height="16" />,
    in_review: <InReview width="16" height="16" />,
    completed: <Done width="16" height="16" />,
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

        {new Array(weeks).fill(weeks).map((week, weekIndex) =>
          weekDays.map((weekDay, weekDayIndex) => {
            const day = weekIndex * 7 + weekDayIndex + 1 - startDayOfWeek;
            const key = `day-${day - weekIndex * 7 + weekDayIndex}`;
            const date = setDate(viewDate, day);
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
                      <SmartLink href={viewUrl} preventLinkNavigation onNavigate={() => location.replace(viewUrl)}>
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
