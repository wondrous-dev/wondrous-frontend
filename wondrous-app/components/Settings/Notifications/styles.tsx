import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import { InputBase, Switch, Typography } from '@material-ui/core';
import SnackbarComp from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';

import { Button } from '../../Common/button';
import { Red800, White } from '../../../theme/colors';

export const ConnectDiscordButton = styled(Button)`
  && {
    max-width: 206px;
  }
`;

export const TableValueText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 16px;
    font-height: 22px;
  }
`;

export const DiscordCard = styled(Grid)`
  && {
    background: #3f3f45;
    border-radius: 8px;
    margin-top: 24px;
    padding: 8px;
  }
`;

export const DiscordCardElement = styled(Grid)``;
export const DiscordCardElementDiv = styled.div`
  padding: 12px;
`;

export const DiscordCardText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    color: ${White};
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

export const UserDiscordNotificationSettingsDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  justify-content: space-between;
`;

export const UserDiscordNotificationSettingsText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    color: ${White};
    font-size: 20px;
    font-weight: bold;
  }
`;
