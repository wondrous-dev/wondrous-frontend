import styled from 'styled-components';
import palette from 'theme/palette';
import { InputBase, ListItemIcon, Typography, Tab, Tabs } from '@mui/material';
import { Button } from 'components/Common/button';

export const CollabsContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 765px;
`;

export const CollabsChildrenWrapper = styled.div`
  padding: 100px 24px 0px 24px;
`;

export const Container = styled.div`
  width: 95%;
`;

export const StyledTabs = styled(Tabs)`
  && {
    color: #fff;
    width: 100%;
  }
  .MuiTabs-flexContainer {
    justify-content: start;
    ${({ withBorder = true }) => withBorder && 'border-bottom: 2px solid #4b4b4b;'};
  }
  .MuiTab-textColorInherit {
    opacity: 1;
  }
  .MuiTabs-indicator {
    background: linear-gradient(270deg, #ccbbff 2.13%, #7427ff 48.52%, #00baff 100%);
  }
`;

export const StyledTab = styled(Tab)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 500;
    max-width: fit-content;
    padding: 3px;
    margin-right: 20px;
    color: ${({ isActive }) => (isActive ? 'white' : '#828282')};
  }
`;

export const ChildrenWrapper = styled.div``;

export const NewCollabDiv = styled.div`
  margin-top: 14px;
  margin-bottom: 14px;
  min-height: 98px;
  position: relative;
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NewCollabButton = styled(Button)`
  && {
    position: relative;
    z-index: 10;
  }
`;

export const NewCollabButtonText = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 15px;
    color: ${palette.white};
  }
`;

export const CollabCard = styled.div`
  padding: 14px;
  background: ${palette.black92};
  border-radius: 6px;
  cursor: pointer;
`;

export const CollabCardHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const CollabDescription = styled(Typography)`
  && {
    color: ${palette.grey250};
    font-size: 15px;
    font-family: Space Grotesk;
    line-height: 24px;
    margin-top: 14px;
    margin-bottom: 14px;
    font-weight: 500;
  }
`;

export const CollabBottom = styled.div`
  display: flex;
  align-items: center;
`;

export const CollabInvitationHeader = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-weight: bold;
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 14px;
  }
`;

export const StyledBottomHr = styled.hr`
  height: 1px;
  border: 1px solid ${palette.black87};
  width: calc(100% - 28px);
`;

export const InvitationButton = styled(Button)`
  && {
    margin-top: 8px;
  }
`;

export const InvitationButtonText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 14px;
    font-weight: 500;
  }
`;

export const EmptyText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 12px;
    margin-bottom: 20px;
  }
`;

export const CollabCount = styled(Typography)`
  && {
    color: ${({ isActive }) => (isActive ? 'white' : '#828282')};
    background: ${palette.grey87};
    padding: 2px;
    border-radius: 4px;
    font-size: 13px;
  }
`;
