import React from 'react';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isToday from 'date-fns/isToday';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import palette from 'theme/palette';
import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import styles from 'components/Calendar/CalendarWeekView/styles';
import { taskList } from 'components/Calendar/testData';
import SmartLink from 'components/Common/SmartLink';

type Props = {
  /**
   * The current view date
   */
  viewDate: Date;

  /**
   * The number of days in a week. Can be used to create a shorter or longer week view.
   * The first day of the week will always be the viewDate
   */
  daysInWeek?: number;
  location: any;
  viewUrl: string;
};

const CalendarWeekView = ({ viewDate, daysInWeek = 7, location, viewUrl }: Props) => {
  // const week = [];
  //
  // for (let i = 0; i <= 6; i++) {
  //   week.push(format(addDays(new Date(), i), 'ccc d'));
  // }

  const taskStatusIcon = {
    created: <ToDo width="16" height="16" />,
    in_progress: <InProgress width="16" height="16" />,
    in_review: <InReview width="16" height="16" />,
    completed: <Done width="16" height="16" />,
  };

  return (
    <Grid container wrap="nowrap" sx={styles.wrapper}>
      {new Array(daysInWeek).fill(daysInWeek).map((day, dayIndex) => {
        const date = addDays(viewDate, dayIndex);
        const dateIsToday = isToday(date);

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
              {taskList.map((task) => (
                <SmartLink
                  key={task.title}
                  href={viewUrl}
                  preventLinkNavigation
                  onNavigate={() => location.replace(viewUrl)}
                >
                  <Grid item display="flex" wrap="nowrap">
                    <Box>{taskStatusIcon[task.status]}</Box>
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
