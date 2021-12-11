import styled from 'styled-components'
import { Task } from '../Common/Task'
import { Grey400 } from '../../theme/colors'

export const BoardWrapper = styled.div`
    display: flex;
	flex-direction: row;
	align-items: flex-start;
    flex-wrap: nowrap;
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

export const BoardColumnWrapper = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;

    font-weight: bold;

    min-width: 200px; 
`

export const BoardColumnTitle = styled.h3 `
    width: 100%;
    display: flex;
    line-height: 24px;
    font-size: 18px;
    font-weight: 400;
    text-align: left;
    padding-left: 15px;
    vertical-align: middle;
`

export const IconWrapper = styled.div `
    display: flex;
    width: 24px;
    line-height: 24px;
    margin-right: 10px;
`

export const BoardColumnHeader = ({ title, icon, count }) => {
    
    const Icon = icon
    const iconStyle = {
        height: '24px',
        width: '24px',
        borderRadius: '24px',
        border: '1px solid ' + Grey400,
        padding: '3px'
    }

    return (
        <BoardColumnTitle>
            <IconWrapper>
                <Icon style={iconStyle} />
            </IconWrapper>
            <span style={{ display: 'flex', fontWeight: 'bold' }}> {title} {count} </span>
        </BoardColumnTitle>
    )
}

export const BoardColumn = (props) => {

    const count = props.tasks.length;

    return (
        <BoardColumnWrapper key={props.title + '-wrapper'}>
            <BoardColumnHeader title={props.title} icon={props.icon} count={count} />
            <div id={props.title + '-task-list'}>
            {
                props.tasks.map((task) => <Task key={task.id} task={task} />)
            }
            </div>
        </BoardColumnWrapper>
    )
}

export const KanbanBoard = (props) => {

    return (
        <BoardWrapper key='board-wrapper'>
            {
                props.columns.map((column) => <BoardColumn key={column.title} title={column.title} icon={column.icon} tasks={column.tasks} />)
            }
        </BoardWrapper>
	)
}
