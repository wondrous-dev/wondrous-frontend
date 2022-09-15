import styled from 'styled-components';

import Accordion from '@mui/material/Accordion';
import AccordionDetailsComp from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import typography from 'theme/typography';
import palette from 'theme/palette';

export const AccordionComp = styled(Accordion)`
  && {
    margin-top: 0;
    border: 1px solid #4b4b4b;
    border-radius: 6px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    background: ${palette.black97};
    margin-bottom: 16px;
  }

  .MuiAccordionSummary-content {
    margin: 0;
  }

  .MuiAccordionSummary-gutters {
    padding: 0;
    display: flex;
    height: 40px;
    min-height: 40px;
  }

  .MuiAccordionSummary-contentGutters {
    padding-left: 15px;
  }

  .MuiAccordionSummary-expandIconWrapper {
    width: 40px;
    height: 100%;

    svg {
      margin: auto;
      stroke: ${palette.white};
    }

    &:not(.Mui-disabled) {
      svg {
        path {
          fill: #ccbbff;
        }
      }
    }
  }

  .MuiTypography-body1 {
    color: #c4c4c4;
  }

  .MuiCollapse-vertical {
    .MuiAccordionDetails-root {
      padding: 0;
    }
  }
`;

export const AccordionDetails = styled(AccordionDetailsComp)`
  background: ${palette.grey950};
  padding: 14px;
`;

export const Title = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 23px;
    /* identical to box height, or 153% */

    letter-spacing: 0.0025em;

    color: ${palette.blue20};
  }
`;
