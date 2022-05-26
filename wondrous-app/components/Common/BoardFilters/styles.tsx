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
