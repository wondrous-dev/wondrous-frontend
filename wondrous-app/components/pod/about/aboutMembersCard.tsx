import { IconButton } from '@material-ui/core'
import { AvatarList } from '../../Common/AvatarList'
import RightArrowIcon from '../../Icons/rightArrow'
import {
	Card,
	CardContent,
	CardHeader,
	MembersCardFooter,
	MembersCardFooterButton,
	MembersCardName,
	MilestonesCardAuthorAvatar,
} from './styles'

const AboutMembersCard = (props) => {
	const {
		description = '',
		skills = [],
		users = [],
		name = '',
		avatar = '',
	} = props

	return (
		<Card>
			<CardHeader>
				<MilestonesCardAuthorAvatar src={avatar.src} />
				<AvatarList users={users} />
				<IconButton>
					<RightArrowIcon />
				</IconButton>
			</CardHeader>
			<MembersCardName>{name}</MembersCardName>
			<CardContent>{description}</CardContent>
			<MembersCardFooter>
				{skills.map((skill, i) => (
					<MembersCardFooterButton key={i}>{skill}</MembersCardFooterButton>
				))}
			</MembersCardFooter>
		</Card>
	)
}

export default AboutMembersCard
