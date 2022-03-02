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
import AboutOrganizationsCard from './aboutOrganizationsCard';
import AboutPodsCard from './aboutPodsCard';
import { AboutInfoSeeAll } from './aboutInfoSeeAll';
import {
  AboutInfoBlock,
  AboutInfoBlockContent,
  AboutInfoBlockHeader,
  AboutInfoBlockHeaderCount,
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
  AboutInfoBlockHeaderCountText,
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
  const [getUserAboutPage, { data }] = useLazyQuery(GET_USER_ABOUT_PAGE_DATA);
  useEffect(() => {
    if (!data && userId) {
      getUserAboutPage({
        variables: {
          userId: userId,
        },
      });
    }
  }, [getUserAboutPage, userId, data]);
  return data?.getUserAboutPageData ?? {};
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
  const { id, username } = router.query;
  const userProfileData = useGetUserProfile(id, username);
  const { links, additionalInfo = {}, id: userProfileDataId } = userProfileData;
  const { orgCount, podCount } = additionalInfo;
  const { orgs, pods, tasksCompleted, tasksCompletedCount = 0 } = useGetUserAboutPage(id ?? userProfileDataId);
  const userOrgsData = orgs?.map((org) => <AboutOrganizationsCard key={org.id} {...org} />);
  const userPodsData = pods?.map((pod) => <AboutPodsCard {...pod} key={pod.id} />);
  const userCompletedTasks = tasksCompleted?.map((task) => <AboutCompletedCard {...task} key={task.id} />);
  const userData = [
    {
      name: `DAO${orgCount > 1 ? 's' : ''}`,
      count: orgCount,
      data: userOrgsData,
    },
    {
      name: `Pod${podCount > 1 ? 's' : ''}`,
      count: podCount,
      data: userPodsData,
    },
    {
      name: `Task${tasksCompletedCount > 1 ? 's' : ''} Completed`,
      count: tasksCompletedCount,
      data: userCompletedTasks,
    },
  ];
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
    <Wrapper userProfileData={userProfileData} mainLink={mainLink}>
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

        <AboutInfoContainer>
          {userData
            .filter((i) => i.count > 0)
            .map(({ name, count, data }, i) => (
              <AboutInfoBlock key={i}>
                <AboutInfoBlockHeader>
                  <AboutInfoBlockHeaderCountText>
                    <AboutInfoBlockHeaderCount>{count}</AboutInfoBlockHeaderCount>
                    <AboutInfoBlockHeaderText>{name}</AboutInfoBlockHeaderText>
                  </AboutInfoBlockHeaderCountText>
                  <AboutInfoSeeAll count={count} text={name}>
                    {data}
                  </AboutInfoSeeAll>
                </AboutInfoBlockHeader>
                <AboutInfoBlockContent>{data?.slice(0, 5)}</AboutInfoBlockContent>
              </AboutInfoBlock>
            ))}
        </AboutInfoContainer>
      </AboutSection>
    </Wrapper>
  );
};

export default About;
