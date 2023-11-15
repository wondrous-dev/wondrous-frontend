import { useEffect, useMemo, useRef, useState } from "react";
import { DayPickerRangeController } from "react-dates";
import { DayPickerSingleDateController } from "react-dates";
import moment from "moment";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import isEmpty from "lodash/isEmpty";

import {
  DATEPICKER_FIELDS,
  MONTH_DAY_FULL_YEAR,
  DEFAULT_DATEPICKER_VALUE,
  DEFAULT_SINGLE_DATEPICKER_VALUE,
  DATEPICKER_OPTIONS,
  DAY_STRING_MONTH_SHORT_YEAR,
} from "utils/constants";

import Popper from "@mui/material/Popper";
import { ButtonBase, ClickAwayListener, InputAdornment } from "@mui/material";
import { BackspaceOutlined } from "@mui/icons-material";
import { WEEK_DAYS, textFieldInputProps } from "../Shared/utils";
import DatePickerNavButton from "../Shared/DatePickerNavButton";
import CalendarDay from "../Shared/CalendarDay";

interface SingleDatePickerProps {
  sx?: object;
  setValue?: Function;
  setRecurrenceType?: Function;
  setRecurrenceValue?: Function;
  recurrenceType?: any;
  recurrenceValue?: any;
  value?: any;
  hideRecurring?: boolean;
  className?: string;
  handleClose?(): void;
  autoFocus?: boolean;
  placement?: "bottom" | "top";
  ButtonComponent: React.ComponentType<any>;
  ButtonComponentOnClick?: () => void;
  ButtonComponentProps?: { [key: string]: any };
}

function SingleDatePicker({
  setValue,
  value,
  recurrenceType,
  recurrenceValue,
  setRecurrenceValue,
  autoFocus,
  placement = "top",
  ButtonComponent = null,
  ButtonComponentOnClick = null,
  ButtonComponentProps = null,
}: SingleDatePickerProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [repeatType, setRepeatType] = useState();
  const [repeatValue, setRepeatValue] = useState();
  const [weekDaysSelected, setWeekDaysSelected] = useState<Object>(WEEK_DAYS);
  const [monthInView, setMonthInView] = useState();

  const parseWeekDaysToPosition = (weekDays) => {
    const booleanDayList = Object.keys(weekDays).map((_, idx) => Object.values(weekDays)[idx]);
    const dayPositionList = booleanDayList.map((elm, idx) => elm && idx).filter((elm) => elm || elm === 0);
    return dayPositionList;
  };
  const parsePositionToWeekDays = (values) => {
    const listOfDays = Object.keys(WEEK_DAYS).map((day, idx) =>
      values.includes(idx) ? { [day]: true } : { [day]: false }
    );
    const weekDays = listOfDays.reduce((map, newValue) => ({ ...map, ...newValue }));

    return weekDays;
  };

  useEffect(() => {
    recurrenceType && setRepeatType(recurrenceType);

    if (recurrenceType === DATEPICKER_OPTIONS.WEEKLY) {
      const parsedWeekDays = parsePositionToWeekDays(recurrenceValue);
      setWeekDaysSelected(parsedWeekDays);
      return;
    }
    recurrenceValue && setRepeatValue(recurrenceValue);
  }, []);

  useEffect(() => {
    if (repeatType === DATEPICKER_OPTIONS.WEEKLY) {
      const parsedWeekDays = parseWeekDaysToPosition(weekDaysSelected);
      !isEmpty(parsedWeekDays) && setRecurrenceValue(parsedWeekDays);
    }
  }, [weekDaysSelected, repeatType]);

  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });

  const handleDateChange = (newDate) => {
    setValue(moment(newDate));
  };

  const todayMoment = moment();

  const parsedWeekDays = Object.values(weekDaysSelected)
    .map((item, idx) => (item ? idx : null))
    .filter((item) => item || item === 0);

  const highlightDay = (day) => {
    const initialDate = value ? moment(value) : todayMoment;
    const dayOfyear = day.dayOfYear();
    const initialDayOfYear = initialDate.dayOfYear();

    if (repeatType === DATEPICKER_OPTIONS.DAILY) {
      return day.isSameOrAfter(initialDate);
    }
    if (repeatType === DATEPICKER_OPTIONS.WEEKLY) {
      return parsedWeekDays.includes(day.weekday()) && day.isAfter(initialDayOfYear);
    }
    if (repeatType === DATEPICKER_OPTIONS.MONTHLY) {
      return day.date() === repeatValue && day.isAfter(initialDayOfYear);
    }
    if (repeatType === DATEPICKER_OPTIONS.PERIODICALLY) {
      const rest = (dayOfyear + initialDayOfYear) % Number(repeatValue);
      return rest === 0 && day.isAfter(initialDayOfYear);
    }
    return false;
  };

  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      setIsOpen(true);
    }
  }, [autoFocus]);

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
      <div style={{ width: "100%" }}>
        <Box ref={anchorEl}>
          <ButtonComponent
            onClick={() => {
              handleClick();
              ButtonComponentOnClick?.();
            }}
            {...ButtonComponentProps}
          />
        </Box>
        <Popper
          open={isOpen}
          anchorEl={anchorEl.current}
          placement={placement}
          modifiers={[
            {
              name: "flip",
              enabled: true,
              options: {
                altBoundary: true,
                rootBoundary: "document",
                padding: 8,
              },
            },
            {
              name: "preventOverflow",
              enabled: true,
              options: { altAxis: true, altBoundary: true, tether: true, rootBoundary: "document", padding: 8 },
            },
          ]}
        >
          <Box
            sx={{
              "& .DayPicker": {
                width: "300px !important",
              },
              "& .CalendarMonth": {
                "& .CalendarMonth_caption": {
                  fontSize: 13,
                  color: "#2A8D5C",
                  fontFamily: "Poppins",
                  fontWeight: 500,
                },
              },
              "& .DayPicker_transitionContainer": {
                height: "250px !important",
              },
            }}
          >
            <DayPickerSingleDateController
              date={value ? moment(value) : null}
              initialDate={value ? moment(value) : todayMoment}
              id="your_unique_id"
              onDateChange={(date) => handleDateChange(date)}
              focusedInput={isOpen}
              onFocusChange={() => {}}
              numberOfMonths={1}
              displayFormat="MM/DD/yyyy"
              daySize={35.9}
              minimumNights={0}
              enableOutsideDays
              navPrev={<DatePickerNavButton prev />}
              navNext={<DatePickerNavButton next />}
              onPrevMonthClick={(month) => {
                setMonthInView(month);
              }}
              onNextMonthClick={(month) => {
                setMonthInView(month);
              }}
              customArrowIcon={<></>}
              isDayHighlighted={(day) => highlightDay(day)}
              renderCalendarDay={(props) => <CalendarDay {...props} />}
              hideKeyboardShortcutsPanel
            />
          </Box>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

export default SingleDatePicker;
