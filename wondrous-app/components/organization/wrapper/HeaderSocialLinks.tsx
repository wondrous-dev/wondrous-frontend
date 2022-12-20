import React from 'react';

import { SOCIAL_MEDIA_DISCORD, SOCIAL_MEDIA_TWITTER, SOCIAL_OPENSEA, SOCIAL_MEDIA_LINKEDIN } from 'utils/constants';
import { removeUrlStart } from 'utils/helpers';
import { DiscordIcon } from '../../Icons/discord';
import OpenSeaIcon from '../../Icons/openSea';
import LinkedInIcon from '../../Icons/linkedIn';
import { HeaderActivityLink, HeaderActivityLinkIcon } from './styles';
import TwitterPurpleIcon from '../../Icons/twitterPurple';

const HeaderSocialLinks = ({ links }) => (
  <>
    {links?.map((link, index) => {
      if (link.type === 'link') {
        return (
          <HeaderActivityLink href={link?.url} key={index} target="_blank">
            <HeaderActivityLinkIcon />
            {removeUrlStart(link?.name) || removeUrlStart(link?.url)}
          </HeaderActivityLink>
        );
      }
    })}

    {links?.map((link, index) => {
      if (link.type !== 'link') {
        let SocialIcon = null;
        switch (link.type) {
          case SOCIAL_MEDIA_DISCORD:
            SocialIcon = DiscordIcon;
            break;
          case SOCIAL_MEDIA_TWITTER:
            SocialIcon = TwitterPurpleIcon;
            break;
          case SOCIAL_MEDIA_LINKEDIN:
            SocialIcon = LinkedInIcon;
            break;
          case SOCIAL_OPENSEA:
            SocialIcon = OpenSeaIcon;
            break;
        }
        if (SocialIcon) {
          return (
            <HeaderActivityLink href={link?.url} key={index} target="_blank">
              <SocialIcon
                style={{
                  width: '20px',
                  height: '20px',
                }}
                fill="#ccbbff"
              />
            </HeaderActivityLink>
          );
        }
        return null;
      }
    })}
  </>
);

export default HeaderSocialLinks;
