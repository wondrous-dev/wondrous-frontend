import React from 'react';
import { InputAdornment} from '@material-ui/core'

import SearchIcon from '../../Icons/search'
import Wrapper from '../wrapper/wrapper'

import KanbanBoard from "../../Common/KanbanBoard/kanbanBoard";

import {
	BoardsActivity,
	BoardsActivityInput,
	BoardsContainer,
} from './styles'
import { MultiSelect } from '../../Common/MultiSelect'

const selectOptions = [
	'#copywriting (23)',
	'#growth (23)',
	'#design (23)',
	'#community (11)',
	'#analytics (23)',
	'#sales (23)',
	'#tiktok (13)',
	'#design (23)',
	'#community (11)',
	'#analytics (23)',
];

const Boards = () => {

	return (
		<Wrapper>
			<BoardsContainer>
				<BoardsActivity>
					<BoardsActivityInput
						placeholder='Search people or tasks...'
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>

					<MultiSelect
						options={selectOptions}
					/>

				</BoardsActivity>

				<KanbanBoard />

			</BoardsContainer>
		</Wrapper>
	);
}

export default Boards