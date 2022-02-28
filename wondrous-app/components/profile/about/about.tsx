import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_USER_ABOUT_PAGE_DATA, GET_USER_FROM_USERNAME, GET_USER_PROFILE } from '../../../graphql/queries';
import {
  SOCIAL_MEDIA_DISCORD,
  SOCIAL_MEDIA_FACEBOOK,
  SOCIAL_MEDIA_GITHUB,
  SOCIAL_MEDIA_LINKEDIN,
  SOCIAL_MEDIA_TWITTER,
  SOCIAL_OPENSEA,
} from '../../../utils/constants';
import { formatLinkDisplay } from '../../../utils/links';
import { DiscordIcon } from '../../Icons/discord';
import FacebookIcon from '../../Icons/facebook';
import githubIcon from '../../Icons/githubIcon';
import LinkedInIcon from '../../Icons/linkedIn';
import OpenSeaIcon from '../../Icons/openSea';
import LinksIcon from '../../Icons/resume';
import SocialIcon from '../../Icons/social';
import TwitterPurpleIcon from '../../Icons/twitterPurple';
import Wrapper from '../wrapper/wrapper';
import AboutCompletedCard from './aboutCompletedCard';
import AboutOrganisationsCard from './aboutOrganisationsCard';
import AboutPodsCard from './aboutPodsCard';
import {
  AboutInfoBlock,
  AboutInfoBlockContent,
  AboutInfoBlockHeader,
  AboutInfoBlockHeaderAmount,
  AboutInfoBlockHeaderText,
  AboutInfoContainer,
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
} from './styles';

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
const SOCIAL_LINKS = ['twitter', 'discord', 'instagram', 'github', 'linkedin', 'spotify', 'opensea', 'facebook'];

const parseLinks = (links) => {
  /**
   * parse links from backend into social links, websites, and main
   */
  if (!links) {
    return {
      social: [],
      websites: [],
      mainLink: null,
    };
  }
  let mainLink = null;
  const socialLinks = [];
  const websites = [];
  for (const link of links) {
    if (!link.type || link.type === 'website') {
      websites.push(link);
    } else if (SOCIAL_LINKS.includes(link.type)) {
      socialLinks.push(link);
    } else if (link.type === 'main') {
      mainLink = link;
    }
  }
  if (mainLink === null) {
    if (websites.length > 0) {
      mainLink = websites[0];
    } else if (socialLinks.length > 0) {
      mainLink = socialLinks[0];
    }
  }
  return {
    social: socialLinks,
    websites: websites,
    mainLink: mainLink,
  };
};

const useGetUserAboutPage = (userId) => {
  const [getUserAboutPage, { data: getUserAboutPageData }] = useLazyQuery(GET_USER_ABOUT_PAGE_DATA);
  useEffect(() => {
    if (userId) {
      getUserAboutPage({
        variables: {
          userId: userId,
        },
      });
    }
  }, [getUserAboutPage, userId]);
  const {
    orgs: userOrgsData = [],
    pods: userPodsData = [],
    taskCompleted: userCompletedTasks = [],
    tasksCompletedCount = 0,
  } = getUserAboutPageData?.getUserAboutPageData ?? {};
  return { userOrgsData, userPodsData, userCompletedTasks, tasksCompletedCount };
};

