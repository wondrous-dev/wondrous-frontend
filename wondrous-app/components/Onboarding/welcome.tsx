import React, { useState, useEffect } from 'react'
import {
	InviteWelcomeBoxParagraph,
	InviteWelcomeBoxWrapper,
	LogoDiv,
	LogoImg,
	LogoText,
	StyledHr,
	ProgressBar,
	OnboardingTitle,
	ContinueButton,
	UsernameTitle,
	UsernameDescription,
	UsernameInput,
} from './styles'
import WonderLogo from '../../public/images/onboarding/wonder-logo.svg'

import { useRouter } from 'next/router'

import { FirstStep } from '../../components/Common/Image/OnboardingProgressBar'
import { useWonderWeb3 } from '../../services/web3'
import { Field, FieldInput } from '../Common/field'

const USERNAME_REGEX = /^[A-Za-z0-9_]{3,16}$/

export const Logo = ({ divStyle }) => {
	return (
		<LogoDiv style={divStyle}>
			<WonderLogo />
			<LogoText>Wonder</LogoText>
		</LogoDiv>
	)
}

export const InviteWelcomeBox = ({ updateUser }) => {
	const router = useRouter()
	const wonderWeb3 = useWonderWeb3()
	const [username, setUsername] = useState('')
	const [error, setError] = useState('')
	// Two stage process as wallet connection takes
	// time.
	const buttonStyle = {
		background:
			'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
	}

	useEffect(() => {
		if (wonderWeb3?.onConnect) {
			wonderWeb3.onConnect()
		}
		if (wonderWeb3?.wallet?.addressTag) {
			const splitUsernameArr = wonderWeb3?.wallet?.addressTag.split('.')
			setUsername(splitUsernameArr[0])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wonderWeb3?.wallet?.addressTag])

	return (
		<InviteWelcomeBoxWrapper>
			<Logo
				divStyle={{
					position: 'relative',
					top: 0,
					left: 0,
					width: '100%',
					marginBottom: '26px',
				}}
			/>
			<StyledHr />
			<FirstStep
				style={{
					width: '100%',
					marginTop: '24px',
				}}
			/>
			<OnboardingTitle
				style={{
					textAlign: 'left',
					marginTop: '36px',
					width: '100%',
				}}
			>
				Welcome to Wonder
			</OnboardingTitle>
			<InviteWelcomeBoxParagraph
				style={{
					textAlign: 'left',
					width: '100%',
				}}
			>
				Earn crypto while contributoring to web3 projects. <br /> Let’s get your
				membership set up, it’ll take 2 minutes.
			</InviteWelcomeBoxParagraph>
			<UsernameTitle>Enter your username</UsernameTitle>
			<UsernameDescription>
				You can use your Twitter, Discord or ENS handle
			</UsernameDescription>
			<UsernameInput
				name="username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Enter username"
				required
				error={error}
			/>
			<ContinueButton
				style={buttonStyle}
				onClick={() => {
					if (USERNAME_REGEX.test(username)) {
						updateUser({
							variables: {
								input: {
									username,
								},
							},
						})
					} else {
						setError(
							'Please enter a valid username with 3-15 alphanumeric characters '
						)
					}
				}}
				buttonInnerStyle={{
					padding: '8px 16px',
				}}
			>
				<InviteWelcomeBoxParagraph>Continue</InviteWelcomeBoxParagraph>
			</ContinueButton>
		</InviteWelcomeBoxWrapper>
	)
}
