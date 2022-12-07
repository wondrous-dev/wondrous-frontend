import styled from 'styled-components';
import palette from 'theme/palette';
import { Grid } from '@mui/material';
import { HorizontalEntityItem } from 'components/HeaderItems/styles';
import Link from 'next/link';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const OrgItem = styled(Link)`
  flex: 1;
  flex-basis: 48%;
  text-decoration: none;
  display: flex;
  background: ${({ isActive }) => (isActive ? palette.grey87 : palette.black92)};
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  align-items: center;
  flex-direction: column;
  font-weight: 500;
  font-size: 13px;
  color: ${palette.white};
  border-radius: 6px;
  height: 100px;
  &:hover {
    background: ${palette.grey87};
  }
`;

export const OrgWrapper = styled(Grid)`
  && {
    background: ${palette.grey900};
    padding: 12px;
    max-height: 300px;
    overflow-y: auto;
    ${ScrollBarStyles};
  }
`;

export const ItemsWrapper = styled(Grid)`
  && {
    background: ${palette.grey99};
  }
`;

export const Item = styled(HorizontalEntityItem)`
  && {
    background: transparent;
    padding: 12px;
    border-radius: 0px
  }
`;

export const UnstyledButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
`;