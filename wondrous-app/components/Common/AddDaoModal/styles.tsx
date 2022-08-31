import { ButtonBase, Modal, Typography } from '@mui/material';
import AddIcon from 'components/Icons/add.svg';
import ArrowIcon from 'components/Icons/arrow.svg';
import CloseModal from 'components/Icons/closeModal';
import styled, { css } from 'styled-components';

const TransitionStyle = css`
  transition: all 0.5s ease-in-out;
`;

export const StyledModal = styled(Modal)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ModalWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: transparent;
`;

export const DialogWrapper = styled.div`
  background: ${({ theme }) => theme.palette.grey900};
  width: 520px;
  min-height: 260px;
  border: 1px solid ${({ theme }) => theme.palette.grey79};
  border-radius: 6px;
  padding: 24px;
  position: relative;
  z-index: 100;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderText = styled(Typography)`
  && {
    align-items: center;
    color: ${({ theme }) => theme.palette.white};
    display: flex;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
  }
`;

export const HeaderIcon = styled((props) => (
  <ButtonBase {...props}>
    <CloseModal />
  </ButtonBase>
))`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    background: ${({ theme }) => theme.palette.background.default};
    border-radius: 6px;
  }
`;

export const Divider = styled.div`
  border-top: 1px dashed ${({ theme }) => theme.palette.grey75};
  border-radius: 6px;
  height: 5px;
  width: 100%;
`;

export const ButtonStyled = styled(({ children, ...props }) => (
  <ButtonBase {...props}>
    <div>
      <div>{children}</div>
    </div>
  </ButtonBase>
))`
  && {
    border-radius: 6px;
    height: 50px;
    width: 100%;
    ${({ theme }) =>
      `background: linear-gradient(270deg, ${theme.palette.blue20} -5.62%, ${theme.palette.highlightPurple} 45.92%, ${theme.palette.highlightBlue} 103.12%)`}
  }
  > div {
    height: inherit;
    width: inherit;
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    ${TransitionStyle};
    :hover {
      background: transparent;
    }
  }
  > div > div {
    align-items: center;
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: 5px;
    display: flex;
    height: calc(100% - 2px);
    width: calc(100% - 2px);
    justify-content: space-between;
    padding: 10px;
  }
`;

export const ButtonText = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.palette.white};
  }
`;

export const ButtonArrowIcon = styled(ArrowIcon)`
  path {
    fill: ${({ theme }) => theme.palette.white};
  }
`;

export const CreateDaoIcon = styled(({ children, ...props }) => (
  <div {...props}>
    <div>
      <AddIcon />
    </div>
  </div>
))`
  && {
    width: 30px;
    height: 30px;
    border-radius: 60px;
    ${({ theme }) =>
      `background: linear-gradient(228.64deg, ${theme.palette.blue20} -40.38%, ${theme.palette.highlightPurple} 13.55%, ${theme.palette.highlightBlue} 73.41%);`}
    display: flex;
    justify-content: center;
    align-items: center;
    ${TransitionStyle};
    ${ButtonStyled}:hover & {
      ${({ theme }) =>
        `filter: drop-shadow(0px 0px 1px ${theme.palette.blue20}) drop-shadow(0px 0px 1px ${theme.palette.highlightPurple}) drop-shadow(0px 0px 1px ${theme.palette.highlightBlue});`}
    }
    > div {
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      border-radius: 58px;
      background: ${({ theme }) => theme.palette.background.default};
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const IconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 19px;
`;

export const ModalEllipse1 = styled.div`
  position: absolute;
  width: 558px;
  height: 558px;
  left: -10%;
  top: -30%;
  background: ${({ theme }) => theme.palette.violet800};
  filter: blur(230px);
  opacity: ${({ showEllipse }) => (showEllipse ? 1 : 0)};
  ${TransitionStyle};
`;

export const ModalEllipse2 = styled.div`
  position: absolute;
  width: 558px;
  height: 558px;
  right: -10%;
  bottom: -20%;
  background: ${({ theme }) => theme.palette.violet900};
  filter: blur(436.5px);
  opacity: ${({ showEllipse }) => (showEllipse ? 1 : 0)};
  ${TransitionStyle};
`;
