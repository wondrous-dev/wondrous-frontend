import React, { useState, useCallback, useEffect } from 'react'
import Trackable from '../Trackable'
import SmartLink from '../SmartLink'
import Image from 'next/image'
import Head from 'next/head'
import { Modal } from '@material-ui/core'
import JoinWaitList from '../Waitlist'
import {
	HeaderContainer,
	RightImage,
	ContentDiv,
	Title,
	HomeSubtext,
	FunkyText,
	HomeButton,
	HomeButtonText,
	Blob1,
	EmphasisSpan,
} from './styles'
import { useIsMobile } from '../../utils/hooks'
import HomeNavBar from '../Navbar/Home'
import styled from 'styled-components'
import { useMe, withWaitlistAuth } from '../Auth/withAuth'
import { useRouter } from 'next/router'
const StyledModal = styled(Modal)`
	display: flex;
	justify-content: center;
	align-items: center;
`

const Home = () => {
	const [showJoinWaitList, setShowJoinWaitList] = useState(false)

	const isMobile = useIsMobile()
	const user = useMe()
	const router = useRouter()
	useEffect(() => {
		if (user) {
			// Redirect to unique link page
			router.push('/waitlist/profile')
		}
	}, [user, router])

	return (
		<>
			<HeaderContainer>
				<Head>
					<meta
						property="twitter:image"
						content="https://wonderverse.xyz/images/twitter-meta.png"
					/>
					<meta property="twitter:site" content="@wonderversexyz" />
					<meta property="twitter:title" content="Wonder Waitlist" />
					<meta
						property="og:description"
						content="Earn tokens for building, learning and creating."
					/>
					<meta
						property="og:image"
						content="https://wonderverse.xyz/images/twitter-meta.png"
					/>
					<meta property="og:title" content="Wonder Waitlist" />
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
					<HomeButton onClick={() => setShowJoinWaitList(!showJoinWaitList)}>
						<HomeButtonText>Enter the Wonderverse</HomeButtonText>
					</HomeButton>
					<HomeNavBar />
				</ContentDiv>
				<StyledModal
					open={showJoinWaitList}
					onClose={() => setShowJoinWaitList(false)}
				>
					<JoinWaitList
						showJoinWaitList={showJoinWaitList}
						setShowJoinWaitList={setShowJoinWaitList}
					/>
				</StyledModal>
			</HeaderContainer>
		</>
	)
}

export default withWaitlistAuth(Home)
