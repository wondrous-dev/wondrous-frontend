import { Typography } from '@mui/material';
import { Button } from 'components/Common/button';
import { GradientHighlightHorizontal } from 'components/Common/gradients';
import PlusIcon from 'components/Icons/plus';
import styled from 'styled-components';

export const MilestoneTasksCreateWrapper = styled.div`
  height: 68px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #171717;
`;

export const MilestonesTasksCreateButton = styled(Button)`
  && {
    border-radius: 115px;
    min-width: 120px;
    height: 40px;

    ${GradientHighlightHorizontal};
    button {
      padding: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 16px 0 4px;
      ${({ theme }) => `
        background: ${theme.palette.background.default};
    `}
    }
  }
`;

export const MilestonesTasksCreateButtonIconWrapper = styled.div`
  align-items: center;
  background: #1d1d1d;
  border-radius: 100%;
  display: flex;
  height: 30px;
  justify-content: center;
  padding: 9px;
  width: 30px;
`;

export const MilestonesTasksCreateButtonIcon = styled(PlusIcon)`
  width: 12px;
  height: 12px;
  path {
    fill: #ccbbff;
  }
`;

export const MilestonesTaskCreateButtonLabel = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-size: 15px;
    font-weight: 600;
    ${({ theme }) => `
        color: ${theme.palette.white};
    `}
  }
`;
