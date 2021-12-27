import React from 'react'
import {
	SOCIAL_MEDIA_FACEBOOK,
	SOCIAL_MEDIA_LINKEDIN,
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
}

const About = (props) => {
	const {
		lastCompletedTask = {},
		organizations = [],
		profileInfo = {},
		pods = [],
	} = props

	const { completedTasks, links, skills, socialMedia } = profileInfo

	return (
		<Wrapper>
			<AboutSection>
				<AboutInfoTable>
					<AboutInfoTableRow>
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
					</AboutInfoTableRow>

					<AboutInfoTableRow>
						<AboutInfoTableRowNameBlock>
							<AboutInfoTableRowTitle>
								<SocialIcon />
								<AboutInfoTableRowTitleText>Social</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							{socialMedia.map(({ name }) => {
								const SocialMediaIcon = SOCIAL_MEDIA_ICONS[name]

								return (
									<AboutInfoTableRowContentSocialButton key={name}>
										<SocialMediaIcon />
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
							{links.map(({ link, text }) => (
								<AboutInfoTableRowContentItem key={link}>
									<AboutInfoTableRowContentItemLink href={link} as="a">
										{text}
									</AboutInfoTableRowContentItemLink>
								</AboutInfoTableRowContentItem>
							))}
						</AboutInfoTableRowContent>
					</AboutInfoTableRow>
				</AboutInfoTable>

				<AboutInfoContainer>
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
				</AboutInfoContainer>
			</AboutSection>
		</Wrapper>
	)
}

export default About
