import { Grid } from '@mui/material';
import { useGetLoggedInUserFullAccessOrgs } from 'components/AppInstallation/Coordinape/CoordinapeIntegrationForm/hooks';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { FIELDS } from 'components/Common/TaskViewModal/Fields/hooks/constants';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import { CreateGrantApplicationWorkspaceWrapper } from 'components/GrantApplications/CreateGrantApplication/styles';
import { DAOIcon } from 'components/Icons/dao';
import EditIcon from 'components/Icons/editIcon';
import OrgSearch from 'components/OrgSearch';
import { useMemo } from 'react';
import palette from 'theme/palette';
import { OrgViewer } from '../Fields';

const EditContent = ({ org, toggleEditMode }) => {
  const userOrgs: any = useGetLoggedInUserFullAccessOrgs();
  const { submit, error } = useSubmit({ field: FIELDS.ORG });
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

  const handleSubmit = async (value) => await submit(value?.id);

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
        onChange={handleSubmit}
        label="Select project"
      />
    </CreateGrantApplicationWorkspaceWrapper>
  );
};

const Project = ({ canEdit, grantApplication }) => (
  <TaskFieldEditableContent
    ViewContent={({ toggleEditMode }) => (
      <ViewFieldWrapper $canEdit={canEdit} onClick={toggleEditMode}>
      <OrgViewer grantApplication={grantApplication} />
        <EditIcon stroke={palette.grey58} className="edit-icon-field" />
      </ViewFieldWrapper>
    )}
    canAddItem={false && !grantApplication?.org?.id}
    editableContent={({ toggleEditMode }) => <EditContent toggleEditMode={toggleEditMode} org={grantApplication.org} />}
    addContent={({ toggleAddMode }) => <EditContent toggleEditMode={toggleAddMode} org={grantApplication.org} />}
  />
);

export default Project;
