import addMonths from 'date-fns/addMonths';
import addWeeks from 'date-fns/addWeeks';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import endOfMonth from 'date-fns/endOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import subMonths from 'date-fns/subMonths';
import subWeeks from 'date-fns/subWeeks';
import Typography from '@mui/material/Typography';

import ArrowLeft from 'components/Icons/ArrowLeft';
import ArrowRight from 'components/Icons/ArrowRight';
import CalendarMonthView from 'components/Calendar/CalendarMonthView';
import CalendarWeekView from 'components/Calendar/CalendarWeekView';
import DropdownSelect from 'components/Common/DropdownSelect';
import InfoIcon from 'components/Icons/infoIcon';
import styles from './styles';
import WonderButton from 'components/Button';
import { CALENDAR_CONFIG, CALENDAR_DAY_GRID_VIEW } from 'utils/constants';
import { TaskInterface } from 'types/task';

type Props = {
  tasksMap: {
    [key: string]: TaskInterface[];
  };
  startDate: Date;
  endDate: Date;
  // Function called when the user navigates from one view to another (e.g. from month view to week view)
  onChange: (startDate: Date, endDate: Date) => unknown;
};

const Calendar = ({ tasksMap, onChange, startDate, endDate }: Props) => {
  const [view, setView] = useState<CALENDAR_DAY_GRID_VIEW>(CALENDAR_CONFIG.defaultView);
  const [isAlertHidden, setIsAlertHidden] = useState<boolean>(!!localStorage.getItem('hideCalendarAlert'));

  // Select previous week or month
  const handlePrevClick = () => {
    let newStartDate;
    let newEndDate;

    if (view === CALENDAR_DAY_GRID_VIEW.Month) {
      newStartDate = subMonths(startDate, 1);
      newEndDate = endOfMonth(newStartDate);
    } else {
      newStartDate = subWeeks(startDate, 1);
      newEndDate = endOfWeek(newStartDate);
    }

    onChange(newStartDate, newEndDate);
  };

  // Select next week or month
  const handleNextClick = () => {
    let newStartDate;
    let newEndDate;

    if (view === CALENDAR_DAY_GRID_VIEW.Month) {
      newStartDate = addMonths(startDate, 1);
      newEndDate = endOfMonth(newStartDate);
    } else {
      newStartDate = addWeeks(startDate, 1);
      newEndDate = endOfWeek(newStartDate);
    }

    onChange(newStartDate, newEndDate);
  };

  const handleTodayClick = () => {
    let newStartDate;
    let newEndDate;

    if (view === CALENDAR_DAY_GRID_VIEW.Month) {
      newStartDate = startOfMonth(new Date());
      newEndDate = endOfMonth(newStartDate);
    } else {
      newStartDate = startOfWeek(new Date(), { weekStartsOn: CALENDAR_CONFIG.weekStartsOn });
      newEndDate = endOfWeek(newStartDate);
    }

    onChange(newStartDate, newEndDate);
  };

  const handleAlertClose = () => {
    localStorage.setItem('hideCalendarAlert', 'true');
    setIsAlertHidden(true);
  };

  return (
    <>
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
                {format(startDate, 'MMMM yyyy')}
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
            <DropdownSelect
              {...styles.viewDropdown}
              options={CALENDAR_CONFIG.dayGridViews}
              value={view}
              setValue={setView}
            />
          </Grid>
        </Grid>

        <Grid item>
          {!isAlertHidden ? (
            <Alert onClose={handleAlertClose} sx={styles.infoAlert} severity="info" icon={<InfoIcon />}>
              Only tasks with due dates are displayed
            </Alert>
          ) : null}
        </Grid>
      </Grid>

      {view === CALENDAR_DAY_GRID_VIEW.Month ? (
        <CalendarMonthView startDate={startDate} tasksMap={tasksMap} />
      ) : (
        <CalendarWeekView />
      )}
    </>
  );
};

export default Calendar;
