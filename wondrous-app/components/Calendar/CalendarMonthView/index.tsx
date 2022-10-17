import endOfMonth from 'date-fns/endOfMonth';
import setDate from 'date-fns/setDate';
import startOfMonth from 'date-fns/startOfMonth';
import React from 'react';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isToday from 'date-fns/isToday';
import getWeeksInMonth from 'date-fns/getWeeksInMonth';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import palette from 'theme/palette';
import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import styles from 'components/Calendar/CalendarWeekView/styles';

type Props = {
  /**
   * The current view date
   */
  viewDate: Date;

  /**
   * the index of the first day of the week (0 - Sunday);
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

const CalendarMonthView = ({ viewDate, weekStartsOn = 0 }: Props) => {
  const weeks = getWeeksInMonth(viewDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startDayOfWeek = startOfMonth(viewDate).getDay();
  // const endDayOfMonth = endOfMonth(viewDate).getDate();

  const taskStatusIcon = {
    created: <ToDo width="16" height="16" />,
    in_progress: <InProgress width="16" height="16" />,
    in_review: <InReview width="16" height="16" />,
    completed: <Done width="16" height="16" />,
  };

  const status = 'completed';
  const title = 'Below is an interactive demo that lets you explore the visual results of the different settings';

  return (
    <Grid container wrap="wrap" columns={7} sx={styles.wrapper}>
      {weekDays.map((weekDay) => {
        return (
          <Grid key={weekDay} item xs={1}>
            {weekDay}
          </Grid>
        );
      })}

      {new Array(weeks).fill(weeks).map((week, weekIndex) =>
        weekDays.map((weekDay, weekDayIndex) => {
          const day = weekIndex * 7 + weekDayIndex + 1 - startDayOfWeek;
          const key = `${day - weekIndex * 7 + weekDayIndex}`;
          const date = setDate(viewDate, day);
          // const dateIsToday = isToday(date);

          return (
            <Grid
              key={key}
              item
              xs={1}
              // className={dateIsToday ? 'ColumnToday' : ''}
              sx={{
                cursor: 'pointer',
                // width: '100%',
                // borderRight: dayIndex === daysInWeek - 1 ? 'none' : `1px solid ${palette.grey101}`,
                // '&.ColumnToday .ColumnHeader, &:hover .ColumnHeader': {
                //   backgroundColor: palette.grey85,
                //   transition: 'all 0.3s ease-in-out',
                // },
                '&.ColumnToday .ColumnHeaderText, &:hover .ColumnHeaderText': {
                  backgroundColor: palette.highlightPurple,
                  borderRadius: '4px',
                  padding: '0 4px',
                  transition: 'all 0.3s ease-in-out',
                },
                '&.ColumnToday .ColumnBody, &:hover .ColumnBody': {
                  backgroundColor: palette.black87,
                  transition: 'all 0.3s ease-in-out',
                },
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
                <Grid item display="flex" wrap="nowrap">
                  <Box>{taskStatusIcon[status]}</Box>
                  <Typography sx={styles.taskTitle}>{title}</Typography>
                </Grid>
              </Grid>
            </Grid>
          );
        })
      )}
    </Grid>
  );
};

export default CalendarMonthView;
