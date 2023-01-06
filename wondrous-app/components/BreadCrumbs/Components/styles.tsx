import { Grid, Typography } from '@mui/material';
import { ItemButton } from 'components/Common/SidebarItem/styles';
import { ChevronFilled } from 'components/Icons/sections';
import styled from 'styled-components';

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
    padding: 4px 6px;
    border-radius: 100px;
    cursor: pointer;
    ${ChevronFilled} {
      fill: ${({ theme, isOpen }) => {
        console.log(isOpen, 'IS OPEN');
        return isOpen ? theme.palette.grey950 : theme.palette.white;
      }};
      transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    }

    &:hover {
      background: ${({ theme }) => theme.palette.grey87};
    }
  }
`;
