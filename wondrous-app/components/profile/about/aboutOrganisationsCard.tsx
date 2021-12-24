import React from 'react'
import { IconButton } from '@material-ui/core'

import RightArrowIcon from '../../Icons/rightArrow'

import {
	OrganisationsCard,
	OrganisationsCardAuthor,
	OrganisationsCardAuthorAvatar,
	OrganisationsCardAuthorPosition,
	OrganisationsCardContent,
	OrganisationsCardHeader,
	OrganisationsCardHeaderName,
	OrganisationsCardHeaderWonderIcon,
} from './styles'

const ICONS = {
	wonder: OrganisationsCardHeaderWonderIcon,
}

const AboutOrganisationsCard = (props) => {
	const { icon, title, description, position, avatar } = props

	const Icon = ICONS[icon]

	return (
		<OrganisationsCard>
			<OrganisationsCardHeader>
				<Icon />

				<OrganisationsCardHeaderName>{title}</OrganisationsCardHeaderName>
				<IconButton>
					<RightArrowIcon />
				</IconButton>
			</OrganisationsCardHeader>
			<OrganisationsCardContent>{description}</OrganisationsCardContent>
			<OrganisationsCardAuthor>
				<OrganisationsCardAuthorAvatar src={avatar} />
				<OrganisationsCardAuthorPosition>
					{position}
				</OrganisationsCardAuthorPosition>
			</OrganisationsCardAuthor>
		</OrganisationsCard>
	)
}

export default AboutOrganisationsCard
