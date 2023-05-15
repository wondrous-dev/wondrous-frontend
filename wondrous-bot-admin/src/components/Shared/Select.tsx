import { Box, MenuItem } from "@mui/material"

import { ErrorText, StyledTextFieldSelect } from "./styles"
const SelectComponent = ({
	onChange,
	placeholder = "Select",
	value,
	options = [],
	background = null,
	style = {},
	error = null
}) => {
	const handleChange = (e) => onChange(e.target.value)

	return (
		<Box>
			<StyledTextFieldSelect
			select
			defaultValue=''
			value={value}
			style={style}
			placeholder={placeholder}
			background={background}
			onChange={handleChange}
			SelectProps={{
				displayEmpty: true,
				renderValue: (selected) => {
					const selectedOption = options?.find(
						(option) => option.value === selected
					)
					return selectedOption ? selectedOption.label : "Select"
				},
				MenuProps: {
					sx: {
						".MuiPaper-root": {
							backgroundColor: "#E8E8E8",
							borderRadius: "6px"
						}
					}
				}
			}}
		>
			{options?.map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))}
		</StyledTextFieldSelect>
		{error ? <ErrorText>{error}</ErrorText> : null}
		</Box>
	)
}

export default SelectComponent
