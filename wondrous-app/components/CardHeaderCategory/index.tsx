import React from 'react';

import {
	TASK_STATUS_DONE,
	TASK_STATUS_INPROGRESS,
	TASK_STATUS_TODO,
} from "../../utils/constants";
import { shrinkNumber } from "../../utils/helpers";

import {
	CardCategoryBlock,
	CardCategoryDoneIcon,
	CardCategoryDoneStarIcon,
	CardCategoryIconContainer,
	CardCategoryInfoBlock,
	CardCategoryInfoBlockText,
	CardCategoryInProgressIcon,
	CardCategoryInProgressStarIcon,
	CardCategoryToDoIcon,
	CardCategoryToDoStarIcon
} from './styles'

const STAR_ICONS = {
	[TASK_STATUS_DONE]: CardCategoryDoneStarIcon,
	[TASK_STATUS_INPROGRESS]: CardCategoryInProgressStarIcon,
	[TASK_STATUS_TODO]: CardCategoryToDoStarIcon,
}

const STATUS_ICONS = {
	[TASK_STATUS_DONE]: CardCategoryDoneIcon,
	[TASK_STATUS_INPROGRESS]: CardCategoryInProgressIcon,
	[TASK_STATUS_TODO]: CardCategoryToDoIcon,
}

export const CardHeaderCategory = (props) => {
	const {
		status,
		starCount
	} = props;

	const StarIcon = STAR_ICONS[status]
	const StatusIcon = STATUS_ICONS[status]

	return (
		<CardCategoryBlock>
			<CardCategoryIconContainer>
				<StatusIcon />
			</CardCategoryIconContainer>
			<CardCategoryInfoBlock>
				<StarIcon />
				<CardCategoryInfoBlockText>
					{shrinkNumber(starCount)}
				</CardCategoryInfoBlockText>
			</CardCategoryInfoBlock>
		</CardCategoryBlock>
	);
}