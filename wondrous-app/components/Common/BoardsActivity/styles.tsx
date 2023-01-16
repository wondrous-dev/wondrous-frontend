import styled from 'styled-components';
import { BoardFiltersContainer } from 'components/Common/BoardFilters/styles';

export const BoardsActivityInlineViewWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 18px;
  height: 34px;

  ${BoardFiltersContainer} {
    width: ${({ displaySingleViewFilter }) => (displaySingleViewFilter ? 'auto' : '100%')};
  }
`;
