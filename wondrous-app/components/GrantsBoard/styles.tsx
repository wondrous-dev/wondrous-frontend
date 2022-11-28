import { Grid } from '@mui/material';
import { BoardsCardBodyDescription } from 'components/Common/Boards/styles';
import { BountyCardWrapper } from 'components/Common/BountyBoard/styles';
import { CompensationPill } from 'components/Common/Compensation/styles';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

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
  padding: 2px 11px 2px ${({ withIcon }) => (withIcon ? '2px' : '11px')};
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
    -webkit-line-clamp: 2;
  }
`;

export const EmptyStateWrapper = styled.div`
  width: 100% !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${palette.white};
  border-radius: 6px;
  border: 1px solid ${palette.black95};
  background: transparent;
  gap: 14px;
  position: relative;
  padding: 38px;
  height: fit-content;
`;

export const CreateGrantButton = styled.button`
  border: none;
  background: transparent;
  color: ${palette.highlightBlue};
  font-size: 13px;
  font-weight: 700;
  font-family: ${typography.fontFamily};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
