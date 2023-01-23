import styled from 'styled-components';
import { BoardFiltersContainer } from 'components/Common/BoardFilters/styles';

export const BoardsActivityInlineViewWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 18px;
  min-height: 34px;
  flex-wrap: ${props => props.withAdminToggle ? 'wrap' : 'nowrap'};

  ${BoardFiltersContainer} {
    width: ${({ displaySingleViewFilter }) => (displaySingleViewFilter ? 'auto' : '100%')};
  }
`;
