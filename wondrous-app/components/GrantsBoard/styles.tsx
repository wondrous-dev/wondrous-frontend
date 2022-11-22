import { Grid } from '@mui/material';
import { BoardsCardBodyDescription } from 'components/Common/Boards/styles';
import { BountyCardWrapper } from 'components/Common/BountyBoard/styles';
import { CompensationPill } from 'components/Common/Compensation/styles';
import styled from 'styled-components';
import palette from 'theme/palette';

export const MenuWrapper = styled(Grid)`
  && {
    display: none;
  }
`;

export const BoardWrapper = styled(BountyCardWrapper)`
  && {
    background: ${palette.grey900};
    &::before {
      display: none;
    }
    &:hover {
      ${MenuWrapper} {
        display: flex;
      }
    }
    ${CompensationPill} {
      padding: 1px;
    }
  }
`;

export const ItemPill = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 2px 11px 2px ${({ withIcon }) => (withIcon ? '5px' : '11px')};
  border: none;
  background: ${palette.grey78};
  border-radius: 300px;
`;

export const EndingSoonPill = styled(ItemPill)`
  && {
    border-radius: 4px;
    background: ${palette.grey99};
    padding: 1px 5px 1px 6px;
  }
`;

export const GrantsBoardCardDescription = styled(BoardsCardBodyDescription)`
  && {
    -webkit-line-clamp: 3;
  }
`;
