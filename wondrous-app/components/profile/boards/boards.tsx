import React from 'react'
import { InputAdornment } from '@material-ui/core'

import SearchIcon from '../../Icons/search'
import Wrapper from '../wrapper/wrapper'

import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard'
import { MultiSelect } from '../../Common/MultiSelect'
import { ButtonGroup } from '../../Common/ButtonGroup'

import { BoardsActivity, BoardsActivityInput, BoardsContainer } from './styles'

import { Table } from '../../Table'

const Boards = (props) => {
	const { selectOptions, columns } = props
	const [selected, setSelected] = React.useState(0)

	return (
		<Wrapper>
			<BoardsContainer>
				<BoardsActivity>
					<BoardsActivityInput
						placeholder="Search people or pods..."
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>

					<MultiSelect options={selectOptions} />

					<ButtonGroup
						selected={selected}
						setSelected={setSelected}
					></ButtonGroup>
				</BoardsActivity>
				{selected === 0 && <Table />}
				{selected === 1 && <KanbanBoard columns={columns} />}
			</BoardsContainer>
		</Wrapper>
	)
}

export default Boards
