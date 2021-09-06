import React from 'react'
import { useIsMobile } from '../../utils/hooks'
import {
	HomeNavLink,
	HomeNavLinkTypography,
	LinkContainer,
	ManifestoLink,
	NavContainer,
} from './styles'

const HomeNavbar = () => {
	const isMobile = useIsMobile()

	return (
		<NavContainer>
			<LinkContainer>
				<ManifestoLink>
					<HomeNavLink href="https://wonderapp.notion.site/Wonder-Manifesto-caa5a446e8a54e7f8baffc667a77a33f">
						Manifesto
					</HomeNavLink>
				</ManifestoLink>
				<HomeNavLinkTypography>
					<HomeNavLink href="https://wonderapp.notion.site/FAQ-for-Wonder-b2968c6f76bc480ca7f060fe83f7a2a9">
						FAQ
					</HomeNavLink>
				</HomeNavLinkTypography>
			</LinkContainer>
		</NavContainer>
	)
}

export default HomeNavbar
