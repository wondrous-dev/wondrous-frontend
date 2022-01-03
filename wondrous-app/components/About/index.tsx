import React from 'react'
import {
    SOCIAL_MEDIA_FACEBOOK,
    SOCIAL_MEDIA_LINKEDIN,
    SOCIAL_MEDIA_TWITTER
} from '../../utils/constants'
import FacebookIcon from '../Icons/facebook'
import LinkedInIcon from '../Icons/linkedIn'
import LinksIcon from '../Icons/resume'
import SocialIcon from '../Icons/social'
import TwitterPurpleIcon from '../Icons/twitterPurple'
import AboutCompletedCard from './aboutCompletedCard'
import AboutMembersCard from './aboutMembersCard'
import AboutMilestonesCard from './aboutMilestonesCard'
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
    AboutInfoTableRowContentItemLink,
    AboutInfoTableRowContentSocialButton,
    AboutInfoTableRowNameBlock,
    AboutInfoTableRowTitle,
    AboutInfoTableRowTitleText,
    AboutSection
} from './styles'

const SOCIAL_MEDIA_ICONS = {
	[SOCIAL_MEDIA_FACEBOOK]: FacebookIcon,
	[SOCIAL_MEDIA_TWITTER]: TwitterPurpleIcon,
	[SOCIAL_MEDIA_LINKEDIN]: LinkedInIcon,
}

const About = (props) => {
	const { data } = props
	const { socialMedia, links, milestones, completedTasks, members, pod } = data

	return (
		<AboutSection>
			<AboutInfoTable>
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
							{milestones.length}
						</AboutInfoBlockHeaderAmount>
						<AboutInfoBlockHeaderText>Milestones</AboutInfoBlockHeaderText>
					</AboutInfoBlockHeader>
					<AboutInfoBlockContent>
						{milestones.map((organization) => (
							<AboutMilestonesCard key={milestones.id} {...organization} />
						))}
					</AboutInfoBlockContent>
				</AboutInfoBlock>

				<AboutInfoBlock>
					<AboutInfoBlockHeader>
						<AboutInfoBlockHeaderAmount>
							{members.length}
						</AboutInfoBlockHeaderAmount>
						<AboutInfoBlockHeaderText>Members</AboutInfoBlockHeaderText>
					</AboutInfoBlockHeader>
					<AboutInfoBlockContent>
						{members.map((member) => (
							<AboutMembersCard key={member.id} {...member} />
						))}
					</AboutInfoBlockContent>
				</AboutInfoBlock>
				<AboutInfoBlock>
					<AboutInfoBlockHeader>
						<AboutInfoBlockHeaderAmount>
							{completedTasks.length}
						</AboutInfoBlockHeaderAmount>
						<AboutInfoBlockHeaderText>Completed Tasks</AboutInfoBlockHeaderText>
						<AboutInfoBlockHeaderSeeAll>See all</AboutInfoBlockHeaderSeeAll>
					</AboutInfoBlockHeader>
					<AboutInfoBlockContent>
						{completedTasks.map((task) => (
							<AboutCompletedCard key={task.id} {...task} />
						))}
					</AboutInfoBlockContent>
				</AboutInfoBlock>
			</AboutInfoContainer>
		</AboutSection>
	)
}

export default About
