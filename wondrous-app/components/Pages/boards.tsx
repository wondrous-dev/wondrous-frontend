import styled from 'styled-components'
import { BoardColumn } from '../Common/BoardColumn'

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
`

export const KanbanBoard = (props) => {

    return (
        <BoardWrapper key='board-wrapper'>
            {
                props.columns.map((column) => <BoardColumn key={'board-column-' + column.id} title={column.title} icon={column.icon} tasks={column.tasks} />)
            }
        </BoardWrapper>
	)
}
