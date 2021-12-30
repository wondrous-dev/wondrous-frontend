import Header from '../../Header'
import SideBarComponent from '../../SideBar'
import { AvatarList } from '../avatar'
import Tabs from '../tabs/tabs'
import {
	AvatarContainer,
	Content,
	ContentContainer,
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
	HeaderImage,
	HeaderMainBlock,
	HeaderMembers,
	HeaderMembersAmount,
	HeaderMembersText,
	HeaderMilestones,
	HeaderMilestonesAmount,
	HeaderMilestonesText,
	HeaderText,
	HeaderTitle,
	OverviewComponent,
	TokenHeader,
} from './styles'

const SIDEBAR_LIST_ITEMS = [
	{
		id: 1,
		icon: '/images/sidebar/first.png',
		path: '/',
	},
	{
		id: 2,
		icon: '/images/sidebar/second.png',
		path: '/',
	},
	{
		id: 3,
		icon: '/images/sidebar/third.png',
		path: '/',
	},
]

const Wrapper = (props) => {
	const { children, pod, members, milestones, completedTasks } = props
	const { name, description, followers, link } = pod

	return (
		<>
			<Header />
			<SideBarComponent listItems={SIDEBAR_LIST_ITEMS} />
			<OverviewComponent>
				<HeaderImage />
				<Content>
					<ContentContainer>
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
									<HeaderMilestonesAmount>
										{milestones.length}
									</HeaderMilestonesAmount>
									<HeaderMilestonesText>Milestones</HeaderMilestonesText>
								</HeaderMilestones>
								<HeaderCompletedTasks>
									<HeaderCompletedTasksAmount>
										{completedTasks.length}
									</HeaderCompletedTasksAmount>
									<HeaderCompletedTasksText>
										Completed Tasks
									</HeaderCompletedTasksText>
								</HeaderCompletedTasks>
							</HeaderActivity>
						</TokenHeader>

						<Tabs>{children}</Tabs>
					</ContentContainer>
				</Content>
			</OverviewComponent>
		</>
	)
}

export default Wrapper
