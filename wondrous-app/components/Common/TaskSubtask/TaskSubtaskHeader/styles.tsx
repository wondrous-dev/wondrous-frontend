import { Typography } from '@mui/material';
import { Button } from 'components/Common/button';
import PlusIcon from 'components/Icons/plus';
import styled from 'styled-components';
import palette from 'theme/palette';

export const TaskSubtaskHeaderWrapper = styled.div`
  align-items: center;
  background: ${palette.grey900};
  border-radius: 6px;
  display: flex;
  height: 68px;
  justify-content: center;
`;

export const TaskSubtaskHeaderButton = styled(Button)`
  && {
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    height: 40px;
    button {
      background: #0f0f0f;
      padding: 5px 16px 5px 5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
`;

export const TaskSubtaskHeaderButtonIconWrapper = styled.div`
  align-items: center;
  background: #1d1d1d;
  border-radius: 100%;
  display: flex;
  height: 30px;
  justify-content: center;
  padding: 9px;
  width: 30px;
`;

export const TaskSubtaskHeaderButtonIcon = styled(PlusIcon)`
  width: 12px;
  height: 12px;
`;

export const TaskSubtaskHeaderButtonLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 15px;
    font-weight: 600;
    ${({ theme }) => `
      color: ${theme.palette.white};
    `};
  }
`;
