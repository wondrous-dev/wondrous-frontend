import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import {
  InputBase,
  Switch,
  Typography,
} from '@material-ui/core';
import { Button } from '../../Common/button';


export const RolesContainer = styled.div`
  height: 100vh;
  width: 555px;
`;

export const Box = styled.div`
  ${space}
`;

export const RolesInputsBlock = styled.div`
  padding: 30px 0;
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

export const Permission = styled.div`
  padding: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #4b4b4b;
`;

export const PermissionTitle = styled.h5`
  font-size: 16px;
  margin: 0 0 10px 0;
`;

export const PermissionSubtitle = styled.div`
  font-size: 13px;
  color: #c4c4c4;
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
  }
`;

export const AndroidSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    background: '#3E3E3E',

    '&:before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
      zIndex: 1000,
      opacity: 1,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
    background: 'white',
  },

  '& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
    background:
      'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
  },
}));

export const LabelBlock = styled(Typography)`
  && {
    ${space}
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
    margin-bottom: 10px;
  }
`;
