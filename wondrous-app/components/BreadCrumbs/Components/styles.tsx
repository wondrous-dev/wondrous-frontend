import { Grid, Typography } from '@mui/material';
import { ArrowIcon } from 'components/Common/SidebarEntityMenu/styles';
import { ItemButton } from 'components/Common/SidebarItem/styles';
import { UnstyledButton } from 'components/WorkspacePicker/styles';
import Link from 'next/link';
import styled from 'styled-components';
import palette from 'theme/palette';

export const PageTypeItemButton = styled(ItemButton)`
  && {
    padding: 0;
    border-left: none;
    width: fit-content;
  }
`;

export const PodTitle = styled(Typography)`
  && {
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    overflow: hidden;
    overflow-wrap: break-word;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-oriental: vertical;
    max-width: 5rem;
  }
`;

export const PodSelectorWrapper = styled(Grid)`
  && {
    padding: 0px 6px;
    border-radius: 100px;
    cursor: pointer;
    ${UnstyledButton} {
      cursor: pointer;
    }
    ${ArrowIcon} {
      display: none;
    }
    &:hover {
      background: ${({ theme }) => theme.palette.grey87};
      ${ArrowIcon} {
        display: flex;
      }
    }
  }
`;

export const PodLink = styled(Link)`
  display: flex;
  gap: 8px;
  text-decoration: none;
  color: ${palette.white};
  justify-content: center;
  align-items: center;
`;
