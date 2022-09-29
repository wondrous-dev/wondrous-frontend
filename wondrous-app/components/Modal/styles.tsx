import CloseModalIcon from 'components/Icons/closeModal';
import styled, { css } from 'styled-components';
import Typography from '@mui/material/Typography';
import palette from '../../theme/palette';

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
  ${({ alignCenter }) =>
    alignCenter &&
    `
  display: flex;
  justify-content: center;
  align-items: center;

  `}
`;

export const ModalDialog = styled.div`
  position: relative;
  width: 100%;
  max-width: ${(props) => (props.maxWidth ? `${props.maxWidth}px` : '100%')};
  ${({ alignCenter }) => !alignCenter && 'margin: 50px auto auto;'};

  pointer-events: none;
  background: ${(props) => props.theme.palette.grey900};
  border: 1px solid ${(props) => props.theme.palette.grey79};
  border-radius: 6px;

  @media (min-width: 576px) {
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
    fontSize: 18,
    color: palette.white,
    fontWeight: 700,
  },
})``;

export const CloseModalBtn = styled((props) => (
  <div {...props}>
    <CloseModalIcon />
  </div>
))`
  width: 32px;
  height: 32px;
  background-color: #171717;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #454545;
  }

  svg {
    transform: scale(88%);
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${palette.grey920};
  border-radius: 6px 6px 0 0;
`;

export const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  padding: 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 24px;
  background: ${palette.black97};
  border-radius: 0 0 6px 6px;
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
