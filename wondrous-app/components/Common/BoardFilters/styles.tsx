import styled from 'styled-components';
export const BoardFiltersWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 18px;
`;

export const BoardFiltersContainer = styled.div`
  width: 100%;
  height: 100%;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
`;

export const AppliedFiltersWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 18px;
  width: 100%;
  flex-wrap: wrap;
`;

export const AppliedFiltersItem = styled.div`
  color: white;
`;

export const Button = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 11px;
  padding: 10px 12px;
  background: #1b1b1b;
  border-radius: 6px;
  color: white;
  height: 40px;
  cursor: pointer;
  min-width: 20%;
  &.active {
    background: #4000b3;
    border: 1px solid #7427ff;
  }
`;
