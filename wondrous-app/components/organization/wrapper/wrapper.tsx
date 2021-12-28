import React from 'react'

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
	HeaderContributeButton,
	HeaderContributors,
	HeaderContributorsAmount,
	HeaderContributorsText,
	HeaderFollowButton,
	HeaderFollowButtonIcon,
	HeaderFollowButtonText,
	HeaderImage,
	HeaderMainBlock,
	HeaderPods,
	HeaderPodsAmount,
	HeaderPodsText,
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

	return (
		<>
			<Header />
			<SideBarComponent listItems={SIDEBAR_LIST_ITEMS} />
			<OverviewComponent>
				<HeaderImage />
				<Content>
					<ContentContainer>
						<TokenHeader>
							<TokenLogo />
							<HeaderMainBlock>
								<HeaderTitle>Wonder</HeaderTitle>
								<HeaderButtons>
									<HeaderFollowButton>
										<HeaderFollowButtonText>1.2m</HeaderFollowButtonText>
										<HeaderFollowButtonIcon src="/images/overview/icon.png" />
									</HeaderFollowButton>
									<HeaderContributeButton>Contribute</HeaderContributeButton>
								</HeaderButtons>
							</HeaderMainBlock>
							<HeaderText>
								Helping DAOs manage projects with web3 native collaboration
								tools.
							</HeaderText>
							<HeaderActivity>
								<HeaderActivityLink href="https://wonderverse.xyz">
									<HeaderActivityLinkIcon />
									wonderverse.xyz
								</HeaderActivityLink>
								<HeaderContributors>
									<HeaderContributorsAmount>201</HeaderContributorsAmount>
									<HeaderContributorsText>Contributors</HeaderContributorsText>
								</HeaderContributors>
								<HeaderPods>
									<HeaderPodsAmount>11</HeaderPodsAmount>
									<HeaderPodsText>Pods</HeaderPodsText>
								</HeaderPods>
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
