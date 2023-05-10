import { Grid, Typography } from "@mui/material"
import { IndexContainer, Label } from "./styles"
import TextField from "../../Shared/TextField"
import { TYPES } from "utils/constants"
import SelectComponent from "components/Shared/Select"

const TextInputStyle = {
	width: "50%"
}
const DISCORD_MESSAGE_TYPES = [
	{
		label: "Introduction",
		value: "intro"
	}
]

const DiscordChannelMessage = ({ handleOnChange, value }) => (
	<>
		<Label>Ask members to message a particular channel</Label>
		<TextField
			placeholder='Please enter the channel name without the # e.g. intros'
			value={value?.discordChannelName || ""}
			onChange={(value) => handleOnChange("discordChannelName", value)}
			multiline={false}
			style={TextInputStyle}
		/>
		<Label>Select message type</Label>
		<SelectComponent
			options={DISCORD_MESSAGE_TYPES}
			background='#C1B6F6'
			value={value?.discordMessageType}
			onChange={(value) => handleOnChange("discordMessageType", value)}
			style={{
				width: "50%"
			}}
		/>
	</>
)

const getDiscordComponent = (stepType, handleOnChange, value) => {
	if (stepType === TYPES.DISCORD_MESSAGE_IN_CHANNEL) {
		return (
			<DiscordChannelMessage handleOnChange={handleOnChange} value={value} />
		)
	}

	return null
}

const DiscordComponent = ({ onChange, value, stepType }) => {
	const handleOnChange = (key, val) => {
		onChange({
			...value,
			[key]: val
		})
	}

	return (
		<Grid
			gap='8px'
			display='flex'
			alignItems='center'
			style={{
				width: "100%"
			}}
			direction='column'
		>
			<Grid
				item
				gap='14px'
				display='flex'
				flexDirection='column'
				xs={12}
				style={{
					width: "100%"
				}}
			>
				<Label>Prompt</Label>
				<TextField
					placeholder='Enter a prompt for the user'
					value={value?.prompt || ""}
					onChange={(value) => handleOnChange("prompt", value)}
					multiline={false}
					style={{
						width: "50%"
					}}
				/>
			</Grid>
			<Grid
				item
				gap='14px'
				display='flex'
				flexDirection='column'
				xs={12}
				style={{
					width: "100%"
				}}
			>
				{getDiscordComponent(stepType, handleOnChange, value)}
			</Grid>
		</Grid>
	)
}

export default DiscordComponent
