import { Typography } from '@mui/material';
import { ItemButton } from 'components/Common/SidebarItem/styles';
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
