import React, { useState, useCallback, useEffect } from 'react'
import Trackable from '../Trackable'
import SmartLink from '../SmartLink'
import Image from 'next/image'
import { Modal, TextField } from '@material-ui/core'
import JoinWaitList from '../Waitlist'
import {
	Container,
	LeftImage,
	RightImage,
	ContentDiv,
	Title,
	HomeSubtext,
	FunkyText,
	HomeButton,
	HomeButtonText,
	Blob1,
	Blob2,
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

			<RightImage src="/images/homepage-right.png" />
			<ContentDiv>
				<Title variant="h1">Wonder</Title>
				<HomeSubtext>
					The productivity metaverse - build your projects in public and earn
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
