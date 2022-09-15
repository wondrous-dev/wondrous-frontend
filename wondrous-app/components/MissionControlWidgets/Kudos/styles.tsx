import styled from 'styled-components';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';

export const KudosWrapper = styled.div`
  max-height: 200px;
  overflow: auto;
  ${ScrollBarStyles};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
