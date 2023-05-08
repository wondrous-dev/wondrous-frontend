import { ButtonBase, Typography } from '@mui/material';
import styled, { css } from 'styled-components';

export const DiscordButton = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    gap: 5px;
    width: 150px;
    height: 50px;
    background: #5865F2;
    border-radius: 6px;
  }
`;