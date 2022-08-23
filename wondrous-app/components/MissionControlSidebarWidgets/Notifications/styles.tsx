import styled from 'styled-components';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';

export const NotificationsWrapper = styled.div`
  max-height: 400px;
  overflow: auto;
  z-index: 1;
  ${ScrollBarStyles};
`;
