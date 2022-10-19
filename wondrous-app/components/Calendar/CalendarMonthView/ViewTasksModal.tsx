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

  /**
   *
   */
  tasks: TaskFragment[];

  /**
   * the index of the first day of the week (0 - Sunday);
   */
  // weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  location: any;
  viewUrl: string;
};

const CalendarMonthView = ({ show, selectedDate, tasks, viewUrl }: Props) => {
  const taskStatusIcon = {
    created: <ToDo width="16" height="16" />,
    in_progress: <InProgress width="16" height="16" />,
    in_review: <InReview width="16" height="16" />,
    completed: <Done width="16" height="16" />,
  };


  return (
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
            // preventLinkNavigation
            // onNavigate={() => location.replace(viewUrl)}
            // onClick={() => setSelectedDate(null)}
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
  );
};

export default CalendarMonthView;
