import React, { useState } from 'react'
import { SIDEBAR_WIDTH } from '../../../utils/constants'
import { SideBarContext } from '../../../utils/contexts'

import Header from '../../Header'
import SideBarComponent from '../../SideBar'
import Tabs from '../tabs/tabs'
import CreateFormModal from '../../CreateEntity'
import { shrinkNumber, toggleHtmlOverflow } from '../../../utils/helpers'

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

const MOCK_ORGANIZATION_DATA = {
	amount: 1234567,
	contributors: 201,
	pods: 11,
	link: 'https://wonderverse.xyz',
	title: 'Wonder',
	description:
		'Helping DAOs manage projects with web3 native collaboration tools.',
}

const Wrapper = (props) => {
	const { children } = props
	const [minimized, setMinimized] = useState(false)

	const [createFormModal, setCreateFormModal] = useState(false)
	const [data, setData] = useState(MOCK_ORGANIZATION_DATA)
	const { amount, contributors, pods, link, title, description } = data

	const toggleCreateFormModal = () => {
		toggleHtmlOverflow()
		setCreateFormModal((prevState) => !prevState)
	}

	return (
		<>
			<Header openCreateFormModal={toggleCreateFormModal} />
			<SideBarContext.Provider
				value={{
					minimized,
					setMinimized,
				}}
			>
				<SideBarComponent listItems={SIDEBAR_LIST_ITEMS} />
				<CreateFormModal
					open={createFormModal}
					toggleOpen={toggleCreateFormModal}
				/>
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
									<HeaderTitle>{title}</HeaderTitle>
									<HeaderButtons>
										<HeaderFollowButton>
											<HeaderFollowButtonText>
												{shrinkNumber(amount)}
											</HeaderFollowButtonText>
											<HeaderFollowButtonIcon src="/images/overview/icon.png" />
										</HeaderFollowButton>
										<HeaderContributeButton>Contribute</HeaderContributeButton>
									</HeaderButtons>
								</HeaderMainBlock>
								<HeaderText>{description}</HeaderText>
								<HeaderActivity>
									<HeaderActivityLink href={link}>
										<HeaderActivityLinkIcon />
										{link.replace('https://', '')}
									</HeaderActivityLink>
									<HeaderContributors>
										<HeaderContributorsAmount>
											{contributors}
										</HeaderContributorsAmount>
										<HeaderContributorsText>
											Contributors
										</HeaderContributorsText>
									</HeaderContributors>
									<HeaderPods>
										<HeaderPodsAmount>{pods}</HeaderPodsAmount>
										<HeaderPodsText>Pods</HeaderPodsText>
									</HeaderPods>
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
