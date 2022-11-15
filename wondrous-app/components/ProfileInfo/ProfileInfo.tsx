import React, { useState } from 'react';
import isEmpty from 'lodash/isEmpty';

import { parseLinks } from 'utils/common';
import { formatLinkDisplay } from 'utils/links';
import { SOCIAL_MEDIA_DISCORD, SOCIAL_MEDIA_TWITTER, SOCIAL_OPENSEA } from 'utils/constants';
import { CREATE_USER_INTEREST } from 'graphql/mutations';
import { GET_USER_INTERESTS } from 'graphql/queries/user';
import { useMutation } from '@apollo/client';

import { DiscordIcon } from 'components/Icons/discord';
import OpenSeaIcon from 'components/Icons/openSea';
import TwitterPurpleIcon from 'components/Icons/twitterPurple';
import { UserInterestModal, getInterestDisplay } from 'components/Common/UserInterestModal';

import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import ChooseEntityToCreate from 'components/CreateEntity';
import { removeUrlStart } from 'utils/helpers';
import styles, {
  ProfileInfoWrapper,
  ProfileInfoContainer,
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
import { useMe } from '../Auth/withAuth';

const SOCIAL_ICONS = {
  [SOCIAL_MEDIA_TWITTER]: TwitterPurpleIcon,
  [SOCIAL_MEDIA_DISCORD]: DiscordIcon,
  [SOCIAL_OPENSEA]: OpenSeaIcon,
};

function ProfileInfo({ userProfile }) {
  const user = useMe();
  const [openGR15Modal, setOpenGR15Modal] = useState(false);
  const [openInterestModal, setOpenInterestModal] = useState(false);
  const { id, links, firstName, lastName, username, bio, profilePicture, interests } = userProfile;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : username;
  const { mainLink, social, websites } = parseLinks(links);
  const [createUserInterest] = useMutation(CREATE_USER_INTEREST, { refetchQueries: [GET_USER_INTERESTS] });
  const viewingSelf = user?.username === username;
  const isGr15Contributor = viewingSelf
    ? user?.checkIsGr15Contributor?.isGr15Contributor
    : userProfile?.checkIsGr15Contributor?.isGr15Contributor;

  const twitterUrl = `https://twitter.com/${userProfile?.userInfo?.twitterUsername}`;
  return (
    <ProfileInfoWrapper>
      <ChooseEntityToCreate />
      <UserInterestModal
        open={openInterestModal}
        onClose={() => setOpenInterestModal(false)}
        createUserInterest={createUserInterest}
        existingInterests={interests}
      />

      <ProfileInfoContainer>
        <div
          style={{
            position: 'relative',
            ...(isGr15Contributor && {
              marginRight: '20px',
            }),
          }}
        >
          {profilePicture ? (
            <SafeImage
              src={profilePicture}
              width={62}
              height={62}
              useNextImage
              style={{
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          ) : (
            <DefaultUserImage
              style={{
                width: '62',
                height: '62',
                borderRadius: '31px',
              }}
            />
          )}
          {isGr15Contributor && (
            <>
              <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
              <GR15DEILogo
                width="42"
                height="42"
                onClick={() => setOpenGR15Modal(true)}
                style={{
                  top: '0',
                  right: '-20px',
                  position: 'absolute',
                  zIndex: '20',
                }}
              />
            </>
          )}
        </div>
        <ProfileInfoFullName>{fullName || username}</ProfileInfoFullName>
        <ProfileInfoUsername>@{username}</ProfileInfoUsername>
      </ProfileInfoContainer>
      <ProfileInfoBioWrapper>
        <ProfileInfoBioText>{bio}</ProfileInfoBioText>
      </ProfileInfoBioWrapper>
      <ProfileLinkContainer>
        {mainLink?.url && (
          <ProfileInfoLink
            href={
              mainLink?.url?.startsWith('https') || mainLink?.url?.startsWith('http')
                ? mainLink.url
                : `https://${mainLink.url}`
            }
            target="_blank"
          >
            <ProfileInfoMainLink>
              <ProfileInfoIcon>
                <ProfileInfoLinkIcon />
              </ProfileInfoIcon>
              <ProfileInfoIcon>{removeUrlStart(mainLink?.url)}</ProfileInfoIcon>
            </ProfileInfoMainLink>
          </ProfileInfoLink>
        )}
        {userProfile?.userInfo?.discordUsername && (
          <ProfileInfoLink
            target="_blank"
            style={{
              textDecoration: 'none',
            }}
          >
            <ProfileInfoIcon
              style={{
                marginRight: '8px',
              }}
            >
              <DiscordIcon fill="#ccbbff" />
            </ProfileInfoIcon>
            <ProfileInfoIcon>{`${userProfile?.userInfo?.discordUsername}#${userProfile?.userInfo?.discordDiscriminator}`}</ProfileInfoIcon>
          </ProfileInfoLink>
        )}
        {userProfile?.userInfo?.twitterUsername && (
          <ProfileInfoLink key={twitterUrl} href={twitterUrl} target="_blank">
            <ProfileInfoIcon>
              <TwitterPurpleIcon fill="#ccbbff" />
            </ProfileInfoIcon>
          </ProfileInfoLink>
        )}
        {social.map(({ url, type }) => {
          if (!url) return null;
          if (type === SOCIAL_MEDIA_DISCORD) {
            // legacy discord url
            return;
          }
          if (type === SOCIAL_MEDIA_TWITTER) {
            // legacy twitter url
            return;
          }
          const SocialIcon = SOCIAL_ICONS[type];

          return (
            <ProfileInfoLink key={url} href={url} target="_blank">
              <ProfileInfoIcon>
                <SocialIcon fill="#ccbbff" />
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
              {interests?.map((interest) => (
                <ProfileInfoInterestsChip key={interest} label={getInterestDisplay(interest)} />
              ))}

              {viewingSelf && (
                <div
                  onClick={() => {
                    setOpenInterestModal(true);
                  }}
                >
                  <ProfileInfoInterestsChip sx={styles.editInterest} key="add-interest" label="+ Edit interest" />
                </div>
              )}
            </ProfileInfoInterestsChipWrapper>
          </ProfileInfoInterestsContainer>
        </ProfileInfoEarningsInterestWrapper>
      )}
    </ProfileInfoWrapper>
  );
}

export default ProfileInfo;
