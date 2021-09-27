import React, { useState } from 'react'
import Confetti from 'react-confetti'

import { useMe, withWaitlistAuth } from '../../components/Auth/withAuth'
import { TwitterShare } from '../../components/Icons/twitter'
import {
	JoinWaitlistHeader,
	ModalWrapper,
	FunkyText,
	ExplanationText,
	FunkyTextYellow,
	LinkBox,
	LinkText,
	CopyText,
	TweetButton,
	TweetButtonText,
	ReferredText,
	LinkRow,
	ReferredFunkyButton,
} from '../../components/Waitlist/styles'
import { Blue500, Grey800 } from '../../services/colors'
import {
	HomeNavLink,
	HomeNavLinkTypography,
	LinkContainer,
	ManifestoLink,
} from '../../components/Navbar/styles'
import WaitlistNavbar from '../../components/Navbar/Waitlist'
import { NewCanvas } from '../../components/Common'
import { useWindowSize } from '../../utils/hooks'
import { FunkyButton } from '../../components/Button'

// Have $10 Wonder tokens
// Invite for another $30
// Unique link
// Discord + resources
// Share on Twitter/Instagram/Reddit??
// Number of invites sent.

export const tweetNow = ({ twitterShareURL, tweetContent }) => {
	let twitterParameters = []
	if (twitterShareURL)
		twitterParameters.push('url=' + encodeURI(twitterShareURL))
	if (tweetContent) twitterParameters.push('text=' + encodeURI(tweetContent))
	// if (twitterViaAccount)
	// 	twitterParameters.push('via=' + encodeURI(twitterViaAccount))
	const url = 'https://twitter.com/intent/tweet?' + twitterParameters.join('&')
	if (typeof window !== undefined) {
		window.open(url, '_blank').focus()
	}
	// .then((data) => {
	//   alert('Twitter Opened');
	// })
	// .catch(() => {
	//   alert('Something went wrong');
	// });
}

const shareContent = 'Sign up to Wonder to earn tokens for your project 🤑'
const COPIED_TIMEOUT = 2000
let timeout = null

const WaitlistProfile = () => {
	const waitlistUser = useMe()
	const windowSize = useWindowSize()
	const referralLink = `https://wonderverse.xyz?ref=${waitlistUser?.refCode}`
	const [copied, setCopied] = useState(false)
	const handleCopyClick = (e) => {
		const newEl = document.createElement('input')

		document.body.appendChild(newEl)
		newEl.setAttribute('value', referralLink)
		newEl.select()
		document.execCommand('copy')
		document.body.removeChild(newEl)
		setCopied(true)

		if (timeout) {
			clearTimeout(timeout)
		}
		timeout = setTimeout(() => {
			setCopied(false)
		}, COPIED_TIMEOUT)
	}

	return (
		<ModalWrapper>
			{windowSize?.width && (
				<Confetti
					width={windowSize?.width}
					height={windowSize?.height}
					recycle={false}
					initialVelocityY={{
						min: 8,
						max: 10,
					}}
					gravity={0.2}
				/>
			)}
			<WaitlistNavbar />
			<JoinWaitlistHeader variant="h4">
				Thanks for joining the waitlist! You now have:
			</JoinWaitlistHeader>
			<FunkyText variant="h3">
				{` `}
				{waitlistUser?.tokensEarned || '10'} $WONDER
			</FunkyText>
			<ExplanationText>
				Share the link below with friends to get{' '}
				<FunkyTextYellow>{` `}30 $WONDER</FunkyTextYellow> tokens for each
				additional person who signs up!
			</ExplanationText>
			{waitlistUser && (
				<>
					<LinkRow>
						<LinkBox data-cy="referral-link">
							<LinkText>{referralLink}</LinkText>
							<CopyText
								onClick={handleCopyClick}
								style={{
									color: copied ? Grey800 : Blue500,
								}}
							>
								{copied ? 'Copied!' : 'Copy'}
							</CopyText>
						</LinkBox>
					</LinkRow>
					<TweetButton
						onClick={() =>
							tweetNow({
								twitterShareURL: referralLink,
								tweetContent: shareContent,
							})
						}
					>
						<TwitterShare
							style={{
								width: '28',
								height: '28',
								marginRight: '2px',
							}}
						/>
						<TweetButtonText>Tweet</TweetButtonText>
					</TweetButton>
					<ReferredFunkyButton>
						<ReferredText>
							Users referred: {waitlistUser?.invitesSent || 0}
						</ReferredText>
					</ReferredFunkyButton>
				</>
			)}
		</ModalWrapper>
	)
}

export default withWaitlistAuth(WaitlistProfile)
