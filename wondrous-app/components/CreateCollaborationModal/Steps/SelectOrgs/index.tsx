import { createPortal } from 'react-dom';
import { Org } from 'types/Org';
import * as Yup from 'yup';

import Divider from 'components/Divider';
import React, { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';

import { InlineText } from 'components/Common/Filter/styles';
import Dao2Dao from 'components/Icons/Dao2Dao';
import { Button } from 'components/Button';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { DAOIcon } from 'components/Icons/dao';
import TextField from 'components/TextField';
import palette from 'theme/palette';
import OrgSearch from 'components/OrgSearch';
import { useGlobalContext } from 'utils/hooks';
import { PERMISSIONS } from 'utils/constants';
import { useGetUserOrgs } from 'components/AppInstallation/Coordinape/CoordinapeIntegrationForm/hooks';
import { useMe } from 'components/Auth/withAuth';

type Props = {
  onCancel: () => void;
  onSubmit: (values: { title: string; mission: string; org1: Org; org2: Org }) => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
  defaultOrgId?: string;
};

const Step1SelectDaos = ({ onSubmit, onCancel, footerRef, defaultOrgId }: Props) => {
  const { userPermissionsContext } = useGlobalContext();
  const user = useMe();
  const userOrgs = useGetUserOrgs(user?.id);
  const [selectedOrg1, setSelectedOrg1] = useState(null);
  const [selectedOrg2, setSelectedOrg2] = useState(null);

  useEffect(() => {
    if (defaultOrgId) {
      setSelectedOrg1(userOrgs?.find((org) => org.id === defaultOrgId));
    }
  }, [defaultOrgId, userOrgs]);

  const DROPDOWN_PACEHOLDER = {
    DAO1: 'Select your project',
    DAO2: 'Select collaborator',
  };

  const fields = {
    title: {
      name: 'title',
      label: 'Title',
      placeholder: 'Enter name of project collaboration',
      labelType: 'highlighted',
      labelWidth: 94,
    },
    mission: {
      name: 'mission',
      label: 'Mission',
      placeholder: 'What is the mission of this collaboration?',
      multiline: true,
      maxLength: 200,
      labelType: 'highlighted',
      labelWidth: 94,
    },
  };

  const orgsSchema = {
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
  };

  // Unselect org from org2
  const org1Schema = useMemo(
    () => ({
      ...orgsSchema,
      items: orgsSchema.items?.filter(
        (org) =>
          (org?.modules?.collab || !org?.modules) &&
          org.id !== selectedOrg2?.id &&
          userPermissionsContext?.orgPermissions[org.id]?.includes(PERMISSIONS.FULL_ACCESS)
      ),
      label: selectedOrg1 ? null : DROPDOWN_PACEHOLDER.DAO1,
    }),
    [userOrgs, selectedOrg1, selectedOrg2]
  );

  // Unselect org from org1
  const org2Schema = useMemo(() => {
    const items = orgsSchema.items?.filter((org) => org.id !== selectedOrg1?.id);
    items?.unshift({ name: 'Project not in wonder', id: null, skipProfilePicture: true });
    return {
      ...orgsSchema,
      items,
      label: selectedOrg2 ? null : DROPDOWN_PACEHOLDER.DAO2,
    };
  }, [userOrgs, selectedOrg1, selectedOrg2]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    mission: Yup.string().required('Mission is required'),
  });

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      org1: selectedOrg1,
      org2: selectedOrg2,
    });
  };

  return (
    <Formik
      initialValues={{
        title: '',
        mission: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnMount
    >
      {({ isValid }) => (
        <Form id="org2dao">
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            wrap="nowrap"
            sx={{
              [InlineText]: {
                maxWidth: '154px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          >
            <OrgSearch
              value={selectedOrg1}
              options={org1Schema.items}
              label="Select your project"
              onChange={(org: any) => setSelectedOrg1(org)}
            />
            <Grid container sx={{ flex: '0 0 42px' }} justifyContent="center">
              <Dao2Dao />
            </Grid>
            <OrgSearch
              value={selectedOrg2}
              label="Select collaborator"
              options={org2Schema.items}
              onChange={(org: any) => setSelectedOrg2(org)}
              globalSearch
            />
          </Grid>

          <Divider my="18px" />

          <TextField {...fields.title} />
          <TextField {...fields.mission} />
          {footerRef.current
            ? createPortal(
                <Grid container gap="18px">
                  <Button color="grey" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    form="org2dao"
                    type="submit"
                    disabled={!(selectedOrg1 && selectedOrg2 && isValid)}
                  >
                    Send invitation
                  </Button>
                </Grid>,
                footerRef.current
              )
            : null}
        </Form>
      )}
    </Formik>
  );
};

export default Step1SelectDaos;
