import React from 'react'
import { useIsMobile, useWindowSize } from '../../utils/hooks'
import {
	HomeNavLink,
	HomeNavLinkTypography,
	LinkContainer,
	ManifestoLink,
	NavContainer,
	ImgLink,
	LogoImg,
	FlexDiv,
	LinkDiv,
	JoinDiscordButton,
	LogoNoTextImg,
} from './styles'

const HomeNavbar = () => {
	const windowSize = useWindowSize()
	console.log('windowSize', windowSize)
	return (
		<NavContainer>
			<LinkContainer>
				<ImgLink>
					{windowSize?.width < 375 ? (
						<LogoNoTextImg src="/images/logo/wonder-logo-no-text.png" />
					) : (
						<LogoImg src="/images/logo/horizontal-white-text.png" />
					)}
				</ImgLink>
				<FlexDiv />
				<LinkDiv>
					<ManifestoLink>
						<HomeNavLink
							href="https://wonderapp.notion.site/Wonder-Manifesto-caa5a446e8a54e7f8baffc667a77a33f"
							target="_blank"
						>
							Manifesto
						</HomeNavLink>
					</ManifestoLink>
					<HomeNavLinkTypography>
						<JoinDiscordButton
							href="https://discord.gg/vUnfjnZADH"
							target="_blank"
						>
							Join Discord
						</JoinDiscordButton>
					</HomeNavLinkTypography>
				</LinkDiv>
			</LinkContainer>
		</NavContainer>
	)
}

export default HomeNavbar
