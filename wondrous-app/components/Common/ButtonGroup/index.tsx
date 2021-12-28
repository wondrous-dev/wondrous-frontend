import * as React from 'react'
import { ButtonGroupStyled, ButtonStyled } from './styles'

export const ButtonGroup = () => {
	return (
		<ButtonGroupStyled variant="contained" aria-label="outlined primary button group">
			<ButtonStyled>List</ButtonStyled>
			<ButtonStyled>Grid</ButtonStyled>
		</ButtonGroupStyled>
	)
}
