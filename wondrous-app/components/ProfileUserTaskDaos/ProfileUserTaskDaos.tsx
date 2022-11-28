import useGetUserAboutPage from 'hooks/useGetUserAboutPage';

import Task from 'components/Common/Task';
import OrgCard from 'components/OrgCard';
import ProfileContentGrid from 'components/ProfileContentGrid';

import { ProfileUserTaskDaosContainer, ProfileUserTaskDaosTitle, ProfileUserTaskDaosWrapper } from './styles';

function ProfileUserTaskCard(props) {
  const { item } = props;
  return <Task {...props} task={item} />;
}

function ProfileUserTaskDaos({ userProfile }) {
  const { id: userId } = userProfile;

  const {
    completedTasksData,
    disableCompletedTaskButton,
    disableInProgressButton,
    disableOrgRolesButton,
    handleFetchMoreCompletedTasks,
    handleFetchMoreInProgressTasks,
    handleFetchMoreOrgRoles,
    inProgressData,
    userOrgs,
    userTaskCountData,
  } = useGetUserAboutPage(userId);

  const inProgressCount = userTaskCountData?.created + userTaskCountData?.inProgress + userTaskCountData?.inReview;

  return (
    <ProfileUserTaskDaosWrapper>
      <ProfileUserTaskDaosContainer>
        <ProfileUserTaskDaosTitle>{userOrgs?.length} DAOS</ProfileUserTaskDaosTitle>
        <ProfileContentGrid
          data={userOrgs}
          Component={OrgCard}
          fetchMore={handleFetchMoreOrgRoles}
          buttonIsDisabled={disableOrgRolesButton}
        />
      </ProfileUserTaskDaosContainer>

      <ProfileUserTaskDaosContainer>
        <ProfileUserTaskDaosTitle>{userTaskCountData?.completed} tasks completed</ProfileUserTaskDaosTitle>
        <ProfileContentGrid
          data={completedTasksData}
          Component={ProfileUserTaskCard}
          fetchMore={handleFetchMoreCompletedTasks}
          buttonIsDisabled={disableCompletedTaskButton}
        />
      </ProfileUserTaskDaosContainer>

      <ProfileUserTaskDaosContainer>
        <ProfileUserTaskDaosTitle>{inProgressCount} Currently working on</ProfileUserTaskDaosTitle>
        <ProfileContentGrid
          data={inProgressData}
          Component={ProfileUserTaskCard}
          fetchMore={handleFetchMoreInProgressTasks}
          buttonIsDisabled={disableInProgressButton}
        />
      </ProfileUserTaskDaosContainer>
    </ProfileUserTaskDaosWrapper>
  );
}

export default ProfileUserTaskDaos;
