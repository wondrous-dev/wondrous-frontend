import React from 'react';
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
	AboutInfoTableRowContent, AboutInfoTableRowContentIconBtn,
	AboutInfoTableRowContentItem,
	AboutInfoTableRowContentItemHashtag, AboutInfoTableRowContentItemOpen,
	AboutInfoTableRowContentItemText, AboutInfoTableRowContentSocialButton,
	AboutInfoTableRowNameBlock,
	AboutInfoTableRowTitle,
	AboutInfoTableRowTitleText,
	AboutSection,
	OrganisationsCard,
	PodsCard
} from './styles'
import { TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { AboutOrganisationsCard } from './aboutOrganisationsCard'
import { AboutPodsCard } from './aboutPodsCard'
import { AboutCompletedCard } from './aboutCompletedCard'
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

const About = () => {

	const infoBlockList = [
		{
			id: 1,
			title: 'Organisations',
			amount: 2,
			seeAll: false,
		},
		{
			id: 2,
			title: 'Pods',
			amount: 4,
			seeAll: false,
		},
		{
			id: 3,
			title: 'completed tasks',
			amount: 321,
			seeAll: true,
		}
	];

	const organisationsCardList = [
		{
			id: 1,
			icon: 'wonder',
			title: 'Wonder',
			text: 'A social platform where founders build in public using crypto incentives.',
			avatar: '/images/boards/avatar.png',
			position: 'Founder',
		},
		{
			id: 2,
			// icon: 'upClick',
			icon: 'wonder',
			title: 'UpClick',
			text: 'Upclick is a custom e-commerce platform with expertise in sales tool.',
			avatar: '/images/boards/avatarNFT.png',
			position: 'Public Relations',
		},
	];

	const podsCardList = [
		{
			id: 1,
			participantsAvatars: '/images/overview/people.png',
			title: 'PR Dream Team',
			text: 'Tortor aliquet dui posuere tortor in viverra orci cras quisque. Lectus mauris.',
			tasksAmount: 42,
			goalsAmount: 1,
		},
		{
			id: 2,
			participantsAvatars: '/images/overview/people.png',
			title: 'Analytics system creation',
			text: 'Tortor aliquet dui posuere tortor in viverra orci cras quisque. Lectus mauris.',
			tasksAmount: 21,
			goalsAmount: 1,
		},
	];

	const socialIconsList = [
		{
			icon: <FacebookIcon />,
		},
		{
			icon: <TwitterPurpleIcon />,
		},
		{
			icon: <LinkedInIcon />,
		},
	];

	return (
		<Wrapper>
			<AboutSection>
				<AboutInfoTable>
					<AboutInfoTableRow>
						<AboutInfoTableRowNameBlock>
							<AboutInfoTableRowTitle>
								<SkillsIcon />
								<AboutInfoTableRowTitleText>
									Skills
								</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							<AboutInfoTableRowContentItem>
								<AboutInfoTableRowContentItemHashtag>
									#publicrelations
								</AboutInfoTableRowContentItemHashtag>
							</AboutInfoTableRowContentItem>
							<AboutInfoTableRowContentItem>
								<AboutInfoTableRowContentItemHashtag>
									#analytics
								</AboutInfoTableRowContentItemHashtag>
							</AboutInfoTableRowContentItem>
						</AboutInfoTableRowContent>
					</AboutInfoTableRow>

					<AboutInfoTableRow>
						<AboutInfoTableRowNameBlock>
							<AboutInfoTableRowTitle>
								<ResumeIcon />
								<AboutInfoTableRowTitleText>
									Resume
								</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							<AboutInfoTableRowContentItem>
								<AboutInfoTableRowContentItemText>
									Jane_Seymour_Resume_11.21.22.pdf
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
								<AboutInfoTableRowTitleText>
									Status
								</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							<AboutInfoTableRowContentItemOpen>
								<AboutInfoTableRowContentItemText>
									<CheckMarkIcon />
									Open to work
								</AboutInfoTableRowContentItemText>
							</AboutInfoTableRowContentItemOpen>
						</AboutInfoTableRowContent>
					</AboutInfoTableRow>

					<AboutInfoTableRow>
						<AboutInfoTableRowNameBlock>
							<AboutInfoTableRowTitle>
								<SocialIcon />
								<AboutInfoTableRowTitleText>
									Social
								</AboutInfoTableRowTitleText>
							</AboutInfoTableRowTitle>
						</AboutInfoTableRowNameBlock>
						<AboutInfoTableRowContent>
							{socialIconsList.map((item, index) => (
								<AboutInfoTableRowContentSocialButton key={index}>
									{item.icon}
								</AboutInfoTableRowContentSocialButton>
							))}
						</AboutInfoTableRowContent>
					</AboutInfoTableRow>
				</AboutInfoTable>

				<AboutInfoContainer>

					<AboutInfoBlock>
						<AboutInfoBlockHeader>
							<AboutInfoBlockHeaderAmount>
								2
							</AboutInfoBlockHeaderAmount>
							<AboutInfoBlockHeaderText>
								Organisations
							</AboutInfoBlockHeaderText>
						</AboutInfoBlockHeader>
						<AboutInfoBlockContent>

							{organisationsCardList.map(card => (
								<AboutOrganisationsCard
									key={card.id}
									icon={card.icon}
									title={card.title}
									text={card.text}
									position={card.position}
									avatar={card.avatar}
								/>
							))}

						</AboutInfoBlockContent>
					</AboutInfoBlock>

					<AboutInfoBlock>
						<AboutInfoBlockHeader>
							<AboutInfoBlockHeaderAmount>
								4
							</AboutInfoBlockHeaderAmount>
							<AboutInfoBlockHeaderText>
								Pods
							</AboutInfoBlockHeaderText>
						</AboutInfoBlockHeader>
						<AboutInfoBlockContent>

							{podsCardList.map(card => (
								<AboutPodsCard
									key={card.id}
									participantsAvatars={card.participantsAvatars}
									title={card.title}
									text={card.text}
									tasksAmount={card.tasksAmount}
									goalsAmount={card.goalsAmount}
								/>
							))}

						</AboutInfoBlockContent>
					</AboutInfoBlock>
					<AboutInfoBlock>
						<AboutInfoBlockHeader>
							<AboutInfoBlockHeaderAmount>
								321
							</AboutInfoBlockHeaderAmount>
							<AboutInfoBlockHeaderText>
								completed tasks
							</AboutInfoBlockHeaderText>
							<AboutInfoBlockHeaderSeeAll>
								See all
							</AboutInfoBlockHeaderSeeAll>
						</AboutInfoBlockHeader>
						<AboutInfoBlockContent>

							<AboutCompletedCard />

						</AboutInfoBlockContent>
					</AboutInfoBlock>
				</AboutInfoContainer>
			</AboutSection>
		</Wrapper>
	);
}

export default About