import styled from 'styled-components';

export const KanbanBoardContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  margin-top: 32px;
`;
export const LoadMore = styled.div`
  height: 50px;
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;
