import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styled from 'styled-components';
import typography from 'theme/typography';
import palette from 'theme/palette';

export const StyledTabs = styled(Tabs)`
  && {
    color: ${palette.white};
    ${({ withMargin = true }) => withMargin && 'margin: 24px auto;'};
    width: 100%;
  }
  .MuiTabs-flexContainer {
    justify-content: start;
    ${({ withBorder = true }) => withBorder && `border-bottom: 2px solid ${palette.black92};`};
    gap: 20px;
  }
  .MuiTab-textColorInherit {
    opacity: 1;
  }
  .MuiTabs-indicator {
    background: linear-gradient(
      270deg,
      ${palette.blue20} 2.13%,
      ${palette.highlightPurple} 48.52%,
      ${palette.highlightBlue} 100%
    );
  }
`;

export const StyledTab = styled(Tab)`
  && {
    font-family: ${typography.fontFamily};
    font-size: 14px;
    font-weight: 500;
    /* min-width: fit-content; */
    padding: 7px 4px;
    /* margin-right: 20px; */
    color: ${({ isActive }) => (isActive ? palette.white : palette.grey51)};
  }
`;
