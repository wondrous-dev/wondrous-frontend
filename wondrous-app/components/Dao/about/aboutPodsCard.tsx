import React from 'react';
import {
	PodsCard,
	PodsCardContent,
	PodsCardFooter,
	PodsCardFooterButton,
	PodsCardFooterIcon,
	PodsCardHeader,
	PodsCardHeaderAvatars,
	PodsCardHeaderButton,
	PodsCardName
} from './styles'
import RightArrowIcon from '../../Icons/rightArrow'

export const AboutPodsCard = (props) => {

	const {
		participantsAvatars,
		title,
		text,
		tasksAmount,
		goalsAmount,
	} = props

	return (
		<PodsCard>
			<PodsCardHeader>
				<PodsCardHeaderAvatars src={participantsAvatars}/>
				<PodsCardHeaderButton>
					<RightArrowIcon />
				</PodsCardHeaderButton>
			</PodsCardHeader>
			<PodsCardName>
				{title}
			</PodsCardName>
			<PodsCardContent>
				{text}
			</PodsCardContent>
			<PodsCardFooter>
				<PodsCardFooterIcon />
				<PodsCardFooterButton>
					{tasksAmount} tasks
				</PodsCardFooterButton>
				<PodsCardFooterButton>
					{goalsAmount} goal
				</PodsCardFooterButton>
			</PodsCardFooter>
		</PodsCard>
	);
}