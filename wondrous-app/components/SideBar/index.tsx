import React from 'react'
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

const SideBarComponent = (props) => {
	const { listItems } = props

	return (
		<DrawerComponent variant="permanent" anchor="left">
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
					<DrawerBottomButton>
						<ExitIcon />
					</DrawerBottomButton>
					<DrawerBackButton>
						<BackArrowIcon />
					</DrawerBackButton>
				</DrawerBottomBlock>
			</DrawerContainer>
		</DrawerComponent>
	)
}

export default SideBarComponent
