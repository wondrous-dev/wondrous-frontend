import styled from 'styled-components';

export const PaginationDotContainer = styled.button`
  width: 8px;
  height: 8px;
  cursor: pointer;
  border: 1px solid #7a7a7a;
  background: none;
  padding: 0px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    border-radius: 50%;
    width: 6px;
    height: 6px;
    background-color: ${({ active }) => (active ? '#ffffff' : 'none')};
  }
`;
