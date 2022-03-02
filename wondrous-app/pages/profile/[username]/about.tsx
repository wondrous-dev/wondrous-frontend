import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { withAuth } from '../../../components/Auth/withAuth';
import { UserAboutInfo } from '../../../components/Common/UserAboutInfo';
import { DiscordIcon } from '../../../components/Icons/discord';
import FacebookIcon from '../../../components/Icons/facebook';
import githubIcon from '../../../components/Icons/githubIcon';
import LinkedInIcon from '../../../components/Icons/linkedIn';
import OpenSeaIcon from '../../../components/Icons/openSea';
import SocialIcon from '../../../components/Icons/social';
import TwitterPurpleIcon from '../../../components/Icons/twitterPurple';
import {
  AboutInfoTable,
  AboutInfoTableRow,
  AboutInfoTableRowContent,
  AboutInfoTableRowContentItem,
  AboutInfoTableRowContentItemLink,
  AboutInfoTableRowContentSocialButton,
  AboutInfoTableRowNameBlock,
  AboutInfoTableRowTitle,
  AboutInfoTableRowTitleText,
  AboutSection,
} from '../../../components/profile/about/styles';
import Wrapper from '../../../components/profile/wrapper/wrapper';
import { GET_USER_FROM_USERNAME, GET_USER_PROFILE } from '../../../graphql/queries';
import { parseLinks } from '../../../utils/common';
import {
  SOCIAL_MEDIA_DISCORD,
  SOCIAL_MEDIA_FACEBOOK,
  SOCIAL_MEDIA_GITHUB,
  SOCIAL_MEDIA_LINKEDIN,
  SOCIAL_MEDIA_TWITTER,
  SOCIAL_OPENSEA,
} from '../../../utils/constants';
import { formatLinkDisplay } from '../../../utils/links';

const SOCIAL_MEDIA_ICONS = {
  [SOCIAL_MEDIA_FACEBOOK]: FacebookIcon,
  [SOCIAL_MEDIA_TWITTER]: TwitterPurpleIcon,
  [SOCIAL_MEDIA_LINKEDIN]: LinkedInIcon,
  [SOCIAL_MEDIA_DISCORD]: DiscordIcon,
  [SOCIAL_MEDIA_GITHUB]: githubIcon,
  // [SOCIAL_MEDIA_SPOTIFY]: LinkedInIcon,
  // [SOCIAL_MEDIA_INSTAGRAM]: LinkedInIcon,
  [SOCIAL_OPENSEA]: OpenSeaIcon,
};

const useGetUserProfile = (id, username) => {
  const [getUser, { data: getUserProfileData }] = useLazyQuery(GET_USER_PROFILE);
  const [getUserFromUsername, { data: getUserFromUsernameData }] = useLazyQuery(GET_USER_FROM_USERNAME);
  useEffect(() => {
    if (!getUserProfileData && id) {
      getUser({
        variables: {
          userId: id,
        },
      });
    } else if (!getUserFromUsernameData && !id && username) {
      getUserFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [getUser, getUserFromUsername, getUserFromUsernameData, getUserProfileData, id, username]);
  return getUserProfileData?.getUser ?? getUserFromUsernameData?.getUserFromUsername ?? {};
};

const About = (props) => {
  const router = useRouter();
  const { username, id: routerId } = router.query;
  const userProfile = useGetUserProfile(routerId, username);
  const { links, id: userProfileId } = userProfile;
  const { social, websites, mainLink } = parseLinks(links);
  const userInfo = [
    {
      label: 'Social',
      data: social.map(({ url, type }) => {
        const SocialMediaIcon = SOCIAL_MEDIA_ICONS[type];
        return (
          <AboutInfoTableRowContentSocialButton key={url}>
            <a href={url} target="_blank" rel="noreferrer">
              <SocialMediaIcon />
            </a>
          </AboutInfoTableRowContentSocialButton>
        );
      }),
    },
    {
      label: 'Links',
      data: websites.map((link) => (
        <AboutInfoTableRowContentItem key={link.url}>
          <AboutInfoTableRowContentItemLink href={link.url} as="a" target="_blank">
            {formatLinkDisplay(link)}
          </AboutInfoTableRowContentItemLink>
        </AboutInfoTableRowContentItem>
      )),
    },
  ];
  return (
    <Wrapper userProfileData={userProfile} mainLink={mainLink}>
      <AboutSection>
        <AboutInfoTable>
          {userInfo
            .filter((i) => i.data.length > 0)
            .map(({ label, data }, i) => (
              <AboutInfoTableRow key={i}>
                <AboutInfoTableRowNameBlock>
                  <AboutInfoTableRowTitle>
                    <SocialIcon />
                    <AboutInfoTableRowTitleText>{label}</AboutInfoTableRowTitleText>
                  </AboutInfoTableRowTitle>
                </AboutInfoTableRowNameBlock>
                <AboutInfoTableRowContent>{data}</AboutInfoTableRowContent>
              </AboutInfoTableRow>
            ))}
        </AboutInfoTable>
        <UserAboutInfo id={userProfileId} />
      </AboutSection>
    </Wrapper>
  );
};

export default withAuth(About);
