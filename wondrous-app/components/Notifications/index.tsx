import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Black30, Grey75, White } from '../../theme/colors'
import { DropDown, DropDownItem } from '../Common/dropdown'
import {
	GradientMidnightDiagonalOposite,
	GradientMidnightVertical,
} from '../Common/gradients'
import { StyledLink } from '../Common/text'
import { HeaderNotificationsButton, StyledBadge } from '../Header/styles'
import NotificationsIcon from '../Icons/notifications'
import { TaskMenuIcon } from '../Icons/taskMenu'

const NotificationsBoardWrapper = styled.div`
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

const NotificationsBoardArrow = styled.div`
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

const NotificationsBoardOverArrow = styled.div`
	position: absolute;
	height: 40px;
	width: 40px;

	background: linear-gradient(176.83deg, #1e1e1e -68.66%, #141414 239.25%);
	border: 0px solid transparent;

	/* drop shadow */
	box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.55);

	border-radius: 8px;
	transform: rotate(45deg);

	margin-left: 0px;
	margin-top: 3px;

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

    color: ${White};
    text-decoration: underline;
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

const NotificationsBoard = ({ notifications, setNofications }) => {
	const unreadCount = useMemo(() => {
		return notifications.filter((n) => n.unread).length
	}, [notifications])

	const [isOpen, setIsOpen] = useState(false)

	const toggleNotifications = () => {
		setIsOpen(!isOpen)
	}

	const calculateTimeLapse = (timestamp) => {
		return '18 minutes ago.'
	}

	const handleMarkAllRead = async () => {
		console.log('Tap on Mark all read')
	}

	const handleCleanNotifications = () => {
		setNofications([])
	}

	const handleNotificationsSettings = () => {
		console.log('Tap on Notifications Settings')
	}

	const display = isOpen ? 'block' : 'none'

	return (
		<>
			<NotificationsOverlay
				onClick={toggleNotifications}
				style={{ display: display }}
			/>
			<div>
				<StyledBadge
					color="primary"
					badgeContent={unreadCount}
					onClick={toggleNotifications}
				>
					<HeaderNotificationsButton>
						<NotificationsIcon />
					</HeaderNotificationsButton>
				</StyledBadge>
				<NotificationsBoardWrapper style={{ display: display }}>
					<NotificationsBoardHeader>
						<NotificationsMarkRead>
							<span style={{ cursor: 'pointer' }} onClick={handleMarkAllRead}>
								Mark all as read
							</span>
						</NotificationsMarkRead>
						<div style={{ lineHeight: '12px' }}>
							<DropDown DropdownHandler={TaskMenuIcon}>
								<DropDownItem
									key={'notifications-menu-clean'}
									onClick={handleCleanNotifications}
								>
									Clean all notifications
								</DropDownItem>
								<DropDownItem
									key={'notifications-menu-settings'}
									onClick={handleNotificationsSettings}
								>
									Settings
								</DropDownItem>
							</DropDown>
						</div>
					</NotificationsBoardHeader>
					{notifications.length ? (
						notifications.map((notification) => (
							<NotificationsItem key={'notifications-' + notification.id}>
								<NotificationItemIcon>
									{notification.icon}
									<NotificationItemStatus>
										{notification.status}
									</NotificationItemStatus>
								</NotificationItemIcon>
								<NotificationItemBody>
									<div style={{ paddingTop: '2px' }}>{notification.text}</div>
									<NotificationItemTimeline>
										{calculateTimeLapse(notification.timestamp)}
									</NotificationItemTimeline>
								</NotificationItemBody>
							</NotificationsItem>
						))
					) : (
						<NotificationsItem>
							<NotificationItemIcon />
							<NotificationItemBody>No notifications</NotificationItemBody>
						</NotificationsItem>
					)}
				</NotificationsBoardWrapper>
				<NotificationsBoardArrow style={{ display: display }} />
				<NotificationsBoardOverArrow style={{ display: display }} />
			</div>
		</>
	)
}

export default NotificationsBoard
