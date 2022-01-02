import React from 'react'
import { useState } from 'react'
import { SIDEBAR_WIDTH } from '../../../utils/constants'
import { SideBarContext } from '../../../utils/contexts'

import Header from '../../Header'
import SideBarComponent from '../../SideBar'
import Tabs from '../tabs/tabs'

import {
	Content,
	ContentContainer,
	HeaderActivity,
	HeaderActivityLink,
	HeaderActivityLinkIcon,
	HeaderButtons,
	HeaderEditProfileButton,
	HeaderFollowers,
	HeaderFollowersAmount,
	HeaderFollowersText,
	HeaderFollowButton,
	HeaderFollowButtonIcon,
	HeaderFollowButtonText,
	HeaderFollowing,
	HeaderFollowingAmount,
	HeaderFollowingText,
	HeaderImage,
	HeaderMainBlock,
	HeaderProjects,
	HeaderProjectsAmount,
	HeaderProjectsText,
	HeaderText,
	HeaderTitle,
	OverviewComponent,
	TokenHeader,
	TokenLogo,
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
	const { children } = props
	const [minimized, setMinimized] = useState(false)
	return (
		<>
			<Header />
			<SideBarContext.Provider
				value={{
					minimized,
					setMinimized,
				}}
			>
				<SideBarComponent listItems={SIDEBAR_LIST_ITEMS} />
				<OverviewComponent
					style={{
						paddingLeft: minimized ? 0 : SIDEBAR_WIDTH,
					}}
				>
					<HeaderImage />
					<Content>
						<ContentContainer>
							<TokenHeader>
								<TokenLogo />
								<HeaderMainBlock>
									<HeaderTitle>0xAndros</HeaderTitle>
									<HeaderButtons>
										<HeaderFollowButton>
											<HeaderFollowButtonText>2,500</HeaderFollowButtonText>
											<HeaderFollowButtonIcon src="/images/overview/icon.png" />
										</HeaderFollowButton>
										<HeaderEditProfileButton>
											Edit my profile
										</HeaderEditProfileButton>
									</HeaderButtons>
								</HeaderMainBlock>
								<HeaderText>Building the future of work and play.</HeaderText>
								<HeaderActivity>
									<HeaderActivityLink href="https://andros.io">
										<HeaderActivityLinkIcon />
										andros.io
									</HeaderActivityLink>
									<HeaderFollowers>
										<HeaderFollowersAmount>201</HeaderFollowersAmount>
										<HeaderFollowersText>Followers</HeaderFollowersText>
									</HeaderFollowers>
									<HeaderFollowing>
										<HeaderFollowingAmount>201</HeaderFollowingAmount>
										<HeaderFollowingText>Following</HeaderFollowingText>
									</HeaderFollowing>
									<HeaderProjects>
										<HeaderProjectsAmount>11</HeaderProjectsAmount>
										<HeaderProjectsText>Projects</HeaderProjectsText>
									</HeaderProjects>
								</HeaderActivity>
							</TokenHeader>

							<Tabs>{children}</Tabs>
						</ContentContainer>
					</Content>
				</OverviewComponent>
			</SideBarContext.Provider>
		</>
	)
}

export default Wrapper
