import styled from 'styled-components'
import * as Colors from '../../../theme/colors'

export const SmallAvatarWrapper = styled.div`
	display: flex;
	align-self: flex-start;
	flex-flow: column;
	align-items: center;
	justify-content: center;
	width: 27px;
	height: 27px;
	border-radius: 27px;
	box-shadow: 0 2px solid black;
	border: ${(props) =>
		props.isOwnerOfPod
			? '1.5px solid ' + Colors.HighlightBlue
			: '1.5px solid black'};
	background-color: ${(props) => props.randomColor};
	${(props) =>
		props.avatarURL ? 'background: url(' + props.avatarURL + ');' : ''}
	background-position: center;
	background-size: cover;

	font-size: 10px;
`

export const BlackAura = styled.div`
	min-width: 27px;
	min-height: 27px;
	border-radius: 27px;
	margin-left: -6px;
	border: 1px solid black;
	background: black;
	padding: 0;
`

export const AvatarListWrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	margin-left: 16px;
`
