import React from 'react';
import { useRouter } from 'next/router';
import PaymentMethods from 'components/Settings/PaymentMethods';

const PaymentMethodPage = () => {
  const router = useRouter();

  const { orgId } = router.query;

  return <PaymentMethods orgId={orgId} />;
};

export default PaymentMethodPage;
