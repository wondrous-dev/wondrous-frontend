import { useState } from 'react'
import { ButtonGroupStyled, ButtonStyled } from './styles'

export const ButtonGroup = (props) => {
	const { selected, setSelected } = props

	const buttons = ['List', 'Grid']

	return (
		<ButtonGroupStyled>
			{buttons.map((button, index) => (
				<ButtonStyled
					key={index}
					onClick={() => setSelected(index)}
					variant={selected === index ? 'contained' : 'outlined'}
				>
					{button}
				</ButtonStyled>
			))}
		</ButtonGroupStyled>
	)
}
