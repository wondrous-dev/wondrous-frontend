import styled from 'styled-components';
import { GradientMidnightDiagonal, GradientMidnightVertical } from 'components/Common/gradients';

export const CardWrapper = styled.div`
  display: flex;
  margin: ${(props) => (props.wrapped ? '0' : '1em 0 0 0')};

  padding: 1px;
  background: #515151;

  cursor: grab;

  ${GradientMidnightDiagonal}

  border-radius: ${(props) => (props.wrapped ? '0px' : '6px')};
`;
