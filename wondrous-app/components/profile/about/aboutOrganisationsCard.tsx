import React from 'react';
import { IconButton } from '@material-ui/core';
import { SafeImage } from '../../Common/Image';

import RightArrowIcon from '../../Icons/rightArrow';

import {
  OrganisationsCard,
  OrganisationsCardAuthor,
  OrganisationsCardAuthorAvatar,
  OrganisationsCardAuthorPosition,
  OrganisationsCardContent,
  OrganisationsCardHeader,
  OrganisationsCardHeaderName,
  OrganisationsCardHeaderWonderIcon,
  OrganisationsCardNoLogo,
} from './styles';
import { DAOIcon } from '../../Icons/dao';

const ICONS = {
  wonder: OrganisationsCardHeaderWonderIcon,
};

const AboutOrganisationsCard = (props) => {
  const { name, description, profilePicture, thumbnailPicture } = props;

  // const Icon = ICONS[icon]

  return (
    <OrganisationsCard>
      <OrganisationsCardHeader>
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
        <OrganisationsCardHeaderName>{name}</OrganisationsCardHeaderName>
        <IconButton>
          <RightArrowIcon />
        </IconButton>
      </OrganisationsCardHeader>
      <OrganisationsCardContent>{description}</OrganisationsCardContent>
      {/* <OrganisationsCardAuthor>
				<OrganisationsCardAuthorAvatar src={avatar} />
				<OrganisationsCardAuthorPosition>
					{position}
				</OrganisationsCardAuthorPosition>
			</OrganisationsCardAuthor> */}
    </OrganisationsCard>
  );
};

export default AboutOrganisationsCard;
