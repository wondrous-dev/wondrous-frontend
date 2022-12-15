import styled from 'styled-components';

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  padding: 14px 14px 0px;
  width: 100%;
  ${({ minimized }) => (minimized ? 'visibility: hidden' : '')}
`;
