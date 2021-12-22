import React from 'react'
import { IconButton } from '@material-ui/core'

import RightArrowIcon from '../../Icons/rightArrow'
import { AvatarList } from '../../Common/AvatarList'

import {
	OrganisationsCard,
	OrganisationsCardContent,
	OrganisationsCardHeader,
	PodsCardFooter,
	PodsCardFooterButton,
	PodsCardFooterIcon,
	PodsCardName,
} from './styles'

const AboutPodsCard = (props) => {
	const {
		title = '',
		description = '',
		tasksAmount = 0,
		goalsAmount = 0,
		users,
	} = props

	return (
		<OrganisationsCard>
			<OrganisationsCardHeader>
				<AvatarList users={users} />
				<IconButton>
					<RightArrowIcon />
				</IconButton>
			</OrganisationsCardHeader>
			<PodsCardName>{title}</PodsCardName>
			<OrganisationsCardContent>{description}</OrganisationsCardContent>
			<PodsCardFooter>
				<PodsCardFooterIcon />
				<PodsCardFooterButton>{tasksAmount} tasks</PodsCardFooterButton>
				<PodsCardFooterButton>{goalsAmount} goal</PodsCardFooterButton>
			</PodsCardFooter>
		</OrganisationsCard>
	)
}

export default AboutPodsCard
