import React from 'react';
import styled from 'styled-components';

import BoardColumn from 'components/Common/BoardColumn';

export const BoardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-evenly;

  min-height: 56px;
  line-height: 1.1;
  color: #ffffff;
  background: transparent;

  & > *:not(:first-child) {
    margin-left: 15px;
  }

  z-index: 100;
`;

export function KanbanBoard({ board, setBoard }) {
  const { columns = [] } = board;

  const setColumn = (column) => {
    setBoard({
      ...board,
      columns: columns.map((c) => {
        if (c.id === column.id) {
          return column;
        }
        return c;
      }),
    });
  };

  return (
    <BoardWrapper key="board-wrapper">
      {columns.map((column) => (
        <BoardColumn key={`board-column-${column.id}`} column={column} setColumn={setColumn} />
      ))}
    </BoardWrapper>
  );
}
