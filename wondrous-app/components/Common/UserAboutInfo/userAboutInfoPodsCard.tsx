import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { SafeImage } from '../Image';
import { DAOIcon } from '../../Icons/dao';
import RightArrowIcon from '../../Icons/rightArrow';
import {
  UserAboutInfoCardHeader,
  UserAboutInfoCardHeaderPodIcon,
  UserAboutInfoCardNoLogo,
  UserAboutInfoCard,
  UserAboutInfoCardContent,
  UserAboutInfoPodsCardFooter,
  UserAboutInfoPodsCardFooterCount,
  UserAboutInfoPodsCardName,
} from './styles';

function AboutPodsCard(props) {
  const { id, color, name = '', description = '', org = {}, tasksIncompleteCount, milestoneCount } = props;
  const router = useRouter();
  const handleOnClick = () => router.push(`/pod/${id}/home`);
  return (
    <UserAboutInfoCard onClick={handleOnClick}>
      <UserAboutInfoCardHeader>
        <UserAboutInfoCardHeaderPodIcon color={color} />
        <IconButton onClick={handleOnClick}>
          <RightArrowIcon />
        </IconButton>
      </UserAboutInfoCardHeader>
      <UserAboutInfoPodsCardName>{name}</UserAboutInfoPodsCardName>
      <UserAboutInfoCardContent>{description}</UserAboutInfoCardContent>
      <UserAboutInfoPodsCardFooter>
        {org?.thumbnailPicture || org?.profilePicture ? (
          <SafeImage
            src={org?.thumbnailPicture || org?.profilePicture}
            useNextImage={false}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '4px',
              marginRight: '8px',
            }}
            alt="Organization Logo"
          />
        ) : (
          <UserAboutInfoCardNoLogo style={{ height: '30px', width: '30px' }}>
            <DAOIcon />
          </UserAboutInfoCardNoLogo>
        )}
        {tasksIncompleteCount > 0 && (
          <UserAboutInfoPodsCardFooterCount> {tasksIncompleteCount} tasks </UserAboutInfoPodsCardFooterCount>
        )}
        {milestoneCount > 0 && (
          <UserAboutInfoPodsCardFooterCount> {milestoneCount} milestones </UserAboutInfoPodsCardFooterCount>
        )}
      </UserAboutInfoPodsCardFooter>
    </UserAboutInfoCard>
  );
}

export default AboutPodsCard;
