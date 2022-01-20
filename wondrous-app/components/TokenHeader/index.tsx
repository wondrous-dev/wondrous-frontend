import { useState } from 'react'
import { AvatarList } from '../Common/AvatarListLarge'
import {
	AvatarContainer,
	HeaderActivity,
	HeaderActivityLink,
	HeaderActivityLinkIcon,
	HeaderButtons,
	HeaderCompletedTasks,
	HeaderCompletedTasksAmount,
	HeaderCompletedTasksText,
	HeaderEditProfileButton,
	HeaderFollowButton,
	HeaderFollowButtonIcon,
	HeaderFollowButtonText,
	HeaderMainBlock,
	HeaderMembers,
	HeaderMembersAmount,
	HeaderMembersText,
	HeaderMilestones,
	HeaderMilestonesAmount,
	HeaderMilestonesText,
	HeaderText,
	HeaderTitle,
	TokenHeader,
} from './styles'
import { InviteLinkModal } from '../Common/InviteLinkModal'

const Token = (props) => {
	const { data } = props
	const { milestones, completedTasks, members, pod } = data
	const { name, description, followers, link } = pod
	const [openInvite, setOpenInvite] = useState(false)

	return (
		<>
			<InviteLinkModal orgId="" open={openInvite} onClose={() => setOpenInvite(false)} />
			<TokenHeader>
				<AvatarContainer>
					<AvatarList users={members} />
				</AvatarContainer>
				<HeaderMainBlock>
					<HeaderTitle>{name}</HeaderTitle>
					<HeaderButtons>
						<HeaderFollowButton>
							<HeaderFollowButtonText>{followers}</HeaderFollowButtonText>
							<HeaderFollowButtonIcon src="/images/overview/icon.png" />
						</HeaderFollowButton>
						<HeaderEditProfileButton>Join Pod</HeaderEditProfileButton>
					</HeaderButtons>
				</HeaderMainBlock>
				<HeaderText>{description}</HeaderText>
				<HeaderActivity>
					<HeaderActivityLink href={link.url}>
						<HeaderActivityLinkIcon />
						{link.text}
					</HeaderActivityLink>
					<HeaderMembers>
						<HeaderMembersAmount>{members.length}</HeaderMembersAmount>
						<HeaderMembersText>Contributors</HeaderMembersText>
					</HeaderMembers>
					<HeaderMilestones>
						<HeaderMilestonesAmount>{milestones.length}</HeaderMilestonesAmount>
						<HeaderMilestonesText>Milestones</HeaderMilestonesText>
					</HeaderMilestones>
					<HeaderCompletedTasks>
						<HeaderCompletedTasksAmount>
							{completedTasks.length}
						</HeaderCompletedTasksAmount>
						<HeaderCompletedTasksText>Completed Tasks</HeaderCompletedTasksText>
					</HeaderCompletedTasks>
				</HeaderActivity>
			</TokenHeader>
		</>
	)
}

export default Token
