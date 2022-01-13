import styled from 'styled-components'

export const KanbanBoardContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: stretch;
	justify-content: space-between;
	margin-top: 65px;
`
export const LoadMore = styled.div`
	height: 50px;
	display: ${props => props.hasMore ? 'block' : 'none'};
` 
