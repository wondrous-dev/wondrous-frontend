import { Box, ButtonBase } from '@mui/material';
import { CustomTextField } from 'components/AddFormEntity/components/styles';
import DateRangePicker from 'components/Shared/DatePicker';
import Switch from 'components/Shared/Switch';
import moment from 'moment';
import { MONTH_DAY_FULL_YEAR } from 'utils/constants';

const TimeboundComponent = (props) => {
  const { setEntitySettings, entitySettings } = props;
  const isTimebound = entitySettings.timeBound;
  return (
    <Box display='flex' gap={isTimebound ? '10px' : '0px'} alignItems='center'>
      <Box
        sx={{
          width: isTimebound ? '100%' : '0px',
          visibility: isTimebound ? 'visible' : 'hidden',
          transition: 'width 0.3s ease-in-out, visibility 0.3s ease-in-out',
        }}
      >
        <DateRangePicker
          startToday
          onConfirm={(value) => {
            setEntitySettings((prev) => ({
              ...prev,
              ...value
            }));
          }}
          ButtonComponent={(props) => (
            <ButtonBase disabled={!isTimebound} {...props}>
              <CustomTextField
                disabled
                placeholder='Select Date Range'
                value={
                  entitySettings?.startAt && entitySettings?.endAt
                    ? `${entitySettings?.startAt?.format(
                        MONTH_DAY_FULL_YEAR
                      )} - ${entitySettings?.endAt?.format(
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
