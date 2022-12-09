import { useQuery } from '@apollo/client';
import EntitySidebar from 'components/Common/SidebarEntity';
import Wrapper from 'components/organization/wrapper/wrapper';
import ProjectProfile from 'components/ProjectProfile';
import { GET_ORG_FROM_USERNAME } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { OrgBoardContext } from 'utils/contexts';

const OrgProject = () => {
  const { username } = useRouter().query;
  const { data } = useQuery(GET_ORG_FROM_USERNAME, {
    skip: !username,
    variables: {
      username,
    },
  });
  const { getOrgFromUsername: orgData } = data || {};
  const contextValue = useMemo(
    () => ({
      orgData,
    }),
    [orgData]
  );

  return (
    <OrgBoardContext.Provider value={contextValue}>
      <EntitySidebar>
        <Wrapper orgData={orgData}>
          <ProjectProfile orgData={orgData} />
        </Wrapper>
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
};

export default OrgProject;
