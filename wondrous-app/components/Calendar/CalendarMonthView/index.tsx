import endOfMonth from 'date-fns/endOfMonth';
import setDate from 'date-fns/setDate';
import startOfMonth from 'date-fns/startOfMonth';
import React, { useState } from 'react';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isToday from 'date-fns/isToday';
import getWeeksInMonth from 'date-fns/getWeeksInMonth';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import palette from 'theme/palette';
import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import styles from 'components/Calendar/CalendarMonthView/styles';
// import { taskList } from 'components/Calendar/testData';
import SmartLink from 'components/Common/SmartLink';
import Modal from 'components/Modal';
import { TaskFragment } from 'types/task';

type Props = {
  /**
   * The current view date
   */
  viewDate: Date;

  tasksMap: {
    [key: string]: TaskFragment[];
  };
};

const CalendarMonthView = ({ viewDate, tasksMap }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  // TODO: Move to the config
  const maximumNumberTasks = 3;
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
            const key = `${day - weekIndex * 7 + weekDayIndex}`;
            const date = setDate(viewDate, day);
            const dateIsToday = isToday(date);
            const dateFormat = isFirstDayOfMonth(date) ? 'LLL d' : 'd';

            return (
              <Grid
                key={key}
                item
                xs={1}
                className={dateIsToday ? 'ColumnToday' : ''}
                sx={{
                  borderRight: weekDayIndex === 6 ? 'none' : `1px solid ${palette.grey101}`,
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
                <Grid container item className="ColumnBody" sx={styles.columnBody}>
                  {tasks.slice(0, 3).map((task) => (
                    <SmartLink
                      key={task.title}
                      href={viewUrl}
                      preventLinkNavigation
                      onNavigate={() => location.replace(viewUrl)}
                    >
                      <Grid key={task.title} wrap="nowrap" mb="10px" container height="16px">
                        <Box>{taskStatusIcon[task.status]}</Box>
                        <Typography noWrap sx={styles.taskTitle}>
                          {task.title}
                        </Typography>
                      </Grid>
                    </SmartLink>
                  ))}
                  {tasks.length > maximumNumberTasks ? (
                    <Button
                      variant="text"
                      onClick={() => {
                        setSelectedDate(date);
                        // setSelectedDay(format(date, 'LLL d'));
                      }}
                      sx={styles.moreButton}
                    >
                      {tasks.length - maximumNumberTasks} more
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            );
          })
        )}
      </Grid>

      <Modal
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        maxWidth={529}
        title={format(selectedDate || new Date(), 'LLL d')}
      >
        <Grid container rowSpacing="6px">
          {tasks.map((task) => (
            <SmartLink
              key={task.title}
              href={viewUrl}
              preventLinkNavigation
              onNavigate={() => location.replace(viewUrl)}
              onClick={() => setSelectedDate(null)}
            >
              <Grid item display="flex" wrap="nowrap" alignItems="center" sx={styles.modalTask}>
                <Grid display="flex" alignItems="center">
                  {taskStatusIcon[task.status]}
                </Grid>
                <Grid display="flex" alignItems="center" sx={{ width: '31rem' }}>
                  <Typography noWrap sx={styles.modalTaskTitle}>
                    {task.title}
                  </Typography>
                </Grid>
              </Grid>
            </SmartLink>
          ))}
        </Grid>
      </Modal>
    </>
  );
};

export default CalendarMonthView;
