import styled, { css, keyframes } from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { Button } from 'components/Button';
import { Grid } from '@mui/material';
import { STEPS } from './constants';

export const MintStep = styled.div`
  display: flex;
  color: ${({ isActive }) => (isActive ? palette.white : palette.grey57)};
  font-family: ${typography.fontFamily};
  font-size: 15px;
  font-weight: 400;
  gap: 12px;
  align-items: center;
`;

export const CommunityShareWrapper = styled.div`
  display: flex;
  background: ${palette.black97};
  padding: 14px;
  color: ${palette.white};
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
`;

export const ShareButton = styled(Button)`
  && {
    font-weight: 500;
    font-size: 15px;
    gap: 8px;
  }
`;

const setAnimation = ({ step }) => {
  const widthToStepThresholds = STEPS.map((_, idx) => Math.round(((idx + 1) * 98) / STEPS.length));

  const animation = keyframes`
  from {
    width: ${widthToStepThresholds[step - 1] || 0}%;
  }
  to {
    width: ${widthToStepThresholds[step]}%;
  }
`;

  return css`
    animation: ${animation};
    max-width: ${widthToStepThresholds[step]}%;
    animation-duration: 6s;
    transition: max-width: 2s ease-in-out;
    transition: width 0.6s ease-in-out;
    animation-fill-mode: forwards;
  `;
};

export const ProgressBarWrapper = styled(Grid)`
  && {
    .mint-task-progress-bar {
      ${setAnimation}
    }
  }
`;
