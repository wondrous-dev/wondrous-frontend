import React from 'react';
import { IconButton } from '@material-ui/core';

import RightArrowIcon from '../../Icons/rightArrow';
import { AvatarList } from '../../Common/AvatarList';
import { SafeImage } from '../../Common/Image';

import {
  OrganisationsCard,
  OrganisationsCardContent,
  OrganisationsCardHeader,
  OrganisationsCardNoLogo,
  PodsCardFooter,
  PodsCardFooterButton,
  PodsCardFooterIcon,
  PodsCardName,
} from './styles';
import { DAOIcon } from '../../Icons/dao';

const AboutPodsCard = (props) => {
  const { name = '', description = '', tasksAmount = 0, goalsAmount = 0, org = {} } = props;

  return (
    <OrganisationsCard>
      {/* <OrganisationsCardHeader>
				<AvatarList users={users} />
				<IconButton>
					<RightArrowIcon />
				</IconButton>
			</OrganisationsCardHeader> */}
      <PodsCardName>{name}</PodsCardName>
      <OrganisationsCardContent>{description}</OrganisationsCardContent>
      <PodsCardFooter>
        {org?.thumbnailPicture || org?.profilePicture ? (
          <SafeImage
            src={org?.thumbnailPicture || org?.profilePicture}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '4px',
              marginRight: '8px',
            }}
          />
        ) : (
		  <OrganisationsCardNoLogo style={{ height: '30px', width: '30px'}}>
			  <DAOIcon />
		  </OrganisationsCardNoLogo>
        )}
        {/* <PodsCardFooterButton>{tasksAmount} tasks</PodsCardFooterButton>
				<PodsCardFooterButton>{goalsAmount} goal</PodsCardFooterButton> */}
      </PodsCardFooter>
    </OrganisationsCard>
  );
};

export default AboutPodsCard;
