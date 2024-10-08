import React, { useRef } from 'react';
import ModalComponent from '@mui/material/Modal';
import { useOutsideAlerter } from 'utils/hooks';
import {
  ModalBody,
  ModalContent,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  CloseModalBtn,
  ModalFooterRight,
  ModalFooterLeft,
} from './styles';

type Props = {
  /**
   *
   * If true, the component is shown.
   */
  open: boolean;
  /**
   * Callback fired when the component requests to be closed. The reason parameter can optionally be used to control the response to onClose.
   */
  onClose?: () => void;
  /**
   * A single child content element.
   */
  children: React.ReactNode;
  /**
   * Modal title
   */
  title?: React.ReactNode | string;

  /**
   * Modal width
   */
  maxWidth?: number;
  /**
   * Footer left part
   */
  footerLeft?: React.ReactNode;
  /**
   * Footer right part
   */
  footerRight?: React.ReactNode;

  alignCenter?: boolean;

  footerCenter?: React.ReactNode;
  modalBodyStyle?: React.CSSProperties;
};

export function Modal({
  open,
  onClose,
  title,
  footerLeft,
  footerRight,
  footerCenter,
  maxWidth,
  children,
  alignCenter = false,
  modalBodyStyle = {},
}: Props) {
  const contentRef = useRef();

  const handleBackdropClick = (event) => {
    if (event.target.dataset.backdrop) {
      onClose();
    }
  };

  // TODO: Adrian - refactor this to use modals native API
  // useOutsideAlerter(contentRef, onClose);
  return (
    <ModalComponent open={open} onClose={onClose}>
      <ModalContainer tabIndex={-1} data-backdrop="true" alignCenter={alignCenter} onClick={handleBackdropClick}>
        <ModalDialog maxWidth={maxWidth} alignCenter={alignCenter}>
          <ModalContent>
            <ModalHeader>
              {!!title && <ModalTitle>{title}</ModalTitle>}
              {onClose && <CloseModalBtn onClick={onClose} />}
            </ModalHeader>

            <ModalBody style={modalBodyStyle}>{children}</ModalBody>

            {!!footerLeft || !!footerRight || !!footerCenter ? (
              <ModalFooter alignCenter={!!footerCenter}>
                {footerLeft ? <ModalFooterLeft>{footerLeft}</ModalFooterLeft> : null}
                {footerRight ? <ModalFooterRight>{footerRight}</ModalFooterRight> : null}
              </ModalFooter>
            ) : null}
          </ModalContent>
        </ModalDialog>
      </ModalContainer>
    </ModalComponent>
  );
}

Modal.defaultProps = {
  title: null,
  footerLeft: null,
  footerRight: null,
};

export default Modal;
