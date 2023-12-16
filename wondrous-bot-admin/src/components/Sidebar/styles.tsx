import { Typography } from "@mui/material";
import styled from "styled-components";

export const SidebarLabel = styled(Typography)`
  && {
    fontfamily: Poppins;
    color: ${({ color = "black" }) => color};
    fontsize: 14px;
    fontweight: 500;
    lineheight: 14x;
  }
`;
