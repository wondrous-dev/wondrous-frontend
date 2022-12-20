import React, { useContext } from 'react';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import styles from 'components/Calendar/CalendarMonthView/styles';
import SmartLink from 'components/Common/SmartLink';
import WonderModal from 'components/Modal';
import { TaskInterface } from 'types/task';
import { delQuery } from 'utils/index';
import { ViewType } from 'types/common';
import { CalendarContext } from 'utils/contexts';

type Props = {
  open: boolean;
  selectedDate: Date;
  tasks: TaskInterface[];
  onClose: () => void;
};

const CalendarMonthView = ({ open, selectedDate, tasks, onClose }: Props) => {
  const { taskStatusIcon, router, handleTaskClick } = useContext(CalendarContext);

  return (
    <WonderModal open={open} onClose={onClose} maxWidth={529} title={format(selectedDate || new Date(), 'LLL d')}>
      <Grid container rowSpacing="6px">
        {tasks.map((task) => {
          const viewUrl = `${delQuery(router.asPath)}?task=${task?.id}&view=${ViewType.Calendar}`;

          return (
            <SmartLink
              key={task.title}
              href={viewUrl}
              preventLinkNavigation
              onClick={(task) => {
                handleTaskClick(task);
                onClose();
              }}
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
          );
        })}
      </Grid>
    </WonderModal>
  );
};

export default CalendarMonthView;
