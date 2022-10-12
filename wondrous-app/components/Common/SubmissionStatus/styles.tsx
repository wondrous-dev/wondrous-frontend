import { Typography } from '@mui/material';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';
import VARIATIONS from './constants';

const statusWrapperVariations = {
  [VARIATIONS.default]: css`
    background: ${palette.grey99};
    border-radius: 4px;
    padding: 4px 8px;
  `,
  [VARIATIONS.rounded]: css`
    background: ${palette.background.default};
    padding: 7px 11px 7px 0;
    border-radius: 50px;
  `,
};

export const StatusWrapper = styled.div`
  ${({ variation }) => statusWrapperVariations[variation]}
  display: flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const IconWrapper = styled.div`
  background: ${palette.background.default};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 500px;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Text = styled(Typography)`
  && {
    font-size: 14px;
    ${({ theme }) => `
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightMedium};
    `}
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const TextAwaitingReview = styled(Text)`
  background: -webkit-linear-gradient(${palette.white}, ${palette.highlightBlue});
`;

export const TextChangesRequested = styled(Text)`
  background: -webkit-linear-gradient(${palette.white}, ${palette.yellow800});
`;

export const TextChangesRejected = styled(Text)`
  background: -webkit-linear-gradient(${palette.white}, ${palette.red400});
`;

export const TextCompleted = styled(Text)`
  background: -webkit-linear-gradient(${palette.white}, ${palette.green30});
`;
