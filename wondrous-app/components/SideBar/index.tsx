import React, { useContext, useState } from 'react'
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
import { useSideBar } from '../../utils/hooks'
import { useQuery } from '@apollo/client'
import { GET_USER_ORGS } from '../../graphql/queries'
import { SafeImage } from '../Common/Image'

const SideBarComponent = (props) => {
  const { data: userOrgs } = useQuery(GET_USER_ORGS)
  const sidebar = useSideBar()
  const minimized = sidebar?.minimized
  const setMinimized = sidebar?.setMinimized

  const handleMinimize = (event) => {
    if (setMinimized) {
      setMinimized(!minimized)
    }
  }

  const signOut = () => {
    logout()
  }

  const listItems = userOrgs?.getUserOrgs

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
                <SafeImage
                  src={item?.profilePicture}
                  style={{
                    width: '36px',
                    height: '36px',
                  }}
                />
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
