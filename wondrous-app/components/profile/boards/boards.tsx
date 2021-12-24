import React from 'react'
import { InputAdornment } from '@material-ui/core'

import SearchIcon from '../../Icons/search'
import Wrapper from '../../profile/wrapper/wrapper'

import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard'
import { MultiSelect } from '../../Common/MultiSelect'

import { BoardsActivity, BoardsActivityInput, BoardsContainer } from './styles'

const Boards = (props) => {
	const { selectOptions, tasksList } = props

	return (
		<Wrapper>
			<BoardsContainer>
				<BoardsActivity>
					<BoardsActivityInput
						placeholder="Search people or tasks..."
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>

					<MultiSelect options={selectOptions} />
				</BoardsActivity>

				<KanbanBoard tasksList={tasksList} />
			</BoardsContainer>
		</Wrapper>
	)
}

export default Boards
