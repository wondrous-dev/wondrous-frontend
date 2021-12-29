import { useState } from 'react'
import { ButtonGroupStyled, ButtonStyled } from './styles'

export const ButtonGroup = () => {
	const [selected, setSelected] = useState(0)

	const handleClick = (index) => {
		setSelected(index)
	}

	const buttons = ['List', 'Grid']

	return (
		<ButtonGroupStyled>
			{buttons.map((button, index) => (
				<ButtonStyled
					key={index}
					onClick={() => handleClick(index)}
					variant={selected === index ? 'contained' : 'outlined'}
				>
					{button}
				</ButtonStyled>
			))}
		</ButtonGroupStyled>
	)
}
