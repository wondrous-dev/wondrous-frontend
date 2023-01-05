import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import isEqual from 'lodash/isEqual';
import { GET_POD_MEMBERSHIP_REQUEST, GET_POD_USERS } from 'graphql/queries';
import { QUERY_LIMIT } from './constants';

export const useGetPodMemberRequests = (podId, searchString = '', roleIds = []) => {
  const [hasMore, setHasMore] = useState(false);
  const [isInitialFetchForThePage, setIsInitialFetchForThePage] = useState(true); // this state is used to determine if the fetch is from a fetchMore or from route change
  const [previousSearchQuery, setPreviousSearchQuery] = useState('');
  const [previousRoleFilter, setPreviousRoleFilter] = useState([]);

  const [getPodUserMembershipRequests, { data, fetchMore, previousData, variables }] = useLazyQuery(
    GET_POD_MEMBERSHIP_REQUEST,
    {
      fetchPolicy: 'network-only',
      // set notifyOnNetworkStatusChange to true if you want to trigger a rerender whenever the request status updates
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ getPodMembershipRequest }) => {
        const isPreviousDataValid = previousData && previousData?.getPodMembershipRequest?.length > 1; // if length of previous data is 1, it is likely a refetch;
        // if previousData is undefined, it means this is the initial fetch
        const previousDataLength = previousData?.getPodMembershipRequest?.length;
        const currentDataLength = getPodMembershipRequest?.length;

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
    if (podId) {
      getPodUserMembershipRequests({
        variables: {
          podId,
          limit: QUERY_LIMIT,
          searchString,
          roleIds,
        },
      }).then(({ data }) => {
        const requestData = data?.getPodMembershipRequest;
        if (requestData) setIsInitialFetchForThePage(false);
      });
    }
  }, [podId, getPodUserMembershipRequests]);
  return { getPodUserMembershipRequests, data: data?.getPodMembershipRequest, fetchMore, hasMore };
};

export const useGetPodUsers = (podId, searchString = '', roleIds = []) => {
  const [hasMore, setHasMore] = useState(false);
  const [isInitialFetchForThePage, setIsInitialFetchForThePage] = useState(true);
  const [previousSearchQuery, setPreviousSearchQuery] = useState('');
  const [previousRoleFilter, setPreviousRoleFilter] = useState([]);

  const [getPodUsers, { data, fetchMore, previousData, variables }] = useLazyQuery(GET_POD_USERS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getPodUsers }) => {
      const isPreviousDataValid = previousData && previousData?.getPodUsers?.length > 1;
      const previousDataLength = previousData?.getPodUsers?.length;
      const currentDataLength = getPodUsers?.length;
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

      console.log({ isANewSearch, updatedDataLength });

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
    if (podId) {
      getPodUsers({
        variables: {
          podId,
          limit: QUERY_LIMIT,
          searchString,
          roleIds,
        },
      }).then(({ data }) => {
        const requestData = data?.getPodUsers;
        if (requestData) setIsInitialFetchForThePage(false);
      });
    }
  }, [podId, getPodUsers]);
  return { getPodUsers, data: data?.getPodUsers, fetchMore, hasMore };
};
