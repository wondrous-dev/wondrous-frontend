import React from 'react'
import styled from 'styled-components'
import { Background, Blue800, Violet300 } from '../../../theme/colors'

export const TaskSummaryWrapper = styled.div`
	display: flex;
	margin: 1em auto;
	align-self: center;

	padding: 1px;
	background: #515151;

	background: ${Background};

	border-radius: 6px;

	min-width: 296px;
	min-height: 170px;
	width: 296px;
`

export const TaskSummaryInner = styled.div`
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	flex-flow: column wrap;
	align-items: stretch;

	border-radius: 5px;
	padding: 14px;

	padding-bottom: 18px;
`

export const TaskSummaryMedia = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	width: 29px;
	height: 29px;

	border-radius: 3px;

	background-color: ${Blue800};
`

export const TaskSummaryFooter = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	height: 42px;
`

export const TaskSummaryAction = styled.div`
	display: flex;
	flex-grow: 1;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;

	cursor: pointer;

	font-size: 16px;
	color: ${Violet300};
`
