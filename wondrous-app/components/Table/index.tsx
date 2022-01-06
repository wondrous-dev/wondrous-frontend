import { MoreVert } from '@material-ui/icons'
import { AvatarList } from '../Common/AvatarList'
import { TodoWithBorder } from '../Icons'
import ArrowDropDownIcon from '../Icons/arrowDropDown'
import AudioIcon from '../Icons/MediaTypesIcons/audio'
import { RewardRed } from '../Icons/reward'
import UpClickIcon from '../Icons/upClick'
import {
	DeliverableContainer,
	DeliverableItem,
	DeliverablesIconContainer,
	DropDownButton,
	MoreOptions,
	Reward,
	RewardAmount,
	RewardContainer,
	StyledTable,
	StyledTableBody,
	StyledTableCell,
	StyledTableContainer,
	StyledTableHead,
	StyledTableRow,
	TaskDescription,
	TaskTitle,
} from './styles'

export const Table = () => {
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
					<StyledTableRow>
						<StyledTableCell align="center">
							<UpClickIcon />
						</StyledTableCell>
						<StyledTableCell align="center">
							<AvatarList
							    align="center"
								users={[
									{
										name: 'UserName',
										id: '0c4db830-f31a-4d5b-8863-00612f4b2501',
										avatar: {
											id: 'c2a10d67-6046-4395-89b8-3cdb466625ed',
											isOwnerOfPod: true,
										},
									},
									{
										name: 'AnotherUser',
										id: 'bb44d5ac-b09e-4b62-9b2c-2c625250b843',
									},
									{
										name: 'AnotherUser',
										id: 'bb44d5ac-b09e-4b62-9b2c-2c625250b843',
									},
								]}
							/>
						</StyledTableCell>
						<StyledTableCell align="center">
							<TodoWithBorder />
						</StyledTableCell>
						<StyledTableCell>
							<TaskTitle>Web3 Instagram Post</TaskTitle>
							<TaskDescription>
								Design google sheet where we can get an open look at our
								twitters performance ✨🦄
							</TaskDescription>
						</StyledTableCell>
						<StyledTableCell>
							<DeliverableItem>
								<DeliverablesIconContainer>
									<AudioIcon />
								</DeliverablesIconContainer>
								3
							</DeliverableItem>
						</StyledTableCell>
						<StyledTableCell>
							<RewardContainer>
								<Reward>
									<RewardRed />
									<RewardAmount>2.5k</RewardAmount>
								</Reward>
							</RewardContainer>
						</StyledTableCell>
						<StyledTableCell align="center">
							<DropDownButton>
								{' '}
								<ArrowDropDownIcon />{' '}
							</DropDownButton>
						</StyledTableCell>
						<StyledTableCell align="center">
							<MoreOptions>
								{' '}
								<MoreVert />{' '}
							</MoreOptions>
						</StyledTableCell>
					</StyledTableRow>
					<StyledTableRow>
						<StyledTableCell align="center">
							<UpClickIcon />
						</StyledTableCell>
						<StyledTableCell align="center">
							<AvatarList
								align="center"
								users={[
									{
										name: 'AnotherUser',
										id: 'bb44d5ac-b09e-4b62-9b2c-2c625250b843',
									},
								]}
							/>
						</StyledTableCell>
						<StyledTableCell align="center">
							<TodoWithBorder />
						</StyledTableCell>
						<StyledTableCell>
							<TaskTitle>Web3 Instagram Post</TaskTitle>
							<TaskDescription>
								Design google sheet where we can get an open look at our
								twitters performance ✨🦄
							</TaskDescription>
						</StyledTableCell>
						<StyledTableCell>
							<DeliverableContainer>
								<DeliverableItem>
									<DeliverablesIconContainer>
										<AudioIcon />
									</DeliverablesIconContainer>
									3
								</DeliverableItem>
								<DeliverableItem>
									<DeliverablesIconContainer>
										<AudioIcon />
									</DeliverablesIconContainer>
									3
								</DeliverableItem>
								<DeliverableItem>
									<DeliverablesIconContainer>
										<AudioIcon />
									</DeliverablesIconContainer>
									3
								</DeliverableItem>
							</DeliverableContainer>
						</StyledTableCell>
						<StyledTableCell>
							<RewardContainer>
								<Reward>
									<RewardRed />
									<RewardAmount>2.5k</RewardAmount>
								</Reward>
							</RewardContainer>
						</StyledTableCell>
						<StyledTableCell align="center">
							<DropDownButton>
								{' '}
								<ArrowDropDownIcon />{' '}
							</DropDownButton>
						</StyledTableCell>
						<StyledTableCell align="center">
							<MoreOptions>
								{' '}
								<MoreVert />{' '}
							</MoreOptions>
						</StyledTableCell>
					</StyledTableRow>
				</StyledTableBody>
			</StyledTable>
		</StyledTableContainer>
	)
}
