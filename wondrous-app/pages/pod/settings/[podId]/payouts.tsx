import React from 'react';
import { useRouter } from 'next/router';
import Payouts from 'components/Settings/Payouts';

const PayoutsPage = () => {
  const router = useRouter();

  const { podId } = router.query;

  return <Payouts podId={podId} />;
};

export default PayoutsPage;
