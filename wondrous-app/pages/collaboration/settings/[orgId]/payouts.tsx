import React from 'react';
import { useRouter } from 'next/router';
import Payouts from 'components/Settings/Payouts';
import { withAuth } from 'components/Auth/withAuth';

function PayoutsPage() {
  const router = useRouter();

  const { orgId } = router.query;

  return <Payouts orgId={orgId} />;
}

export default withAuth(PayoutsPage);
