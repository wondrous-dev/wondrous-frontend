import styled from 'styled-components';
import palette from 'theme/palette';
import { CenteredFlexRow } from './index';

export const Line = styled.h2`
  && {
    text-align: center;
    border-bottom: ${(props) => props.borderBottom};
    line-height: 0.1rem;
    width: ${(props) => props.width || '100%'};
  }
`;

export function LineWithText({ children, width = '25%', borderBottom = `1px solid ${palette.grey85}` }) {
  return (
    <CenteredFlexRow>
      <Line width={width} borderBottom={borderBottom} />
      {children}
      <Line width={width} borderBottom={borderBottom} />
    </CenteredFlexRow>
  );
}
