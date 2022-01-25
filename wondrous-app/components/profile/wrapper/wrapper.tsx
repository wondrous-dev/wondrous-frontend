import React from 'react';
import { useState } from 'react';
import { SIDEBAR_WIDTH } from '../../../utils/constants';
import { SideBarContext } from '../../../utils/contexts';
import { SafeImage } from '../../Common/Image';

import Header from '../../Header';
import SideBarComponent from '../../SideBar';
import Tabs from '../tabs/tabs';
import { formatLinkDisplay } from '../../../utils/links';
import {
  Content,
  ContentContainer,
  HeaderActivity,
  HeaderActivityLink,
  HeaderActivityLinkIcon,
  HeaderButtons,
  HeaderEditProfileButton,
  HeaderOrgPodCount,
  HeaderPodCount,
  HeaderPodCountText,
  HeaderOrgCount,
  HeaderOrgCountText,
  HeaderImage,
  HeaderMainBlock,
  HeaderText,
  HeaderTitle,
  OverviewComponent,
  TokenHeader,
  TokenLogo,
} from './styles';
import { MoreInfoModal } from '../../profile/modals';
import router from 'next/router';

const Wrapper = (props) => {
  const [showOrgs, setShowOrgs] = useState(false);
  const [showPods, setShowPods] = useState(false);

  const { children, userProfileData, loggedInUser, mainLink } = props;
  let viewingSelf = false;
  if (userProfileData?.id === loggedInUser?.id) {
    viewingSelf = true;
  }
  const username = userProfileData?.username;
  const bio = userProfileData?.bio;
  const orgCount = userProfileData?.additionalInfo?.orgCount;
  const podCount = userProfileData?.additionalInfo?.podCount;
  const [minimized, setMinimized] = useState(false);
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
                {!userProfileData?.profilePicture && <TokenLogo />}
                {userProfileData?.profilePicture && (
                  <SafeImage
                    src={userProfileData?.profilePicture}
                    style={{
                      width: '96px',
                      height: '96px',
                      position: 'absolute',
                      borderRadius: '48px',
                      top: '-50px',
                      border: '10px solid #0f0f0f',
                    }}
                  />
                )}
                <HeaderMainBlock>
                  <HeaderTitle>{username}</HeaderTitle>
                  {viewingSelf && (
                    <HeaderButtons>
                      <HeaderEditProfileButton onClick={() => router.push(`/profile/settings`)}>
                        Edit my profile
                      </HeaderEditProfileButton>
                    </HeaderButtons>
                  )}
                </HeaderMainBlock>
                <HeaderText>{bio}</HeaderText>
                <HeaderActivity>
                  {mainLink && (
                    <HeaderActivityLink href={mainLink.url} target="_blank">
                      <HeaderActivityLinkIcon />
                      {formatLinkDisplay(mainLink)}
                    </HeaderActivityLink>
                  )}
                  <HeaderOrgPodCount>
                    <HeaderPodCount>{podCount || 0}</HeaderPodCount>
                    <HeaderPodCountText>Pods</HeaderPodCountText>
                  </HeaderOrgPodCount>
                  <HeaderOrgPodCount>
                    <HeaderOrgCount>{orgCount || 0}</HeaderOrgCount>
                    <HeaderOrgCountText>DAOs</HeaderOrgCountText>
                  </HeaderOrgPodCount>
                </HeaderActivity>
              </TokenHeader>

              <Tabs>{children}</Tabs>
            </ContentContainer>
          </Content>
        </OverviewComponent>
      </SideBarContext.Provider>
    </>
  );
};

export default Wrapper;
