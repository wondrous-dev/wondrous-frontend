import { IconButton, Typography } from '@material-ui/core';
import styled from 'styled-components';

export const UserLinksTableWrapper = styled.div`
  max-width: 680px;
  width: 680px;
  margin: 20px auto 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const UserLinksTableRow = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  margin-top: 16px;
  :first-child {
    margin-top: 0;
  }
`;

export const UserLinksTableRowNameBlock = styled.div`
  max-width: 76px;
  width: 100%;
  height: 100%;
  display: flex;
`;

export const UserLinksTableRowTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
`;

export const UserLinksTableRowTitleText = styled(Typography)`
  && {
    margin-left: 10px;
    font-size: 14px;
    color: #c4c4c4;
  }
`;

export const UserLinksTableRowContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 76px;
`;

export const UserLinksTableRowContentItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 7px;
  background: #1c1c1c;
  border-radius: 4px;
  margin-right: 9px;
`;

export const UserLinksTableRowContentSocialButton = styled(IconButton)`
  && {
    width: 32px;
    height: 32px;
    background: #1c1c1c;
    margin-right: 8px;
    padding: 0;
    border-radius: 2px;
  }
`;

export const AboutInfoTableRowContentItemText = styled(Typography)`
  && {
    font-size: 14px;
    text-align: center;
    color: #fff;
  }
`;

export const UserLinksTableRowContentItemLink = styled(AboutInfoTableRowContentItemText)`
  && {
    color: #ccbbff;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
