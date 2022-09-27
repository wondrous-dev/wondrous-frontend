import React from 'react';
import ModalComponent from '@mui/material/Modal';

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
};

export function Modal({
  open,
  onClose,
  title,
  footerLeft,
  footerRight,
  maxWidth,
  children,
  alignCenter = false,
}: Props) {
  return (
    <ModalComponent open={open} onClose={onClose}>
      <ModalContainer tabIndex={-1} alignCenter={alignCenter}>
        <ModalDialog maxWidth={maxWidth} alignCenter={alignCenter}>
          <ModalContent>
            <ModalHeader>
              {!!title && <ModalTitle>{title}</ModalTitle>}
              {onClose && <CloseModalBtn onClick={onClose} />}
            </ModalHeader>

            <ModalBody>{children}</ModalBody>

            {footerLeft || footerRight ? (
              <ModalFooter>
                <ModalFooterLeft>{footerLeft}</ModalFooterLeft>
                <ModalFooterRight>{footerRight}</ModalFooterRight>
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
