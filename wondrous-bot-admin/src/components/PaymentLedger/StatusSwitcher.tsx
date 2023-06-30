import { ButtonBase, Grid, Typography } from "@mui/material";

const StatusSwitcher = ({ value, onChange, options }) => {
  const handleSwitch = (value) => onChange(value);

  return (
    <Grid
      display="flex"
      height="46px"
      padding="6px"
      alignItems="center"
      justifyContent="center"
      gap="8px"
      borderRadius="6px"
      border="1px solid black"
      bgcolor="#E2E2E2"
    >
      {options?.map((option, idx) => (
        <ButtonBase
          onClick={() => handleSwitch(option.value)}
          key={option.value}
          sx={{
            border: "1px solid black",
            borderRadius: "6px",
            width: "100%",
            padding: "10px 30px",
            backgroundColor: option.value === value ? "#F8AFDB" : "transparent",
            "&:hover": {
              backgroundColor: "#F8AFDB",
              borderColor: "black",
            },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          <Typography
            color={"black"}
            whiteSpace="nowrap"
            fontFamily="Poppins"
            fontWeight={600}
            fontSize="13px"
            lineHeight="13px"
          >
            {option.label}
          </Typography>
        </ButtonBase>
      ))}
    </Grid>
  );
  //     return <ToggleWrapper fullWidth={fullWidth}>
  //     {options?.map((option, idx) => (
  //       <ToggleItem
  //         key={`toggle-item-${idx}`}
  //         checked={option.value === value}
  //         onClick={() => onChange(option.value)}
  //       >
  // <Typography
  //   color={'black'}
  //   whiteSpace='nowrap'
  //   fontFamily='Poppins'
  //   fontWeight={500}
  //   fontSize='13px'
  //   lineHeight='13px'
  // >
  //   {option.label}
  // </Typography>
  //       </ToggleItem>
  //     ))}
  //   </ToggleWrapper>
};
export default StatusSwitcher;
