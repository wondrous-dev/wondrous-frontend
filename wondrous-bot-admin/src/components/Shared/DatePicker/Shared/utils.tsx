import { Grid } from "@mui/material";
import { CloseIcon } from "./Icons";

export const textFieldInputProps = ({ dateString, onClick }) => ({
  readOnly: true,
  endAdornment: dateString && (
    <Grid
      onClick={onClick}
      container
      alignItems="center"
      justifyContent="center"
      width="12px"
      sx={{
        "&:hover": {
          cursor: "pointer",
        },
        svg: {
          transform: "scale(0.8)",
          path: {
            fill: "white",
          },
        },
      }}
    >
      <CloseIcon />
    </Grid>
  ),
  sx: {
    borderRadius: "6px",
    height: "40px",
    background: " #C6BBFC",
    fontSize: "15px",
    color: "black",
    fontWeight: "500",
    padding: "8px",
    "& .MuiInputBase-input": {
      padding: "0",
      "&::placeholder": {
        color: "black",
      },
    },
  },
});
