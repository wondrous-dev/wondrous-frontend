import { Grid, Typography } from "@mui/material"
import { IndexContainer, Label } from "./styles"
import TextField from "../../Shared/TextField"
import { TYPES } from "utils/constants"

const TextInputStyle = {
	width: "50%"
}
const TwitterLikeText = ({ handleOnChange, value }) => (
	<>
		<Label>Like this tweet</Label>
		<TextField
			placeholder='Please enter the tweet link'
			value={value?.tweetLink || ""}
			onChange={(value) => handleOnChange("tweetLink", value)}
			multiline={false}
			style={TextInputStyle}
		/>
	</>
)

const TwitterRetweetText = ({ handleOnChange, value }) => (
	<>
		<Label>Retweet this tweet</Label>
		<TextField
			placeholder='Please enter the tweet link'
			value={value?.tweetLink || ""}
			onChange={(value) => handleOnChange("tweetLink", value)}
			multiline={false}
			style={TextInputStyle}
		/>
	</>
)

const TwitterReplyText = ({ handleOnChange, value }) => (
	<>
		<Label>Reply to this tweet</Label>
		<TextField
			placeholder='Please enter the tweet link'
			value={value?.tweetLink || ""}
			onChange={(value) => handleOnChange("tweetLink", value)}
			multiline={false}
			style={TextInputStyle}
		/>
	</>
)

const TwitterFollowText = ({ handleOnChange, value }) => (
	<>
		<Label>Follow this Twitter account</Label>
		<TextField
			placeholder='Please enter the twitter handle to follow e.g. wonderverse_xyz'
			value={value?.tweetHandle}
			onChange={(value) => handleOnChange("tweetHandle", value)}
			multiline={false}
			style={{
				...TextInputStyle,
				width: "55%"
			}}
		/>
	</>
)

const TweetWithPhraseText = ({ handleOnChange, value }) => (
	<>
		<Label>Tweet with this hashtag, mention, or phrase!</Label>
		<TextField
			placeholder='Please enter the a phrase: e.g. #wonderverse, @wonderverse_xyz or Wonderverse'
			value={value?.tweetPhrase || ""}
			onChange={(value) => handleOnChange("tweetPhrase", value)}
			multiline={false}
			style={{
				...TextInputStyle,
				width: "70%"
			}}
		/>
	</>
)

const getTwitterComponent = (stepType, handleOnChange, value) => {
	if (stepType === TYPES.LIKE_TWEET)
		return <TwitterLikeText handleOnChange={handleOnChange} value={value} />
	if (stepType === TYPES.RETWEET)
		return <TwitterRetweetText handleOnChange={handleOnChange} value={value} />
	if (stepType === TYPES.REPLY_TWEET)
		return <TwitterReplyText handleOnChange={handleOnChange} value={value} />
	if (stepType === TYPES.FOLLOW_TWITTER)
		return <TwitterFollowText handleOnChange={handleOnChange} value={value} />
	if (stepType === TYPES.TWEET_WITH_PHRASE)
		return <TweetWithPhraseText handleOnChange={handleOnChange} value={value} />

	return null
}

const TwitterComponent = ({ onChange, value, stepType }) => {
	const handleOnChange = (key, val) => {
		onChange({
			...value,
			[key]: val
		})
	}
	const getTextWidth = (stepType) => {
		if (stepType === TYPES.TWEET_WITH_PHRASE) return "70%"
		if (stepType === TYPES.FOLLOW_TWITTER) return "55%"
		return "50%"
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
						width: getTextWidth(stepType)
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
				{getTwitterComponent(stepType, handleOnChange, value)}
			</Grid>
		</Grid>
	)
}

export default TwitterComponent
