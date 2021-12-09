import React from 'react'
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
import HomeIcon from '../Icons/home'
import { InputAdornment } from '@material-ui/core'
import SearchIcon from '../Icons/search'
import NotificationsIcon from '../Icons/notifications'
import CreateBtnIcon from '../Icons/createBtn'

const HeaderComponent = () => {
	return (
		<Header>
			<HeaderContainer>
				<HeaderLeftBlock>
					<HeaderLogo src="/images/logo/wonder-logo-no-text.png" />
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
