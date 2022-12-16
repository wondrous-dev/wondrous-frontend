import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useQuery } from '@apollo/client';
import ExploreProjectIcon from 'components/MissionControlWidgets/MyProjects/ExploreProjectIcon.svg';
import CreateProjectIcon from 'components/MissionControlWidgets/MyProjects/CreateProjectIcon.svg';

import { GET_USER_ORG_ROLES } from 'graphql/queries';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import RolePill from 'components/Common/RolePill';
import { useMe } from 'components/Auth/withAuth';
import AddDaoModal from 'components/Common/AddDaoModal';
import SmartLink from 'components/Common/SmartLink';
import {
  ProjectRowContainer,
  MyProjectWrapper,
  MyProjectRowsContainer,
  ExploreCreateButton,
  ExploreCreateButtonsContainer,
  MyProjectBannerContainer,
  MyProjectLabel,
  OrgNameTitle,
  BannerImage,
} from './styles';

const MyProjectsWidget = () => {
  const router = useRouter();
  const user = useMe();
  const [openCreateDaoModal, setCreateDaoModal] = useState(false);
  const handleCreateDaoModal = (a) => () => setCreateDaoModal(a);
  const { data, loading } = useQuery(GET_USER_ORG_ROLES, {
    variables: {
      userId: user?.id,
      excludeSharedOrgs: true,
    },
    skip: !user?.id,
  });
  return (
    <MyProjectWrapper>
      {openCreateDaoModal && <AddDaoModal open={openCreateDaoModal} handleClose={handleCreateDaoModal(false)} />}

      <MyProjectBannerContainer>
        <BannerImage src="/images/mission-control/spaceship.png" />
        <div style={{ position: 'absolute' }}>
          <MyProjectLabel>Projects</MyProjectLabel>
        </div>
      </MyProjectBannerContainer>

      <ExploreCreateButtonsContainer>
        <ExploreCreateButton onClick={handleCreateDaoModal(true)}>
          <CreateProjectIcon />
          Create
        </ExploreCreateButton>

        <ExploreCreateButton
          onClick={() => {
            router.push('/explore');
          }}
        >
          <ExploreProjectIcon />
          Explore
        </ExploreCreateButton>
      </ExploreCreateButtonsContainer>
      {data?.getUserOrgRoles?.length > 0 && (
        <MyProjectRowsContainer>
          {data?.getUserOrgRoles?.map((orgRole, idx) => (
            <SmartLink
              href={`/organization/${orgRole?.org?.username}/home`}
              key={`myproject-${orgRole?.org?.id}`}
              asLink
            >
              <ProjectRowContainer>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <OrgProfilePicture profilePicture={orgRole?.org?.thumbnailPicture || orgRole?.org?.profilePicture} />
                  <OrgNameTitle>{orgRole?.org?.username}</OrgNameTitle>
                </div>

                <RolePill roleName={orgRole?.role?.name} fontSize={13} onClick={() => {}} />
              </ProjectRowContainer>
            </SmartLink>
          ))}
        </MyProjectRowsContainer>
      )}
    </MyProjectWrapper>
  );
};

export default MyProjectsWidget;
