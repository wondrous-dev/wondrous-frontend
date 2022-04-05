import React from 'react';
import { useRouter } from 'next/router';
import Payouts from 'components/Settings/Payouts';

const PayoutsPage = () => {
  const router = useRouter();

  const { orgId } = router.query;

  return <Payouts orgId={orgId} />;
};

export default PayoutsPage;
