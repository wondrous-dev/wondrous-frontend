import React from 'react'

import { VERBS, OBJECT_TYPE } from '../../../utils/constants'
import { PostAuthorSubtitle } from './styles'

export const PostSubtitle = (props) => {
	const { id = '', verb = '', object_type = '' } = props

	const ObjectNames = {
		[OBJECT_TYPE.POD]: 'pod',
		[OBJECT_TYPE.TASK]: 'task',
		[OBJECT_TYPE.MILESTONE]: 'milestone',
	}

	const objectName = ObjectNames[object_type]

	const subtitleFromVerb = {
		[VERBS.CREATE]: `created a ${objectName}`,
		[VERBS.COMPLETE]: `completed a ${objectName}`,
		[VERBS.AWARD]: 'awarded kudos',
	}
	const subtitle = subtitleFromVerb[verb] || ''

	return <PostAuthorSubtitle>{subtitle}</PostAuthorSubtitle>
}
