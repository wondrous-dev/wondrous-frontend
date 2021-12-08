import React from 'react'
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
	TokenLogo
} from './styles'
import { TabsActivity } from './tabs'

const Overview = () => {

	return (
		<OverviewComponent>
			<HeaderImage />
			<Content>
				<ContentContainer>
					<TokenHeader>
						<TokenLogo src='/images/overview/logo.png'/>
						<HeaderMainBlock>
							<HeaderTitle>
								Wonder
							</HeaderTitle>
							<HeaderButtons>
								<HeaderFollowButton>
									<HeaderFollowButtonText>
										1.2m
									</HeaderFollowButtonText>
									<HeaderFollowButtonIcon src='/images/overview/icon.png' />
								</HeaderFollowButton>
								<HeaderContributeButton>Contribute</HeaderContributeButton>
							</HeaderButtons>
						</HeaderMainBlock>
						<HeaderText>
							Helping DAOs manage projects with web3 native collaboration tools.
						</HeaderText>
						<HeaderActivity>
							<HeaderActivityLink href='https://wonderverse.xyz'>
								<HeaderActivityLinkIcon src='/images/overview/linkIcon.png'/>
								wonderverse.xyz
							</HeaderActivityLink>
							<HeaderContributors>
								<HeaderContributorsAmount>
									201
								</HeaderContributorsAmount>
								<HeaderContributorsText>
									Contributors
								</HeaderContributorsText>
							</HeaderContributors>
							<HeaderPods>
								<HeaderPodsAmount>
									11
								</HeaderPodsAmount>
								<HeaderPodsText>
									Pods
								</HeaderPodsText>
							</HeaderPods>
						</HeaderActivity>
					</TokenHeader>
					<TabsActivity />
				</ContentContainer>
			</Content>
		</OverviewComponent>
	)
}

export default Overview;