import { Grid, Typography } from "@mui/material"
import { IndexContainer, Label } from "./styles"
import TextField from "../../Shared/TextField"
import { TYPES } from "utils/constants"

const TextInputStyle = {
	width: "50%"
}
const SnapshotProposalText = ({ handleOnChange, value,error }) => (
	<>
		<Label>Vote on this Snapshot proposal</Label>
		<TextField
			placeholder='Please enter Snapshot proposal link'
			value={value?.snapshotProposalLink || ""}
			onChange={(value) => handleOnChange("snapshotProposalLink", value)}
			multiline={false}
			error={error}
			style={TextInputStyle}
		/>
	</>
)

const SnapshotSpaceText = ({ handleOnChange, value, errors }) => (
	<>
		<Label>Vote on in our Snapshot Space at least X times</Label>
		<TextField
			placeholder='Please enter Snapshot space link'
			value={value?.snapshotSpaceLink || ""}
			onChange={(value) => handleOnChange("snapshotSpaceLink", value)}
			multiline={false}
			error={errors?.snapshotSpaceLink}
			style={TextInputStyle}
		/>
		<TextField
			placeholder='Please enter the number of times to vote'
			value={value?.snapshotVoteTimes}
			error={errors?.snapshotVoteTimes}
			onChange={(value) => handleOnChange("snapshotVoteTimes", value)}
			multiline={false}
			style={TextInputStyle}
			type='number'
		/>
	</>
)

const getSnapshotComponent = (stepType, handleOnChange, value, error) => {
	if (stepType === TYPES.SNAPSHOT_PROPOSAL_VOTE) {
		return (
			<SnapshotProposalText handleOnChange={handleOnChange} value={value} error={error?.snapshotProposalLink}/>
		)
	}
	if (stepType === TYPES.SNAPSHOT_SPACE_VOTE) {
		return <SnapshotSpaceText handleOnChange={handleOnChange} value={value} errors={error}/>
	}

	return null
}

const SnapshotComponent = ({ onChange, value, stepType, error }) => {
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
					error={error?.prompt}
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
				{getSnapshotComponent(stepType, handleOnChange, value, error?.additionalData)}
			</Grid>
		</Grid>
	)
}

export default SnapshotComponent
