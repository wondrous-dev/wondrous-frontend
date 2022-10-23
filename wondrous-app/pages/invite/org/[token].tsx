import { withAuth } from 'components/Auth/withAuth';
import ContributorInvite from 'components/ContributorInvite';

function ContributorOnboardingPage() {
  return <ContributorInvite path="organization" />;
}

export default withAuth(ContributorOnboardingPage);
