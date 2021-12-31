import { IconButton } from '@material-ui/core'
import { CardHeaderCategory } from '../CardHeaderCategory'
import { AvatarList } from '../Common/AvatarList'
import { TaskCardLogo } from '../Common/KanbanBoard/TaskCard/styles'
import { TaskMedia } from '../Common/MediaPlayer'
import CommentsIcon from '../Icons/comments'
import DotsIcon from '../Icons/dots'
import LikeIcon from '../Icons/like'
import ShareIcon from '../Icons/share'
import {
    Card,
    CardHeader,
    CompletedCardFooter,
    CompletedCardFooterActivity,
    CompletedCardFooterActivityAmount,
    CompletedCardFooterActivityIconBtn,
    CompletedCardFooterBlock,
    CompletedCardText,
    CompletedCardTitle
} from './styles'

const AboutCompletedCard = (props) => {
	if (Object.keys(props).length === 0) {
		return null
	}

	const { actions, compensation, description, media, status, title, users } =
		props

	const { comments, likes, shares } = actions

	return (
		<Card>
			<CardHeader>
				<TaskCardLogo />
				<AvatarList users={users} />

				<CardHeaderCategory compensation={compensation} status={status} />
			</CardHeader>

			<CompletedCardTitle>{title}</CompletedCardTitle>

			<CompletedCardText>{description}</CompletedCardText>

			<TaskMedia media={media} />

			<CompletedCardFooter>
				<CompletedCardFooterActivity>
					<CompletedCardFooterBlock>
						<CompletedCardFooterActivityIconBtn>
							<LikeIcon />
						</CompletedCardFooterActivityIconBtn>
						<CompletedCardFooterActivityAmount>
							{likes}
						</CompletedCardFooterActivityAmount>
					</CompletedCardFooterBlock>
					<CompletedCardFooterBlock>
						<CompletedCardFooterActivityIconBtn>
							<CommentsIcon />
						</CompletedCardFooterActivityIconBtn>
						<CompletedCardFooterActivityAmount>
							{comments}
						</CompletedCardFooterActivityAmount>
					</CompletedCardFooterBlock>
					<CompletedCardFooterBlock>
						<CompletedCardFooterActivityIconBtn>
							<ShareIcon />
						</CompletedCardFooterActivityIconBtn>
						<CompletedCardFooterActivityAmount>
							{shares}
						</CompletedCardFooterActivityAmount>
					</CompletedCardFooterBlock>
				</CompletedCardFooterActivity>
				<IconButton>
					<DotsIcon />
				</IconButton>
			</CompletedCardFooter>
		</Card>
	)
}

export default AboutCompletedCard
