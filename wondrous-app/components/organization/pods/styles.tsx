import styled from 'styled-components';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';

import SearchIcon from 'components/Icons/search';

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
    padding: 7px 4px;
    color: ${({ isActive }) => (isActive ? palette.white : palette.grey51)};
  }
`;

export const SearchPods = styled(({ ...props }) => (
  <Input
    {...props}
    disableUnderline
    startAdornment={
      <InputAdornment position="start">
        <SearchIcon color={palette.blue20} />
      </InputAdornment>
    }
  />
))`
  && {
    height: 40px;
    background: ${palette.black101};
    color: ${palette.grey250};
    width: 100%;
    padding: 0 10px;
    margin: 10px 0 31px 0;
    border-radius: 6px;
    font-size: 14px;
  }
`;

export const PodItemWrapper = styled.a`
  text-decoration: none;
`;

export const CreateNewPodButton = styled(Button)`
  && {
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${palette.grey87};
    border-radius: 6px;
    padding: 8px;
    transition: background 0.2s ease-in-out;

    &:hover {
      background: ${palette.grey88};
    }
  }
`;

export const CreateNewPodIconWrapper = styled.div`
  height: 24px;
  width: 24px;
  background: ${palette.background.default};
  border-radius: 1000px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  svg path {
    fill: ${palette.blue20};
  }

  &::before {
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(
      232.77deg,
      ${palette.highlightBlue} 18.39%,
      ${palette.highlightPurple} 86.24%,
      ${palette.blue20} 161.54%
    );
    mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
    mask-composite: xor;
    mask-composite: exclude;
    padding: 2px;
    border-radius: 1000px;
  }
`;
