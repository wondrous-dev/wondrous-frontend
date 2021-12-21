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

const HeaderComponent = (props) => {
	return (
		<Header>
			<HeaderContainer>
				<HeaderLeftBlock>
					<HeaderLogo />
					<HeaderHomeButton>
						<HomeIcon />
					</HeaderHomeButton>
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
					{props.wallet
					? <Wallet wallet={props.wallet} />
					: ''
					}
					<StyledBadge color="primary" badgeContent={5}>
						<HeaderNotificationsButton>
							<NotificationsIcon />
						</HeaderNotificationsButton>
					</StyledBadge>
					<HeaderCreateButton>
						Create
						<CreateBtnIcon />
					</HeaderCreateButton>
				</HeaderRightBlock>
			</HeaderContainer>
		</Header>
	)
}

export default HeaderComponent
