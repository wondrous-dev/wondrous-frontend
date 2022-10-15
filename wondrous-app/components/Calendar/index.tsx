import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import startOfWeek from 'date-fns/startOfWeek';
import subWeeks from 'date-fns/subWeeks';
import addWeeks from 'date-fns/addWeeks';

import DropdownSelect from 'components/Common/DropdownSelect';
import CalendarWeekView from 'components/Calendar/CalendarWeekView';
import CalendarMonthView from 'components/Calendar/CalendarMonthView';
import typography from 'theme/typography';
import WonderButton from 'components/Button';
import ArrowLeft from 'components/Icons/ArrowLeft';
import ArrowRight from 'components/Icons/ArrowRight';
import palette from 'theme/palette';

enum View {
  Month = 'month',
  Week = 'week',
}

const Calendar = () => {
  const weekStartsOn = 0; // the index of the first day of the week (0 - Sunday
  const views = [
    { label: 'Month View', value: View.Month },
    { label: 'Week View', value: View.Week },
  ];
  const [view, setView] = useState<View>(View.Week);
  const [viewDate, setViewDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn }));
  const handlePrevClick = () => {
    setViewDate((prevDate) => {
      // if (view === View.Month) {
      //   return new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
      // }

      return subWeeks(prevDate, 1);
    });
  };

  const handleNextClick = () => {
    setViewDate((prevDate) => {
      // if (view === View.Month) {
      //   return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
      // }

      return addWeeks(prevDate, 1);
    });
  };

  const handleTodayClick = () => {
    setViewDate(startOfWeek(new Date(), { weekStartsOn }));
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
          <Grid item>
            <Typography
              marginLeft="32px"
              marginRight="24px"
              color="white"
              fontWeight={500}
              fontSize="14px"
              fontFamily={typography.fontFamily}
            >
              August 2022
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
          <Grid item>
            <DropdownSelect
              options={views}
              innerStyle={{
                background: palette.grey87,
                maxWidth: '150px',
                padding: 0,
                margin: 0,
                fontSize: '15px',
                color: palette.white,
              }}
              formSelectStyle={{
                height: 'auto',
                margin: '0 32px',
              }}
              value={view}
              setValue={setView}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '250px',
                    width: '100%',
                    maxWidth: 150,
                    background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
                    padding: '15px',
                    '*::-webkit-scrollbar': {
                      width: 100,
                    },
                  },
                },
              }}
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
            sx={{
              background: '#250069',
              alignItems: 'center',
              border: '1px solid #4F00DE',
              borderRadius: '6px',
              height: '36px',
              padding: '0 7px',
              color: '#FFFFFF',
              '.MuiAlert-icon svg': {
                color: '#CCBBFF',
              },
              '.MuiAlert-action': {
                margin: '0 0 0 70px',
                padding: 0,
              },
            }}
            severity="info"
          >
            Only tasks with due dates are displayed
          </Alert>
        </Grid>
      </Grid>

      {view === View.Week ? <CalendarWeekView viewDate={viewDate} /> : <CalendarMonthView viewDate={viewDate} weekStartsOn={weekStartsOn} />}
    </div>
  );
};

export default Calendar;
