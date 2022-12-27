import React from 'react';

import palette from 'theme/palette';
import { SOCIAL_MEDIA_DISCORD, SOCIAL_MEDIA_TWITTER, SOCIAL_OPENSEA, SOCIAL_MEDIA_LINKEDIN } from 'utils/constants';
import { LinkIcon } from 'components/Icons/linkIcon';
import { removeUrlStart } from 'utils/helpers';
import { DiscordIcon } from '../../Icons/discord';
import OpenSeaIcon from '../../Icons/openSea';
import LinkedInIcon from '../../Icons/linkedIn';
import { HeaderActivityLink } from './styles';
import TwitterPurpleIcon from '../../Icons/twitterPurple';

const HeaderSocialLinks = ({ links }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    {links?.map((link) => {
      if (link.type === 'link') {
        return (
          <HeaderActivityLink href={link?.url} key={link?.url} target="_blank">
            <LinkIcon style={{ marginRight: 5 }} />
            {removeUrlStart(link?.name) || removeUrlStart(link?.url)}
          </HeaderActivityLink>
        );
      }
    })}

    {links?.map((link) => {
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
            <HeaderActivityLink href={link?.url} key={link?.url} target="_blank">
              <SocialIcon
                style={{
                  width: '15px',
                  height: '15px',
                }}
                fill={palette.grey57}
              />
            </HeaderActivityLink>
          );
        }
        return null;
      }
    })}
  </div>
);

export default HeaderSocialLinks;
