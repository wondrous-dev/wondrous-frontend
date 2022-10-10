import styled from 'styled-components';
import {
  Button,
  Checkbox,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const LedgerActionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0;
  border: 1px solid ${palette.black87};
  border-right: 0px;
  border-left: 0px;
  padding: 8px 0;
`;

export const LedgerClearSelectionButton = styled(Button)`
  && {
    color: ${palette.grey57};
    background: transparent;
    font-family: ${typography.fontFamily};
    font-weight: 500;
    font-size: 14px;
    padding: 0;
    width: fit-content;
  }
`;

export const LedgerDownloadButton = styled(LedgerClearSelectionButton)`
  && {
    color: ${palette.highlightBlue};
  }
`;

const StyledSelect = styled(Select)`
  && {
    background: ${palette.background.default};
    color: ${palette.white};
    height: 42px;
    width: auto;
    border-radius: 6px;
    border: 1px solid ${palette.highlightPurple};
    transition: border 0.2s ease-out;

    > div {
      display: flex;
    }

    svg {
      color: ${(props) => (props.isActive ? palette.white : palette.grey58)};
      transition: transform 0.2s ease-out;
    }

    p {
      margin: 0;
      font-family: ${typography.fontFamily};
      font-weight: 500;
    }
  }
`;

export const PayoutSelectionSelect = styled(({ className, ...props }) => (
  <StyledSelect {...props} {...className} MenuProps={{ classes: { paper: className } }} isActive />
))`
  &.MuiPaper-root {
    background: ${palette.grey900};
    width: 100%;
    max-width: 270px;
    color: ${palette.white};
    border: 1px solid ${palette.grey75};
    transform: translateX(28%) !important;
  }

  &.MuiPaper-root > .MuiList-root {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px;
  }

  &.MuiPaper-root > .MuiList-padding {
    padding: 8px;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${palette.grey10};
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${palette.grey50};
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${palette.grey76};
  }
`;

export const PayoutSelectionSelectMenuItem = styled(MenuItem)`
  && {
    background: ${palette.black98};
    color: ${(props) => (props.isSelected ? palette.white : palette.grey250)};
    border: 1px solid;
    border-color: ${(props) => (props.isSelected ? palette.highlightPurple : palette.black98)};
    border-radius: 4px;
    font-weight: ${(props) => (props.isSelected ? 500 : 400)};
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    transition: background 0.2s ease-out;

    :hover {
      background: ${palette.black92};
    }
  }
`;

export const PayoutSelectionSelectValueDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PayoutSelectionSelectValueDisplayText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 400;
    font-size: 15px;
    line-height: 19.14px;
    color: ${(props) => (props.isActive ? palette.white : palette.grey57)};
  }
`;

export const PayoutCount = styled(Typography)`
  font-family: ${typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${palette.blue20};
`;

export const StyledTableContainer = styled(TableContainer)`
  && {
    width: 100%;
    overflow-x: visible;
    min-width: 890px;
  }
`;

export const StyledTable = styled(Table)`
  && {
    width: 100%;
    margin: 14px 0;
    border-collapse: collapse;
  }
`;

export const StyledTableHead = styled(TableHead)`
  & .MuiTableCell-head {
    color: #ccbbff;
    background: ${palette.black97};
    border: none;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0em;
    border-radius: 0px;
    padding: 10px !important;
  }

  & .MuiTableCell-head:first-of-type {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  & .MuiTableCell-head:last-of-type {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

export const StyledTableBody = styled(TableBody)`
  && {
    border: none;
    margin-top: 14px;
  }
`;

export const StyledTableRow = styled(TableRow)`
  & .MuiTableCell-body {
    border: none;
    border-radius: 6px;
    padding: 8px;
  }
`;

export const StyledTableCell = styled(TableCell)`
  && {
    padding: 14px;
  }

  &.justify-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  /* &.justify-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  } */

  &.clickable {
    cursor: pointer;
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;

export const RewardChainHalfBox = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${palette.white};
  font-family: ${typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  padding: 6px 8px 6px 10px;
  background: ${(props) => (props.isRewardBox ? palette.grey85 : palette.grey900)};
  border: 1px solid ${palette.grey79};
  border-right-width: ${(props) => (props.isRewardBox ? '0px' : '2px')};
  border-left-width: ${(props) => (props.isRewardBox ? '2px' : '0px')};
  border-top-left-radius: ${(props) => (props.isRewardBox ? '1000px' : '0px')};
  border-bottom-left-radius: ${(props) => (props.isRewardBox ? '1000px' : '0px')};
  border-top-right-radius: ${(props) => (props.isRewardBox ? '0px' : '1000px')};
  border-bottom-right-radius: ${(props) => (props.isRewardBox ? '0px' : '1000px')};
  margin-right: ${(props) => (props.isRewardBox ? '-14px' : '0px')};
  margin-left: ${(props) => (props.isRewardBox ? '0px' : '-14px')};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const BatchPayoutButton = styled(CreateFormPreviewButton)`
  && {
    margin-left: 12px;
  }
`;

export const TableCellText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 14px;
    text-align: center;
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  && {
    width: 24px;
    height: 24px;
    color: ${(props) => (props.disabled ? palette.grey800 : palette.white)};
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
    /* border: ${(props) => (props.isDisabled ? `1px solid ${palette.grey800}` : `1px solid ${palette.white}`)}; */
  }
`;

export const PayeeProfileLink = styled.a`
  text-decoration: none;
`;

export const PayeeUsername = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 700;
    color: ${palette.white};
  }
`;

export const PayeeAddressTagContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

export const PayeeAddressTag = styled(PayeeUsername)`
  && {
    font-weight: ${(props) => (props.hasAddressBeenCopied ? 500 : 400)};
    color: ${(props) => (props.hasAddressBeenCopied ? palette.green30 : palette.grey250)};
    width: max-content;

    + svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const LoadMore = styled.div`
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;
