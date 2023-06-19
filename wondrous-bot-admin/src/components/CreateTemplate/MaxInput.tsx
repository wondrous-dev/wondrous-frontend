import { Box } from '@mui/material';
import { CustomTextField } from 'components/AddFormEntity/components/styles';
import Switch from 'components/Shared/Switch';

const MaxInput = (props) => {
  const { keyValue, stateKey, setQuestSettings } = props;
  return (
    <Box
      display='flex'
      gap={keyValue ? '10px' : '0px'}
      alignItems='center'
    >
      <Box
        sx={{
          width: keyValue ? '100%' : '0px',
          visibility: keyValue ? 'visible' : 'hidden',
          transition: 'width 0.3s ease-in-out, visibility 0.3s ease-in-out',
        }}
      >
        <CustomTextField
        autoFocus
          type='number'
          value={keyValue}
          onChange={(e) => {
            setQuestSettings((prev) => ({
              ...prev,
              [stateKey]: e.target.value,
            }));
          }}
        />
      </Box>
      <Switch {...props} />
    </Box>
  );
};

export default MaxInput
