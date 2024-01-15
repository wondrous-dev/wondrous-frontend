import { Grid } from "@mui/material";
import styled from "styled-components";

export const SubmissionContainer = styled(Grid)`
  && {
    background-color: white;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

export const SubmissionStyledDetails = styled(Grid)`
  && {
    display: flex;
    gap: 24px;
  }
`;
