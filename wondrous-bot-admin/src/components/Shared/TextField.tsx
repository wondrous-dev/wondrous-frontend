import TextField from '@mui/material/TextField';
import { memo } from 'react';
import { CustomTextField } from '../AddFormEntity/components/styles';

const TextFieldComponent = ({
  label = 'Label',
  value,
  onChange,
  error = null,
  placeholder = 'Enter value',
  multiline = true,
  ...props
}) => {
  const handleChange = (e) => {
    return onChange(e.target.value)
  };

  return (
    <CustomTextField
      label={label}
      value={value}
      fullWidth
      onChange={handleChange}
      multiline={multiline}
      variant='standard'
      placeholder={placeholder}
      error={error}
      helperText={error}
    />
  );
};

export default memo(TextFieldComponent);
