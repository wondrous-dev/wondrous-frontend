import React from 'react'
import styled from 'styled-components'
import { Drawer, IconButton, List, ListItem } from '@material-ui/core'
import { Black97 } from '../../theme/colors'

export const DrawerComponent = styled(Drawer)`
	&& {
		& .MuiDrawer-paperAnchorDockedLeft {
			background-color: ${Black97};
			z-index: 200;
			margin-top: 50px;
			transition: 0.3s;
		}

		&.active .MuiDrawer-paperAnchorDockedLeft {
			left: -80px;
		}
	}
`

export const DrawerContainer = styled.div`
	min-height: 740px;
	width: 80px;
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding-top: 50px;
`

export const DrawerTopBlock = styled.div`
	min-height: 250px;
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	justify-content: space-evenly;
`

export const DrawerUserImage = styled.img`
	display: flex;
	margin: 0 auto;
	width: 48px;
	height: 48px;
`

export const DrawerList = styled(List)`
	& {
		min-height: 152px;
		display: flex;
		flex-direction: column;
		align-content: flex-start;
		justify-content: space-evenly;
		padding: 0;
		margin: 1em auto;
	}
`
export const DrawerListItem = styled(ListItem)`
	& {
		display: flex;
		height: 36px;
		padding: .5em auto;
		margin: .5em auto;
	}
`

export const DrawerListItemIcon = styled.img`
	width: 36px;
	height: 36px;
`

export const DrawerBottomBlock = styled.div`
	min-height: 85px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	margin-bottom: 120px;
`
export const DrawerBottomButton = styled(IconButton)`
	&& {
		width: 45px;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`

export const DrawerBackButton = styled(DrawerBottomButton)`
	&& {
		position: fixed;
		bottom: 20px;
		left: 20px;
		width: 45px;
		height: 45px;
		display: flex;
		align-items: center;
		justify-content: center;
	
		background: linear-gradient(
			169.47deg,
			rgba(75, 75, 75, 0.6) 7.84%,
			rgba(35, 35, 35, 0.6) 108.71%
		);

		transition: transform 0.2s;
	
		&.active {
			transform: rotate(180deg);
		}
	}
`
