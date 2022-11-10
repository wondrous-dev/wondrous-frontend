import {
  ButtonArrowIcon,
  ButtonStyled,
  ButtonsWrapper,
  ButtonText,
  CreateDaoIcon,
  DialogWrapper,
  Divider,
  Header,
  HeaderIcon,
  HeaderText,
  IconTextWrapper,
  ModalEllipse1,
  ModalEllipse2,
  ModalWrapper,
  Options,
  StyledModal,
} from 'components/Common/AddDaoModal/styles';
import { ExplorePageIcon } from 'components/Icons/sidebar';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
            <HeaderText>Add Org</HeaderText>
            <HeaderIcon />
          </Header>
          <ButtonsWrapper>
            <ButtonOption
              Icon={CreateDaoIcon}
              onClick={handleOnClick('/onboarding-dao')}
              onMouseEnter={handleSetShowEllipse(true)}
              onMouseLeave={handleSetShowEllipse(false)}
            >
              Create new org workspace
            </ButtonOption>
            <ButtonOption
              Icon={ExplorePageIcon}
              onClick={handleOnClick('/explore')}
              onMouseEnter={handleSetShowEllipse(true)}
              onMouseLeave={handleSetShowEllipse(false)}
            >
              Explore existing organizations
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
