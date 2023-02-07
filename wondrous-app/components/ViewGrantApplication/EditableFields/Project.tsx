import { Grid } from '@mui/material';
import { useGetLoggedInUserFullAccessOrgs } from 'components/AppInstallation/Coordinape/CoordinapeIntegrationForm/hooks';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import { CreateGrantApplicationWorkspaceWrapper } from 'components/GrantApplications/CreateGrantApplication/styles';
import { DAOIcon } from 'components/Icons/dao';
import OrgSearch from 'components/OrgSearch';
import { useMemo } from 'react';
import palette from 'theme/palette';
import { OrgViewer } from '../Fields';

const EditContent = ({ org, toggleEditMode }) => {
  const userOrgs: any = useGetLoggedInUserFullAccessOrgs();

  const orgsSchema = useMemo(
    () => ({
      name: 'org',
      label: 'Select your project',
      items: userOrgs?.map((org) => ({
        ...org,
        icon: <OrgProfilePicture profilePicture={org?.profilePicture} />,
        pillIcon: () => <OrgProfilePicture profilePicture={org?.profilePicture} />,
      })),
      icon: ({ style, ...rest }) => (
        <DAOIcon
          encircled={false}
          stroke={palette.blue20}
          style={{ ...style, width: '28px', height: '28px' }}
          {...rest}
        />
      ),
    }),
    [userOrgs]
  );

  return (
    <CreateGrantApplicationWorkspaceWrapper>
      <OrgSearch
        options={orgsSchema.items}
        logoStyle={{
          height: '24px',
          width: '24px',
        }}
        autoFocus
        value={org}
        onChange={(org) => console.log('on change')}
        label="Select project"
      />
    </CreateGrantApplicationWorkspaceWrapper>
  );
};

const Project = ({ canEdit, grantApplication }) => (
  <TaskFieldEditableContent
    ViewContent={({ toggleEditMode }) => (
      <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
        <OrgViewer grantApplication={grantApplication} />
      </ViewFieldWrapper>
    )}
    canAddItem={false && !grantApplication?.org?.id}
    editableContent={({ toggleEditMode }) => <EditContent toggleEditMode={toggleEditMode} org={grantApplication.org} />}
    addContent={({ toggleAddMode }) => <EditContent toggleEditMode={toggleAddMode} org={grantApplication.org} />}
  />
);

export default Project;
