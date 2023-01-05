import addDays from 'date-fns/addDays';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import isToday from 'date-fns/isToday';
import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

import palette from 'theme/palette';
import SmartLink from 'components/Common/SmartLink';
import styles from 'components/Calendar/CalendarWeekView/styles';
import TaskStatus from 'components/Icons/TaskStatus';
import { CALENDAR_CONFIG } from 'utils/constants';
import { CalendarMonthAndWeekViewProps } from 'components/Calendar/types';

const CalendarWeekView = ({ startDate, tasksMap }: CalendarMonthAndWeekViewProps) => {
  const router = useRouter();
  const daysInWeek = CALENDAR_CONFIG.weekDays.length;

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
    <Grid container wrap="nowrap" sx={styles.wrapper}>
      {days.map(({ key, date, dateIsToday }, dayIndex) => {
        const tasks = tasksMap[format(date, 'yyyy-MM-dd')] ?? [];

        return (
          <Grid
            key={key}
            container
            item
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
            <Grid container item className="ColumnBody" rowSpacing="20px" sx={styles.columnBody}>
              {tasks?.map((task) => (
                <SmartLink
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
                  <Grid item display="flex" wrap="nowrap" sx={{ width: '100%' }}>
                    <TaskStatus
                      style={{
                        width: '16px',
                        height: '16px',
                      }}
                      status={task?.status}
                    />
                    <Typography sx={styles.taskTitle}>{task.title}</Typography>
                  </Grid>
                </SmartLink>
              ))}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CalendarWeekView;
