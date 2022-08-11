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
  background: #1d1d1d;
  width: 520px;
  min-height: 260px;
  border: 1px solid #424242;
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
    color: #ffffff;
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
    background: #0f0f0f;
    border-radius: 6px;
  }
`;

const Divider = styled.div`
  border-top: 1px dashed #4b4b4b;
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
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
  }
  > div {
    height: inherit;
    width: inherit;
    background: #313131;
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
    background: #313131;
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
    color: #ffffff;
  }
`;

const ButtonArrowIcon = styled(ArrowIcon)`
  path {
    fill: #fff;
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
    background: linear-gradient(228.64deg, #ccbbff -40.38%, #7427ff 13.55%, #00baff 73.41%);
    display: flex;
    justify-content: center;
    align-items: center;
    ${TransitionStyle};
    ${ButtonStyled}:hover & {
      filter: drop-shadow(0px 0px 1px #ccbbff) drop-shadow(0px 0px 1px #7427ff) drop-shadow(0px 0px 1px #00baff);
    }
    > div {
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      border-radius: 58px;
      background: #0f0f0f;
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
  background: #360097;
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
  background: #700097;
  filter: blur(436.5px);
  opacity: ${({ showEllipse }) => (showEllipse ? 1 : 0)};
  ${TransitionStyle};
`;

const useHover = () => {
  const [showEllipse, setShowEllipse] = useState<Boolean>(false);
  const handleHover = (a) => () => setShowEllipse(a);
  return { showEllipse, handleHover };
};

const AddDaoModal = ({ open, handleClose }) => {
  const router = useRouter();
  const handleOnClick = (link) => () => {
    handleClose();
    router.push(link);
  };
  const { showEllipse, handleHover } = useHover();
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
              onMouseEnter={handleHover(true)}
              onMouseLeave={handleHover(false)}
            >
              Create new DAO
            </ButtonOption>
            <ButtonOption
              Icon={ExplorePageIcon}
              onClick={handleOnClick('/explore')}
              onMouseEnter={handleHover(true)}
              onMouseLeave={handleHover(false)}
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
