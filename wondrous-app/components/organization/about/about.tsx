import React from 'react'

import Wrapper from '../wrapper/wrapper'
import StatusIcon from '../../Icons/status'
import ResumeIcon from '../../Icons/resume'
import SkillsIcon from '../../Icons/skills'
import SocialIcon from '../../Icons/social'
import DownloadPdfIcon from '../../Icons/downloadPdf'
import CheckMarkIcon from '../../Icons/checkMark'
import FacebookIcon from '../../Icons/facebook'
import TwitterPurpleIcon from '../../Icons/twitterPurple'
import LinkedInIcon from '../../Icons/linkedIn'
import {
	SOCIAL_MEDIA_FACEBOOK,
	SOCIAL_MEDIA_LINKEDIN,
	SOCIAL_MEDIA_TWITTER,
} from '../../../utils/constants'

import AboutOrganisationsCard from './aboutOrganisationsCard'
import AboutPodsCard from './aboutPodsCard'
import AboutCompletedCard from './aboutCompletedCard'

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
	AboutInfoTableRowContentIconBtn,
	AboutInfoTableRowContentItem,
	AboutInfoTableRowContentItemHashtag,
	AboutInfoTableRowContentItemOpen,
	AboutInfoTableRowContentItemText,
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

	const { completedTasks, resume, skills, socialMedia, status } = profileInfo

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
								<ResumeIcon />
								<AboutInfoTableRowTitleText>Resume</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							<AboutInfoTableRowContentItem>
								<AboutInfoTableRowContentItemText>
									{resume}
									<AboutInfoTableRowContentIconBtn>
										<DownloadPdfIcon />
									</AboutInfoTableRowContentIconBtn>
								</AboutInfoTableRowContentItemText>
							</AboutInfoTableRowContentItem>
						</AboutInfoTableRowContent>
					</AboutInfoTableRow>

					<AboutInfoTableRow>
						<AboutInfoTableRowNameBlock>
							<AboutInfoTableRowTitle>
								<StatusIcon />
								<AboutInfoTableRowTitleText>Status</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							<AboutInfoTableRowContentItemOpen>
								<AboutInfoTableRowContentItemText>
									<CheckMarkIcon />
									{status.label}
								</AboutInfoTableRowContentItemText>
							</AboutInfoTableRowContentItemOpen>
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
