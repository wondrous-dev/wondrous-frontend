import { Grid } from "@mui/material";
import styled from "styled-components";

export const HeatmapContainer = styled(Grid)`
  display: grid;
  // grid-template-columns: repeat(6, 1fr);
  grid-template-columns: ${({ cellsNum }) => `repeat(${cellsNum}, 1fr);`}
  grid-gap: 4px;
  grid-row-gap: 2px;
  width: 100%;
  height: 100%;
`;

export const HeatmapCell = styled.div`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 6px;
  height: 100%;
`;
