import TextField from "@mui/material/TextField";

const TextFieldComponent = ({ label, value, onChange, error, ...props }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      variant='standard'
      placeholder='Enter value'
      error={error}
      helperText={error}
    />
  );
};

export default TextFieldComponent;
