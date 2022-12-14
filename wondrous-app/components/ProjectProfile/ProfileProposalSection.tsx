import Grid from '@mui/material/Grid';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import TaskCardStatus from 'components/Common/TaskCardStatus';
import ContentPaste from 'components/Icons/Sidebar/contentPaste.svg';
import palette from 'theme/palette';
import { getProposalStatus } from 'utils/board';
import { ENTITIES_TYPES } from 'utils/constants';
import { useTaskActions } from 'utils/hooks';

import { useEntityCreateButtonProps, useGetOrgProposal } from './helpers';
import SectionContent from './SectionContent';

const LeftComponent = ({ title, creator }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    <UserProfilePicture avatar={creator?.profilePicture} />
    {title}
  </Grid>
);

const RightComponent = ({ orgId, rejectedAt, approvedAt, closedAt }) => (
  <Grid container>
    <TaskCardStatus
      type="proposal"
      orgId={orgId}
      status={getProposalStatus({ rejectedAt, approvedAt, closedAt })}
      style={{ background: palette.black81 }}
    />
  </Grid>
);

const ProfileProposalSection = () => {
  const { openTaskViewModal } = useTaskActions();

  return (
    <SectionContent
      HeaderTitleProps={{
        text: 'Proposals',
        IconComponent: ContentPaste,
      }}
      CreateButtonProps={useEntityCreateButtonProps(ENTITIES_TYPES.PROPOSAL)}
      backgroundImageUrl="/images/project/proposal-empty-bg.svg"
      showAllUrl="boards?entity=proposal"
      ListItemProps={{
        LeftComponent,
        RightComponent,
        onClick: (router, { id }) => openTaskViewModal({ id }),
      }}
      data={useGetOrgProposal()}
    />
  );
};

export default ProfileProposalSection;
