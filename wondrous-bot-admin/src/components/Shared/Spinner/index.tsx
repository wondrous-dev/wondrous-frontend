import { CircularProgress } from "@mui/material";

interface IProps {
  size?: string | number;
  thickness?: number;
  sx?: any;
}

export default function Spinner({ size = 30, thickness = 5, sx = {} }: IProps) {
  return (
    <CircularProgress
      size={size}
      thickness={thickness}
      sx={{
        color: "#2A8D5C",
        animationDuration: "10000ms",
        ...sx,
      }}
    />
  );
}
