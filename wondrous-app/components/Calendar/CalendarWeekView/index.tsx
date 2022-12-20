import React, { useContext, useEffect } from 'react';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isToday from 'date-fns/isToday';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import palette from 'theme/palette';
import styles from 'components/Calendar/CalendarWeekView/styles';
import SmartLink from 'components/Common/SmartLink';
import { delQuery } from 'utils/index';
import { ViewType } from 'types/common';
import { CalendarContext } from 'utils/contexts';

const CalendarWeekView = () => {
  const {
    taskStatusIcon,
    router,
    viewStartDate,
    tasksMap,
    handleTaskClick,
    getUserTaskBoardTasksCalendar,
    loggedInUser,
  } = useContext(CalendarContext);

  const daysInWeek = 7;
  const lastDayOfWeek = addDays(new Date(viewStartDate), daysInWeek - 1);

  // useEffect(() => {
  //   getUserTaskBoardTasksCalendar({
  //     variables: {
  //       userId: loggedInUser?.orgId,
  //       fromDate: viewStartDate,
  //       toDate: lastDayOfWeek,
  //     },
  //   });
  // }, [viewStartDate, lastDayOfWeek]);

  return (
    <Grid container wrap="nowrap" sx={styles.wrapper}>
      {new Array(daysInWeek).fill(daysInWeek).map((day, dayIndex) => {
        const date = addDays(viewStartDate, dayIndex);
        const dateIsToday = isToday(date);
        const tasks = tasksMap[format(date, 'yyyy-MM-dd')] ?? [];

        return (
          <Grid
            key={date.getTime()}
            container
            item
            className={dateIsToday ? 'ColumnToday' : ''}
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
              {tasks?.map((task) => {
                const viewUrl = `${delQuery(router.asPath)}?task=${task?.id}&view=${ViewType.Calendar}`;

                return (
                  <SmartLink
                    key={task.title}
                    href={viewUrl}
                    preventLinkNavigation
                    onClick={(task) => handleTaskClick(task)}
                  >
                    <Grid item display="flex" wrap="nowrap" sx={{ width: '100%' }}>
                      <Box>{taskStatusIcon[task.status]}</Box>
                      <Typography sx={styles.taskTitle}>{task.title}</Typography>
                    </Grid>
                  </SmartLink>
                );
              })}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CalendarWeekView;
