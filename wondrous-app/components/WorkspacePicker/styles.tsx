import styled from 'styled-components';
import palette from 'theme/palette';
import { Grid, Typography } from '@mui/material';
import { HorizontalEntityItem } from 'components/HeaderItems/CreateEntityComponent/styles';
import Link from 'next/link';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import { ButtonIcon } from 'components/Common/SidebarItem/styles';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 30vw;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-width: 100%;
  }
`;

export const OrgItem = styled(Link)`
  flex: 1;
  flex-basis: 30%;
  width: 30%;
  text-decoration: none;
  display: flex;
  background: ${({ isActive }) => (isActive ? palette.grey87 : palette.black92)};
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  text-align: center;
  align-items: center;
  flex-direction: column;
  border-radius: 6px;
  height: 100px;
  &:hover {
    background: ${palette.grey87};
  }
`;

export const OrgItemTitle = styled(Typography)`
  && {
    font-weight: 500;
    max-width: 90%;
    font-size: 13px;
    color: ${palette.white};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
export const FullWidthItem = styled(OrgItem)`
  flex-basis: 100%;
  width: 100%;
`;

export const OrgWrapper = styled(Grid)`
  && {
    background: ${palette.grey900};
    padding: 12px;
    max-height: 300px;
    min-width: 300px;
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
    border-radius: 0px;
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

export const UnstyledLink = styled(Link)`
  text-decoration: none;
`;

export const LeaveWorkspaceWrapper = styled(HorizontalEntityItem)`
  && {
    color: ${palette.white};

    &:hover {
      color: ${palette.red900};
      ${ButtonIcon} {
        svg {
          path {
            stroke: ${palette.red900};
          }
        }
        background: transparent !important;
      }
    }
  }
`;
