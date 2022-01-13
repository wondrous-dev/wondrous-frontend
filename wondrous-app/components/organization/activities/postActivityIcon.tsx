import React from 'react'

import { VERBS } from '../../../utils/constants'
import {
	CardCategoryDoneIcon,
	CardCategoryInProgressIcon,
	CardCategoryToDoIcon,
} from '../../CardHeaderCategory/styles'
import { PostActivityPlaceHolder } from './styles'

const STATUS_ICONS = {
	[VERBS.COMPLETE]: CardCategoryDoneIcon,
	[VERBS.JOIN]: CardCategoryInProgressIcon,
	[VERBS.CREATE]: CardCategoryToDoIcon,
}

const PostActivityIcon = (props) => {
	const { verb } = props
	const StatusIcon = STATUS_ICONS[verb]

	return (
		<PostActivityPlaceHolder>
			<StatusIcon />
		</PostActivityPlaceHolder>
	)
}

export default PostActivityIcon
