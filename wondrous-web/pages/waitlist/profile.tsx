import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

import { useMe, withWaitlistAuth } from '../../components/Auth/withAuth'
import { TwitterShare } from '../../components/Icons/twitter'
import {
	JoinWaitlistHeader,
	ProfileWrapper,
	FunkyText,
	ExplanationText,
	FunkyTextYellow,
	LinkBox,
	LinkText,
	CopyText,
	InviteButtonText,
	ReferredText,
	LinkRow,
	CenteredDiv,
	LogoNoTextImg,
	ProfileText,
	TokenEarnedDiv,
	YouHaveText,
	TokenEarnedInnerDiv,
	WonderTokenSymbol,
	InviteDiv,
	InviteButton,
	InviteButtonDiv,
	ProfileCenteredDiv,
} from '../../components/Waitlist/styles'
import { Blue500, Grey800 } from '../../services/colors'
import {
	HomeNavLink,
	HomeNavLinkTypography,
	LinkContainer,
	ManifestoLink,
} from '../../components/Navbar/styles'
import { NewCanvas } from '../../components/Common'
import { useIsMobile, useWindowSize } from '../../utils/hooks'
import { FunkyButton } from '../../components/Button'
import HomeNavbar from '../../components/Navbar/Home'
import { TokenText } from '../../components/Home/styles'
import { DiscordShare } from '../../components/Icons/discord'
import { initHotjar } from '../../utils/hotjar'
import { Logo } from '../../components/Common/ci'

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
	const referralLink = `https://wonderverse.xyz?ref=${waitlistUser?.refCode}`
	const isMobile = useIsMobile()
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

	useEffect(() => {
		initHotjar()
	}, [])
	return (
		<ProfileWrapper>
			<HomeNavbar />
			<ProfileCenteredDiv>
				<Logo />
				<JoinWaitlistHeader variant="h3">You&apos;re in</JoinWaitlistHeader>
				<ProfileText
					style={{
						marginBottom: '16px',
					}}
				>
					Claim your tokens during our public launch
				</ProfileText>
				<TokenEarnedDiv>
					<YouHaveText>You have:</YouHaveText>
					<TokenEarnedInnerDiv>
						<WonderTokenSymbol src="/images/wonder-token.svg" />
						{waitlistUser?.tokensEarned && (
							<TokenText>{waitlistUser?.tokensEarned} $WONDER</TokenText>
						)}
						<YouHaveText></YouHaveText>
					</TokenEarnedInnerDiv>
				</TokenEarnedDiv>
				<InviteButtonDiv>
					<InviteButton
						style={{
							marginRight: '16px',
						}}
						href="https://twitter.com/wonderverse_xyz"
						target="_blank"
					>
						<TwitterShare
							style={{
								marginRight: '8px',
							}}
						/>
						<InviteButtonText>
							{isMobile ? 'Join Twitter' : 'join our twitter'}
						</InviteButtonText>
					</InviteButton>
					<InviteButton href="https://discord.gg/vUnfjnZADH" target="_blank">
						<DiscordShare
							style={{
								marginRight: '8px',
							}}
						/>
						<InviteButtonText>
							{isMobile ? 'Join Discord' : 'join our discord'}
						</InviteButtonText>
					</InviteButton>
				</InviteButtonDiv>
			</ProfileCenteredDiv>
		</ProfileWrapper>
	)
}

export default withWaitlistAuth(WaitlistProfile)
