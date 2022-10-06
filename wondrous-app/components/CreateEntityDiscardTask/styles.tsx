import { ButtonBase, Modal, Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 561px;
  height: fit-content;
  background: ${palette.grey900};
  border: 1px solid ${palette.grey79};
  border-radius: 6px;
  color: ${palette.white};
`;

export const Header = styled.div`
  padding: 12px;
  width: 100%;
  background: ${palette.grey920};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderText = styled(Typography)`
  && {
    color: ${palette.white};
    font-weight: 500;
    font-size: 18px;
  }
`;

export const CloseHeaderIcon = styled(ButtonBase)`
  && {
    width: 32px;
    height: 32px;
    background: ${palette.grey910};
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Body = styled.div`
  width: 100%;
  padding: 24px;
  text-align: center;
  font-weight: 600;
`;

export const Footer = styled.div`
  background: ${palette.black97};
  width: 100%;
  padding: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
`;

export const Cancel = styled(ButtonBase)`
  && {
    padding: 8px 24px;
    height: 40px;
    background: ${palette.grey78};
    border-radius: 35px;
    font-family: ${typography.fontFamily};
    font-weight: 600;
    font-size: 15px;
  }
`;

export const Discard = styled(ButtonBase)`
  && {
    padding: 8px 20px;
    height: 40px;
    width: fit-content;
    position: relative;
    z-index: 10;
    border-radius: 35px;
    background: linear-gradient(270deg, ${palette.red300} -5.62%, ${palette.highlightPurple} 103.12%);
    font-family: ${typography.fontFamily};
    font-weight: 600;
    font-size: 15px;
    :after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(1px, 1px);
      height: calc(100% - 2px);
      width: calc(100% - 2px);
      border-radius: inherit;
      z-index: -3;
      background: ${palette.background.default};
    }
  }
`;
