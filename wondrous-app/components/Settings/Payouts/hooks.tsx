import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries';

export const useGetPaymentMethodsForOrg = (orgId, includeDeactivated = false) => {
  const [getPaymentMethods, { data }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG);
  useEffect(() => {
    if (orgId) {
      getPaymentMethods({
        variables: {
          orgId,
          includeDeactivated,
        },
      });
    }
  }, [orgId, includeDeactivated, getPaymentMethods]);
  return data?.getPaymentMethodsForOrg;
};
