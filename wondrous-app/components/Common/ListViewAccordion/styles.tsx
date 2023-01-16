import styled from 'styled-components';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import typography from 'theme/typography';

import { EmptyStateWrapper, NoPermissionToCreateWrapper } from 'components/EmptyStateBoards/styles';

export const AccordionComponent = styled(MuiAccordion)`
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
    gap: ${(props) => (props.noGap ? '0' : '8px')};
    margin-top: 8px;
    padding: 8px 0px 8px;
    border-bottom: 0.5px dashed #2b2b2b;
    border-radius: 6px;
    border-top: 0.5px dashed #2b2b2b;
    background: ${({ highlighted }) => (highlighted ? palette.grey100 : 'none')};
  }
  ${EmptyStateWrapper} {
    width: fit-content;
    min-width: 10%;
    ${NoPermissionToCreateWrapper} {
      flex-direction: row;
    }
  }
`;

export const ListViewItemHeader = styled.div`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  padding-bottom: 14px;
`;

export const ListViewItemStatus = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 18px;
  font-family: ${typography.fontFamily};
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

export const ShowMoreButton = styled.button`
  color: white;
  padding: 10px;
  background: ${palette.highlightPurple};
  border-radius: 6px;
  cursor: pointer;
  border: 0;
  font-family: ${typography.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  letter-spacing: 0.01em;
  margin-top: 8px;
`;
