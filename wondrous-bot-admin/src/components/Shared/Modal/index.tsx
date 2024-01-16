import ModalComponent from "@mui/material/Modal";
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
  StyledModalComponent,
} from "./styles";

interface IModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  maxWidth?: number;
  noHeader?: boolean;
  children: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  footerCenter?: React.ReactNode;
  modalComponentProps?: {
    className?: string;
  };
  dialogComponentProps?: {
    className?: string;
  };
  modalFooterStyle?: {
    padding?: string;
  };
  modalHeaderStyle?: any;
  modalTitleStyle?: any;
  closeButtonStyle?: any;
}

const Modal = ({
  open,
  onClose,
  title = "",
  maxWidth = 400,
  children,
  footerLeft = null,
  footerRight = null,
  footerCenter = null,
  noHeader = false,
  modalComponentProps = {},
  dialogComponentProps = {},
  modalFooterStyle = {},
  modalHeaderStyle = {},
  modalTitleStyle = {},
  closeButtonStyle = {}
}: IModalProps) => {
  const handleBackdropClick = (event) => {
    if (event.target.dataset.backdrop) {
      onClose();
    }
  };

  return (
    <StyledModalComponent open={open} onClose={onClose} {...modalComponentProps}>
      <ModalContainer tabIndex={-1} data-backdrop="true" onClick={handleBackdropClick}>
        <ModalDialog maxWidth={maxWidth} {...dialogComponentProps}>
          <ModalContent>
            {!noHeader && (
              <ModalHeader justifyContent={title ? "space-between" : "flex-end"} style={modalHeaderStyle}>
                {!!title && <ModalTitle style={modalTitleStyle}>{title}</ModalTitle>}
                {onClose && <CloseModalBtn style={closeButtonStyle} onClick={onClose} />}
              </ModalHeader>
            )}

            <ModalBody>{children}</ModalBody>

            {!!footerLeft || !!footerRight || !!footerCenter ? (
              <ModalFooter alignCenter={!!footerCenter} style={{ ...modalFooterStyle }}>
                {footerLeft ? <ModalFooterLeft>{footerLeft}</ModalFooterLeft> : null}
                {footerRight ? <ModalFooterRight>{footerRight}</ModalFooterRight> : null}
              </ModalFooter>
            ) : null}
          </ModalContent>
        </ModalDialog>
      </ModalContainer>
    </StyledModalComponent>
  );
};

export default Modal;
