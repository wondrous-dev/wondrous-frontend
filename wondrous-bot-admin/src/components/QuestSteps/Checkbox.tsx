import { ButtonBase, Typography } from "@mui/material";
import { StyledCheckbox } from "components/PaymentLedger/styles";
import { useRef } from "react";

const CheckboxOption = ({
  option,
  value,
  disabled = false,
  buttonSx = {},
  handleCheckboxChange,
  checkboxProps = {},
}) => {
  const checkboxRef = useRef(null);

  // The idea is to have the checkbox manage it's own check/uncheck state but be able to be clicked from the wrapper ( ButtonBase )
  const handleCheckboxClick = () => checkboxRef.current.click();

  return (
    <ButtonBase
      onClick={handleCheckboxClick}
      sx={{
        padding: "8px 12px",
        borderRadius: "6px",
        bgcolor: "#E8E8E8",
        border: "1px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "12px",
        ...buttonSx,
      }}
    >
      <StyledCheckbox
        bgcolor={"#2A8D5C"}
        height="22px"
        width="22px"
        inputRef={checkboxRef}
        onClick={handleCheckboxClick}
        disabled={disabled}
        onChange={handleCheckboxChange}
        {...checkboxProps}
      />
      <Typography fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px" color="#1D1D1D">
        {option.text}
      </Typography>
    </ButtonBase>
  );
};

export default CheckboxOption;
