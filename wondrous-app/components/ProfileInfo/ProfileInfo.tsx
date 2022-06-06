import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';

import { parseLinks } from 'utils/common';
import { formatLinkDisplay } from 'utils/links';
import { SOCIAL_MEDIA_DISCORD, SOCIAL_MEDIA_TWITTER, SOCIAL_OPENSEA } from 'utils/constants';

import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { SafeImage } from 'components/Common/Image';
import { LinkIcon } from 'components/Icons/linkIcon';
import { DiscordIcon } from 'components/Icons/discord';
import OpenSeaIcon from 'components/Icons/openSea';
import TwitterPurpleIcon from 'components/Icons/twitterPurple';

import styles from './styles';

const SOCIAL_ICONS = {
  [SOCIAL_MEDIA_TWITTER]: TwitterPurpleIcon,
  [SOCIAL_MEDIA_DISCORD]: DiscordIcon,
  [SOCIAL_OPENSEA]: OpenSeaIcon,
};

const ProfileInfo = ({ userProfile }) => {
  const { id, links, firstName, lastName, username, bio, profilePicture, interests } = userProfile;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : username;
  const { mainLink, social, websites } = parseLinks(links);

  return (
    <Box sx={styles.root}>
      <Box sx={styles.infoContainer}>
        {profilePicture ? (
          <SafeImage src={profilePicture} style={styles.userImage} />
        ) : (
          <DefaultUserImage style={styles.userImage} />
        )}
        <Box ml={1.25} />
        <Typography sx={styles.fullName}>{fullName}</Typography>
        <Box ml={1.25} />
        <Typography sx={styles.userName}>@{username}</Typography>
      </Box>
      <Box my={2}>
        <Typography sx={styles.bio}>{bio}</Typography>
      </Box>
      <Box sx={styles.socialContainer}>
        {mainLink?.url && (
          <Link sx={styles.mainLink} href={mainLink.url} target="_blank">
            <Box sx={styles.linkIcon}>
              <LinkIcon />
            </Box>
            {formatLinkDisplay(mainLink)}
          </Link>
        )}
        {social.map(({ url, type }) => {
          if (!url) return null;
          const SocialIcon = SOCIAL_ICONS[type];
          return (
            <Link sx={styles.mainLink} key={url} href={url} target="_blank">
              <Box sx={styles.socialIcon}>
                <SocialIcon />
              </Box>
            </Link>
          );
        })}
      </Box>

      {!isEmpty(interests) && (
        <Box sx={styles.earningInterestsContainer}>
          {/* TODO: Earnings */}
          <Box sx={styles.interestsContainer}>
            <Typography sx={styles.interestText}>Interests</Typography>
            <Box ml={3} />
            {interests.map((item) => (
              <Chip key={item} label={item} sx={styles.interestChip} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProfileInfo;
