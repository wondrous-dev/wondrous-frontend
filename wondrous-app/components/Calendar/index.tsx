import startOfMonth from 'date-fns/startOfMonth';
import React, { useState } from 'react';
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
import WonderButton from 'components/Button';
import ArrowLeft from 'components/Icons/ArrowLeft';
import ArrowRight from 'components/Icons/ArrowRight';
import { TaskFragment } from 'types/task';
import testData from 'components/Calendar/testData';
import { CALENDAR_CONFIG, CALENDAR_DAY_GRID_VIEW } from 'utils/constants';
import styles from './styles';

type Props = {
  tasksMap: {
    [key: string]: TaskFragment[];
  };
};

const Calendar = ({ tasksMap }: Props) => {
  const [view, setView] = useState<CALENDAR_DAY_GRID_VIEW>(CALENDAR_CONFIG.defaultView);
  const [viewDate, setViewDate] = useState<Date>(startOfMonth(new Date()));

  // Select previous week or month
  const handlePrevClick = () => {
    setViewDate((prevDate) => {
      if (view === CALENDAR_DAY_GRID_VIEW.Month) {
        return subMonths(prevDate, 1);
      }

      return subWeeks(prevDate, 1);
    });
  };

  // Select next week or month
  const handleNextClick = () => {
    setViewDate((prevDate) => {
      if (view === CALENDAR_DAY_GRID_VIEW.Month) {
        return addMonths(prevDate, 1);
      }

      return addWeeks(prevDate, 1);
    });
  };

  const handleTodayClick = () => {
    setViewDate(() => {
      if (view === CALENDAR_DAY_GRID_VIEW.Month) {
        return startOfMonth(new Date());
      }

      return startOfWeek(new Date(), { weekStartsOn: CALENDAR_CONFIG.weekStartsOn });
    });
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
            <DropdownSelect
              {...styles.viewDropdown}
              options={CALENDAR_CONFIG.dayGridViews}
              value={view}
              setValue={setView}
            />
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

      {view === CALENDAR_DAY_GRID_VIEW.Month ? (
        <CalendarMonthView tasksMap={tasksMap} viewDate={viewDate} />
      ) : (
        <CalendarWeekView tasks={testData.data.getOrgTaskBoardTasks} viewDate={viewDate} />
      )}
    </div>
  );
};

export default Calendar;
