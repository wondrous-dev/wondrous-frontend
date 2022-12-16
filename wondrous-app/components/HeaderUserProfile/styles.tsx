import { WonderBalance } from 'components/Common/Wallet/styles';
import styled from 'styled-components';

export const HeaderUserProfileWrapper = styled(WonderBalance)`
  && {
    padding-left: 6px;
    opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};
    :hover {
      background: ${({ theme }) => theme.palette.grey78};
    }
  }
`;
