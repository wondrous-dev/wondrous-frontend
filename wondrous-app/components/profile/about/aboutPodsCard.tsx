import React from 'react'
import { IconButton } from '@material-ui/core'

import RightArrowIcon from '../../Icons/rightArrow'
import { AvatarList } from '../../Common/AvatarList'
import { SafeImage } from '../../Common/Image';

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
		name = '',
		description = '',
		tasksAmount = 0,
		goalsAmount = 0,
		org = {},
	} = props

	return (
		<OrganisationsCard>
			{/* <OrganisationsCardHeader>
				<AvatarList users={users} />
				<IconButton>
					<RightArrowIcon />
				</IconButton>
			</OrganisationsCardHeader> */}
			<PodsCardName>{name}</PodsCardName>
			<OrganisationsCardContent>{description}</OrganisationsCardContent>
			<PodsCardFooter>
				<SafeImage
					src={org?.thumbnailPicture || org?.profilePicture}
					style={{
						width: '40px',
						height: '40px',
						borderRadius: '4px',
						marginRight: '8px',
					}}
				/>
				{/* <PodsCardFooterButton>{tasksAmount} tasks</PodsCardFooterButton>
				<PodsCardFooterButton>{goalsAmount} goal</PodsCardFooterButton> */}
			</PodsCardFooter>
		</OrganisationsCard>
	)
}

export default AboutPodsCard
