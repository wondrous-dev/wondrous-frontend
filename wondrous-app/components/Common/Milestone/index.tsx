import React from 'react'
import styled from 'styled-components'
import { Purple800, White } from '../../../theme/colors'
import {
	GradientHighlightVertical,
} from '../gradients'

export const MilestoneWrapper = styled.div`
	margin: 0;
	border-bottom-left-radius: 6px;
	border-bottom-right-radius: 6px;
	${GradientHighlightVertical}
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
	border-radius: 3px;
	padding: 1px;
	& > div {
		margin: 0;
	}
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
