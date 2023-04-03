import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import typography from 'theme/typography';

export const RightSideWrapper = styled(Grid)`
  && {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, #7730d3 -5.04%, #1c0e94 26.14%, #151629 71.11%);
  }
`;

export const InfoTypography = styled(Typography)`
  && {
    font-family: 'IBM Plex Mono';
    letter-spacing: 0.01em;
    font-weight: 400;
    line-height: 20px;
    color: ${palette.white};
    font-size: 15px;
  }
`;

export const PageLabel = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    color: ${palette.blue20};
    font-size: ${({ fontSize }) => fontSize || '20px'};
    font-weight: ${({ fontWeight }) => fontWeight || '700'};
    line-height: 24px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      font-size: 16px;
    }
  }
`;

export const TextArea = styled.textarea`
  background: ${({ theme }) => theme.palette.background.default};
  border: none;
  color: ${({ theme }) => theme.palette.white};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  height: 30px;
  resize: none;
  width: 100%;
  :focus-visible {
    outline: none;
  }
  ${ScrollBarStyles}
`;

export const ActionItemWrapper = styled.button`
  border-radius: 6px;
  height: 26px;
  padding: 0;
  width: 26px;
  cursor: pointer;
  background: ${palette.grey940};
  border: none;
  &:hover {
    background: ${palette.grey900};
  }
  svg {
    rect {
      fill: transparent;
    }
  }
`;
