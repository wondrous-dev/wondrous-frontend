import {
	TASK_STATUS_DONE,
	TASK_STATUS_IN_PROGRESS,
	TASK_STATUS_TODO,
} from '../../utils/constants'
import { groupBy, shrinkNumber } from '../../utils/helpers'
import { AvatarList } from '../Common/AvatarList'
import { DropDown, DropDownItem } from '../Common/dropdown'
import { DropDownButtonDecision } from '../DropDownDecision/DropDownButton'
import {
	DoneWithBorder,
	InProgressWithBorder,
	TodoWithBorder,
	WonderCoin,
} from '../Icons'
import ImageIcon from '../Icons/image'
import AudioIcon from '../Icons/MediaTypesIcons/audio'
import PlayIcon from '../Icons/play'
import { RewardRed } from '../Icons/reward'
import { TaskMenuIcon } from '../Icons/taskMenu'
import {
	DeliverableContainer,
	DeliverableItem,
	DeliverablesIconContainer,
	MoreOptions,
	Reward,
	RewardAmount,
	RewardContainer,
	StyledLinkIcon,
	StyledTable,
	StyledTableBody,
	StyledTableCell,
	StyledTableContainer,
	StyledTableHead,
	StyledTableRow,
	TaskDescription,
	TaskTitle,
} from './styles'

const STATUS_ICONS = {
	[TASK_STATUS_TODO]: <TodoWithBorder />,
	[TASK_STATUS_IN_PROGRESS]: <InProgressWithBorder />,
	[TASK_STATUS_DONE]: <DoneWithBorder />,
}

const DELIVERABLES_ICONS = {
	audio: <AudioIcon />,
	image: <ImageIcon />,
	link: <StyledLinkIcon />,
	video: <PlayIcon />,
}

export const Table = (props) => {
	const { tasks } = props

	return (
		<StyledTableContainer>
			<StyledTable>
				<StyledTableHead>
					<StyledTableRow>
						<StyledTableCell align="center" width="56px">
							DAO
						</StyledTableCell>
						<StyledTableCell align="center" width="105px">
							Assigned
						</StyledTableCell>
						<StyledTableCell align="center" width="77px">
							Status
						</StyledTableCell>
						<StyledTableCell width="383px">Task</StyledTableCell>
						<StyledTableCell width="190px">Deliverables</StyledTableCell>
						<StyledTableCell align="center" width="88px">
							Reward
						</StyledTableCell>
						<StyledTableCell align="center" width="80px">
							Decision
						</StyledTableCell>
						<StyledTableCell width="54px"></StyledTableCell>
					</StyledTableRow>
				</StyledTableHead>

				<StyledTableBody>
					{tasks.map((task, index) => (
						<StyledTableRow key={index}>
							<StyledTableCell align="center">
								<WonderCoin />
							</StyledTableCell>
							<StyledTableCell align="center">
								<AvatarList align="center" users={task.users} />
							</StyledTableCell>
							<StyledTableCell align="center">
								{STATUS_ICONS[task.status]}
							</StyledTableCell>
							<StyledTableCell>
								<TaskTitle>{task.title}</TaskTitle>
								<TaskDescription>{task.description}</TaskDescription>
							</StyledTableCell>
							<StyledTableCell>
								<DeliverableContainer>
									{Object.entries(groupBy(task?.media, 'type')).map(
										([key, value]: [string, any], index) => {
											return (
												<DeliverableItem key={index}>
													<DeliverablesIconContainer>
														{DELIVERABLES_ICONS[key]}
													</DeliverablesIconContainer>
													{value?.length}
												</DeliverableItem>
											)
										}
									)}
								</DeliverableContainer>
							</StyledTableCell>
							<StyledTableCell>
								<RewardContainer>
									<Reward>
										<RewardRed />
										<RewardAmount>
											{shrinkNumber(task.compensation.amount)}
										</RewardAmount>
									</Reward>
								</RewardContainer>
							</StyledTableCell>
							<StyledTableCell align="center">
								<DropDownButtonDecision />
							</StyledTableCell>
							<StyledTableCell align="center">
								<MoreOptions>
									<DropDown DropdownHandler={TaskMenuIcon} fill="#1F1F1F">
										<DropDownItem
											key={'task-menu-edit-' + task.id}
											onClick={''}
											color="#C4C4C4"
											fontSize="13px"
											fontWeight="normal"
										>
											Edit task
										</DropDownItem>
										<DropDownItem
											key={'task-menu-report-' + task.id}
											onClick={''}
											color="#C4C4C4"
											fontSize="13px"
											fontWeight="normal"
										>
											Report
										</DropDownItem>
									</DropDown>
								</MoreOptions>
							</StyledTableCell>
						</StyledTableRow>
					))}
				</StyledTableBody>
			</StyledTable>
		</StyledTableContainer>
	)
}
