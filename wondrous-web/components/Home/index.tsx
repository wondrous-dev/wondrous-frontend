import React, { useState, useCallback, useEffect } from 'react'
import Trackable from '../Trackable'
import SmartLink from '../SmartLink'
import Head from 'next/head'
import { Modal } from '@material-ui/core'
import Link from 'next/link'
import {
	HeaderContainer,
	ContentDiv,
	Title,
	HomeSubtext,
	HomeButton,
	HomeButtonText,
	EmphasisSpan,
	Block2Container,
	FeatureDiv,
	FeatureBlock,
	FeatureImg,
	FeatureHeader,
	FeatureText,
	FeatureBlockInner,
	Block2Header,
	Block2TextDiv,
	CollaborativeImg,
	Block3Container,
	Block3Header,
	Block3LeftSideGraphic,
	Block4Container,
	GetFreeTokensDiv,
	GetFreeTokensHeader,
	TokenText,
	WonderToken,
	FreeTokenButton,
	JoinDiscordBox,
	DiscordLogo,
	JoinDiscordText,
	JoinDiscordButton,
	BackgroundContainer,
} from './styles'
import { useIsMobile } from '../../utils/hooks'
import HomeNavBar from '../Navbar/Home'
import Footer from '../Footer'
import styled from 'styled-components'
import { useMe, withWaitlistAuth } from '../Auth/withAuth'
import { useRouter } from 'next/router'

const StyledModal = styled(Modal)`
	display: flex;
	justify-content: center;
	align-items: center;
`

