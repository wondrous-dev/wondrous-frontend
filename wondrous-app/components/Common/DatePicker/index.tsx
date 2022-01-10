import React, { useState } from 'react'
import { FormControl, TextField } from '@material-ui/core'
import {
	CreateFormInputLabel,
	CreateFormMenuItem,
	CreateFormSelect,
	CreateFormSelectArrowIcon,
	CreateFormSelectBlock,
	CreateFormSelectBlockTitle,
} from '../DropdownSelect/styles'
import { StyledDatePicker, StyledTextField } from './styles'

const MenuProps = {
	PaperProps: {
		style: {
			width: '100%',
			maxWidth: 260,
			background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
			padding: '15px',

			'*::-webkit-scrollbar': {
				width: 100,
			},
		},
	},
}

const DatePicker = (props) => {
	const { title, labelText, labelIcon, options, name, value, setValue } = props

	const handleChange = (event) => {
		setValue(event)
	}

	return (
		<CreateFormSelectBlock>
			<CreateFormSelectBlockTitle>{title}</CreateFormSelectBlockTitle>
			<FormControl>
				{!value && (
					<CreateFormInputLabel id={`select-label-${name}`} shrink={false}>
						{labelIcon}
						{labelText}
					</CreateFormInputLabel>
				)}

				<StyledDatePicker
					inputFormat="MM/dd/yyyy"
					value={value}
					onChange={handleChange}
					renderInput={(params) => <StyledTextField {...params} />}
				></StyledDatePicker>
			</FormControl>
		</CreateFormSelectBlock>
	)
}

export default DatePicker
