import React from 'react';
import { useRouter } from 'next/router';
import PaymentMethods from 'components/Settings/PaymentMethods';
import { withAuth } from 'components/Auth/withAuth';

function PaymentMethodPage() {
  const router = useRouter();

  const { orgId } = router.query;

  return <PaymentMethods orgId={orgId} />;
}

export default withAuth(PaymentMethodPage);
