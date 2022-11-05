import React from 'react';
import { DiscordIcon } from 'components/Icons/discord';
import OpenSeaIcon from 'components/Icons/openSea';
import TwitterPurpleIcon from 'components/Icons/twitterPurple';
import { parseLinks } from 'utils/common';
import router from 'next/router';
import { SOCIAL_MEDIA_DISCORD, SOCIAL_MEDIA_TWITTER, SOCIAL_OPENSEA } from 'utils/constants';
import { formatLinkDisplay } from 'utils/links';
import { useMe } from '../../Auth/withAuth';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import {
  Content,
  ContentContainer,
  HeaderActivity,
  HeaderActivityLink,
  HeaderActivityLinkIcon,
  HeaderActivityLinkText,
  HeaderActivitySocialIcon,
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

const socialIcons = {
  [SOCIAL_MEDIA_TWITTER]: TwitterPurpleIcon,
  [SOCIAL_MEDIA_DISCORD]: DiscordIcon,
  [SOCIAL_OPENSEA]: OpenSeaIcon,
};

interface IWrapperProps {
  userProfileData: {
    [key: string]: any;
  };
  children: React.ReactNode;
}

function Wrapper(props: IWrapperProps) {
  const loggedInUser = useMe();
  const { children, userProfileData = {} } = props;
  const { links } = userProfileData;
  const { mainLink, social } = parseLinks(links);
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
    <SafeImage src={profilePicture} style={style as React.CSSProperties} useNextImage={false} />
  ) : (
    <DefaultUserImage style={style} />
  );
  return (
    <OverviewComponent>
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
              <HeaderOrgPodCount>
                <HeaderPodCount>{podCount}</HeaderPodCount>
                <HeaderPodCountText>Pods</HeaderPodCountText>
              </HeaderOrgPodCount>
              <HeaderOrgPodCount>
                <HeaderOrgCount>{orgCount}</HeaderOrgCount>
                <HeaderOrgCountText>Organizations</HeaderOrgCountText>
              </HeaderOrgPodCount>
              {mainLink?.url && (
                <HeaderActivityLink href={mainLink.url} target="_blank">
                  <HeaderActivityLinkIcon />
                  <HeaderActivityLinkText>{formatLinkDisplay(mainLink)}</HeaderActivityLinkText>
                </HeaderActivityLink>
              )}
              {social.map(({ url, type }) => {
                if (!url) return null;
                const SocialIcon = socialIcons[type];
                return (
                  <HeaderActivityLink key={url} href={url} target="_blank">
                    <HeaderActivitySocialIcon Component={SocialIcon} />
                  </HeaderActivityLink>
                );
              })}
            </HeaderActivity>
          </TokenHeader>
          {children}
        </ContentContainer>
      </Content>
    </OverviewComponent>
  );
}

export default Wrapper;
