import { Typography } from '@mui/material';
import { ToggleItem, ToggleWrapper } from './styles';

const DEFAULT_OPTIONS = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];
const ToggleComponent = ({ options = DEFAULT_OPTIONS }) => {
  return (
    <ToggleWrapper>
      {options?.map((option, idx) => {
        return (
          <ToggleItem key={`${option.value}`} checked={option.value}>
            <Typography
              color={'white'}
              fontFamily='Poppins'
              fontWeight={500}
              fontSize='13px'
              lineHeight='13px'
            >
              {option.label}
            </Typography>
          </ToggleItem>
        );
      })}
    </ToggleWrapper>
  );
};

export default ToggleComponent;
