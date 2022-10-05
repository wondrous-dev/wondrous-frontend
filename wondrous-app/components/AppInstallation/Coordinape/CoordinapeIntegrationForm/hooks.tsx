import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_LOGGED_IN_USER_FULL_ACCESS_ORGS, GET_ORG_PODS, GET_USER_ORGS } from 'graphql/queries';

export const useGetLoggedInUserFullAccessOrgs = () => {
  const [getLoggedInUserFullAccessOrgs, { data }] = useLazyQuery(GET_LOGGED_IN_USER_FULL_ACCESS_ORGS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getLoggedInUserFullAccessOrgs();
  }, []);

  return data?.getLoggedInUserFullAccessOrgs;
};

export const useGetUserOrgs = (userId) => {
  const [getUserOrgs, { data }] = useLazyQuery(GET_USER_ORGS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (userId) {
      getUserOrgs({ variables: { userId } });
    }
  }, [userId]);

  return data?.getUserOrgs;
};

export const useGetOrgPods = (orgId) => {
  const [getOrgPods, { data }] = useLazyQuery(GET_ORG_PODS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId) {
      getOrgPods({ variables: { orgId } });
    }
  }, [orgId]);

  return data?.getOrgPods;
};
