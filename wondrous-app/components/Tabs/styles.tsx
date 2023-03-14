import Tabs from '@mui/material/Tabs';
import styled from 'styled-components';

export const StyledTabs = styled(Tabs)`
  && {
    color: #fff;
    ${({ $withMargin = true }) => $withMargin && 'margin-bottom: 30px'};
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

export const styles = {
  tab: {
    fontSize: '14px',
    fontWeight: '500',
    minWidth: 'fit-content',
    padding: '3px',
    marginRight: '20px',
    color: 'white',
    '&.Mui-selected': {
      color: '#1976d2',
    },
  },
};
