import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styled from 'styled-components';

export const StyledTabs = styled(Tabs)`
  && {
    color: #fff;
    ${({ withMargin = true }) => withMargin && 'margin-bottom: 30px'};
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
    min-width: fit-content;
    padding: 3px;
    margin-right: 20px;
    color: white;
  }
`;
