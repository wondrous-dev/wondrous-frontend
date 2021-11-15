import React, { useState } from 'react'
import { useWindowSize } from '../../utils/hooks'
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
	try {
		const windowSize = useWindowSize()
		return (
			<NavContainer>
				<LinkContainer>
					<ImgLink href="/?redirect=false">
						{windowSize && windowSize?.width < 375 ? (
							<LogoNoTextImg src="/images/logo/wonder-logo-no-text.png" />
						) : (
							<LogoImg src="/images/logo/horizontal-white-text.png" />
						)}
					</ImgLink>
					<FlexDiv />
					<LinkDiv>
						<ManifestoLink>
							<HomeNavLink
								href="https://wonderverse.notion.site/Wonder-Manifesto-caa5a446e8a54e7f8baffc667a77a33f"
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
	} catch (err) {
		return (
			<NavContainer>
				<LinkContainer>
					<ImgLink href="/">
						<LogoImg src="/images/logo/horizontal-white-text.png" />
					</ImgLink>
					<FlexDiv />
					<LinkDiv>
						<ManifestoLink>
							<HomeNavLink
								href="https://wonderverse.notion.site/Wonder-Manifesto-caa5a446e8a54e7f8baffc667a77a33ff"
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
}

export default HomeNavbar
