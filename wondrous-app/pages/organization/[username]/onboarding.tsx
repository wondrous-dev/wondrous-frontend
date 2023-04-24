import { withAuth } from 'components/Auth/withAuth';
import EntitySidebar from 'components/Common/SidebarEntity';
import { OnboardingWrapper } from 'components/ProjectOnboarding';
import { CONFIG, TYPES } from 'components/ProjectOnboarding/Shared/constants';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const OrgOnboarding = () => {
  const router = useRouter();
  const { username } = router.query;

  const defaultStep = useMemo(() => CONFIG.findIndex((step) => step.type === TYPES.GUIDES), []);

  return <OnboardingWrapper orgUsername={username} defaultStep={defaultStep} withEntitySidebar />;
};

export default withAuth(OrgOnboarding);
