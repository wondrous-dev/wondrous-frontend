import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import { InputBase, Switch, Typography } from '@material-ui/core';
import SnackbarComp from '@mui/material/Snackbar';

import { Button } from '../../Common/button';
import { Red800 } from '../../../theme/colors';

export const RolesContainer = styled.div`
  width: 100%;
  max-width: 765px;
`;

export const Box = styled.div`
  ${space}
`;

export const RolesInputsBlock = styled.div`
  padding: 30px 0 10px;
`;

export const RoleNameBlock = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 28px;
`;

export const CreateRole = styled.div`
  display: flex;
`;

export const CreateRoleButton = styled(Button)`
  width: 160px;
  margin-left: 22px;
  height: 36px;
  box-sizing: content-box;
  min-height: 36px;
`;

export const DeleteButton = styled(Button).attrs({ variant: 'outlined', color: 'error' })`
  && {
    border: 1px solid #cb3340;
    color: white;
    width: 150px;
    height: 36px;
    min-height: 36px;
  }
`;

export const Permissions = styled.div`
  padding: 0 24px;
`;

export const Permission = styled.div`
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 85px;

  &:not(:first-child) {
    border-top: 1px solid #4b4b4b;
  }
`;

export const PermissionTitle = styled.h5`
  font-size: 16px;
  margin-bottom: 7px;
  margin-top: 14px;
  font-family: Space Grotesk;
`;

export const PermissionSubtitle = styled.div`
  font-size: 13px;
  color: #c4c4c4;
`;

export const PermissionFooter = styled.div`
  border-top: 1px solid #4b4b4b;
  padding: 50px 0 30px;
  display: flex;
  justify-content: flex-end;
  font-family: Space Grotesk;
`;

export const RoleNameInput = styled(InputBase)`
  && {
    width: 100%;
    height: 40px;
    border: 1px solid #4b4b4b;
    border-radius: 6px;

    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    padding: 10px 15px;
    font-family: Space Grotesk;
  }
`;

export const LabelBlock = styled(Typography)`
  && {
    ${space};
    margin-left: 20px;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
    margin-bottom: 10px;
  }
`;

export const Snackbar = styled(SnackbarComp)`
  .MuiPaper-elevation {
    background: rgb(0, 67, 61);
    color: white;
  }
`;

export const Error = styled.h3`
  color: ${Red800};
  margin: 30px 0;
`;
