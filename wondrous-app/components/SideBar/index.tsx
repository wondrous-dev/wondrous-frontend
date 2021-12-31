import React, { useState } from 'react'
import {
	DrawerBackButton,
	DrawerBottomBlock,
	DrawerBottomButton,
	DrawerComponent,
	DrawerContainer,
	DrawerList,
	DrawerListItem,
	DrawerListItemIcon,
	DrawerTopBlock,
	DrawerUserImage,
} from './styles'
import SettingsIcon from '../Icons/settings'
import ExitIcon from '../Icons/exit'
import BackArrowIcon from '../Icons/backArrow'
import { logout } from '../Auth/withAuth'

const SideBarComponent = (props) => {
	const { listItems } = props

	const [minimized, setMinimized] = useState(false)

	const handleMinimize = (event) => {
		setMinimized(!minimized)
	}

	const signOut = () => {
		logout()
	}

	return (
		<DrawerComponent
			variant="permanent"
			anchor="left"
			className={minimized ? 'active' : ''}
		>
			<DrawerContainer>
				<DrawerTopBlock>
					<DrawerUserImage src="/images/sidebar/avatar.png" />
					<DrawerList>
						{listItems.map((item) => (
							<DrawerListItem button key={item.id}>
								<DrawerListItemIcon src={item.icon} alt="" />
							</DrawerListItem>
						))}
					</DrawerList>
				</DrawerTopBlock>
				<DrawerBottomBlock>
					<DrawerBottomButton>
						<SettingsIcon />
					</DrawerBottomButton>
					<DrawerBottomButton onClick={signOut}>
						<ExitIcon />
					</DrawerBottomButton>
				</DrawerBottomBlock>
			</DrawerContainer>
			<DrawerBackButton
				onClick={handleMinimize}
				className={minimized ? 'active' : ''}
			>
				<BackArrowIcon />
			</DrawerBackButton>
		</DrawerComponent>
	)
}

export default SideBarComponent
