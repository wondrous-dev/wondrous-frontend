import React, { useCallback, useState, useEffect } from 'react';
import About from '../../../components/profile/about/about';
import {
  SOCIAL_MEDIA_FACEBOOK,
  SOCIAL_MEDIA_LINKEDIN,
  SOCIAL_MEDIA_TWITTER,
  TASK_STATUS_DONE,
} from '../../../utils/constants';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/client';

import { useMe, withAuth } from '../../../components/Auth/withAuth';
import { GET_USER_TASK_BOARD_TASKS } from '../../../graphql/queries/taskBoard';
import Boards from '../../../components/organization/boards/boards';
import {
  GET_USER_PERMISSION_CONTEXT,
  GET_USER_PROFLIE,
  GET_USER_FROM_USERNAME,
  GET_USER_ABOUT_PAGE_DATA,
  GET_USER_PODS,
  GET_USER_ORGS,
} from '../../../graphql/queries';

const AboutPage = () => {
  const loggedInUser = useMe();
  const [userProfileData, setUserProfileData] = useState(null);
  const [userAboutPageData, setUserAboutPageData] = useState(null);
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

  const [getUserAboutPageData] = useLazyQuery(GET_USER_ABOUT_PAGE_DATA, {
    onCompleted: (data) => {
      setUserAboutPageData(data?.getUserAboutPageData);
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
    },
  });

  const [getUser] = useLazyQuery(GET_USER_PROFLIE, {
    onCompleted: (data) => {
      setUserProfileData(data?.getUser);
    },
  });

  const [getUserFromUsername, { data: getUserFromUsernameData, error: getUserFromUsernameError }] = useLazyQuery(
    GET_USER_FROM_USERNAME,
    {
      onCompleted: (data) => {
        if (data?.getUserFromUsername) {
          setUserProfileData(data?.getUserFromUsername);
        }
      },
    }
  );

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
      getUserAboutPageData({
        variables: {
          userId: userProfileData.id,
        },
      });
    }
  }, [username, userId, userProfileData, getUser, getUserFromUsername, getUserAboutPageData]);

  return <About userProfileData={userProfileData} loggedInUser={loggedInUser} userOrgsData={userOrgsData} userPodsData={userPodsData} userCompletedTasks={userCompletedTasks} tasksCompletedCount={userCompletedTaskCount}/>;
};

export default withAuth(AboutPage);
