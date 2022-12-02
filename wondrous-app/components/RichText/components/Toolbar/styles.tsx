import styled from 'styled-components';
import { Button, Typography, TextField } from '@mui/material';

import { BaseCard } from 'components/Common/card';
import palette from 'theme/palette';

export const ToolbarContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 28px;
  gap: 2px;
  padding: 4px;
  border-radius: 4px;
  background: #313131;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-wrap: wrap;
    display: flex;
  }
`;

export const ToolbarButton = styled(Button)`
  &.MuiButton-root {
    width: 28px;
    height: 28px;
    min-width: auto;
    padding: 6px;
    background: transparent;
    border-radius: 4px;
    color: #c4c4c4;

    &:hover {
      background: rgba(29, 29, 29, 0.35);
      color: #fff;
    }

    ${({ $active }) =>
      $active
        ? `
      background: rgba(29, 29, 29, 0.5);
      color: ${palette.white};
      `
        : ''}
  }
`;

export const LinkModal = styled(BaseCard)`
  width: 480px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const LinkModalTitle = styled(Typography)`
  && {
    color: ${palette.white};
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 32px;
    margin-bottom: 8px;
  }
`;

export const LinkModalInput = styled(TextField)`
  && .MuiInputBase-root {
    padding: 6px 12px;
    color: ${palette.white};
    background: ${palette.background.default};
    border-radius: 6px;
  }

  && .MuiInputBase-input.Mui-disabled {
    color: ${palette.white};
    -webkit-text-fill-color: rgba(255, 255, 255, 0.5);
  }
`;
