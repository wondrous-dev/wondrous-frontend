import startOfMonth from 'date-fns/startOfMonth';
import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import startOfWeek from 'date-fns/startOfWeek';
import subWeeks from 'date-fns/subWeeks';
import addWeeks from 'date-fns/addWeeks';
import subMonths from 'date-fns/subMonths';
import addMonths from 'date-fns/addMonths';
import format from 'date-fns/format';

import DropdownSelect from 'components/Common/DropdownSelect';
import CalendarWeekView from 'components/Calendar/CalendarWeekView';
import CalendarMonthView from 'components/Calendar/CalendarMonthView';
import typography from 'theme/typography';
import WonderButton from 'components/Button';
import ArrowLeft from 'components/Icons/ArrowLeft';
import ArrowRight from 'components/Icons/ArrowRight';
import palette from 'theme/palette';
import { TaskFragment } from 'types/task';
import { useLocation } from 'utils/useLocation';
import { ViewType } from 'types/common';
import { delQuery } from 'utils/index';
import styles from './styles';
import testData from 'components/Calendar/testData';
import { TASK_STATUS_IN_REVIEW, TASK_STATUS_REQUESTED } from 'utils/constants';

enum View {
  Month = 'month',
  Week = 'week',
}

type Props = {
  tasksMap: {
    [key: string]: TaskFragment[];
  };
};

const Calendar = ({ tasksMap }: Props) => {
  const weekStartsOn = 0; // the index of the first day of the week (0 - Sunday
  const views = [
    { label: 'Month View', value: View.Month },
    { label: 'Week View', value: View.Week },
  ];
  const [view, setView] = useState<View>(View.Month);
  const [viewDate, setViewDate] = useState<Date>(startOfMonth(new Date()));
  // const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM yyyy'));
  const handlePrevClick = () => {
    setViewDate((prevDate) => {
      if (view === View.Month) {
        return subMonths(prevDate, 1);
      }

      return subWeeks(prevDate, 1);
    });

    // if (view === View.Month) {
    //   return setSelectedMonth(format(subMonths(viewDate, 1), 'MMMM yyyy'));
    // }
    //
    // if (view === View.Week) {
    //   return setSelectedMonth(format(subWeeks(viewDate, 1), 'MMMM yyyy'));
    // }
  };

  const handleNextClick = () => {
    setViewDate((prevDate) => {
      // if (view === View.Month) {
      //   return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
      // }

      if (view === View.Month) {
        return addMonths(prevDate, 1);
      }

      return addWeeks(prevDate, 1);
    });
    //
    // if (view === View.Month) {
    //   return setSelectedMonth(format(addMonths(viewDate, 1), 'MMMM yyyy'));
    // }
    //
    // if (view === View.Week) {
    //   return setSelectedMonth(format(addWeeks(viewDate, 1), 'MMMM yyyy'));
    // }
  };

  const handleTodayClick = () => {
    setViewDate(startOfWeek(new Date(), { weekStartsOn }));

    setViewDate((prevDate) => {
      // if (view === View.Month) {
      //   return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
      // }

      if (view === View.Month) {
        return startOfMonth(new Date());
      }

      return startOfWeek(new Date(), { weekStartsOn });
    });
    // setSelectedMonth(format(new Date(), 'MMMM yyyy'));
  };

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item display="flex" alignItems="center">
          <Grid item>
            <WonderButton color="grey" borderRadius={6} onClick={handleTodayClick}>
              Today
            </WonderButton>
          </Grid>
          <Grid container item display="flex" alignItems="center" sx={{ margin: '0 32px' }}>
            <Grid item sx={{ minWidth: '112px', marginRight: '24px' }}>
              <Typography color="white" fontWeight={500} fontSize="14px" textAlign="center">
                {format(viewDate, 'MMMM yyyy')}
              </Typography>
            </Grid>

            <Grid item>
              <Grid display="flex">
                <WonderButton
                  color="grey"
                  borderRadius={6}
                  width={30}
                  height={30}
                  buttonTheme={{ paddingX: 0 }}
                  onClick={handlePrevClick}
                >
                  <ArrowLeft />
                </WonderButton>
                <Box padding="2px" />
                <WonderButton
                  color="grey"
                  borderRadius={6}
                  width={30}
                  height={30}
                  buttonTheme={{ paddingX: 0 }}
                  onClick={handleNextClick}
                >
                  <ArrowRight />
                </WonderButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <DropdownSelect {...styles.viewDropdown} options={views} value={view} setValue={setView} />
          </Grid>
        </Grid>

        <Grid item>
          <Alert
            onClose={() => {}}
            action={
              <WonderButton color="purple" borderRadius={4} width={18} height={18} buttonTheme={{ paddingX: 0 }}>
                &times;
              </WonderButton>
            }
            sx={styles.infoAlert}
            severity="info"
          >
            Only tasks with due dates are displayed
          </Alert>
        </Grid>
      </Grid>

      {view === View.Month ? (
        <CalendarMonthView tasksMap={tasksMap} viewDate={viewDate} />
      ) : (
        <CalendarWeekView tasks={testData.data.getOrgTaskBoardTasks} viewDate={viewDate} />
      )}
    </div>
  );
};

export default Calendar;
