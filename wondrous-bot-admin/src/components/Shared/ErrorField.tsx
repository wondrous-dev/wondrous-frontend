import { Box } from "@mui/material";
import { ErrorText } from "./styles";
import WarningIcon from "components/Icons/WarningIcon";

interface Props {
  errorText: string
}

const ErrorField = ({ errorText }) => {
  if(!errorText || typeof errorText !== 'string') return;
  return (
    <Box display="flex" gap="2px" alignItems="flex-start" paddingTop="5px"> 
      <WarningIcon />
      <ErrorText
      sx={{
        marginTop: '0px !important'
      }}
      >{errorText}</ErrorText>
    </Box>
  );
};

export default ErrorField;
