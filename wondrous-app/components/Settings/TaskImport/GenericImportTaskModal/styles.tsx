import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  MenuItem,
  Modal,
  Select,
  Typography,
} from '@mui/material';
import styled from 'styled-components';
import CloseModalIcon from 'components/Icons/closeModal';
import AttachFileSvg from 'components/Icons/attachFile.svg';
import { Button } from 'components/Common/button';
import typography from 'theme/typography';
import palette from 'theme/palette';

export const GenericImportTaskModalWrapper = styled(Modal)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const GenericImportTaskModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: ${palette.grey900};
  border: 1px solid ${palette.grey79};
  border-radius: 6px;
  overflow: hidden;
`;

export const GenericImportTaskModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${palette.grey920};
  padding: 12px 24px;
`;

export const GenericImportTaskModalHeaderText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
    color: ${palette.white};
  }
`;

export const GenericImportTaskModalHeaderCloseModalIcon = styled((props) => (
  <div {...props}>
    <CloseModalIcon />
  </div>
))`
  width: 32px;
  height: 32px;
  background: ${palette.grey100};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    transform: scale(88%);
  }
  box-shadow: none;
  transition: box-shadow 0.2s ease-out;

  :hover {
    box-shadow: 0px 6px 7px ${palette.black}73;
  }
`;

export const GenericImportTaskModalBody = styled.div`
  padding: 24px;
  background: ${palette.grey900};
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

export const GenericImportTaskModalInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const GenericImportTaskModalLabel = styled.label`
  font-family: ${typography.fontFamily};
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 1%;
  color: ${palette.blue20};
  width: max-content;
`;

export const GenericImportTaskModalError = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: ${palette.red400};
    padding-left: 4px;
  }
`;

const StyledSelect = styled(Select)`
  && {
    background: ${palette.background.default};
    color: ${palette.white};
    height: 42px;
    width: 100%;
    border-radius: 6px;
    border: 1px solid transparent;
    transition: border 0.2s ease-out;

    :hover {
      border: 1px solid ${palette.grey79};
    }

    svg {
      color: ${(props) => (props.isActive ? palette.white : palette.grey58)};
      transition: transform 0.2s ease-out;
    }

    p {
      margin: 0;
    }
  }
`;

export const GenericImportTaskModalSelect = styled(({ className, ...props }) => (
  <StyledSelect
    {...props}
    {...className}
    MenuProps={{ classes: { paper: className } }}
    isActive={!!props.value?.value}
  />
))`
  &.MuiPaper-root {
    background: ${palette.grey77};
    width: 100%;
    max-width: 510px;
    color: ${palette.white};
  }

  &.MuiPaper-root > .MuiList-root {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &.MuiPaper-root > .MuiList-padding {
    padding: 4px;
  }
`;

export const GenericImportTaskModalSelectMenuItem = styled(MenuItem)`
  && {
    background: ${palette.grey87};
    color: ${palette.white};
    border-radius: 4px;
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

export const GenericImportTaskModalSelectValueDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const GenericImportTaskModalSelectValueDisplayText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 400;
    font-size: 15px;
    line-height: 19.14px;
    color: ${(props) => (props.isActive ? palette.white : palette.grey57)};
  }
`;

export const GenericImportTaskModalBodyExpandedViewWrapper = styled(Accordion)`
  && {
    background: ${palette.grey900};
    margin-top: ${(props) => (props.expanded ? 0 : '-24px')};

    & .MuiAccordion-region {
      display: flex;
      flex-direction: column;
      gap: 26px;
      box-shadow: none;
    }

    &.MuiPaper-root.MuiAccordion-root {
      box-shadow: none;
    }

    &.MuiPaper-root::before {
      display: none;
    }
  }
`;

export const GenericImportTaskModalBodyExpandedViewInvisibleState = styled(AccordionSummary)`
  && {
    display: none;
  }
`;

export const GenericImportTaskModalFooter = styled.div`
  background: ${palette.black97};
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
`;

export const GenericImportTaskModalFooterButton = styled(Button)`
  && {
    background: ${(props) =>
      props.disabled
        ? 'transparent'
        : props.isPrimary
        ? `linear-gradient(
      270deg,
      ${palette.blue20} -5.62%,
      ${palette.highlightPurple} 45.92%,
      ${palette.highlightBlue} 103.12%
    )`
        : palette.grey85};

    button {
      font-family: ${typography.fontFamily};
      font-weight: 600;
      font-size: 15px;
      line-height: 22.5px;
      letter-spacing: -1%;
      color: ${palette.white};
      padding: 9px 24px;
      border-radius: 1000px;
      border: 1px solid;
      border-color: ${(props) => (props.disabled ? palette.grey78 : props.isPrimary ? 'transparent' : palette.grey78)};
      background: ${(props) => (props.isPrimary ? palette.background.default : palette.grey78)};
      transition: background 0.2s ease-out;

      :hover {
        background: transparent;
      }

      :disabled {
        background: transparent;
        color: ${palette.grey78};
        cursor: not-allowed;
      }
    }
  }
`;

export const GenericImportTaskModalProgressSpinner = styled(CircularProgress)`
  && {
    margin-left: 12px;
  }
`;

export const AttachFileIcon = styled(AttachFileSvg)`
  && {
    path {
      stroke: ${palette.blue20};
    }
  }
`;
