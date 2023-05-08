import { Typography } from '@mui/material';
import CloseModalIcon from 'components/Icons/CloseModal';
import styled from 'styled-components';

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
  overflow-y: auto;
  background: rgba(175, 158, 255, 0.9);
    display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalDialog = styled.div`
  position: relative;
  width: 80%;
  max-width: ${(props) => (props.maxWidth ? `${props.maxWidth}px` : '100%')};

  overflow: hidden;
  pointer-events: none;
  background: white;
  border-radius: 16px;
  border: 1px solid black;
  overflow: hidden;
  @media (min-width: 5716px) {
    .modal-dialog {
      max-width: 500px;
      margin: 1.75rem auto;
    }
  }
`;

export const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  outline: 0;
`;

export const ModalTitle = styled(Typography).attrs({
  sx: {
    fontSize: 15,
    color: '#E9FF90',
    fontFamily: 'Poppins',
    fontWeight: 600,
  },
})``;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #2a8d5c;
  border-bottom: 1px solid black;
`;

export const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  padding: 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ alignCenter }) => (alignCenter ? 'center' : 'flex-end')};
  padding: 24px;
  border-radius: 0 0 16px 16px;
  border-top: 1px solid #E8E8E8;
`;

export const ModalFooterLeft = styled.div`
  display: flex;
  gap: 18px;
  flex: 1;
`;

export const ModalFooterRight = styled.div`
  display: flex;
  gap: 18px;
`;

export const CloseModalBtn = styled((props) => (
  <div {...props}>
    <CloseModalIcon />
  </div>
))`
  width: 32px;
  height: 32px;
  background-color: #F8AFDB;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #F8AFDB;
  }

  svg {
    transform: scale(88%);
  }
`;
