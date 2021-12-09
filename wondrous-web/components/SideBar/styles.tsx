import React from 'react'
import styled from 'styled-components'
import { Drawer, IconButton, List, ListItem } from '@material-ui/core'

export const DrawerComponent = styled(Drawer)({
	'& .MuiDrawer-paperAnchorDockedLeft': {
		backgroundColor: '#141414',
		zIndex: 1,
		marginTop: 50,
	},
})

export const DrawerContainer = styled.div`
	height: 740px;
	width: 80px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding-top: 50px;
`

export const DrawerTopBlock = styled.div`
	height: 250px;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
`

export const DrawerUserImage = styled.img`
	width: 48px;
	height: 48px;
`

export const DrawerList = styled(List)`
	& {
		height: 152px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0;
		margin: 0;
	}
`
export const DrawerListItem = styled(ListItem)`
	& {
		height: 36px;
		padding: 0;
		margin: 0;
	}
`

export const DrawerListItemIcon = styled.img`
	width: 36px;
	height: 36px;
`

export const DrawerBottomBlock = styled.div`
	height: 135px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
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
    background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);

`
