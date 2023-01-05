import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import isEqual from 'lodash/isEqual';
import { GET_ORG_MEMBERSHIP_REQUEST, GET_ORG_USERS } from 'graphql/queries';
import { QUERY_LIMIT } from './constants';

export const useGetOrgMemberRequests = (orgId, searchString = '', roleIds = []) => {
  const [hasMore, setHasMore] = useState(false);
  const [isInitialFetchForThePage, setIsInitialFetchForThePage] = useState(true); // this state is used to determine if the fetch is from a fetchMore or from route change
  const [previousSearchQuery, setPreviousSearchQuery] = useState('');
  const [previousRoleFilter, setPreviousRoleFilter] = useState([]);

  const [getOrgUserMembershipRequests, { data, fetchMore, previousData, variables }] = useLazyQuery(
    GET_ORG_MEMBERSHIP_REQUEST,
    {
      fetchPolicy: 'network-only',
      // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ getOrgMembershipRequest }) => {
        const isPreviousDataValid = previousData && previousData?.getOrgMembershipRequest?.length > 1; // if length of previous data is 1, it is likely a refetch;
        const previousDataLength = previousData?.getOrgMembershipRequest?.length;
        const currentDataLength = getOrgMembershipRequest?.length;

        const isDataBeingFiltered = variables?.searchString || variables?.roleIds?.length > 0;
        const isANewSearch =
          previousSearchQuery !== variables?.searchString || !isEqual(previousRoleFilter, variables?.roleIds);

        let updatedDataLength = isPreviousDataValid ? currentDataLength - previousDataLength : currentDataLength;

        if (isANewSearch) {
          updatedDataLength = currentDataLength;
        }

        if (isInitialFetchForThePage) {
          setHasMore(currentDataLength >= QUERY_LIMIT);
        } else {
          updatedDataLength >= 0 && setHasMore(updatedDataLength >= QUERY_LIMIT); // updatedDataLength >= 0 means it's not a refetch
        }

        if (isDataBeingFiltered) {
          setPreviousSearchQuery(variables?.searchString);
          setPreviousRoleFilter(variables?.roleIds);
        }
      },
      onError: (error) => {
        console.error(error);
        Sentry.captureException(error);
      },
    }
  );
  useEffect(() => {
    if (orgId) {
      getOrgUserMembershipRequests({
        variables: {
          orgId,
          limit: QUERY_LIMIT,
          searchString,
          roleIds,
        },
      }).then(({ data }) => {
        const requestData = data?.getOrgMembershipRequest;
        if (requestData) setIsInitialFetchForThePage(false);
      });
    }
  }, [orgId, getOrgUserMembershipRequests]);
  return { getOrgUserMembershipRequests, data: data?.getOrgMembershipRequest, fetchMore, hasMore };
};

export const useGetOrgUsers = (orgId, searchString = '', roleIds = []) => {
  const [hasMore, setHasMore] = useState(false);
  const [isInitialFetchForThePage, setIsInitialFetchForThePage] = useState(true);
  const [previousSearchQuery, setPreviousSearchQuery] = useState('');
  const [previousRoleFilter, setPreviousRoleFilter] = useState([]);

  const [getOrgUsers, { data, fetchMore, previousData, variables }] = useLazyQuery(GET_ORG_USERS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getOrgUsers }) => {
      const isPreviousDataValid = previousData && previousData?.getOrgUsers?.length > 1;
      const previousDataLength = previousData?.getOrgUsers?.length;
      const currentDataLength = getOrgUsers?.length;
      let updatedDataLength = isPreviousDataValid ? currentDataLength - previousDataLength : currentDataLength;

      const isDataBeingFiltered = variables?.searchString || variables?.roleIds?.length > 0;
      const isANewSearch =
        previousSearchQuery !== variables?.searchString || !isEqual(previousRoleFilter, variables?.roleIds);

      if (isANewSearch) {
        updatedDataLength = currentDataLength;
      }

      if (isInitialFetchForThePage) {
        setHasMore(currentDataLength >= QUERY_LIMIT);
      } else {
        updatedDataLength >= 0 && setHasMore(updatedDataLength >= QUERY_LIMIT);
      }

      if (isDataBeingFiltered) {
        setPreviousSearchQuery(variables?.searchString);
        setPreviousRoleFilter(variables?.roleIds);
      }
    },
    onError: (error) => {
      console.error(error);
      Sentry.captureException(error);
    },
  });
  useEffect(() => {
    if (orgId) {
      getOrgUsers({
        variables: {
          orgId,
          limit: QUERY_LIMIT,
          searchString,
          roleIds,
        },
      }).then(({ data }) => {
        const requestData = data?.getOrgUsers;
        if (requestData) setIsInitialFetchForThePage(false);
      });
    }
  }, [orgId, getOrgUsers]);
  return { getOrgUsers, data: data?.getOrgUsers, fetchMore, hasMore };
};
