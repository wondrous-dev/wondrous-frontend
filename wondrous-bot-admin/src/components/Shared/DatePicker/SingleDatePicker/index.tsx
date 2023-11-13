import { Box, ClickAwayListener, Popper } from "@mui/material";
import moment from "moment";
import { useRef, useState } from "react";
import { DATEPICKER_FIELDS } from "utils/constants";
import { SingleDatePicker } from "react-dates";
import DatePickerNavButton from "../Shared/DatePickerNavButton";
import CalendarDay from "../Shared/CalendarDay";

type CustomSingleDatePickerProps = {
  blockPastDates?: boolean;
  blockFutureDates?: boolean;
  onConfirm: (date) => void;
  ButtonComponent: React.ComponentType<any>;
  ButtonComponentOnClick?: () => void;
  ButtonComponentProps?: { [key: string]: any };
};

const SingleDatePickerComponent = ({
  blockPastDates = true,
  blockFutureDates = false,
  onConfirm,
  ButtonComponent,
  ButtonComponentOnClick,
  ButtonComponentProps,
}: CustomSingleDatePickerProps) => {
  const [date, setDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(false);
  const anchorEl = useRef(null);

  const todayMoment = moment();

  const handleOnClose = () => {
    setFocusedInput(false);
    setDate(null);
  };

  const handleOnConfirm = () => {
    onConfirm(date);
    setFocusedInput(false);
  };

  return (
    <ClickAwayListener onClickAway={handleOnClose} mouseEvent="onMouseDown">
      <div>
        <div ref={anchorEl}>
          <ButtonComponent
            onClick={() => {
              setFocusedInput((prev) => !prev);
              ButtonComponentOnClick?.();
            }}
            {...ButtonComponentProps}
          />
        </div>
        <Popper
          open={Boolean(focusedInput)}
          anchorEl={anchorEl.current}
          placement={"bottom"}
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
              options: {
                altAxis: true,
                altBoundary: true,
                tether: true,
                rootBoundary: "document",
                padding: 8,
              },
            },
          ]}
        >
          <Box
            width="302px"
            borderRadius="16px"
            border="1px solid #000000"
            overflow="hidden"
            // sx={{
            //   "& .SingleDatePicker": {
            //     width: "300px !important",
            //   },
            //   "& .CalendarMonth": {
            //     "& .CalendarMonth_caption": {
            //       fontSize: 13,
            //       color: "#2A8D5C",
            //       fontFamily: "Poppins",
            //       fontWeight: 500,
            //     },
            //   },
            //   "& .DayPicker_transitionContainer": {
            //     height: "250px !important",
            //   },
            // }}
          >
            <SingleDatePicker
              date={date}
              onDateChange={setDate}
              focused={focusedInput}
              onFocusChange={({ focused }) => setFocusedInput(focused)}
              id="date_input"
              // ... other necessary props
              numberOfMonths={1}
              displayFormat="MM/DD/yyyy"
              daySize={36}
              minimumNights={0}
              hideKeyboardhortcutPanel
              enableOutsideDays
              navPrev={<DatePickerNavButton prev />}
              navNext={<DatePickerNavButton next />}
              noBorder
              hideKeyboardShortcutsPanel
              customArrowIcon={null}
              renderCalendarDay={(props) => <CalendarDay {...props} />}
              isDayBlocked={(day) => {
                return (
                  (blockPastDates && day.isBefore(todayMoment, "day")) ||
                  (blockFutureDates && day.isAfter(todayMoment, "day"))
                );
              }}
              // ... rest of the styling and components
            />
            {/* Confirm and clear buttons */}
            {/* ... rest of the components */}
          </Box>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default SingleDatePickerComponent;
