import Wrapper from 'components/organization/wrapper/wrapper';
import Project from 'components/Project';

const OrgProject = ({ orgData = {} }) => (
  <Wrapper orgData={orgData}>
    <Project orgData={orgData} />
  </Wrapper>
);

export default OrgProject;
