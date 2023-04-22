import styled from 'styled-components';

export const Main = styled.main`
  padding-top: ${({ $isPageWithoutHeader }) =>
    $isPageWithoutHeader ? '0' : '82px'};
`;
