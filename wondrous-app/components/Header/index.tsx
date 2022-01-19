import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { InputAdornment } from '@material-ui/core'

import HomeIcon from '../Icons/home'
import SearchIcon from '../Icons/search'
import {
	StatusArchived,
	StatusAssigned,
	StatusLiked,
} from '../Icons/notifications'
import CreateBtnIcon from '../Icons/createBtn'

import Wallet from '../Common/Wallet'

import {
	Header,
	HeaderHomeButton,
	HeaderInput,
	HeaderLeftBlock,
	HeaderLogo,
	HeaderRightBlock,
	HeaderContainer,
	HeaderCreateButton,
} from './styles'
import { StyledLink } from '../Common/text'
import NotificationsBoard from '../Notifications'
import { SmallAvatar } from '../Common/AvatarList'
import { GET_NOTIFICATIONS } from '../../graphql/queries'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'

const NOTIFICATIONS_MOCK = [
	{
		id: 12341234124,
		timestamp: 123412341234,
		text: (
			<>
				<b>Adam</b> liked Terry&apos;s <StyledLink href="#">post</StyledLink>
			</>
		),
		icon: <SmallAvatar initials="AO" />,
		status: <StatusLiked />,
		unread: true,
	},
	{
		id: 12341234125,
		timestamp: 123412341236,
		text: (
			<>
				<b>Adam</b> assigned a <StyledLink href="#">task</StyledLink> to Terry
			</>
		),
		icon: <SmallAvatar initials="AO" />,
		status: <StatusAssigned />,
		unread: true,
	},
	{
		id: 12341234126,
		timestamp: 123412341236,
		text: (
			<>
				<b>Terry</b> archived a <StyledLink href="#">pod</StyledLink> in{' '}
				<StyledLink href="#">Wonder</StyledLink>
			</>
		),
		icon: <SmallAvatar initials="TP" />,
		status: <StatusArchived />,
		unread: true,
	},
	{
		id: 12341234127,
		timestamp: 123412341236,
		text: (
			<>
				<b>Content</b> pod assigned you a <StyledLink href="#">task</StyledLink>
			</>
		),
		icon: <SmallAvatar initials="CP" />,
		status: <StatusAssigned />,
		unread: true,
	},
	{
		id: 12341234128,
		timestamp: 123412341236,
		text: (
			<>
				<b>TikTok</b> pod assigned you a <StyledLink href="#">task</StyledLink>
			</>
		),
		icon: <SmallAvatar initials="CP" />,
		status: <StatusAssigned />,
		unread: true,
	},
]

const HeaderComponent = (props) => {

	// Grab Notifications from Backend
	const { data: notifications } = useQuery(GET_NOTIFICATIONS)
	const { openCreateFormModal } = props

	const setNotifications = (newNotifications) => {
		console.log(newNotifications)
		// Read
		return true
	}

	return (
		<Header>
			<HeaderContainer>
				<HeaderLeftBlock>
					<HeaderLogo />
					<Link passHref href="/dashboard">
						<HeaderHomeButton>
							<HomeIcon />
						</HeaderHomeButton>
					</Link>
					<HeaderInput
						placeholder="Search wonder..."
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
				</HeaderLeftBlock>
				<HeaderRightBlock>
					<Wallet />

					<NotificationsBoard
						notifications={notifications || []}
						setNofications={setNotifications}
					/>

					<HeaderCreateButton highlighted="true" onClick={openCreateFormModal}>
						<span style={{ padding: '0px 8px' }}>Create</span>
						<CreateBtnIcon />
					</HeaderCreateButton>
				</HeaderRightBlock>
			</HeaderContainer>
		</Header>
	)
}

export default HeaderComponent
