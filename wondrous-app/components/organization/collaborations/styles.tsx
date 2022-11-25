import styled from 'styled-components';
import palette from 'theme/palette';
import { Button as MuiButton, InputBase, ListItemIcon, Typography, Tab, Tabs } from '@mui/material';

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
    ${({ withMargin = true }) => withMargin && 'margin: 30px auto;'};
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
