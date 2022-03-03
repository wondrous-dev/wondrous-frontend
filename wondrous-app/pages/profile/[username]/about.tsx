import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { withAuth } from '../../../components/Auth/withAuth';
import { UserAboutInfo } from '../../../components/Common/UserAboutInfo';
import { UserLinksTable } from '../../../components/Common/UserLinksTable';
import Wrapper from '../../../components/profile/wrapper/wrapper';
import { GET_USER_FROM_USERNAME, GET_USER_PROFILE } from '../../../graphql/queries';
import { parseLinks } from '../../../utils/common';
import styled from 'styled-components';

export const AboutSection = styled.div`
  max-width: 1038px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 24px;
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

const About = (props) => {
  const router = useRouter();
  const { username, id: routerId } = router.query;
  const userProfile = useGetUserProfile(routerId, username);
  const { links, id: userProfileId } = userProfile;
  const { social, websites, mainLink } = parseLinks(links);
  return (
    <Wrapper userProfileData={userProfile} mainLink={mainLink}>
      <AboutSection>
        <UserLinksTable parsedLinks={{ social, websites }} />
        <UserAboutInfo id={userProfileId} />
      </AboutSection>
    </Wrapper>
  );
};

export default withAuth(About);
