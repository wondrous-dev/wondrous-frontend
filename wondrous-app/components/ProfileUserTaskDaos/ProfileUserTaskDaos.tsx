import { Task } from 'components/Common/Task';
import OrgCard from 'components/OrgCard';
import ProfileContentGrid from 'components/ProfileContentGrid';
import useGetUserAboutPage from 'hooks/useGetUserAboutPage';

import { ProfileUserTaskDaosContainer, ProfileUserTaskDaosTitle, ProfileUserTaskDaosWrapper } from './styles';

const ProfileUserTaskCard = (props) => {
  const { item } = props;
  return <Task {...props} task={item} />;
};

const ProfileUserTaskDaos = ({ userProfile }) => {
  const { id: userId } = userProfile;

  const {
    inProgressData,
    userOrgs,
    userTaskCountData,
    completedTasksData,
    handleFetchMoreCompletedTasks,
    handleFetchMoreInProgressTasks,
    completedTaskButton,
    inProgressButton,
  } = useGetUserAboutPage(userId);

  const inProgressCount = userTaskCountData?.created + userTaskCountData?.inProgress + userTaskCountData?.inReview;

  return (
    <ProfileUserTaskDaosWrapper>
      <ProfileUserTaskDaosContainer>
        <ProfileUserTaskDaosTitle>{userOrgs?.length} DAOS</ProfileUserTaskDaosTitle>
        <ProfileContentGrid data={userOrgs} Component={OrgCard} fetchMore={() => {}} buttonIsDisabled={true} />
      </ProfileUserTaskDaosContainer>

      <ProfileUserTaskDaosContainer>
        <ProfileUserTaskDaosTitle>{userTaskCountData?.completed} tasks completed</ProfileUserTaskDaosTitle>
        <ProfileContentGrid
          data={completedTasksData}
          Component={ProfileUserTaskCard}
          fetchMore={handleFetchMoreCompletedTasks}
          buttonIsDisabled={completedTaskButton}
        />
      </ProfileUserTaskDaosContainer>

      <ProfileUserTaskDaosContainer>
        <ProfileUserTaskDaosTitle>{inProgressCount} Currently working on</ProfileUserTaskDaosTitle>
        <ProfileContentGrid
          data={inProgressData}
          Component={ProfileUserTaskCard}
          fetchMore={handleFetchMoreInProgressTasks}
          buttonIsDisabled={inProgressButton}
        />
      </ProfileUserTaskDaosContainer>
    </ProfileUserTaskDaosWrapper>
  );
};

export default ProfileUserTaskDaos;
