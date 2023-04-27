import { Typography } from '@mui/material';
import { ToggleItem, ToggleWrapper } from './styles';

const ToggleComponent = ({ options, onChange, value, fullWidth = false }) => (
  <ToggleWrapper fullWidth={fullWidth}>
    {options?.map((option, idx) => (
      <ToggleItem
        key={`toggle-item-${idx}`}
        checked={option.value === value}
        onClick={() => onChange(option.value)}
      >
        <Typography
          color={'black'}
          whiteSpace='nowrap'
          fontFamily='Poppins'
          fontWeight={500}
          fontSize='13px'
          lineHeight='13px'
        >
          {option.label}
        </Typography>
      </ToggleItem>
    ))}
  </ToggleWrapper>
);

export default ToggleComponent;