const Home = () => {
	const isMobile = useIsMobile()
	const user = useMe()
	const router = useRouter()
	useEffect(() => {
		if (user) {
			// Redirect to unique link page
			if (router.query?.redirect !== 'false') {
				router.push('/waitlist/profile')
			}
		}
	}, [user, router])

	const getToWaitlist = useCallback(() => {
		const ref = router.query?.ref
		if (user) {
			router.push('/waitlist/profile')
		} else {
			if (ref) {
				router.push(`/waitlist/signup?ref=${ref}`)
			} else {
				router.push('/waitlist/signup')
			}
		}
	}, [router, user])

	return (
		<BackgroundContainer>
			<HeaderContainer>
				<Head>
					<meta
						property="twitter:image"
						content="https://wonderverse.xyz/images/twitter-meta.png"
					/>
					<meta property="twitter:site" content="@wonderversexyz" />
					<meta property="twitter:title" content="Welcome to Wonder" />
					<meta
						property="og:description"
						content="Manage your projects and earn tokens while you build!"
					/>
					<meta
						property="og:image"
						content="https://wonderverse.xyz/images/twitter-meta.png"
					/>
					<meta property="og:title" content="Welcome to Wonder" />
				</Head>

				<ContentDiv>
					<Title variant="h1">
						Launch and scale projects with the power of web3
					</Title>
					<HomeSubtext>
						Wonder’s intuitive task management system allows DAOs and teams to
						organize projects, pay contributors, and collaborate in{' '}
						<EmphasisSpan> our project metaverse.</EmphasisSpan>
					</HomeSubtext>
					<HomeButton onClick={getToWaitlist}>
						<HomeButtonText>Enter the Wonderverse</HomeButtonText>
					</HomeButton>
					<HomeNavBar />
				</ContentDiv>
			</HeaderContainer>
			<Block2Container>
				<FeatureDiv container spacing={4}>
					<FeatureBlock item lg={3} md={6} xs={12}>
						<FeatureBlockInner>
							<FeatureImg src="/images/homepage/features/task-management.png" />
							<FeatureHeader>Task management</FeatureHeader>
							<FeatureText>
								Our intuitive system configures task workflows, permissioning
								and coordination transparently across teams
							</FeatureText>
						</FeatureBlockInner>
					</FeatureBlock>
					<FeatureBlock item lg={3} md={6} xs={12}>
						<FeatureBlockInner>
							<FeatureImg src="images/homepage/features/payment-for-members.png" />
							<FeatureHeader>Payment for members</FeatureHeader>
							<FeatureText>
								Compensate members as they complete tasks and milestones with
								any currency or social token
							</FeatureText>
						</FeatureBlockInner>
					</FeatureBlock>
					<FeatureBlock item lg={3} md={6} xs={12}>
						<FeatureBlockInner>
							<FeatureImg src="images/homepage/features/optimizing-productivity.png" />
							<FeatureHeader>Optimize productivity</FeatureHeader>
							<FeatureText>
								Use our analytics dashboard to track/improve performance for
								teams and contributors
							</FeatureText>
						</FeatureBlockInner>
					</FeatureBlock>
					<FeatureBlock item lg={3} md={6} xs={12}>
						<FeatureBlockInner>
							<FeatureImg src="images/homepage/features/community-engagement.png" />
							<FeatureHeader>Community engagement</FeatureHeader>
							<FeatureText>
								Understand your contributors through their profiles and onboard
								new members by building in public
							</FeatureText>
						</FeatureBlockInner>
					</FeatureBlock>
				</FeatureDiv>
				<Block2Header>The future is collaborative</Block2Header>
				<Block2TextDiv>
					<FeatureText>
						Business isn’t as usual. Cooperation is a better strategy than
						competing. DAOs have proven that shared incentives drive radical
						collaboration.
					</FeatureText>
					<br />
					<FeatureText>
						Our project collaboration infrastructure facilitates powerful
						network effects for DAOs and gives these shared advantages to
						startups and builders.
					</FeatureText>
				</Block2TextDiv>
				<CollaborativeImg src="/images/homepage/collaborative-future.png" />
				<Block2Header>What is the project metaverse?</Block2Header>
				<Block2TextDiv>
					<FeatureText>
						Our project metaverse is an all-in-one platform that empowers people
						to launch and scale projects with ease.
					</FeatureText>
					<br />
					<FeatureText>
						Build a following, pay/get paid in any currency or token,
						intuitively manage DAOs, and collaborate on a universe of projects.
					</FeatureText>
				</Block2TextDiv>
			</Block2Container>
			<Block3Container>
				<Block3LeftSideGraphic src="/images/homepage/left-side-graphic.png" />
				<Block3Header>Making an impact should be simple</Block3Header>
				<FeatureText>
					DAOs are taking over the world, and we’re helping.
				</FeatureText>
				<br />
				<FeatureText>
					We’re building the easiest way to <br />
					launch and scale world changing projects.
				</FeatureText>
			</Block3Container>
			<Block4Container>
				<GetFreeTokensDiv>
					<GetFreeTokensHeader>
						Launch that Big idea already. <br />
						Get <TokenText>10 $WONDER</TokenText> tokens for free.
					</GetFreeTokensHeader>
					<WonderToken src="/images/wonder-token.svg" />
					<FeatureText>
						Sign up and get 10 $WONDER tokens for free on launch.
					</FeatureText>

					<FreeTokenButton onClick={getToWaitlist}>
						<HomeButtonText>
							Get <TokenText>10 $WONDER</TokenText> Free
						</HomeButtonText>
					</FreeTokenButton>
				</GetFreeTokensDiv>
				<JoinDiscordBox>
					<DiscordLogo src="/images/discord-logo.png" />
					<JoinDiscordText>Let&apos;s collaborate</JoinDiscordText>
					<FeatureText>
						Join our Discord to network, share your ideas, and help form a
						vibrant community hellbent on making a dent in the universe.
					</FeatureText>
					<JoinDiscordButton
						href="https://discord.gg/vUnfjnZADH"
						target="_blank"
					>
						<HomeButtonText>Join our Discord here</HomeButtonText>
					</JoinDiscordButton>
				</JoinDiscordBox>
			</Block4Container>
			<Footer />
		</BackgroundContainer>
	)
}

export default withWaitlistAuth(Home)
