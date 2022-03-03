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
import SocialIcon from '../../Icons/social';
import TwitterPurpleIcon from '../../Icons/twitterPurple';
import {
  UserLinksTableWrapper,
  UserLinksTableRow,
  UserLinksTableRowContent,
  UserLinksTableRowContentItem,
  UserLinksTableRowContentItemLink,
  UserLinksTableRowContentSocialButton,
  UserLinksTableRowNameBlock,
  UserLinksTableRowTitle,
  UserLinksTableRowTitleText,
} from './styles';

export const UserLinksTable = (props) => {
  const { parsedLinks } = props;
  const { social, websites } = parsedLinks;
  const userInfo = [
    {
      label: 'Social',
      data: social.map(({ url, type }) => {
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
        const SocialMediaIcon = SOCIAL_MEDIA_ICONS[type];
        return (
          <UserLinksTableRowContentSocialButton key={url}>
            <a href={url} target="_blank" rel="noreferrer">
              <SocialMediaIcon />
            </a>
          </UserLinksTableRowContentSocialButton>
        );
      }),
    },
    {
      label: 'Links',
      data: websites.map((link) => (
        <UserLinksTableRowContentItem key={link.url}>
          <UserLinksTableRowContentItemLink href={link.url} as="a" target="_blank">
            {formatLinkDisplay(link)}
          </UserLinksTableRowContentItemLink>
        </UserLinksTableRowContentItem>
      )),
    },
  ];
  return (
    <UserLinksTableWrapper>
      {userInfo
        .filter((i) => i.data.length > 0)
        .map(({ label, data }, i) => (
          <UserLinksTableRow key={i}>
            <UserLinksTableRowNameBlock>
              <UserLinksTableRowTitle>
                <SocialIcon />
                <UserLinksTableRowTitleText>{label}</UserLinksTableRowTitleText>
              </UserLinksTableRowTitle>
            </UserLinksTableRowNameBlock>
            <UserLinksTableRowContent>{data}</UserLinksTableRowContent>
          </UserLinksTableRow>
        ))}
    </UserLinksTableWrapper>
  );
};
