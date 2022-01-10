import styled from 'styled-components'
import { Black30, Grey75, White } from '../../theme/colors'
import {
	GradientMidnightDiagonalOposite,
	GradientMidnightVertical,
} from '../Common/gradients'

export const NotificationsBoardWrapper = styled.div`
    position: absolute;
    min-width: 300px;
    min-height: 30px;

    padding: 0px;
    padding-bottom: 6px;
    margin-left: -143px;
    margin-top: 9px;

    border-radius: 5px;
    background: black;

    ${GradientMidnightDiagonalOposite}

    transition: 0.2s display;
    z-index: 100;

    background: linear-gradient(142.08deg, #1E1E1E 39.8%, #141414 73.9%);
    border: 1px solid #4B4B4B;
    border-radius: 3px;

    display: flex;
    flex-direction: column;
    justify-content; space-evenly;

    font-size: 13px;
`

export const NotificationsBoardArrow = styled.div`
	position: absolute;
	height: 40px;
	width: 40px;

	background: linear-gradient(176.83deg, #1e1e1e -68.66%, #141414 239.25%);
	border: 1px solid #4b4b4b;

	/* drop shadow */
	box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.55);

	border-radius: 8px;
	transform: rotate(45deg);

	margin-left: 0px;
	margin-top: 2px;

	content: '';
	z-index: 99;
`

export const NotificationsBoardOverArrow = styled.div`
	position: absolute;
	height: 30px;
	width: 30px;

	background: linear-gradient(
		135deg,
		#1b1b1b 0%,
		#1b1b1b 40%,
		rgba(0, 0, 0, 0) 40%,
		#191919 100%
	);
	border: 0px solid transparent;

	/* drop shadow */
	box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.55);

	border-radius: 8px;
	transform: rotate(45deg);

	margin-left: 5px;
	margin-top: 1px;

	content: '';
	z-index: 102;
`

export const NotificationsItem = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;

	padding: 15px 0px;
	margin: 0px;

	height: 50px;
	line-height: 20px;

	cursor: pointer;

	:hover {
		${GradientMidnightVertical}
		border-radius: 5px;
	}
`

export const NotificationItemIcon = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: end;
	justify-content: center;
	height: 50px;
	width: 27px;

	margin: 0px 15px;
`

export const NotificationItemStatus = styled.div`
	position: absolute;
	top: 12px;
	right: 0;
	width: 10px;
	height: 10px;
	z-index: 103;
`

export const NotificationItemBody = styled.div`
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
`

export const NotificationItemTimeline = styled.div`
	display: flex;

	color: ${Black30};
	line-height: 14px;
`

export const NotificationsBoardHeader = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	width: 100%;
	padding: 15px;

	height: 46px;
	line-height: 46px;

	background: linear-gradient(176.83deg, #1e1e1e -68.66%, #141414 239.25%);
	border-bottom: 1px solid ${Grey75};
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
`

export const NotificationsMarkRead = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    line-height 32px;

    ${(props) =>
			props.enabled
				? `
        color: ${White};
        text-decoration: underline;
        `
				: `
        color: ${Grey75};
        text-decoration: none;
        `}
`

export const NotificationsOverlay = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	height: 100vh;
	width: 100vw;
	background: transparent;
	z-index: 97;
`
