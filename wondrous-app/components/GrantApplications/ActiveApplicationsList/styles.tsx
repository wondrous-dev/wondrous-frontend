import { Grid } from '@mui/material';
import { ItemButtonIcon, ButtonIcon } from 'components/Common/SidebarItem/styles';
import { GrantsBoardCardDescription } from 'components/GrantsBoard/styles';
import styled from 'styled-components';
import palette from 'theme/palette';

export const Card = styled(Grid)`
  && {
    background: ${palette.grey900};
    padding: 14px;
  }
`;

export const CardDescription = styled(GrantsBoardCardDescription)`
  && {
    color: ${palette.grey250};
  }
`;

export const StatItemWrapper = styled(Grid)`
  && {
    cursor: pointer;
    &:hover {
      ${ButtonIcon} {
        background: ${palette.highlightPurple};
      }
    }
  }
`;
