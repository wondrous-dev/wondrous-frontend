import React from 'react'
import { InputAdornment } from '@material-ui/core'

import HomeIcon from '../Icons/home'
import SearchIcon from '../Icons/search'
import NotificationsIcon from '../Icons/notifications'
import CreateBtnIcon from '../Icons/createBtn'

import Wallet from '../Common/Wallet'

import {
	Header,
	HeaderHomeButton,
	HeaderInput,
	HeaderLeftBlock,
	HeaderLogo,
	HeaderNotificationsButton,
	HeaderRightBlock,
	HeaderContainer,
	HeaderCreateButton,
	StyledBadge,
} from './styles'
import Link from 'next/link'
import { PaddedParagraph } from '../Common/text'

const HeaderComponent = (props) => {
	return (
		<Header>
			<HeaderContainer>
				<HeaderLeftBlock>
					<HeaderLogo />
					<Link href="/dashboard">
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
					<StyledBadge color="primary" badgeContent={5}>
						<HeaderNotificationsButton>
							<NotificationsIcon />
						</HeaderNotificationsButton>
					</StyledBadge>
					<HeaderCreateButton highlighted="true">
						<span style={{ padding: '0px 8px' }}>Create</span>
						<CreateBtnIcon />
					</HeaderCreateButton>
				</HeaderRightBlock>
			</HeaderContainer>
		</Header>
	)
}

export default HeaderComponent
