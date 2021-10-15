import React, { useState, useCallback, useEffect } from 'react'
import Trackable from '../Trackable'
import SmartLink from '../SmartLink'
import Image from 'next/image'
import Head from 'next/head'
import { Modal } from '@material-ui/core'
import JoinWaitList from '../Waitlist'
import {
	Container,
	RightImage,
	ContentDiv,
	Title,
	HomeSubtext,
	FunkyText,
	HomeButton,
	HomeButtonText,
	Blob1,
} from './styles'
import { useIsMobile } from '../../utils/hooks'
import HomeNavBar from '../Navbar/Home'
import styled from 'styled-components'
const StyledModal = styled(Modal)`
	display: flex;
	justify-content: center;
	align-items: center;
`

const Home = () => {
	const [showJoinWaitList, setShowJoinWaitList] = useState(false)

	const isMobile = useIsMobile()

	return (
		<Container>
			<Blob1 src="/images/blob1.png" />
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
			<RightImage src="/images/homepage-right.png" />
			<ContentDiv>
				<Title variant="h1">Wonder</Title>
				<HomeSubtext>
					The productivity metaverse - build projects in public with our
					management tools and earn
					{` `}
					<FunkyText>crypto rewards</FunkyText> by completing tasks.
				</HomeSubtext>
				<HomeButton onClick={() => setShowJoinWaitList(!showJoinWaitList)}>
					<HomeButtonText>Join waitlist</HomeButtonText>
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
		</Container>
	)
}

export default Home
