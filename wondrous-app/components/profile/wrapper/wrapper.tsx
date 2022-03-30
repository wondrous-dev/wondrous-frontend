import router from 'next/router';
import React, { useState } from 'react';
import { SIDEBAR_WIDTH } from '../../../utils/constants';
import { SideBarContext } from '../../../utils/contexts';
import { formatLinkDisplay } from '../../../utils/links';
import { useMe } from '../../Auth/withAuth';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import Header from '../../Header';
import SideBarComponent from '../../SideBar';
import Tabs from '../tabs/tabs';
import {
  Content,
  ContentContainer,
  HeaderActivity,
  HeaderActivityLink,
  HeaderActivityLinkIcon,
  HeaderButtons,
  HeaderEditProfileButton,
  HeaderMainBlock,
  HeaderOrgCount,
  HeaderOrgCountText,
  HeaderOrgPodCount,
  HeaderPodCount,
  HeaderPodCountText,
  HeaderText,
  HeaderTitle,
  HeaderUserName,
  OverviewComponent,
  TokenHeader,
  HeaderImageDefault,
  HeaderImageWrapper,
} from './styles';

const Wrapper = (props) => {
  const [minimized, setMinimized] = useState(false);
  const loggedInUser = useMe();
  const { children, userProfileData = {}, mainLink } = props;
  const { firstName, lastName, username, bio, additionalInfo = {}, profilePicture } = userProfileData;
  const { orgCount, podCount } = additionalInfo;
  const viewingSelf = userProfileData?.id === loggedInUser?.id;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : username;
  const style = {
    width: '96px',
    height: '96px',
    position: 'absolute',
    borderRadius: '48px',
    top: '-50px',
    border: '10px solid #0f0f0f',
  };
  const profileImageComponent = profilePicture ? (
    <SafeImage src={profilePicture} style={style} />
  ) : (
    <DefaultUserImage style={style} />
  );
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
          <HeaderImageWrapper>
            <HeaderImageDefault />
          </HeaderImageWrapper>
          <Content>
            <ContentContainer>
              <TokenHeader>
                {profileImageComponent}
                <HeaderMainBlock>
                  <HeaderTitle>{fullName}</HeaderTitle>
                  {viewingSelf && (
                    <HeaderButtons>
                      <HeaderEditProfileButton
                        onClick={() =>
                          router.push(`/profile/settings`, undefined, {
                            shallow: true,
                          })
                        }
                      >
                        Edit my profile
                      </HeaderEditProfileButton>
                    </HeaderButtons>
                  )}
                </HeaderMainBlock>
                <HeaderUserName>@{username}</HeaderUserName>
                {bio && <HeaderText>{bio}</HeaderText>}
                <HeaderActivity>
                  {mainLink && (
                    <HeaderActivityLink href={mainLink.url} target="_blank">
                      <HeaderActivityLinkIcon />
                      {formatLinkDisplay(mainLink)}
                    </HeaderActivityLink>
                  )}
                  <HeaderOrgPodCount>
                    <HeaderPodCount>{podCount}</HeaderPodCount>
                    <HeaderPodCountText>Pods</HeaderPodCountText>
                  </HeaderOrgPodCount>
                  <HeaderOrgPodCount>
                    <HeaderOrgCount>{orgCount}</HeaderOrgCount>
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
