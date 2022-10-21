import React from 'react';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import styles from 'components/Calendar/CalendarMonthView/styles';
import SmartLink from 'components/Common/SmartLink';
import WonderModal from 'components/Modal';
import { TaskFragment } from 'types/task';

type Props = {
  open: boolean;
  selectedDate: Date;
  tasks: TaskFragment[];
  onClose: () => void;
};

const CalendarMonthView = ({ open, selectedDate, tasks, onClose }: Props) => {
  const taskStatusIcon = {
    created: <ToDo width="16" height="16" />,
    in_progress: <InProgress width="16" height="16" />,
    in_review: <InReview width="16" height="16" />,
    completed: <Done width="16" height="16" />,
  };

  return (
    <WonderModal open={open} onClose={onClose} maxWidth={529} title={format(selectedDate || new Date(), 'LLL d')}>
      <Grid container rowSpacing="6px">
        {tasks.map((task) => (
          <SmartLink
            key={task.title}
            href="/"
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
    </WonderModal>
  );
};

export default CalendarMonthView;
