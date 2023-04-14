import Button from '@mui/material/Button';
import addDays from 'date-fns/addDays';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import isToday from 'date-fns/isToday';
import React, { useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

import palette from 'theme/palette';
import SmartLink from 'components/Common/SmartLink';
import styles from 'components/Calendar/CalendarWeekView/styles';
import TaskStatus from 'components/Icons/TaskStatus';
import { buildTaskUrl, getTaskType } from 'utils/board';
import { CALENDAR_CONFIG } from 'utils/constants';
import { CalendarMonthAndWeekViewProps } from 'components/Calendar/types';

const CalendarWeekView = ({
  startDate,
  tasksMap,
  setSelectedDate,
  setTaskForSelectedDate,
}: CalendarMonthAndWeekViewProps) => {
  const router = useRouter();
  const { weekDays, maxTasksForDayView } = CALENDAR_CONFIG;
  const daysInWeek = weekDays.length;

  const days: Array<{
    date: Date;
    dateIsToday: boolean;
    key: string;
  }> = useMemo(
    () =>
      new Array(daysInWeek).fill(daysInWeek).map((day, dayIndex) => {
        const date = addDays(startDate, dayIndex);
        const dateIsToday = isToday(date);
        const key = `day-${format(date, 'yyyy-MM-dd')}`;

        return {
          date,
          dateIsToday,
          key,
        };
      }),
    [startDate]
  );

  return (
    <Grid container sx={styles.wrapper} columns={7}>
      {days.map(({ key, date, dateIsToday }, dayIndex) => {
        const tasks = tasksMap[format(date, 'yyyy-MM-dd')] ?? [];

        return (
          <Grid
            key={key}
            item
            xs={7}
            md={1}
            className={dateIsToday ? 'ColumnToday' : ''}
            flexDirection="column"
            sx={{
              borderRight: dayIndex === daysInWeek - 1 ? 'none' : `1px solid ${palette.grey101}`,
              ...styles.column,
            }}
          >
            <Grid
              className="ColumnHeader"
              container
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={styles.columnHeader}
            >
              <Box className="ColumnHeaderText">{format(date, 'ccc d')}</Box>
            </Grid>
            <Grid container className="ColumnBody" alignItems="flex-start" sx={styles.columnBody}>
              {tasks?.slice(0, maxTasksForDayView).map((task) => {
                const taskType = getTaskType(task);

                return (
                  <SmartLink
                    key={task.id}
                    href={buildTaskUrl(router, task)}
                    preventLinkNavigation
                    onNavigate={() => {
                      const query = {
                        ...router.query,
                        [taskType]: task.id,
                      };

                      router.push({ query }, undefined, { scroll: false, shallow: true });
                    }}
                  >
                    <Grid container display="flex" wrap="nowrap" alignItems="flex-start" sx={styles.taskRow}>
                      <TaskStatus
                        style={{
                          width: '16px',
                          height: '16px',
                          flexShrink: 0,
                        }}
                        status={task?.status}
                      />
                      <Typography sx={styles.taskTitle}>{task.title}</Typography>
                    </Grid>
                  </SmartLink>
                );
              })}
              {tasks.length > maxTasksForDayView ? (
                <Grid container display="flex" wrap="nowrap" alignItems="flex-start" sx={styles.taskRow}>
                  <Button
                    variant="text"
                    onClick={() => {
                      setSelectedDate(date);
                      setTaskForSelectedDate(tasks);
                    }}
                    sx={styles.moreButton}
                  >
                    {tasks.length - maxTasksForDayView} more
                  </Button>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CalendarWeekView;
