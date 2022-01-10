import React from 'react'
import SearchIcon from '../../Icons/search'
import {
	SearchInput,
	SearchInputBlock,
	SearchInputIcon,
	SearchInputIconButton,
} from './styles'

const InputForm = (props) => {
	const { icon, placeholder, search, margin, style, type } = props

	return (
		<SearchInputBlock style={style} margin={margin}>
			<SearchInput
				type={type}
				placeholder={placeholder}
				startAdornment={
					<SearchInputIcon position="start">{icon}</SearchInputIcon>
				}
			/>
			{search && (
				<SearchInputIconButton>
					<SearchIcon />
				</SearchInputIconButton>
			)}
		</SearchInputBlock>
	)
}

export default InputForm
