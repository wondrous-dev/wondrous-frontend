import { ActionButton } from 'components/Common/Task/styles';
import { DataDisplayWrapper } from 'components/ViewGrant/Fields/styles';
import styled from 'styled-components';
import palette from 'theme/palette';

export const WalletAddressWrapper = styled.div`
  cursor: pointer;
  ${DataDisplayWrapper} {
    &:hover {
      background: ${palette.grey78};
      svg {
        path {
          stroke: ${palette.highlightBlue};
        }
      }
    }
  }
`;

export const GrantApplicationStatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  gap: 14px;
  padding: 14px;
  align-items: center;
  background: ${palette.grey900};
`;

export const Button = styled(ActionButton)`
  && {
    padding: 8px 10px;
    white-space: nowrap;
    :hover {
      background: ${({ gradient, disabled }) => (disabled ? 'transparent' : gradient)};
    }
    &::before {
      background: ${({ gradient }) => gradient};
    }
    &.Mui-disabled {
      opacity: 0.5;
    }
  }
`;
