import { Tab, Tabs } from '@material-ui/core';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const StyledTabs = styled(Tabs)`
  && {
    color: #fff;
    margin: 30px auto;
  }
  .MuiTabs-flexContainer {
    justify-content: space-evenly;
  }
  .MuiTab-textColorInherit {
    opacity: 1;
  }
  .MuiTabs-indicator {
    background-color: #7427ff;
  }
`;

export const StyledTab = styled(Tab)`
  && {
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 400;
    padding: 10px;
    border-bottom: 2px solid #4b4b4b;
    width: 100%;
  }
`;
