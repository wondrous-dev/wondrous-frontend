import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useGetUserAboutPage from 'hooks/useGetUserAboutPage';

import OrgCard from 'components/OrgCard';
import ProfileContentGrid from 'components/ProfileContentGrid';
import TaskCompletedCard from 'components/TaskCompletedCard';

import styles from './styles';
import WorkingOnCard from 'components/WorkingOnCard';

const ProfileUserTaskDaos = ({ userProfile }) => {
  const [testOrgs, setTestOrgs] = useState([]);
  const { id, additionalInfo } = userProfile;

  const { userData, workingTasksData } = useGetUserAboutPage(id);

  useEffect(() => {
    if (userData?.orgs) {
      const test = [
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
        ...userData?.orgs,
      ];
      setTestOrgs(test);
    }
  }, [userData?.orgs]);

  return (
    <>
      <Box sx={styles.sectionContainer}>
        <Typography sx={styles.title}>{additionalInfo?.orgCount} DAOS</Typography>
        <ProfileContentGrid data={testOrgs} Component={OrgCard} />
      </Box>

      <Box sx={styles.sectionContainer}>
        <Typography sx={styles.title}>{userData?.tasksCompletedCount} tasks completed</Typography>
        <ProfileContentGrid data={userData?.tasksCompleted} Component={TaskCompletedCard} />
      </Box>

      <Box sx={styles.sectionContainer}>
        <Typography sx={styles.title}>{workingTasksData?.length} Currently working on</Typography>
        <ProfileContentGrid data={workingTasksData} Component={WorkingOnCard} />
      </Box>
    </>
  );
};

export default ProfileUserTaskDaos;
