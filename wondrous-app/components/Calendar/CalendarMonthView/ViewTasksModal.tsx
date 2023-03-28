import { useMe } from 'components/Auth/withAuth';
import React, { useEffect, useMemo, useState } from 'react';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useInView } from 'react-intersection-observer';

import SmartLink from 'components/Common/SmartLink';
import styles from 'components/Calendar/CalendarMonthView/styles';
import TaskStatus from 'components/Icons/TaskStatus';
import WonderModal from 'components/Modal';
import { TaskInterface } from 'types/task';
import { useRouter } from 'next/router';
import { buildTaskUrl } from 'utils/board';

type Props = {
  open: boolean;
  selectedDate: Date;
  tasks: TaskInterface[];
  onClose: () => void;
};

const CalendarMonthView = ({ open, selectedDate, tasks, onClose }: Props) => {
  const pageSize = 20; // Display 20 items per page
  const router = useRouter();
  const [inViewRef, inView] = useInView({});
  const [endIndex, setEndIndex] = useState<number>(pageSize);
  const tasksPaginated = useMemo(() => tasks.slice(0, endIndex), [tasks, endIndex]);
  const hasMore = tasksPaginated.length < tasks.length;

  useEffect(() => {
    if (inView && hasMore) {
      setEndIndex(endIndex + pageSize);
    }
  }, [inView, hasMore, endIndex, pageSize]);

  const handleClick = (event) => {
    const isCommandKeyPressed = event.metaKey || event.ctrlKey;

    if (!isCommandKeyPressed) {
      onClose();
    }
  };

  return (
    <WonderModal open={open} onClose={onClose} maxWidth={529} title={format(selectedDate || new Date(), 'LLL d')}>
      <Grid container rowSpacing="6px">
        {tasksPaginated.map((task) => (
          <SmartLink key={task.id} href={buildTaskUrl(router, task)} asLink>
            <Grid item display="flex" alignItems="center" sx={styles.viewAllTasksModal.taskRow} onClick={handleClick}>
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
          </SmartLink>
        ))}
      </Grid>
      <Box ref={inViewRef} sx={{ display: hasMore ? 'block' : 'none' }} />
    </WonderModal>
  );
};

export default CalendarMonthView;
