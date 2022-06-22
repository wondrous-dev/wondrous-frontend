import styled from 'styled-components';
import { GradientHighlightHorizontal, GradientMidnightVertical } from '../gradients';
import palette from 'theme/palette';

export const StyledButton = styled.button`
  display: flex;
  flex-direction: column;

  margin: 0em 2em;

  line-height: 3em;
  height: 3em;
  width: 3em;
  padding: 0;

  ${GradientHighlightHorizontal}

  background: ${palette.grey80};
  border-radius: 6px;
`;

export const HomeButton = (className) => <StyledButton className={className}>H</StyledButton>;
