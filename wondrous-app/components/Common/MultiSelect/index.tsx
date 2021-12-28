import React, { useState } from 'react'
import { Box, Chip, OutlinedInput } from '@material-ui/core'

import FilterIcon from '../../Icons/filter'

import {
	MultiSelectClearButton,
	MultiSelectCounter,
	MultiSelectForm,
	MultiSelectInputLabel,
	MultiSelectMenuHeader,
	MultiSelectMenuItem,
	MultiSelectSelector,
} from './styles'

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: 340,
			height: '100%',
			minWidth: 325,
			background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
			padding: '15px',
		},
	},
}

export const MultiSelect = (props) => {
	const { options } = props
	const [value, setValue] = useState([])

	const handleChange = (event) => {
		const {
			target: { value },
		} = event
		setValue(
			// On autofill we get a the stringified value.
			typeof value === 'string' ? value.split(',') : value
		)
	}

	const resetValue = () => {
		setValue([])
	}

	const toggleHtmlOverflow = () => {
		const htmlTagElements = document.getElementsByTagName('html')
		const { style } = htmlTagElements.item(0)

		style.overflow = style.overflow ? '' : 'hidden'
	}

	return (
		<MultiSelectForm>
			<MultiSelectInputLabel id="demo-multiple-chip-label">
				{!value.length && (
					<>
						<FilterIcon />
						Filter
					</>
				)}
			</MultiSelectInputLabel>

			<MultiSelectSelector
				multiple
				labelId="demo-multiple-chip-label"
				id="demo-multiple-chip"
				value={value}
				onChange={handleChange}
				onClose={toggleHtmlOverflow}
				onOpen={toggleHtmlOverflow}
				input={<OutlinedInput label="Chip" />}
				renderValue={(selected) => (
					<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
						{selected.map((value) => (
							<Chip key={value} label={value} />
						))}
					</Box>
				)}
				MenuProps={MenuProps}
			>
				<MultiSelectMenuHeader onClick={(e) => e.stopPropagation()}>
					<MultiSelectCounter>{value.length} selected</MultiSelectCounter>
					<MultiSelectClearButton
						onClick={(e) => {
							e.stopPropagation()
							resetValue()
						}}
					>
						Clear
					</MultiSelectClearButton>
				</MultiSelectMenuHeader>
				{options.map((name) => (
					<MultiSelectMenuItem key={name} value={name}>
						{name}
					</MultiSelectMenuItem>
				))}
			</MultiSelectSelector>
		</MultiSelectForm>
	)
}
