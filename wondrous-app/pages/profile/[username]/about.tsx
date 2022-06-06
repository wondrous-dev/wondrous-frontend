import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { withAuth } from 'components/Auth/withAuth';
import { UserAboutInfo } from 'components/Common/UserAboutInfo';
import Wrapper from 'components/profile/wrapper/wrapper';
import { GET_USER_FROM_USERNAME, GET_USER_PROFILE } from 'graphql/queries';

export const AboutSection = styled.div`
  margin-top: 32px;
`;

const useGetUserProfile = (id, username) => {
  const [getUser, { data: getUserProfileData }] = useLazyQuery(GET_USER_PROFILE);
  const [getUserFromUsername, { data: getUserFromUsernameData }] = useLazyQuery(GET_USER_FROM_USERNAME);
  useEffect(() => {
    if (!getUserProfileData && id) {
      getUser({
        variables: {
          userId: id,
        },
      });
    } else if (!getUserFromUsernameData && !id && username) {
      getUserFromUsername({
        variables: {
          username,
        },
      });
    }
  }, [getUser, getUserFromUsername, getUserFromUsernameData, getUserProfileData, id, username]);
  return getUserProfileData?.getUser ?? getUserFromUsernameData?.getUserFromUsername ?? {};
};

const About = () => {
  const router = useRouter();
  const { username, id: routerId } = router.query;
  const userProfile = useGetUserProfile(routerId, username);
  const { id: userProfileId } = userProfile;
  return (
    <Wrapper userProfileData={userProfile}>
      <AboutSection>
        <UserAboutInfo id={userProfileId} />
      </AboutSection>
    </Wrapper>
  );
};

export default withAuth(About);
