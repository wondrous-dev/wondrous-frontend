import { Box, ButtonBase } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import DateRangePicker from "components/Shared/DatePicker";
import Switch from "components/Shared/Switch";
import { MONTH_DAY_FULL_YEAR } from "utils/constants";

const TimeboundComponent = (props) => {
  const { setQuestSettings, questSettings } = props;
  const isTimebound = questSettings.timeBound;
  return (
    <Box display="flex" gap={isTimebound ? "10px" : "0px"} alignItems="center">
      <Box
        sx={{
          width: isTimebound ? "100%" : "0px",
          visibility: isTimebound ? "visible" : "hidden",
          transition: "width 0.3s ease-in-out, visibility 0.3s ease-in-out",
        }}
      >
        <DateRangePicker
          startToday
          onConfirm={(value) => {
            setQuestSettings((prev) => ({
              ...prev,
              ...value,
            }));
          }}
          ButtonComponent={(props) => (
            <ButtonBase disabled={!isTimebound} {...props}>
              <CustomTextField
                disabled
                placeholder="Select Date Range"
                value={
                  questSettings?.startAt && questSettings?.endAt
                    ? `${questSettings?.startAt?.format(MONTH_DAY_FULL_YEAR)} - ${questSettings?.endAt?.format(
                        MONTH_DAY_FULL_YEAR
                      )}`
                    : null
                }
              />
            </ButtonBase>
          )}
        />
      </Box>
      <Switch {...props} />
    </Box>
  );
};

export default TimeboundComponent;
