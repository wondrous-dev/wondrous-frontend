import styled from 'styled-components';

import Accordion from '@mui/material/Accordion';
import AccordionDetailsComp from '@mui/material/AccordionDetails';

export const AccordionComp = styled(Accordion)`
  && {
    margin-top: 0;
    border: 1px solid #4b4b4b;
    border-radius: 6px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    background: transparent;
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

    &:not(.Mui-disabled) p {
      color: #ffffff;
    }
  }

  .MuiAccordionSummary-expandIconWrapper {
    width: 40px;
    height: 100%;
    border-left: 1px solid #4b4b4b;

    &.Mui-expanded {
      border-right: 1px solid #4b4b4b;
      border-left: none;
    }

    svg {
      margin: auto;
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
  border-top: 1px solid #4b4b4b;
`;
