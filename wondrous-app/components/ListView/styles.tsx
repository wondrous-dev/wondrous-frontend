import styled from 'styled-components';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';

import { EmptyStateWrapper, NoPermissionToCreateWrapper } from 'components/EmptyStateBoards/styles';

export const Accordion = styled(MuiAccordion)`
  && {
    margin-top: 0;
    background: transparent;
    color: ${palette.white};
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
    padding: 8px 0 8px;
    border-bottom: 0.5px dashed #2b2b2b;
    border-radius: 6px;
    border-top: 0.5px dashed #2b2b2b;
  }

  .rbd-draggable {
    margin-top: 8px;
  }

  ${EmptyStateWrapper} {
    width: fit-content;
    min-width: 10%;
    ${NoPermissionToCreateWrapper} {
      flex-direction: row;
    }
  }
`;

export const DraggableItem = styled.div`
  margin-top: 8px;
  width: 100%;
`;

export const ListViewItemHeader = styled.div`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
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
  color: ${palette.white};
  width: fit-content;
  .accordion-expansion-icon {
    transition: transform 0.2s ease-out;
    ${({ isExpanded }) => (isExpanded ? 'transform: rotate(180deg)' : 'transform: rotate(0deg)')}
  }
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
  cursor: pointer;
  padding: 8px 8px;
  border-radius: 6px;
  &:hover {
    background: #151515;
  }
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

export const ShowMoreButton = styled.button`
  color: white;
  padding: 10px;
  background: #7427ff;
  border-radius: 6px;
  cursor: pointer;
  border: 0;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  letter-spacing: 0.01em;
  margin-top: 8px;
`;
