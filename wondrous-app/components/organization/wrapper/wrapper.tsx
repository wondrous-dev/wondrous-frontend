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
import { useOrgBoard } from '../../../utils/hooks'
import { useQuery } from '@apollo/client'
import { GET_ORG_BY_ID } from '../../../graphql/queries/org'
import { SafeImage } from '../../Common/Image'

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
	const orgBoard = useOrgBoard()
	const [orgProfile, setOrgProfile] = useState(null)
	const { data: orgData } = useQuery(GET_ORG_BY_ID, {
		onCompleted: (data) => {
			const org = data?.getOrgById
			setOrgProfile(org)
		},
		variables: {
			orgId: orgBoard?.orgId,
		},
	})
	const [createFormModal, setCreateFormModal] = useState(false)
	const [data, setData] = useState(MOCK_ORGANIZATION_DATA)
	const { amount, contributors, pods, link, title, description } = data

	const toggleCreateFormModal = () => {
		toggleHtmlOverflow()
		setCreateFormModal((prevState) => !prevState)
	}
	const links = orgProfile?.links

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
								<SafeImage
									src={orgProfile?.profilePicture}
									style={{
										width: '96px',
										height: '96px',
										position: 'absolute',
										borderRadius: '48px',
										top: '-50px',
										border: '10px solid #0f0f0f',
									}}
								/>
								<HeaderMainBlock>
									<HeaderTitle>{orgProfile?.name}</HeaderTitle>
									<HeaderButtons>
										<HeaderFollowButton
											style={{
												visibility: 'hidden',
											}}
										>
											<HeaderFollowButtonText>
												{shrinkNumber(amount)}
											</HeaderFollowButtonText>
											<HeaderFollowButtonIcon src="/images/overview/icon.png" />
										</HeaderFollowButton>
										{/* <HeaderContributeButton>Contribute</HeaderContributeButton> */}
									</HeaderButtons>
								</HeaderMainBlock>
								<HeaderText>{orgProfile?.description}</HeaderText>
								<HeaderActivity>
									{links?.map((link) => (
										<HeaderActivityLink href={link?.url} key={link}>
											<HeaderActivityLinkIcon />
											{link?.name || link?.url}
										</HeaderActivityLink>
									))}
									<HeaderContributors>
										<HeaderContributorsAmount>
											{orgProfile?.contributorCount}
										</HeaderContributorsAmount>
										<HeaderContributorsText>
											Contributors
										</HeaderContributorsText>
									</HeaderContributors>
									<HeaderPods>
										<HeaderPodsAmount>{orgProfile?.podCount}</HeaderPodsAmount>
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
