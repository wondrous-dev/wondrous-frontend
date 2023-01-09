import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import CloseModalIcon from 'components/Icons/closeModal';
import { Button } from 'components/Common/button';
import typography from 'theme/typography';
import palette from 'theme/palette';
import TaskMedia from 'components/Common/TaskMedia';

export const PaymentViewModalWrapper = styled(Modal)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const PaymentViewModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  background: ${palette.grey900};
  border: 1px solid ${palette.grey79};
  border-radius: 6px;
  overflow: hidden;
`;

export const PaymentViewModalHeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${palette.grey920};
  padding: 12px 24px;
`;

export const PaymentViewModalHeaderText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
    color: ${palette.white};
  }
`;

export const PaymentViewCloseModalIcon = styled((props) => (
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

export const PaymentViewModalBody = styled.div`
  padding: 24px;
  background: ${palette.grey900};
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

export const PaymentViewSectionLabel = styled.label`
  font-family: ${typography.fontFamily};
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 1%;
  color: ${palette.blue20};
  width: max-content;
`;

export const PaymentViewText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 400;
    font-size: 15px;
    line-height: 19.14px;
    color: ${palette.white};
  }
`;

export const PaymentViewSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PaymentViewTextWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;
  padding: 3px 10px;
  gap: 10px;
  border-radius: 6px;
  background-color: ${palette.black};
`;

export const PaymentViewModalFooter = styled.div`
  background: ${palette.black97};
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
`;

export const PaymentViewFooterButton = styled(Button)`
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

export const RewardTextRightPill = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
  width: max-content;
  border-radius: 0px 50px 50px 0px;
  padding: 5px 10px;
  background: ${palette.grey900};
  border-right: 1px solid ${palette.grey79};
  border-top: 1px solid ${palette.grey79};
  border-bottom: 1px solid ${palette.grey79};
`;

export const RewardTextLefPill = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
  width: max-content;
  border-radius: 50px 0px 0px 50px;
  padding: 5px 10px;
  background: ${palette.grey85};
  border-left: 1px solid ${palette.grey79};
  border-top: 1px solid ${palette.grey79};
  border-bottom: 1px solid ${palette.grey79};
`;

export const RewardText = styled(Typography)`
  && {
    color: ${(props) => (props.hasNoReward ? palette.grey57 : palette.white)};
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 500;
    width: max-content;
  }
`;

export const PaymentMediaWrapper = styled(TaskMedia)`
  max-width: 60%;
`;
