import { Box, ButtonBase } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import DateRangePicker from "components/Shared/DatePicker";
import Switch from "components/Shared/Switch";
import moment from "moment";
import { MONTH_DAY_FULL_YEAR } from "utils/constants";

const ONE_DAY_IN_SECONDS = 86400;
const DailySubmissionComponent = (props) => {
  const { questSettings, setQuestSettings } = props;
  console.log("questSettings", questSettings);
  const isDailySubmission = !!questSettings?.submissionCooldownPeriod;
  const handleChange = () => {
    if (!questSettings?.submissionCooldownPeriod) {
      setQuestSettings({
        ...questSettings,
        submissionCooldownPeriod: ONE_DAY_IN_SECONDS,
      });
    } else {
      setQuestSettings({
        ...questSettings,
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
