import { Box } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import Switch from "components/Shared/Switch";

const MaxInput = (props) => {
  const { keyValue, stateKey, handleValueChange, value } = props;

  const isActive = value || keyValue?.trim() === "";

  return (
    <Box display="flex" gap={isActive ? "10px" : "0px"} alignItems="center">
      <Box
        sx={{
          width: isActive ? "100%" : "0px",
          visibility: isActive ? "visible" : "hidden",
          transition: "width 0.3s ease-in-out, visibility 0.3s ease-in-out",
        }}
      >
        <CustomTextField
          autoFocus
          type="number"
          value={keyValue}
          onChange={(e) => {
            handleValueChange(e.target.value);
          }}
        />
      </Box>
      <Switch {...props} value={isActive} />
    </Box>
  );
};

export default MaxInput;
