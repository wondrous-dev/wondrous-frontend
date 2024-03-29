import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const TaskMintWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  background: ${palette.grey900};
  border: 1px solid ${palette.grey920};
  border-radius: 4px;
  padding: 12px;
  align-items: center;
`;

export const TaskMintDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TaskMintDetailsTitle = styled(Typography)`
  && {
    background: linear-gradient(265.8deg, #7427ff -78%, #f2c678 108.49%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 500;
  }
`;

export const TaskMintDetailsChain = styled.div`
  display: flex;
  gap: 8px;
  font-family: ${typography.fontFamily};
  font-weight: 600;
  font-size: 11px;
  line-height: 14px;
  color: ${palette.grey250};
  align-items: center;
  svg {
    path {
      stroke: none !important;
    }
  }
`;

export const TaskMintButtonWrapper = styled.button`
  border: 0;
  background: ${palette.grey1020};
  color: ${({ labelColor }) => labelColor || palette.white};
  padding: 10px;
  display: flex;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;
  gap: 10px;
  align-items: center;
  &:disabled {
    pointer-events: none;
  }
  position: relative;
  &:before {
    content: '';
    width: 20%;
    height: 65%;
    position: absolute;
  }
  &:hover {
    background: ${palette.grey1000};
    &:before {
      background: ${({ hoverColor }) => hoverColor || 'transparent'};
      filter: blur(20px);
    }
  }
`;
