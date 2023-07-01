import { Tooltip } from "@mui/material";

export const StyledInformationTooltip = ({ children, ...props }) => {
  return (
    <Tooltip
      arrow
      title={props?.title}
      {...props}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "#2a8d5c",
            fontFamily: "Poppins",
            fontWeight: 500,
            fontSize: "13px",
            "& .MuiTooltip-arrow": {
              color: "#2a8d5c",
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};
