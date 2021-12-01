import React from 'react'
import {
	FooterContainer,
	FooterEmailText,
	FooterLogo,
	FooterLogoDiv,
	DiscordLogo,
	TwitterLogo,
	FooterEmailLink,
} from './styles'

const Footer = () => {
	return (
		<FooterContainer>
			<FooterLogo src="/images/homepage/footer/footer-logo.png" />
			<FooterEmailLink href="mailto:hello@wonderverse.xyz">
				<FooterEmailText variant="body2">hello@wonderverse.xyz</FooterEmailText>
			</FooterEmailLink>
			<FooterLogoDiv>
				<a
					href="https://twitter.com/wonderverse_xyz"
					target="_blank"
					rel="noreferrer"
				>
					<TwitterLogo src="/images/twitter.svg" />
				</a>
				<a
					href="https://discord.gg/vUnfjnZADH"
					target="_blank"
					rel="noreferrer"
				>
					<DiscordLogo src="/images/discord-logo.png" />
				</a>
			</FooterLogoDiv>
		</FooterContainer>
	)
}

export default Footer
