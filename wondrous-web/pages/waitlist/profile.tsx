import React, { useState } from 'react'
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

	return (
		<ProfileWrapper>
			<HomeNavbar />
			<ProfileCenteredDiv>
				<LogoNoTextImg src="/images/logo/wonder-logo-no-text.png" />
				<JoinWaitlistHeader variant="h3">You&apos;re in</JoinWaitlistHeader>
				<ProfileText
					style={{
						marginBottom: '16px',
					}}
				>
					Claim your tokens during our launch in January
				</ProfileText>
				<TokenEarnedDiv>
					<YouHaveText>You have:</YouHaveText>
					<TokenEarnedInnerDiv>
						<WonderTokenSymbol src="/images/wonder-token.svg" />
						<YouHaveText>
							<TokenText>
								{waitlistUser?.tokensEarned || '10'} $WONDER
							</TokenText>
						</YouHaveText>
					</TokenEarnedInnerDiv>
				</TokenEarnedDiv>
				<InviteDiv>
					<ProfileText>
						Earn <TokenText>30 $WONDER</TokenText> tokens for each person that
						signs up through your link.
					</ProfileText>
					{waitlistUser && (
						<>
							<InviteButtonDiv>
								<InviteButton
									style={{
										marginRight: '16px',
									}}
									onClick={() =>
										tweetNow({
											twitterShareURL: referralLink,
											tweetContent: shareContent,
										})
									}
								>
									<TwitterShare
										style={{
											marginRight: '8px',
										}}
									/>
									<InviteButtonText>
										{isMobile ? 'Tweet link' : 'tweet your link'}
									</InviteButtonText>
								</InviteButton>
								<InviteButton
									href="https://discord.gg/vUnfjnZADH"
									target="_blank"
								>
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
							<ReferredText>
								Users referred: {waitlistUser?.invitesSent || 0}
							</ReferredText>
						</>
					)}
				</InviteDiv>
			</ProfileCenteredDiv>
		</ProfileWrapper>
	)
}

export default withWaitlistAuth(WaitlistProfile)
