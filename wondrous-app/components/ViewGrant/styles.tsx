import styled from 'styled-components';
import palette from 'theme/palette';
import scrollBarStyles from 'components/Common/ScrollbarStyles';

export const DescriptionWrapper = styled.div`
  color: ${palette.white};
  height: 60vh;
  overflow: auto;
  ${scrollBarStyles};
`;
