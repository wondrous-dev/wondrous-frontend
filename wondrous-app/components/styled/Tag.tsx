import styled from 'styled-components';

export const Tag = styled.div`
  background-color: #353535;
  border-radius: 4px;
  padding: 2px 6px;
  color: white;
  margin: 5px 0;
  display: inline-block;
  
  &:not(:last-child) {
    margin-right: 10px;
  }
`;
