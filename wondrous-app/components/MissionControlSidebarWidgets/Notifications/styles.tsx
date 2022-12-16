import styled from 'styled-components';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';

export const NotificationsWrapper = styled.div`
  max-height: 300px;
  overflow: auto;
  z-index: 1;
  ${ScrollBarStyles};
`;
