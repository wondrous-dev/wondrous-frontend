import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
	InviteWelcomeBoxParagraph,
	InviteWelcomeBoxWrapper,
	LogoDiv,
	LogoText,
	StyledHr,
	OnboardingTitle,
	ContinueButton,
	UsernameTitle,
	UsernameDescription,
	UsernameInput,
	ProfilePictureDiv,
	ErrorText,
} from './styles'
import WonderLogo from '../../public/images/onboarding/wonder-logo.svg'

import { useRouter } from 'next/router'

import { ThirdStep } from '../../components/Common/Image/OnboardingProgressBar'
import { CircularProgress } from '@material-ui/core'

const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const validateEmail = (email) => {
	return email.match(EMAIL_REGEX)
}

export const Logo = ({ divStyle }) => {
	return (
		<LogoDiv style={divStyle}>
			<WonderLogo />
			<LogoText>Wonder</LogoText>
		</LogoDiv>
	)
}

export const InviteWelcomeBox = ({ updateUser }) => {
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(null)
	const buttonStyle = {
		background:
			'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
		position: 'relative',
		marginTop: '24px',
		bottom: '0',
		right: '0',
	}

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
			<ThirdStep
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
				Set up your email
			</OnboardingTitle>
			<InviteWelcomeBoxParagraph
				style={{
					textAlign: 'left',
					width: '100%',
				}}
			>
				Get updates on your tasks and payments.
			</InviteWelcomeBoxParagraph>
			<UsernameTitle
				style={{
					marginBottom: '14px',
				}}
			>
				Enter your email
			</UsernameTitle>
			<UsernameInput
				type="email"
				name="email"
				value={email}
				error={error}
				onChange={(e) => {
					setEmail(e.target.value)
					setError(null)
				}}
				placeholder="Enter your best email"
				required
			/>
			{error && <ErrorText>{error}</ErrorText>}
			<div
				style={{
					width: '100%',
					justifyContent: 'end',
					display: 'flex',
				}}
			>
				<ContinueButton
					style={buttonStyle}
					onClick={() => {
						setLoading(true)
						if (validateEmail(email)) {
							updateUser({
								variables: {
									input: {
										email,
									},
								},
							})
						} else {
							setLoading(false)
							setError('Please enter a valid email')
						}
					}}
					buttonInnerStyle={{
						padding: '8px 16px',
					}}
				>
					<InviteWelcomeBoxParagraph>
						{loading ? <CircularProgress /> : 'Finish'}
					</InviteWelcomeBoxParagraph>
				</ContinueButton>
			</div>
		</InviteWelcomeBoxWrapper>
	)
}
