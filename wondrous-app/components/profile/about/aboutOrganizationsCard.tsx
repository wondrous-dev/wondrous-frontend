import { IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { SafeImage } from '../../Common/Image';
import { DAOIcon } from '../../Icons/dao';
import RightArrowIcon from '../../Icons/rightArrow';
import {
  OrganizationsCard,
  OrganizationsCardContent,
  CardHeader,
  OrganizationsCardHeaderName,
  OrganisationsCardNoLogo,
} from './styles';

const AboutOrganizationsCard = (props) => {
  const router = useRouter();
  const { name, description, profilePicture, thumbnailPicture, username } = props;
  const handleOnClick = () => router.push(`/organization/${username}/boards`);
  return (
    <OrganizationsCard>
      <CardHeader>
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
          <OrganisationsCardNoLogo>
            <DAOIcon />
          </OrganisationsCardNoLogo>
        )}
        <OrganizationsCardHeaderName>{name}</OrganizationsCardHeaderName>
        <IconButton onClick={handleOnClick}>
          <RightArrowIcon />
        </IconButton>
      </CardHeader>
      <OrganizationsCardContent>{description}</OrganizationsCardContent>
    </OrganizationsCard>
  );
};

export default AboutOrganizationsCard;
