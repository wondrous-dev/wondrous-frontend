import ModalComponent from '@mui/material/Modal';
import {
  CloseModalBtn,
  ModalBody,
  ModalContainer,
  ModalContent,
  ModalDialog,
  ModalFooter,
  ModalFooterLeft,
  ModalFooterRight,
  ModalHeader,
  ModalTitle,
} from './styles';

const Modal = ({
  open,
  onClose,
  title,
  maxWidth,
  children,
  footerLeft,
  footerRight,
  footerCenter,
}) => {
  const handleBackdropClick = (event) => {
    if (event.target.dataset.backdrop) {
      onClose();
    }
  };

  return (
    <ModalComponent open={open} onClose={onClose}>
      <ModalContainer
        tabIndex={-1}
        data-backdrop='true'
        onClick={handleBackdropClick}
      >
        <ModalDialog maxWidth={maxWidth}>
          <ModalContent>
            <ModalHeader>
              {!!title && <ModalTitle>{title}</ModalTitle>}
              {onClose && <CloseModalBtn onClick={onClose} />}
            </ModalHeader>

            <ModalBody>{children}</ModalBody>

            {!!footerLeft || !!footerRight || !!footerCenter ? (
              <ModalFooter alignCenter={!!footerCenter}>
                {footerLeft ? (
                  <ModalFooterLeft>{footerLeft}</ModalFooterLeft>
                ) : null}
                {footerRight ? (
                  <ModalFooterRight>{footerRight}</ModalFooterRight>
                ) : null}
              </ModalFooter>
            ) : null}
          </ModalContent>
        </ModalDialog>
      </ModalContainer>
    </ModalComponent>
  );
};

export default Modal;
