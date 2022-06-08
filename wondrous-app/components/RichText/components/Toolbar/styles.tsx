import styled from 'styled-components';
import { Button, Typography, TextField } from '@mui/material';

import { BaseCard } from 'components/Common/card';
import { Background, White } from 'theme/colors';

export const ToolbarContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 28px;
  gap: 2px;
  padding: 6px;
  border-radius: 4px;
  background: #313131;
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
      background: rgba(29, 29, 29, 0.5);
      color: #fff;
    }

    ${({ $active }) => {
      return $active
        ? `
      background: rgba(29, 29, 29, 0.35);
      color: ${White};
      `
        : '';
    }}
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
    color: ${White};
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
    color: ${White};
    background: ${Background};
    border-radius: 6px;
  }

  && .MuiInputBase-input.Mui-disabled {
    color: ${White};
    -webkit-text-fill-color: rgba(255, 255, 255, 0.5);
  }
`;
