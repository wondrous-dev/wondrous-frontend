import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';

import SmartLink from 'components/Common/SmartLink';
import styles from 'components/Calendar/CalendarMonthView/styles';
import TaskStatus from 'components/Icons/TaskStatus';
import WonderModal from 'components/Modal';
import { TaskInterface } from 'types/task';
import { useRouter } from 'next/router';

type Props = {
  open: boolean;
  selectedDate: Date;
  tasks: TaskInterface[];
  onClose: () => void;
};

const CalendarMonthView = ({ open, selectedDate, tasks, onClose }: Props) => {
  const router = useRouter();

  return (
    <WonderModal open={open} onClose={onClose} maxWidth={529} title={format(selectedDate || new Date(), 'LLL d')}>
      <Grid container rowSpacing="6px">
        {tasks.map((task) => (
          <SmartLink
            key={task.id}
            href={`${router.asPath}&task=${task.id}`}
            preventLinkNavigation
            onNavigate={() => {
              onClose();
              const query = {
                ...router.query,
                task: task.id,
              };

              router.push({ query }, undefined, { scroll: false, shallow: true });
            }}
          >
            <a href={`${router.asPath}&task=${task.id}`} style={{ textDecoration: 'none' }}>
              <Grid item display="flex" alignItems="center" sx={styles.viewAllTasksModal.taskRow}>
                <Grid display="flex" alignItems="center">
                  <TaskStatus
                    style={{
                      width: '16px',
                      height: '16px',
                    }}
                    status={task?.status}
                  />
                </Grid>
                <Grid display="flex" alignItems="center" sx={{ width: '31rem' }}>
                  <Typography noWrap sx={styles.viewAllTasksModal.taskTitle}>
                    {task.title}
                  </Typography>
                </Grid>
              </Grid>
            </a>
          </SmartLink>
        ))}
      </Grid>
    </WonderModal>
  );
};

export default CalendarMonthView;
