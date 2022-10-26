import { withAuth } from 'components/Auth/withAuth';
import ContributorInvite from 'components/ContributorInvite';

function ContributorOnboardingPage() {
  return <ContributorInvite path="collaboration" />;
}

export default withAuth(ContributorOnboardingPage);
