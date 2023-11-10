import { ButtonBase, Grid, Typography } from "@mui/material";

export const RewardTypeSwitch = ({ options, value, onChange }) => {
  return (
    <Grid bgcolor="#E9E9E9" height="47px" 
    justifyContent="center"
    padding="8px" gap="12px" display="flex" maxWidth="fit-content" width="100%" borderRadius="8px">
      {options?.map((option, idx) => {
        const isActive = value === option.value;
        return (
          <ButtonBase
            key={option.value}
            onClick={() => onChange(option.value)}
            sx={{
              backgroundColor: isActive ? "#AF9EFF" : "transparent",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
              padding: "4px 8px 4px 8px",
              border: `1px solid ${isActive ? "black" : "transparent"}`,
            }}
          >
            <Typography
              color={"black"}
              whiteSpace="nowrap"
              fontFamily="Poppins"
              fontWeight={500}
              fontSize="13px"
              lineHeight="13px"
            >
              {option.label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Grid>
  );
};
