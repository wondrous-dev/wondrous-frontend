import { BountyCardWrapper } from 'components/Common/BountyBoard/styles';
import styled from 'styled-components';
import palette from 'theme/palette';

export const BoardWrapper = styled(BountyCardWrapper)`
  && {
    background: ${palette.grey900};
    &::before {
      display: none;
    }
  }
`;
