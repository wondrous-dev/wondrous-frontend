import styled from 'styled-components';

import Modal from '@mui/material/Modal';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';

import CloseModalIcon from 'components/Icons/closeModal';
import { Button } from 'components/Common/button';

import typography from 'theme/typography';
import palette from 'theme/palette';
import InfoIcon from 'components/Icons/infoIcon';

export const DeleteRoleConfirmationModalWrapper = styled(Modal)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px;
`;

export const DeleteRoleConfirmationModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: ${palette.grey900};
  border: 1px solid ${palette.grey79};
  border-radius: 6px;
  overflow: hidden;
  margin: 14px;
`;

export const DeleteRoleConfirmationModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${palette.grey920};
  padding: 12px 24px;
`;

export const DeleteRoleConfirmationModalHeaderText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
    color: ${palette.white};
  }
`;

export const DeleteRoleConfirmationModalHeaderCloseModalIcon = styled((props) => (
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

export const DeleteRoleConfirmationModalBody = styled.div`
  padding: 24px;
  background: ${palette.grey900};
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const DeleteRoleConfirmationModalBodyWarningBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${palette.red820};
  border: 1px solid ${palette.red650};
  border-radius: 6px;
  padding: 15px 10px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    align-items: flex-start;
  }
`;

export const DeleteRoleConfirmationModalBodyWarningBoxIcon = styled(InfoIcon)`
  min-width: 18px;
  min-height: 18px;

  && {
    fill: ${palette.white};
    transform: rotate(180deg);

    path {
      stroke: ${palette.red820};
    }
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 3px;
  }
`;

export const DeleteRoleConfirmationModalBodyWarningBoxText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    color: ${palette.white};
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
  }
`;

export const DeleteRoleConfirmationModalBodyText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 400;
    color: ${palette.grey250};

    span {
      font-weight: 700;
      color: ${palette.white};
    }
  }
`;

export const DeleteRoleConfirmationModalBodyInput = styled(InputBase)`
  && {
    padding: 6px 24px;
    background: ${palette.background.default};
    color: ${palette.white};
    font-family: ${typography.fontFamily};
    line-height: 19px;
    letter-spacing: 0.01em;
    border: 1px solid ${palette.grey75};
    border-radius: 6px;
  }
`;

export const DeleteRoleConfirmationModalFooter = styled.div`
  background: ${palette.black97};
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
`;

export const DeleteRoleConfirmationModalFooterButton = styled(Button)`
  && {
    background: ${(props) => (props.disabled ? 'transparent' : props.isPrimary ? palette.red650 : palette.black95)};

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
      border-color: ${(props) => (props.disabled ? palette.grey78 : props.isPrimary ? 'transparent' : palette.black92)};
      background: ${(props) => (props.isPrimary ? palette.background.default : palette.black92)};
      transition: background 0.2s ease-out;
      display: flex;
      align-items: center;
      gap: 12px;

      &:hover {
        background: transparent;
      }

      &:disabled {
        background: transparent;
        color: ${palette.grey78};
        cursor: not-allowed;
      }
    }
  }
`;
