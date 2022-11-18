import styled from 'styled-components';
import palette from 'theme/palette';
import scrollBarStyles from 'components/Common/ScrollbarStyles';

export const DescriptionWrapper = styled.div`
  color: ${palette.white};
  max-height: 300px;
  overflow: auto;
  min-height: 25rem;
  ${scrollBarStyles};
`;
