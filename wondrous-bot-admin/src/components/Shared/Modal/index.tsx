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

interface IModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  maxWidth?: number;
  children: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  footerCenter?: React.ReactNode;
  modalComponentProps?: {
    className?: string;
  };
  dialogComponentProps?: {
    className?: string;
  }
}

const Modal = ({
  open,
  onClose,
  title,
  maxWidth = 400,
  children,
  footerLeft = null,
  footerRight = null,
  footerCenter = null,
  modalComponentProps = {},
  dialogComponentProps = {},
}: IModalProps) => {
  const handleBackdropClick = (event) => {
    if (event.target.dataset.backdrop) {
      onClose();
    }
  };

  return (
    <ModalComponent open={open} onClose={onClose} {...modalComponentProps}>
      <ModalContainer
        tabIndex={-1}
        data-backdrop='true'
        onClick={handleBackdropClick}

      >
        <ModalDialog maxWidth={maxWidth}
          {...dialogComponentProps}

        >
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
