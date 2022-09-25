import { Avatar, IconButton, Typography } from '@mui/material';
import styled from 'styled-components';

export const CreateFormMembersList = styled.div`
  width: 100%;
  height: 165px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 45px !important;
`;

export const CreateFormMembersListRow = styled.div`
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CreateFormMembersListInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const CreateFormMembersListAvatar = styled(Avatar)`
  && {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
`;

export const CreateFormMembersListName = styled(Typography)`
  && {
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #ffffff;
  }
`;

export const CreateFormMembersListAdminBlock = styled.div`
  width: 115px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CreateFormMembersListAdminBlockText = styled(Typography)`
  && {
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
  }
`;
export const CreateFormMembersListActivityButtons = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CreateFormMembersListDeleteButton = styled(IconButton)`
  && {
    width: 35px;
    height: 35px;
    background: #0f0f0f;
    padding: 0;
  }
`;
