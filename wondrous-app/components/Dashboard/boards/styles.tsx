import styled from 'styled-components';

export const FilterItemOrgIcon = styled.div`
  display: flex;
  align-items: center;
  margin-left: -10px;
`;

export const DashboardPanelWrapper = styled.div`
  margin-top: -140px;
  width: 100%;
`;

export const Wrapper = styled.div`
  width: 95%;
  margin: 0 auto;
  margin-top: 30px;
`;

export const BoardsActivityWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 20px;
  align-items: center;
  margin-bottom: 20px;
  && {
    grid-template-columns: 1fr;
    .FiltersTrigger-button {
      min-width: unset;
    }
    .MuiAutocomplete-root {
      flex: 1;
    }
  }
`;
