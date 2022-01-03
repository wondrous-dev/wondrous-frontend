import { IconButton } from '@material-ui/core'
import RightArrowIcon from '../Icons/rightArrow'
import {
    Card,
    CardContent,
    CardHeader,
    CardHeaderName,
    MilestonesCardAuthor,
    MilestonesCardAuthorAvatar,
    MilestonesCardAuthorPosition,
    MilestonesCardHeaderWonderIcon
} from './styles'

const ICONS = {
	wonder: MilestonesCardHeaderWonderIcon,
}

const AboutMilestonesCard = (props) => {
	const { icon, title, description, position, avatar } = props

	const Icon = ICONS[icon]

	return (
		<Card>
			<CardHeader>
				<Icon />

				<CardHeaderName>{title}</CardHeaderName>
				<IconButton>
					<RightArrowIcon />
				</IconButton>
			</CardHeader>
			<CardContent>{description}</CardContent>
			<MilestonesCardAuthor>
				<MilestonesCardAuthorAvatar src={avatar} />
				<MilestonesCardAuthorPosition>{position}</MilestonesCardAuthorPosition>
			</MilestonesCardAuthor>
		</Card>
	)
}

export default AboutMilestonesCard
