import { ButtonBase } from '@mui/material';
import { Label } from 'components/CreateTemplate/styles';
import styled from 'styled-components';

export const WorkspaceWrapper = styled(ButtonBase)`
  && {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    padding: 4px 4px;
    border-radius: 10px;
    cursor: pointer;
    ${Label} {
        text-align: left;
    }
    &:hover {
      background: #2a8d5c;
      ${Label} {
          color: white;
      }
    }
  }
`;
