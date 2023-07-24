import { Grid } from "@mui/material";
import styled from "styled-components";

export const HeatmapContainer = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-template-rows: 7;
  overflow: scroll;
  grid-gap: 4px;
  grid-row-gap: 2px;
  width: 100%;
  height: 100%;
`;

export const HeatmapCell = styled.div`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 6px;
  aspect-ratio: 1;
  width: 100%;
  box-sizing: border-box;
`;