const useGetUserProfile = (id, username) => {
  const [getUser, { data: getUserProfileData }] = useLazyQuery(GET_USER_PROFILE);
  const [getUserFromUsername, { data: getUserFromUsernameData }] = useLazyQuery(GET_USER_FROM_USERNAME);
  useEffect(() => {
    if (id) {
      getUser({
        variables: {
          userId: id,
        },
      });
    } else if (!id && username) {
      getUserFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [getUser, getUserFromUsername, id, username]);
  return getUserProfileData?.getUser ?? getUserFromUsernameData?.getUserFromUsername ?? {};
};

const About = (props) => {
  const router = useRouter();
  const { id, username } = router.query;
  const userProfileData = useGetUserProfile(id, username);
  const { links, additionalInfo = {}, id: userProfileDataId } = userProfileData;
  const { social, websites, mainLink } = parseLinks(links);
  const { orgCount, podCount } = additionalInfo;
  const { userOrgsData, userPodsData, userCompletedTasks, tasksCompletedCount } = useGetUserAboutPage(
    id ?? userProfileDataId
  );
  return (
    <Wrapper userProfileData={userProfileData} mainLink={mainLink}>
      <AboutSection>
        <AboutInfoTable>
          {social.length > 0 && (
            <AboutInfoTableRow>
              <AboutInfoTableRowNameBlock>
                <AboutInfoTableRowTitle>
                  <SocialIcon />
                  <AboutInfoTableRowTitleText>Social</AboutInfoTableRowTitleText>
                </AboutInfoTableRowTitle>
              </AboutInfoTableRowNameBlock>
              <AboutInfoTableRowContent>
                {social.map(({ url, type }) => {
                  const SocialMediaIcon = SOCIAL_MEDIA_ICONS[type];
                  return (
                    <AboutInfoTableRowContentSocialButton key={url}>
                      <a href={url} target="_blank" rel="noreferrer">
                        <SocialMediaIcon />
                      </a>
                    </AboutInfoTableRowContentSocialButton>
                  );
                })}
              </AboutInfoTableRowContent>
            </AboutInfoTableRow>
          )}
          {websites.length > 0 && (
            <AboutInfoTableRow>
              <AboutInfoTableRowNameBlock>
                <AboutInfoTableRowTitle>
                  <LinksIcon />
                  <AboutInfoTableRowTitleText>Links</AboutInfoTableRowTitleText>
                </AboutInfoTableRowTitle>
              </AboutInfoTableRowNameBlock>
              <AboutInfoTableRowContent>
                {websites.map((link) => (
                  <AboutInfoTableRowContentItem key={link.url}>
                    <AboutInfoTableRowContentItemLink href={link.url} as="a" target="_blank">
                      {formatLinkDisplay(link)}
                    </AboutInfoTableRowContentItemLink>
                  </AboutInfoTableRowContentItem>
                ))}
              </AboutInfoTableRowContent>
            </AboutInfoTableRow>
          )}
        </AboutInfoTable>

        <AboutInfoContainer>
          {orgCount > 0 && (
            <AboutInfoBlock>
              <AboutInfoBlockHeader>
                <AboutInfoBlockHeaderAmount>{orgCount}</AboutInfoBlockHeaderAmount>
                <AboutInfoBlockHeaderText>DAOs</AboutInfoBlockHeaderText>
              </AboutInfoBlockHeader>
              <AboutInfoBlockContent>
                {userOrgsData.map((organization) => (
                  <AboutOrganisationsCard
                    key={organization.id}
                    thumbnailPicture={organization.thumbnailPicture}
                    profilePicture={organization.profilePicture}
                    orgId={organization.id}
                    name={organization.name}
                    description={organization.description}
                  />
                ))}
              </AboutInfoBlockContent>
            </AboutInfoBlock>
          )}
          {podCount > 0 && (
            <AboutInfoBlock>
              <AboutInfoBlockHeader>
                <AboutInfoBlockHeaderAmount>{podCount}</AboutInfoBlockHeaderAmount>
                <AboutInfoBlockHeaderText>Pods</AboutInfoBlockHeaderText>
              </AboutInfoBlockHeader>
              <AboutInfoBlockContent>
                {userPodsData.map((pod) => (
                  <AboutPodsCard
                    key={pod.id}
                    thumbnailPicture={pod.thumbnailPicture}
                    profilePicture={pod.profilePicture}
                    org={pod.org}
                    podId={pod.id}
                    name={pod.name}
                    description={pod.description}
                  />
                ))}
              </AboutInfoBlockContent>
            </AboutInfoBlock>
          )}
          {tasksCompletedCount > 0 && (
            <AboutInfoBlock>
              <AboutInfoBlockHeader>
                <AboutInfoBlockHeaderAmount>{tasksCompletedCount}</AboutInfoBlockHeaderAmount>
                <AboutInfoBlockHeaderText>completed tasks</AboutInfoBlockHeaderText>
                {/* <AboutInfoBlockHeaderSeeAll>See all</AboutInfoBlockHeaderSeeAll> */}
              </AboutInfoBlockHeader>
              <AboutInfoBlockContent>
                <AboutCompletedCard userCompletedTasks={userCompletedTasks} />
              </AboutInfoBlockContent>
            </AboutInfoBlock>
          )}
        </AboutInfoContainer>
      </AboutSection>
    </Wrapper>
  );
};

export default About;
