import React, { useCallback, useState, useEffect } from 'react';
import About from '../../../components/profile/about/about';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';

import { useMe, withAuth } from '../../../components/Auth/withAuth';
import {
  GET_USER_PERMISSION_CONTEXT,
  GET_USER_PROFLIE,
  GET_USER_FROM_USERNAME,
  GET_USER_ABOUT_PAGE_DATA,
} from '../../../graphql/queries';

const AboutPage = () => {
  const loggedInUser = useMe();
  const [userProfileData, setUserProfileData] = useState(null);
  // const [userAboutPageData, setUserAboutPageData] = useState(null);
  const [userOrgsData, setUserOrgsData] = useState([]);
  const [userPodsData, setUserPodsData] = useState([]);
  const [userCompletedTaskCount, setUserCompletedTaskCount] = useState(null);
  const [userCompletedTasks, setUserCompletedTasks] = useState(null);
  const router = useRouter();
  const { username, userId } = router.query;

  // const { data: userPermissionsContext } = useQuery(
  //   GET_USER_PERMISSION_CONTEXT,
  //   {
  //     fetchPolicy: 'cache-and-network',
  //   }
  // )

  const [getUserAboutPageData, { data: userAboutPageDataFromUser }] = useLazyQuery(GET_USER_ABOUT_PAGE_DATA);
  const [getUser, { data: userProfileDataFromSession } ] = useLazyQuery(GET_USER_PROFLIE);
  const [getUserFromUsername, { data: userProfileDataFromUsername } ] = useLazyQuery(GET_USER_FROM_USERNAME);

  useEffect(() => {
    if (userId && !userProfileData) {
      getUser({
        variables: {
          userId,
        },
      });
      // get user task board tasks immediately
    } else if (!userId && username && !userProfileData) {
      // Get orgId from username
      getUserFromUsername({
        variables: {
          username,
        },
      });
    } else if (userProfileData && userProfileData.id) {
      console.log('3')
      getUserAboutPageData({
        variables: {
          userId: userProfileData.id,
        },
      });
    }
  }, [username, userId, userProfileData, getUser, getUserFromUsername, getUserAboutPageData]);

  // Bind to the hook
  useEffect(() => {
    setUserProfileData(userProfileDataFromUsername?.getUserFromUsername || userProfileDataFromSession?.getUser)
  },[userProfileDataFromSession, userProfileDataFromUsername])

  useEffect(() => {
    const data = userAboutPageDataFromUser
    // setUserAboutPageData(data?.getUserAboutPageData);
    const orgs = data?.getUserAboutPageData?.orgs
    const pods = data?.getUserAboutPageData?.pods
    const tasksCompleted = data?.getUserAboutPageData?.tasksCompleted
    const tasksCompletedCount = data?.getUserAboutPageData?.tasksCompletedCount
    if (orgs || tasksCompletedCount) {
      setUserOrgsData(orgs)
      setUserPodsData(pods)
      setUserCompletedTaskCount(tasksCompletedCount)
      setUserCompletedTasks(tasksCompleted)  
    }
  }, [userAboutPageDataFromUser])

  return <About userProfileData={userProfileData} loggedInUser={loggedInUser} userOrgsData={userOrgsData} userPodsData={userPodsData} userCompletedTasks={userCompletedTasks} tasksCompletedCount={userCompletedTaskCount}/>;
};

export default withAuth(AboutPage);
