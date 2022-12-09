import { Typography } from '@mui/material';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import styled from 'styled-components';
import palette from 'theme/palette';

export const Wrapper = styled.div`
  padding-top: 70px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EntityItem = styled.div`
  flex: 1;
  flex-basis: 48%;
  display: flex;
  background: ${palette.grey87};
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  align-items: center;
  flex-direction: column;
  font-weight: 500;
  font-size: 15px;
  color: ${palette.white};
  border-radius: 6px;
  height: 100px;
  &:hover {
    background: ${palette.grey75};
    ${ItemButtonIcon} {
      background: ${palette.highlightPurple};
    }
  }
`;

export const Label = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-size: 13px;
    font-weight: 500;
    line-height: 16px;
  }
`;

export const HorizontalEntityItem = styled(EntityItem)`
  && {
    flex-basis: 100%;
    justify-content: flex-start;
    flex-direction: row;
    height: fit-content;
    padding: 10px;
    border-radius: 0px;
  }
`;
