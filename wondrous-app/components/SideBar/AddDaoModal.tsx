import { ButtonBase, Modal, Typography } from '@mui/material';
import AddIcon from 'components/Icons/add.svg';
import ArrowIcon from 'components/Icons/arrow.svg';
import CloseModal from 'components/Icons/closeModal';
import { ExplorePageIcon } from 'components/Icons/sidebar';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled, { css } from 'styled-components';

const TransitionStyle = css`
  transition: all 0.5s ease-in-out;
`;

const StyledModal = styled(Modal)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ModalWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: transparent;
`;

const DialogWrapper = styled.div`
  background: ${({ theme }) => theme.palette.grey900};
  width: 520px;
  min-height: 260px;
  border: 1px solid ${({ theme }) => theme.palette.grey79};
  border-radius: 6px;
  padding: 24px;
  position: relative;
  z-index: 100;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderText = styled(Typography)`
  && {
    align-items: center;
    color: ${({ theme }) => theme.palette.white};
    display: flex;
    font-family: 'Space Grotesk';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
  }
`;

const HeaderIcon = styled((props) => (
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

const Divider = styled.div`
  border-top: 1px dashed ${({ theme }) => theme.palette.grey75};
  border-radius: 6px;
  height: 5px;
  width: 100%;
`;

const ButtonStyled = styled(({ children, ...props }) => (
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

const ButtonText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.palette.white};
  }
`;

const ButtonArrowIcon = styled(ArrowIcon)`
  path {
    fill: ${({ theme }) => theme.palette.white};
  }
`;

const CreateDaoIcon = styled(({ children, ...props }) => (
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

const IconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 19px;
`;

const ModalEllipse1 = styled.div`
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

const ModalEllipse2 = styled.div`
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

const useEllipseState = () => {
  const [showEllipse, setShowEllipse] = useState<Boolean>(false);
  const handleSetShowEllipse = (a) => () => setShowEllipse(a);
  return { showEllipse, handleSetShowEllipse };
};

const ButtonOption = ({ Icon, children, ...props }) => (
  <Options>
    <Divider />
    <ButtonStyled {...props}>
      <IconTextWrapper>
        <Icon />
        <ButtonText>{children}</ButtonText>
      </IconTextWrapper>
      <ButtonArrowIcon />
    </ButtonStyled>
  </Options>
);

const AddDaoModal = ({ open, handleClose }) => {
  const { showEllipse, handleSetShowEllipse } = useEllipseState();
  const router = useRouter();
  const handleOnClick = (link) => () => {
    handleSetShowEllipse(false)();
    handleClose();
    router.push(link);
  };
  return (
    <StyledModal open={open} onClose={handleClose}>
      <ModalWrapper onClick={handleClose}>
        <DialogWrapper>
          <Header>
            <HeaderText>Add DAO</HeaderText>
            <HeaderIcon />
          </Header>
          <ButtonsWrapper>
            <ButtonOption
              Icon={CreateDaoIcon}
              onClick={handleOnClick('/onboarding-dao')}
              onMouseEnter={handleSetShowEllipse(true)}
              onMouseLeave={handleSetShowEllipse(false)}
            >
              Create new DAO
            </ButtonOption>
            <ButtonOption
              Icon={ExplorePageIcon}
              onClick={handleOnClick('/explore')}
              onMouseEnter={handleSetShowEllipse(true)}
              onMouseLeave={handleSetShowEllipse(false)}
            >
              Explore existing DAOs
            </ButtonOption>
          </ButtonsWrapper>
        </DialogWrapper>
        <ModalEllipse1 showEllipse={showEllipse} />
        <ModalEllipse2 showEllipse={showEllipse} />
      </ModalWrapper>
    </StyledModal>
  );
};

export default AddDaoModal;
