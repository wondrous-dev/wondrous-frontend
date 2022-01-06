import React from 'react'
import styled from 'styled-components'
import { Purple800, White } from '../../../theme/colors'
import {
	GradientHighlightHorizontal,
	GradientHighlightVertical,
	GradientMidnightDiagonalOposite,
	GradientMidnightVertical,
} from '../gradients'

export const MilestoneWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;

	margin: 0;
	max-width: 324px;

	${GradientHighlightVertical}

	padding: 2px;
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
`

export const MilestoneHeader = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 32px;
	line-height: 36px;

	margin-top: 1em;

	color: ${White};
	font-weight: 600;

	background: ${Purple800};

	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
`

export const MilestoneInner = styled.div`
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	flex-flow: column wrap;
	align-items: stretch;

	border-radius: 5px;
	padding: 0px;

	${GradientMidnightVertical}
`

const Milestone = ({ children }) => {
	return (
		<>
			<MilestoneHeader>Milestone</MilestoneHeader>
			<MilestoneWrapper>
				<MilestoneInner>{children}</MilestoneInner>
			</MilestoneWrapper>
		</>
	)
}

export default Milestone
