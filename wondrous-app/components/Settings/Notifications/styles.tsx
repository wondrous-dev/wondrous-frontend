import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import { InputBase, Switch, Typography } from '@material-ui/core';
import SnackbarComp from '@mui/material/Snackbar';

import { Button } from '../../Common/button';
import { Red800 } from '../../../theme/colors';

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
