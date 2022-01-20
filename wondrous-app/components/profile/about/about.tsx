import React from 'react'
import {
	SOCIAL_MEDIA_DISCORD,
	SOCIAL_MEDIA_FACEBOOK,
	SOCIAL_MEDIA_GITHUB,
	SOCIAL_MEDIA_INSTAGRAM,
	SOCIAL_MEDIA_LINKEDIN,
	SOCIAL_MEDIA_SPOTIFY,
	SOCIAL_MEDIA_TWITTER,
} from '../../../utils/constants'
import FacebookIcon from '../../Icons/facebook'
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
}
const SOCIAL_LINKS = ['twitter', 'discord', 'instagram','github', 'linkedin', 'spotify']

const _parseLinks = (links) => {
	if (!links){
		return {
			'social': [],
			'websites': [],
			'main': {},		
		}
	}
	let mainLink = {}
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
	return {
		'social': socialLinks,
		'websites': websites,
		'main': mainLink,		
	}
}

const About = (props) => {
	const {
		userProfileData = {}
	} = props
	const {social, websites, main} = _parseLinks(userProfileData?.links)

	return (
		<Wrapper userProfileData={userProfileData}>
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

					<AboutInfoTableRow>
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
									// href={url} as="a" target="_blank"
									<AboutInfoTableRowContentSocialButton key={url} >
										<SocialMediaIcon  />
									</AboutInfoTableRowContentSocialButton>
								)
							})}
						</AboutInfoTableRowContent>
					</AboutInfoTableRow>

					<AboutInfoTableRow>
						<AboutInfoTableRowNameBlock>
							<AboutInfoTableRowTitle>
								<LinksIcon />
								<AboutInfoTableRowTitleText>Links</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							{websites.map(({ url, displayName }) => (
								<AboutInfoTableRowContentItem key={url}>
									<AboutInfoTableRowContentItemLink href={url} as="a" target="_blank">
										{displayName ? displayName: url.substring(0,20)}
									</AboutInfoTableRowContentItemLink>
								</AboutInfoTableRowContentItem>
							))}
						</AboutInfoTableRowContent>
					</AboutInfoTableRow>
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
