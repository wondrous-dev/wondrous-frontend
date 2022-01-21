import React from 'react'
import {
	SOCIAL_MEDIA_DISCORD,
	SOCIAL_MEDIA_FACEBOOK,
	SOCIAL_MEDIA_GITHUB,
	SOCIAL_MEDIA_INSTAGRAM,
	SOCIAL_MEDIA_LINKEDIN,
	SOCIAL_MEDIA_SPOTIFY,
	SOCIAL_MEDIA_TWITTER,
	SOCIAL_OPENSEA
} from '../../../utils/constants'
import { formatLinkDisplay } from '../../../utils/links'
import FacebookIcon from '../../Icons/facebook'
import OpenSeaIcon from '../../Icons/openSea'
import LinkedInIcon from '../../Icons/linkedIn'
import LinksIcon from '../../Icons/resume'
import SkillsIcon from '../../Icons/skills'
import SocialIcon from '../../Icons/social'
import TwitterPurpleIcon from '../../Icons/twitterPurple'
import Wrapper from '../wrapper/wrapper'
import AboutCompletedCard from './aboutCompletedCard'
import AboutOrganisationsCard from './aboutOrganisationsCard'
import AboutPodsCard from './aboutPodsCard'
import {
	AboutInfoBlock,
	AboutInfoBlockContent,
	AboutInfoBlockHeader,
	AboutInfoBlockHeaderAmount,
	AboutInfoBlockHeaderSeeAll,
	AboutInfoBlockHeaderText,
	AboutInfoContainer,
	AboutInfoTable,
	AboutInfoTableRow,
	AboutInfoTableRowContent,
	AboutInfoTableRowContentItem,
	AboutInfoTableRowContentItemHashtag,
	AboutInfoTableRowContentItemLink,
	AboutInfoTableRowContentSocialButton,
	AboutInfoTableRowNameBlock,
	AboutInfoTableRowTitle,
	AboutInfoTableRowTitleText,
	AboutSection,
} from './styles'

const SOCIAL_MEDIA_ICONS = {
	[SOCIAL_MEDIA_FACEBOOK]: FacebookIcon,
	[SOCIAL_MEDIA_TWITTER]: TwitterPurpleIcon,
	[SOCIAL_MEDIA_LINKEDIN]: LinkedInIcon,
	[SOCIAL_MEDIA_DISCORD]: LinkedInIcon,
	[SOCIAL_MEDIA_GITHUB]: LinkedInIcon,
	[SOCIAL_MEDIA_SPOTIFY]: LinkedInIcon,
	[SOCIAL_MEDIA_INSTAGRAM]: LinkedInIcon,
	[SOCIAL_OPENSEA]: OpenSeaIcon,
}
const SOCIAL_LINKS = ['twitter', 'discord', 'instagram','github', 'linkedin', 'spotify']

const parseLinks = (links) => {
	/**
	 * parse links from backend into social links, websites, and main
	 */ 
	if (!links){
		return {
			'social': [],
			'websites': [],
			'mainLink': null,		
		}
	}
	let mainLink = null
	const socialLinks = []
	const websites = []
	for(const link of links) {
		if (!link.type || link.type=== 'website') {
			websites.push(link)
		}
		else if (SOCIAL_LINKS.includes(link.type)){
			socialLinks.push(link)
		}
		else if (link.type==='main'){
			mainLink = link
		}
	}
	if (mainLink === null) {
		if (websites.length > 0) {
			mainLink = websites[0]
		} else if ( socialLinks.length > 0) {
			mainLink = socialLinks[0]
		}
	}
	return {
		'social': socialLinks,
		'websites': websites,
		'mainLink': mainLink,		
	}
}

