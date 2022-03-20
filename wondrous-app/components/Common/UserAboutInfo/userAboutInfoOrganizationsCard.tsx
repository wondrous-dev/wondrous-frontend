import { IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { SafeImage } from '../Image';
import { DAOIcon } from '../../Icons/dao';
import RightArrowIcon from '../../Icons/rightArrow';
import {
  UserAboutInfoCard,
  UserAboutInfoCardContent,
  UserAboutInfoCardHeader,
  UserAboutInfoCardHeaderName,
  UserAboutInfoCardNoLogo,
} from './styles';

const AboutOrganizationsCard = (props) => {
  const router = useRouter();
  const { name, description, profilePicture, thumbnailPicture, username } = props;
  const handleOnClick = () => router.push(`/organization/${username}/boards`);
  return (
    <UserAboutInfoCard onClick={handleOnClick}>
      <UserAboutInfoCardHeader>
        {thumbnailPicture || profilePicture ? (
          <SafeImage
            src={thumbnailPicture || profilePicture}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '4px',
              marginRight: '8px',
            }}
          />
        ) : (
          <UserAboutInfoCardNoLogo>
            <DAOIcon />
          </UserAboutInfoCardNoLogo>
        )}
        <UserAboutInfoCardHeaderName>{name}</UserAboutInfoCardHeaderName>
        <IconButton onClick={handleOnClick}>
          <RightArrowIcon />
        </IconButton>
      </UserAboutInfoCardHeader>
      <UserAboutInfoCardContent>{description}</UserAboutInfoCardContent>
    </UserAboutInfoCard>
  );
};

export default AboutOrganizationsCard;
