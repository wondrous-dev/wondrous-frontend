import styled from 'styled-components';

import Accordion from '@mui/material/Accordion';
import AccordionSummaryComp from '@mui/material/AccordionSummary';
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
  }
  
  .MuiAccordionSummary-content {
    margin: 0;
  }
  
  .MuiAccordionSummary-gutters {
    padding: 0 15px;
    display: flex;
    height: 40px;
    min-height: 40px;
  }
  
  .MuiTypography-body1 {
    color: #c4c4c4;
  }
  
  .Mui-expanded {
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
