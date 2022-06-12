import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import { GET_USER_FROM_USERNAME, GET_USER_INTERESTS, GET_USER_PROFILE } from 'graphql/queries';

const useGetUserProfile = (id, username) => {
  const [getUser, { data: getUserProfileData }] = useLazyQuery(GET_USER_PROFILE);
  const [getUserInterests, { data: getUserInterestsData }] = useLazyQuery(GET_USER_INTERESTS);

  const [getUserFromUsername, { data: getUserFromUsernameData }] = useLazyQuery(GET_USER_FROM_USERNAME);
  useEffect(() => {
    if (!getUserProfileData && id) {
      getUser({
        variables: {
          userId: id,
        },
      });
    }

    if (!getUserFromUsernameData && !id && username) {
      getUserFromUsername({
        variables: {
          username,
        },
      });
    }

    if (getUserProfileData?.getUser.id) {
      getUserInterests({
        variables: {
          userId: getUserProfileData?.getUser.id,
        },
      });
    }

    if (getUserFromUsernameData?.getUserFromUsername?.id) {
      getUserInterests({
        variables: {
          userId: getUserFromUsernameData?.getUserFromUsername.id,
        },
      });
    }
  }, [
    getUser,
    getUserFromUsername,
    getUserInterests,
    getUserInterestsData,
    getUserFromUsernameData,
    getUserProfileData,
    id,
    username,
  ]);

  if (getUserProfileData?.getUser) {
    return { ...getUserInterestsData?.getUserInterests, ...getUserProfileData?.getUser };
  }

  return { ...getUserInterestsData?.getUserInterests, ...getUserFromUsernameData?.getUserFromUsername } ?? {};
};

export default useGetUserProfile;
