import styled from 'styled-components';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordion from '@mui/material/Accordion';
import { White } from 'theme/colors';
import Typography from '@mui/material/Typography';

export const Accordion = styled(MuiAccordion)`
  && {
    margin-top: 0;
    background: transparent;
    margin-bottom: 28px;
    color: ${White};
    width: 100%;
    box-shadow: none;
  }
`;

export const AccordionSummary = styled(MuiAccordionSummary)`
  .MuiAccordionSummary-root {
    width: 100%;
  }
  .MuiAccordionSummary-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`;

export const AccordionDetails = styled(MuiAccordionDetails)`
  && {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 8px;
  }
`;

export const ListViewItemHeader = styled.div`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  border-bottom: 0.5px dashed #2b2b2b;
  border-radius: 6px;
  padding-top: 28px;
  padding-bottom: 14px;
`;

export const ListViewItemStatus = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 18px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: ${White};
  width: fit-content;
`;
export const ListViewItemCount = styled(Typography)`
  && {
    color: #828282;
    margin-left: -12px;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ListViewItemBodyWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const ListViewItemDataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
`;

export const ListViewItemIconsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-weight: 400;
  font-size: 13px;
  line-height: 17px;
`;

export const ListViewItemActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;
