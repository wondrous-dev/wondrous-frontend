import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useGetUserAboutPage from 'hooks/useGetUserAboutPage';

import OrgCard from 'components/OrgCard';
import ProfileContentGrid from 'components/ProfileContentGrid';
import TaskCompletedCard from 'components/TaskCompletedCard';
import WorkingOnCard from 'components/WorkingOnCard';

import styles from './styles';

const ProfileUserTaskDaos = ({ userProfile }) => {
  const { id: userId } = userProfile;

  const { workingTasksData, userOrgs, completedTaskCount, completedTasksData } = useGetUserAboutPage(userId);

  console.log('workingTasksData', workingTasksData);

  return (
    <>
      <Box sx={styles.sectionContainer}>
        <Typography style={styles.title}>{userOrgs?.length} DAOS</Typography>
        <ProfileContentGrid data={userOrgs} Component={OrgCard} />
      </Box>

      <Box sx={styles.sectionContainer}>
        <Typography style={styles.title}>{completedTaskCount} tasks completed</Typography>
        <ProfileContentGrid data={completedTasksData} Component={TaskCompletedCard} />
      </Box>

      <Box sx={styles.sectionContainer}>
        <Typography style={styles.title}>{workingTasksData?.length} Currently working on</Typography>
        <ProfileContentGrid data={workingTasksData} Component={WorkingOnCard} />
      </Box>
    </>
  );
};

export default ProfileUserTaskDaos;
