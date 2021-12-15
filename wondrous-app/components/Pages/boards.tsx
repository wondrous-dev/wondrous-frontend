import React, { useState, useEffect } from 'react'
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
	let [columns, setColumns] = useState(props.columns)
	let setParentColumns = props.setColumns

	const setColumn = (columnSet) => {
		columns.filter((col) => col.id === columnSet.id)[0] = columnSet
		setColumns(columns)
	}

	useEffect(() => {
		setParentColumns(columns)
	}, [setParentColumns, columns])

	return (
		<BoardWrapper key="board-wrapper">
			{columns.map((column) => (
				<BoardColumn
					key={'board-column-' + column.id}
					column={column}
					setColumn={setColumn}
				/>
			))}
		</BoardWrapper>
	)
}
