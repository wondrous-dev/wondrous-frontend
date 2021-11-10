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
				<TwitterLogo src="/images/twitter.svg" />
				<DiscordLogo src="/images/discord-logo.png" />
			</FooterLogoDiv>
		</FooterContainer>
	)
}

export default Footer
