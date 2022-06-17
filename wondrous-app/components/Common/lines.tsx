import { CenteredFlexRow } from './index';
import styled from 'styled-components';
import palette from 'theme/palette';

export const Line = styled.h2`
  && {
    text-align: center;
    border-bottom: ${(props) => props.borderBottom};
    line-height: 0.1rem;
    width: ${(props) => props.width || '100%'};
  }
`;

export const LineWithText = ({ children, width = '25%', borderBottom = `1px solid ${palette.grey85}` }) => {
  return (
    <CenteredFlexRow>
      <Line width={width} borderBottom={borderBottom} />
      {children}
      <Line width={width} borderBottom={borderBottom} />
    </CenteredFlexRow>
  );
};
