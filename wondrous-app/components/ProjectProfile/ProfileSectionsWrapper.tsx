import Grid from '@mui/material/Grid';

import ProfileBountySection from './ProfileBountySection';
import ProfileCategorySection from './ProfileCategorySection';
import ProfileCollabSection from './ProfileCollabSection';
import ProfileGrantSection from './ProfileGrantSection';
import ProfileMemberSection from './ProfileMemberSection';
import ProfileMilestoneSection from './ProfileMilestoneSection';
import ProfileProposalSection from './ProfileProposalSection';
import ProfileTaskSection from './ProfileTaskSection';

const ProfileSectionsWrapper = () => (
  <Grid
    container
    justifyContent="space-between"
    gap="24px"
    sx={{
      '& > *': {
        maxWidth: 'calc(50% - 12px)',
      },
    }}
  >
    <ProfileTaskSection />
    <ProfileBountySection />
    <ProfileMilestoneSection />
    <ProfileProposalSection />
    <ProfileMemberSection />
    <ProfileCollabSection />
    <ProfileGrantSection />
    <ProfileCategorySection />
  </Grid>
);

export default ProfileSectionsWrapper;
