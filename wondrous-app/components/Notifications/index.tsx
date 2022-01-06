import React, { useMemo, useState } from 'react'
import { DropDown, DropDownItem } from '../Common/dropdown'

import { HeaderNotificationsButton, StyledBadge } from '../Header/styles'
import NotificationsIcon from '../Icons/notifications'
import { TaskMenuIcon } from '../Icons/taskMenu'
import { NotificationItemBody, NotificationItemIcon, NotificationItemStatus, NotificationItemTimeline, NotificationsBoardArrow, NotificationsBoardHeader, NotificationsBoardOverArrow, NotificationsBoardWrapper, NotificationsItem, NotificationsMarkRead, NotificationsOverlay } from './styles'

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
						<NotificationsMarkRead enabled={notifications.length}>
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
