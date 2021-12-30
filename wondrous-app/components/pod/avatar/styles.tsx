import styled from 'styled-components'
import * as Colors from '../../../theme/colors'

export const AvatarWrapper = styled.div`
	display: flex;
	align-self: flex-start;
	flex-flow: column;
	align-items: center;
	justify-content: center;
	width: 106px;
	height: 106px;
	border-radius: 106px;
	border: ${(props) =>
		props.isOwnerOfPod
			? '10px solid ' + Colors.HighlightBlue
			: '10px solid black'};
	background-color: ${(props) => props.randomColor || Colors.HighlightBlue};
	${(props) =>
		props.avatarURL ? 'background: url(' + props.avatarURL + ');' : ''}
	background-position: center;
	background-size: cover;

	font-size: 24px;
`

export const AvatarContainer = styled.div`
	margin-left: -24px;
`

export const AvatarListWrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	margin-left: 24px;
`
