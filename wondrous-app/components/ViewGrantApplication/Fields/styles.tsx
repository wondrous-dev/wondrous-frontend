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
          stroke: ${({ disableHoverStroke }) => !disableHoverStroke && palette.highlightBlue};
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
  width: 100%;
  padding: 14px;
  align-items: center;
  background: ${palette.grey900};
`;

export const CreateWorkspaceWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 100%;
  background: ${palette.grey900};
  border: 1px solid ${palette.grey920};
  border-radius: 4px;
  padding: 12px;
  align-items: center;
`;

export const Button = styled(ActionButton)`
  && {
    padding: 7px 10px;
    white-space: nowrap;
    font-size: 14px;
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
