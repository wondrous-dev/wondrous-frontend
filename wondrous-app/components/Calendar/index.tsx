import startOfMonth from 'date-fns/startOfMonth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import startOfWeek from 'date-fns/startOfWeek';
import endOfMonth from 'date-fns/endOfMonth';
import subWeeks from 'date-fns/subWeeks';
import addWeeks from 'date-fns/addWeeks';
import subMonths from 'date-fns/subMonths';
import addMonths from 'date-fns/addMonths';
import format from 'date-fns/format';
import { useLazyQuery } from '@apollo/client';

import DropdownSelect from 'components/Common/DropdownSelect';
import CalendarWeekView from 'components/Calendar/CalendarWeekView';
import CalendarMonthView from 'components/Calendar/CalendarMonthView';
import WonderButton from 'components/Button';
import ArrowLeft from 'components/Icons/ArrowLeft';
import ArrowRight from 'components/Icons/ArrowRight';
import { TaskInterface } from 'types/task';
import { CALENDAR_CONFIG, CALENDAR_DAY_GRID_VIEW } from 'utils/constants';
import InfoIcon from 'components/Icons/infoIcon';
import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import { CalendarContext } from 'utils/contexts';
import { GET_USER_TASK_BOARD_TASKS_CALENDAR } from 'graphql/queries';
import { useMe } from 'components/Auth/withAuth';
import styles from './styles';

type Props = {
  tasksMap: {
    [key: string]: TaskInterface[];
  };
};

const Calendar = ({ tasksMap }: Props) => {
  const [getUserTaskBoardTasksCalendar, { data: getUserTaskBoardTasksCalendarData }] = useLazyQuery(
    GET_USER_TASK_BOARD_TASKS_CALENDAR,
    { fetchPolicy: 'network-only' }
  );
  const [view, setView] = useState<CALENDAR_DAY_GRID_VIEW>(CALENDAR_CONFIG.defaultView);
  const [viewStartDate, setViewStartDate] = useState<Date>(startOfMonth(new Date()));
  const router = useRouter();
  const loggedInUser = useMe();
  const [isAlertHidden, setIsAlertHidden] = useState(localStorage.getItem('dueDatesHidden') === 'true');

  const taskStatusIcon = {
    created: <ToDo width="16" height="16" />,
    in_progress: <InProgress width="16" height="16" />,
    in_review: <InReview width="16" height="16" />,
    completed: <Done width="16" height="16" />,
  };

  // Select previous week or month
  const handlePrevClick = () => {
    setViewStartDate((prevDate) => {
      if (view === CALENDAR_DAY_GRID_VIEW.Month) {
        return subMonths(prevDate, 1);
      }

      return subWeeks(prevDate, 1);
    });
  };

  // Select next week or month
  const handleNextClick = () => {
    setViewStartDate((prevDate) => {
      if (view === CALENDAR_DAY_GRID_VIEW.Month) {
        return addMonths(prevDate, 1);
      }

      return addWeeks(prevDate, 1);
    });
  };

  const handleTodayClick = () => {
    setViewStartDate(() => {
      if (view === CALENDAR_DAY_GRID_VIEW.Month) {
        return startOfMonth(new Date());
      }

      return startOfWeek(new Date(), { weekStartsOn: CALENDAR_CONFIG.weekStartsOn });
    });
  };

  const viewEndDate = endOfMonth(new Date(viewStartDate));

  const handleAlertClose = () => {
    localStorage.setItem('dueDatesHidden', 'true');
    setIsAlertHidden(true);
  };

  const handleTaskClick = (task) => {
    const query = {
      ...router.query,
      task: task?.id,
    };

    router.push({ query }, undefined, { scroll: false, shallow: true });
  };

  return (
    <CalendarContext.Provider
      value={{
        taskStatusIcon,
        router,
        tasksMap,
        viewStartDate,
        viewEndDate,
        handleTaskClick,
        getUserTaskBoardTasksCalendar,
        loggedInUser,
      }}
    >
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
                {format(viewStartDate, 'MMMM yyyy')}
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

      {view === CALENDAR_DAY_GRID_VIEW.Month ? <CalendarMonthView /> : <CalendarWeekView />}
    </CalendarContext.Provider>
  );
};

export default Calendar;
