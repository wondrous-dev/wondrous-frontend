import { IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { SafeImage } from '../../Common/Image';
import { DAOIcon } from '../../Icons/dao';
import RightArrowIcon from '../../Icons/rightArrow';
import {
  CardHeader,
  CardHeaderPodIcon,
  OrganisationsCardNoLogo,
  OrganizationsCard,
  OrganizationsCardContent,
  PodsCardFooter,
  PodsCardFooterTaskMilestoneCount,
  PodsCardName,
} from './styles';

const AboutPodsCard = (props) => {
  const { id, color, name = '', description = '', org = {}, tasksIncompleteCount, milestoneCount } = props;
  const router = useRouter();
  const handleOnClick = () => router.push(`/pod/${id}/boards`);
  return (
    <OrganizationsCard>
      <CardHeader>
        <CardHeaderPodIcon color={color} />
        {/* TODO: AvatarList here */}
        <IconButton onClick={handleOnClick}>
          <RightArrowIcon />
        </IconButton>
      </CardHeader>
      <PodsCardName>{name}</PodsCardName>
      <OrganizationsCardContent>{description}</OrganizationsCardContent>
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
          <OrganisationsCardNoLogo style={{ height: '30px', width: '30px' }}>
            <DAOIcon />
          </OrganisationsCardNoLogo>
        )}
        {tasksIncompleteCount > 0 && (
          <PodsCardFooterTaskMilestoneCount> {tasksIncompleteCount} tasks </PodsCardFooterTaskMilestoneCount>
        )}
        {milestoneCount > 0 && (
          <PodsCardFooterTaskMilestoneCount> {milestoneCount} milestones </PodsCardFooterTaskMilestoneCount>
        )}
      </PodsCardFooter>
    </OrganizationsCard>
  );
};

export default AboutPodsCard;
