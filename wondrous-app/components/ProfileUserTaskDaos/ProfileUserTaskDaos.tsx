import useGetUserAboutPage from 'hooks/useGetUserAboutPage';

import OrgCard from 'components/OrgCard';
import ProfileContentGrid from 'components/ProfileContentGrid';
import TaskCompletedCard from 'components/TaskCompletedCard';

import { ProfileUserTaskDaosContainer, ProfileUserTaskDaosTitle, ProfileUserTaskDaosWrapper } from './styles';
import WorkingOnCard from 'components/WorkingOnCard';
import { Task } from 'components/Common/Task';

const ProfileUserTaskCard = (props) => {
  const { item } = props;
  return <Task task={item} />;
};

const ProfileUserTaskDaos = ({ userProfile }) => {
  const { id: userId } = userProfile;

  const { workingTasksData, userOrgs, completedTaskCount, completedTasksData } = useGetUserAboutPage(userId);

  return (
    <ProfileUserTaskDaosWrapper>
      <ProfileUserTaskDaosContainer>
        <ProfileUserTaskDaosTitle>{userOrgs?.length} DAOS</ProfileUserTaskDaosTitle>
        <ProfileContentGrid data={userOrgs} Component={OrgCard} />
      </ProfileUserTaskDaosContainer>

      <ProfileUserTaskDaosContainer>
        <ProfileUserTaskDaosTitle>{completedTaskCount} tasks completed</ProfileUserTaskDaosTitle>
        <ProfileContentGrid data={completedTasksData} Component={ProfileUserTaskCard} />
      </ProfileUserTaskDaosContainer>

      <ProfileUserTaskDaosContainer>
        <ProfileUserTaskDaosTitle>{workingTasksData?.length} Currently working on</ProfileUserTaskDaosTitle>
        <ProfileContentGrid data={workingTasksData} Component={ProfileUserTaskCard} />
      </ProfileUserTaskDaosContainer>
    </ProfileUserTaskDaosWrapper>
  );
};

export default ProfileUserTaskDaos;
