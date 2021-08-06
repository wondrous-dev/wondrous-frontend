import React from 'react'
import Trackable from '../Trackable'
import SmartLink from '../SmartLink'
import Image from 'next/image'

import {
	Container,
	LeftImage,
	RightImage,
	ContentDiv,
	Title,
	Subtext,
	FunkyText,
	HomeButton,
	HomeButtonText,
} from './styles'
import { Typography } from '@material-ui/core'
import { useIsMobile } from '../../utils/hooks'

const Home = () => {
	const isMobile = useIsMobile()
	return (
		<Container>
			<LeftImage src="/images/homepage-left.png" />
			<RightImage src="/images/homepage-right.png" />
			<ContentDiv>
				<Title variant="h1">Wonder</Title>
				<Subtext>
					The productivity metaverse - build your projects in public and earn
					{!isMobile && <br />}
					<FunkyText>crypto rewards</FunkyText> by completing tasks.
				</Subtext>
				<HomeButton>
					<HomeButtonText>Join waitlist</HomeButtonText>
				</HomeButton>
			</ContentDiv>
		</Container>
	)
}

export default Home
