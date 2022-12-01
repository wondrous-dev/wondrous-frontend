import Wrapper from 'components/organization/wrapper/wrapper';
import ProjectProfile from 'components/ProjectProfile';

const OrgProject = ({ orgData = {} }) => (
  <Wrapper orgData={orgData}>
    <ProjectProfile orgData={orgData} />
  </Wrapper>
);

export default OrgProject;
