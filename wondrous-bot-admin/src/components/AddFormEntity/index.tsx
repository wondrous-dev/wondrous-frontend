import { Grid, Typography } from "@mui/material"
import PanelComponent from "components/CreateTemplate/PanelComponent"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import { Header } from "./styles"
import SelectComponent from "components/Shared/Select"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { ButtonIconWrapper } from "components/Shared/styles"
import { DragDropContext, Draggable } from "react-beautiful-dnd"

import DeleteIcon from "components/Icons/Delete"
import StrictModeDroppable from "components/StrictModeDroppable"
import { CONFIG_COMPONENTS, RESPOND_TYPES, TYPES } from "utils/constants"
import TypeComponent from "./components/TypeComponent"

const MULTICHOICE_DEFAULT_VALUE = {
	question: "",
	withCorrectAnswers: false,
	multiSelectValue: TYPES.MULTI_QUIZ,
	answers: []
}

const COMPONENT_OPTIONS = [
	{
		label: "Text",
		value: TYPES.TEXT_FIELD
	},
	{
		label: "Multiple Choice",
		value: TYPES.MULTI_QUIZ
	},
	{
		label: "Number",
		value: TYPES.NUMBER
	},
	{
		label: "Attachments",
		value: TYPES.ATTACHMENTS
	},
	{
		label: "Like a tweet",
		value: TYPES.LIKE_TWEET
	},
	{
		label: "Follow a twitter account",
		value: TYPES.FOLLOW_TWITTER
	},
	{
		label: "Reply to a tweet",
		value: TYPES.REPLY_TWEET
	},
	{
		label: "Retweet a tweet",
		value: TYPES.RETWEET
	},
	{
		label: "Vote on Snapshot proposal",
		value: TYPES.SNAPSHOT_PROPOSAL_VOTE
	},
	{
		label: "Vote on Snapshot space",
		value: TYPES.SNAPSHOT_SPACE_VOTE
	},
	{
		label: "Send a message in Discord channel",
		value: TYPES.DISCORD_MESSAGE_IN_CHANNEL
	},
	{
		label: "Join Discord community call",
		value: TYPES.JOIN_DISCORD_COMMUNITY_CALL
	}
]

const AddFormEntity = ({ configuration, setConfiguration, handleRemove }) => {
	const handleDragEnd = (result) => {
		if (!result.destination) return

		const reorderedItems = Array.from(configuration)
		const [removed] = reorderedItems.splice(result.source.index, 1)
		reorderedItems.splice(result.destination.index, 0, removed)

		setConfiguration(reorderedItems)
	}

	const handleChangeType = (type, id) => {
		if (!type) return

		const newConfiguration = configuration.reduce((acc, next) => {
			if (next.id === id) {
				acc = [
					...acc,
					{
						type,
						id,
						value: type === TYPES.MULTI_QUIZ ? MULTICHOICE_DEFAULT_VALUE : ""
					}
				]
				return acc
			}
			acc.push(next)
			return acc
		}, [])
		setConfiguration(newConfiguration)
	}

	const handleChange = (value, id) => {
		const newConfiguration = configuration.reduce((acc, next) => {
			if (next.id === id) {
				acc = [
					...acc,
					{
						...next,
						value
					}
				]
				return acc
			}
			acc.push(next)
			return acc
		}, [])
		setConfiguration(newConfiguration)
	}

	return (
		<Grid
			display='flex'
			gap='24px'
			flexDirection='column'
			alignItems='flex-start'
			justifyContent='flex-start'
			width='100%'
		>
			<Typography
				fontFamily='Poppins'
				fontWeight={600}
				fontSize='18px'
				lineHeight='24px'
				color='black'
			>
				{configuration?.length} Quest Steps
			</Typography>
			<DragDropContext onDragEnd={handleDragEnd}>
				<StrictModeDroppable droppableId='droppableId'>
					{(provided) => (
						<Grid
							display='flex'
							flexDirection='column'
							justifyContent='center'
							gap='24px'
							alignItems='center'
							width='100%'
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{configuration?.map((item, idx) => {
								const Component = CONFIG_COMPONENTS[item.type]
								if (!Component) return null
								return (
									<Draggable key={idx} draggableId={`${idx}`} index={idx}>
										{(provided, snapshot) => (
											<Grid
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												ref={provided.innerRef}
												width='100%'
												isDragging={snapshot.isDragging}
											>
												<PanelComponent
													renderHeader={() => (
														<Header
															display='flex'
															justifyContent='space-between'
															alignItems='center'
														>
															<Grid
																display='flex'
																gap='18px'
																alignItems='center'
															>
																<DragIndicatorIcon
																	sx={{
																		color: "#2A8D5C"
																	}}
																/>
																<Typography
																	color='#2A8D5C'
																	fontFamily='Poppins'
																	fontWeight={700}
																	fontSize='12px'
																	lineHeight='14px'
																	whiteSpace='nowrap'
																>
																	Step {idx + 1}
																</Typography>
																<SelectComponent
																	options={COMPONENT_OPTIONS}
																	background='#C1B6F6'
																	value={item.type}
																	onChange={(value) =>
																		handleChangeType(value, item.id)
																	}
																/>
															</Grid>
															<Grid
																display='flex'
																alignItems='center'
																gap='14px'
															>
																<ButtonIconWrapper
																	onClick={() => handleRemove(idx)}
																>
																	<DeleteIcon />
																</ButtonIconWrapper>
																<ButtonIconWrapper>
																	<MoreVertIcon
																		sx={{
																			color: "black",
																			fontSize: "17px"
																		}}
																	/>
																</ButtonIconWrapper>
															</Grid>
														</Header>
													)}
													renderBody={() => (
														<>
															<Component
																onChange={(value) =>
																	handleChange(value, item.id)
																}
																value={item.value}
																stepType={item.type}
															/>
															{RESPOND_TYPES[item.type] ? (
																<TypeComponent
																	respondType={RESPOND_TYPES[item.type]}
																/>
															) : null}
														</>
													)}
												/>
											</Grid>
										)}
									</Draggable>
								)
							})}
						</Grid>
					)}
				</StrictModeDroppable>
			</DragDropContext>
		</Grid>
	)
}

export default AddFormEntity
