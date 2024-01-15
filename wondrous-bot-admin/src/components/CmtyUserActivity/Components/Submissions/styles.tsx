import { Grid, Typography } from "@mui/material";
import { SubmissionContainer, SubmissionStyledDetails } from "components/MembersAnalytics/Common/styles";
import { SubmissinsWrapper, TextWrapper } from "components/MembersAnalytics/styles";
import {
  Accordion,
  ChevronButton,
  StyledAccordionSummary,
  StyledAccordionDetails,
} from "components/Shared/Accordion/styles";
import styled from "styled-components";

// TODO: for the future, create multi theme components

export const CmtyUserSubmissionsContainer = styled(Grid)`
  && {
    ${SubmissinsWrapper} {
        width: 100%;
        height: 100%;
        max-height: 100%;
      }
    ${SubmissionContainer} {
      background-color: #F7F7F7;
      ${SubmissionStyledDetails} {
        ${TextWrapper} {
          background: #D8D8D8;
          border: 1px solid #BABABA;
        }
      }
    }

    ${Accordion} {
      background-color: black;
      ${StyledAccordionSummary} {
        background-color: black;
        color: white;
        ${ChevronButton} {
            border: 1px solid white;
            background: #ECECEC;
        }
        p  {
            color: white;
            span {
                color: #BEBEBE;
            }
           }
        }
      }
    }
  }
`;
