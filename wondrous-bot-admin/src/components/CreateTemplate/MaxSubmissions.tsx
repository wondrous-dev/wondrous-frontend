import { Box, ButtonBase } from '@mui/material';
import { CustomTextField } from 'components/AddFormEntity/components/styles';
import DateRangePicker from 'components/Shared/DatePicker';
import Switch from 'components/Shared/Switch';
import moment from 'moment';
import { MONTH_DAY_FULL_YEAR } from 'utils/constants';

const MaxSubmissions = (props) => {
  const { maxSubmission, setQuestSettings } = props;
  return (
    <Box
      display='flex'
      gap={maxSubmission ? '10px' : '0px'}
      alignItems='center'
    >
      <Box
        sx={{
          width: maxSubmission ? '100%' : '0px',
          visibility: maxSubmission ? 'visible' : 'hidden',
          transition: 'width 0.3s ease-in-out, visibility 0.3s ease-in-out',
        }}
      >
        <CustomTextField
        autoFocus
          type='number'
          value={maxSubmission}
          onChange={(e) => {
            setQuestSettings((prev) => ({
              ...prev,
              maxSubmission: e.target.value,
            }));
          }}
        />
      </Box>
      <Switch {...props} />
    </Box>
  );
};

export default MaxSubmissions;
