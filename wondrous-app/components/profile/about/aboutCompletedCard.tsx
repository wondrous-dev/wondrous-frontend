import React from 'react'
import { IconButton } from '@material-ui/core'

import LikeIcon from '../../Icons/like'
import CommentsIcon from '../../Icons/comments'
import ShareIcon from '../../Icons/share'
import DotsIcon from '../../Icons/dots'
import { CardHeaderCategory } from '../../CardHeaderCategory'
import { TaskMedia } from '../../Common/MediaPlayer'
import { TaskCardLogo } from '../../organization/about/styles'
import { AvatarList } from '../../Common/AvatarList'

import {
	CompletedCardFooter,
	CompletedCardFooterActivity,
	CompletedCardFooterActivityAmount,
	CompletedCardFooterActivityIconBtn,
	CompletedCardFooterBlock,
	CompletedCardText,
	CompletedCardTitle,
	OrganisationsCard,
	OrganisationsCardHeader,
} from './styles'

const AboutCompletedCard = (props) => {
	const { userCompletedTasks } = props

	if (userCompletedTasks && userCompletedTasks.length === 0) {
		return null
	}

	return null
}

export default AboutCompletedCard