const About = (props) => {
	const {
		userProfileData = {},
		loggedInUser = {}
	} = props
	let {social, websites, mainLink} = parseLinks(userProfileData?.links)
	return (
		<Wrapper userProfileData={userProfileData} loggedInUser={loggedInUser} mainLink={mainLink}>
			<AboutSection>
				<AboutInfoTable>
					{/* <AboutInfoTableRow>
						<AboutInfoTableRowNameBlock>
							<AboutInfoTableRowTitle>
								<SkillsIcon />
								<AboutInfoTableRowTitleText>Skills</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							{skills.map((skill) => (
								<AboutInfoTableRowContentItem key={skill}>
									<AboutInfoTableRowContentItemHashtag>
										{skill}
									</AboutInfoTableRowContentItemHashtag>
								</AboutInfoTableRowContentItem>
							))}
						</AboutInfoTableRowContent>
					</AboutInfoTableRow> */}

					{social.length > 0 && <AboutInfoTableRow>
						<AboutInfoTableRowNameBlock>
							<AboutInfoTableRowTitle>
								<SocialIcon />
								<AboutInfoTableRowTitleText>Social</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							{social.map(({ url, type }) => {
								const SocialMediaIcon = SOCIAL_MEDIA_ICONS[type]
								return (
									<AboutInfoTableRowContentSocialButton key={url}>
										<a href={url} target="_blank" rel="noreferrer"> 
										<SocialMediaIcon  />
										</a>
									</AboutInfoTableRowContentSocialButton>
								)
							})}
						</AboutInfoTableRowContent>
					</AboutInfoTableRow>}
					{websites.length > 0 && <AboutInfoTableRow>
						<AboutInfoTableRowNameBlock>
							<AboutInfoTableRowTitle>
								<LinksIcon />
								<AboutInfoTableRowTitleText>Links</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							{websites.map((link) => (
								<AboutInfoTableRowContentItem key={link.url}>
									<AboutInfoTableRowContentItemLink href={link.url} as="a" target="_blank">
										{formatLinkDisplay(link)}
									</AboutInfoTableRowContentItemLink>
								</AboutInfoTableRowContentItem>
							))}
						</AboutInfoTableRowContent>
					</AboutInfoTableRow>}
				</AboutInfoTable>

				{/* <AboutInfoContainer>
					<AboutInfoBlock>
						<AboutInfoBlockHeader>
							<AboutInfoBlockHeaderAmount>
								{organizations.length}
							</AboutInfoBlockHeaderAmount>
							<AboutInfoBlockHeaderText>Organisations</AboutInfoBlockHeaderText>
						</AboutInfoBlockHeader>
						<AboutInfoBlockContent>
							{organizations.map((organization) => (
								<AboutOrganisationsCard
									key={organizations.id}
									{...organization}
								/>
							))}
						</AboutInfoBlockContent>
					</AboutInfoBlock>

					<AboutInfoBlock>
						<AboutInfoBlockHeader>
							<AboutInfoBlockHeaderAmount>
								{pods.length}
							</AboutInfoBlockHeaderAmount>
							<AboutInfoBlockHeaderText>Pods</AboutInfoBlockHeaderText>
						</AboutInfoBlockHeader>
						<AboutInfoBlockContent>
							{pods.map((pod) => (
								<AboutPodsCard key={pod.id} {...pod} />
							))}
						</AboutInfoBlockContent>
					</AboutInfoBlock>
					<AboutInfoBlock>
						<AboutInfoBlockHeader>
							<AboutInfoBlockHeaderAmount>
								{completedTasks}
							</AboutInfoBlockHeaderAmount>
							<AboutInfoBlockHeaderText>
								completed tasks
							</AboutInfoBlockHeaderText>
							<AboutInfoBlockHeaderSeeAll>See all</AboutInfoBlockHeaderSeeAll>
						</AboutInfoBlockHeader>
						<AboutInfoBlockContent>
							<AboutCompletedCard lastCompletedTask={lastCompletedTask} />
						</AboutInfoBlockContent>
					</AboutInfoBlock>
				</AboutInfoContainer> */}
			</AboutSection>
		</Wrapper>
	)
}

export default About
