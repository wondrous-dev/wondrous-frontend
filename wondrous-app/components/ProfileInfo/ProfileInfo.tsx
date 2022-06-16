import React, { useState } from 'react';
import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { parseLinks } from 'utils/common';
import { formatLinkDisplay } from 'utils/links';
import { SOCIAL_MEDIA_DISCORD, SOCIAL_MEDIA_TWITTER, SOCIAL_OPENSEA } from 'utils/constants';
import { CREATE_USER_INTEREST } from 'graphql/mutations';
import { GET_USER_INTERESTS } from 'graphql/queries/user';
import { useMutation } from '@apollo/client';
import { useMe } from '../Auth/withAuth';

import { DiscordIcon } from 'components/Icons/discord';
import OpenSeaIcon from 'components/Icons/openSea';
import TwitterPurpleIcon from 'components/Icons/twitterPurple';
import { UserInterestModal, getInterestDisplay } from 'components/Common/UserInterestModal.tsx';

import {
  ProfileInfoWrapper,
  ProfileInfoContainer,
  ProfileInfoUserImage,
  ProfileInfoDefaultImage,
  ProfileInfoFullName,
  ProfileInfoUsername,
  ProfileInfoBioWrapper,
  ProfileInfoBioText,
  ProfileLinkContainer,
  ProfileInfoIcon,
  ProfileInfoLink,
  ProfileInfoMainLink,
  ProfileInfoLinkIcon,
  ProfileInterestText,
  ProfileInfoInterestsContainer,
  ProfileInfoInterestsChip,
  ProfileInfoInterestsChipWrapper,
  ProfileInfoEarningsInterestWrapper,
} from './styles';

const SOCIAL_ICONS = {
  [SOCIAL_MEDIA_TWITTER]: TwitterPurpleIcon,
  [SOCIAL_MEDIA_DISCORD]: DiscordIcon,
  [SOCIAL_OPENSEA]: OpenSeaIcon,
};

const ProfileInfo = ({ userProfile }) => {
  const user = useMe();
  const [openInterestModal, setOpenInterestModal] = useState(false);
  const { id, links, firstName, lastName, username, bio, profilePicture, interests } = userProfile;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : username;
  const { mainLink, social, websites } = parseLinks(links);
  const [createUserInterest] = useMutation(CREATE_USER_INTEREST, { refetchQueries: [GET_USER_INTERESTS] });
  const viewingSelf = user?.username === username;
  return (
    <ProfileInfoWrapper>
      <UserInterestModal
        open={openInterestModal}
        onClose={() => setOpenInterestModal(false)}
        createUserInterest={createUserInterest}
      />

      <ProfileInfoContainer>
        {profilePicture ? <ProfileInfoUserImage src={profilePicture} /> : <ProfileInfoDefaultImage />}
        <ProfileInfoFullName>{fullName ? fullName : username}</ProfileInfoFullName>
        <ProfileInfoUsername>@{username}</ProfileInfoUsername>
      </ProfileInfoContainer>
      <ProfileInfoBioWrapper>
        <ProfileInfoBioText>{bio}</ProfileInfoBioText>
      </ProfileInfoBioWrapper>
      <ProfileLinkContainer>
        {mainLink?.url && (
          <ProfileInfoLink href={mainLink.url} target="_blank">
            <ProfileInfoMainLink>
              <ProfileInfoIcon>
                <ProfileInfoLinkIcon />
              </ProfileInfoIcon>
              <ProfileInfoIcon>{formatLinkDisplay(mainLink)}</ProfileInfoIcon>
            </ProfileInfoMainLink>
          </ProfileInfoLink>
        )}
        {social.map(({ url, type }) => {
          if (!url) return null;
          const SocialIcon = SOCIAL_ICONS[type];
          return (
            <ProfileInfoLink key={url} href={url} target="_blank">
              <ProfileInfoIcon>
                <SocialIcon />
              </ProfileInfoIcon>
            </ProfileInfoLink>
          );
        })}
      </ProfileLinkContainer>

      {(!isEmpty(interests) || viewingSelf) && (
        <ProfileInfoEarningsInterestWrapper>
          {/* TODO: Earnings */}
          <ProfileInfoInterestsContainer>
            <ProfileInterestText>Interests</ProfileInterestText>
            <ProfileInfoInterestsChipWrapper>
              {interests?.map((interest) => {
                return <ProfileInfoInterestsChip key={interest} label={getInterestDisplay(interest)} />;
              })}

              {viewingSelf && (
                <div
                  onClick={() => {
                    setOpenInterestModal(true);
                  }}
                >
                  <ProfileInfoInterestsChip key={'add-interest'} label={'+ Edit interest'} />
                </div>
              )}
            </ProfileInfoInterestsChipWrapper>
          </ProfileInfoInterestsContainer>
        </ProfileInfoEarningsInterestWrapper>
      )}
    </ProfileInfoWrapper>
  );
};

export default ProfileInfo;
