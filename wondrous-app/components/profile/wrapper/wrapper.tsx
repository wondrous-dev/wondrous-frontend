import React from 'react'
import { useState } from 'react'
import { SIDEBAR_WIDTH } from '../../../utils/constants'
import { SideBarContext } from '../../../utils/contexts'

import Header from '../../Header'
import SideBarComponent from '../../SideBar'
import Tabs from '../tabs/tabs'

import {
  Content,
  ContentContainer,
  HeaderActivity,
  HeaderActivityLink,
  HeaderActivityLinkIcon,
  HeaderButtons,
  HeaderEditProfileButton,
  HeaderFollowers,
  HeaderFollowersAmount,
  HeaderFollowersText,
  HeaderFollowButton,
  HeaderFollowButtonIcon,
  HeaderFollowButtonText,
  HeaderFollowing,
  HeaderFollowingAmount,
  HeaderFollowingText,
  HeaderImage,
  HeaderMainBlock,
  HeaderProjects,
  HeaderProjectsAmount,
  HeaderProjectsText,
  HeaderText,
  HeaderTitle,
  OverviewComponent,
  TokenHeader,
  TokenLogo,
} from './styles'

const Wrapper = (props) => {
  const { children, userProfileData, loggedInUser } = props
  let viewingSelf = false
  if (userProfileData?.id === loggedInUser?.id) {
    viewingSelf = true
  }
  const username = userProfileData?.username
  const bio = userProfileData?.bio
  const orgCount = userProfileData?.additionalInfo?.orgCount
  const podCount = userProfileData?.additionalInfo?.podCount
  const [minimized, setMinimized] = useState(false)
  return (
    <>
      <Header />
      <SideBarContext.Provider
        value={{
          minimized,
          setMinimized,
        }}
      >
        <SideBarComponent />
        <OverviewComponent
          style={{
            paddingLeft: minimized ? 0 : SIDEBAR_WIDTH,
          }}
        >
          <HeaderImage />
          <Content>
            <ContentContainer>
              <TokenHeader>
                <TokenLogo />
                <HeaderMainBlock>
                  <HeaderTitle>{username}</HeaderTitle>
                  {viewingSelf && (
                    <HeaderButtons>
                      <HeaderEditProfileButton>
                        Edit my profile
                      </HeaderEditProfileButton>
                    </HeaderButtons>
                  )}
                </HeaderMainBlock>
                <HeaderText>{bio}</HeaderText>
                <HeaderActivity>
                  <HeaderActivityLink href="https://andros.io">
                    <HeaderActivityLinkIcon />
                    andros.io
                  </HeaderActivityLink>
                  <HeaderFollowers>
                    <HeaderFollowersAmount>
                      {podCount || 0}
                    </HeaderFollowersAmount>
                    <HeaderFollowersText>Pods</HeaderFollowersText>
                  </HeaderFollowers>
                  <HeaderFollowing>
                    <HeaderFollowingAmount>
                      {orgCount || 0}
                    </HeaderFollowingAmount>
                    <HeaderFollowingText>DAOs</HeaderFollowingText>
                  </HeaderFollowing>
                </HeaderActivity>
              </TokenHeader>

              <Tabs>{children}</Tabs>
            </ContentContainer>
          </Content>
        </OverviewComponent>
      </SideBarContext.Provider>
    </>
  )
}

export default Wrapper
