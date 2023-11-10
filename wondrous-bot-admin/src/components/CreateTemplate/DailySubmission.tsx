import { Box, ButtonBase } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import DateRangePicker from "components/Shared/DatePicker";
import Switch from "components/Shared/Switch";
import moment from "moment";
import { MONTH_DAY_FULL_YEAR } from "utils/constants";

const ONE_DAY_IN_SECONDS = 86400;
const DailySubmissionComponent = (props) => {
  const { entitySettings, setEntitySettings } = props;
  const isDailySubmission = !!entitySettings?.submissionCooldownPeriod;
  const handleChange = () => {
    if (!entitySettings?.submissionCooldownPeriod) {
      setEntitySettings({
        ...entitySettings,
        submissionCooldownPeriod: ONE_DAY_IN_SECONDS,
      });
    } else {
      setEntitySettings({
        ...entitySettings,
        submissionCooldownPeriod: null,
      });
    }
  };
  return (
    <Box display="flex" alignItems="center">
      <Switch onChange={handleChange} value={isDailySubmission} />
    </Box>
  );
};

export default DailySubmissionComponent;
