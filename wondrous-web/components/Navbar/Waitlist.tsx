import React from 'react'
import { useIsMobile } from '../../utils/hooks'
import { Flex } from '../Common'
import {
	HomeNavLink,
	HomeNavLinkTypography,
	WaitlistContainer,
	ManifestoLink,
	TopNavContainer,
	JoinDiscordButton,
} from './styles'

const WaitlistNavbar = () => {
	const isMobile = useIsMobile()

	return (
		<TopNavContainer>
			<Flex />
			<WaitlistContainer>
				<ManifestoLink>
					<HomeNavLink
						href="https://wonderapp.notion.site/Wonder-Manifesto-caa5a446e8a54e7f8baffc667a77a33f"
						target="_blank"
					>
						Manifesto
					</HomeNavLink>
				</ManifestoLink>
				<HomeNavLinkTypography>
					<HomeNavLink
						href="https://wonderapp.notion.site/FAQ-for-Wonder-b2968c6f76bc480ca7f060fe83f7a2a9"
						target="_blank"
					>
						FAQ
					</HomeNavLink>
				</HomeNavLinkTypography>
				<JoinDiscordButton>
					<HomeNavLinkTypography>Join Discord</HomeNavLinkTypography>
				</JoinDiscordButton>
			</WaitlistContainer>
		</TopNavContainer>
	)
}

export default WaitlistNavbar
