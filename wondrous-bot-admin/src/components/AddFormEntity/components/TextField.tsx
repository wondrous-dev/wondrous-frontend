import TextField from "@mui/material/TextField";
import { CustomTextField } from "./styles";

const TextFieldComponent = ({ label = 'Label', value = 'askdjaslkdjdasklhdasklhdljkashdljaskhdjklashdsajklhdasjkldhsakjldhasjkldhsajklhdajsklhdjlkashdjsklahfejlskaehffjkldhfdsjlkhfsjkldhfjdsaklhfjklsdahfjksdlahfdjklshsfhdjk', onChange = () => {}, error = null, ...props }) => {
  return (
    <CustomTextField
      label={label}
      value={value}
      fullWidth
      onChange={onChange}
      multiline
      variant='standard'
      placeholder='Enter value'
      error={error}
      helperText={error}
    />
  );
};

export default TextFieldComponent;
