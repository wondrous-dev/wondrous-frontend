import { createPortal } from 'react-dom';
import { Org } from 'types/Org';
import * as Yup from 'yup';

import Divider from 'components/Divider';
import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';

import { InlineText } from 'components/Common/Filter/styles';
import Dao2Dao from 'components/Icons/Dao2Dao';
import { Button } from 'components/Button';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { DAOIcon } from 'components/Icons/dao';
import { GET_USER_ORGS } from 'graphql/queries';
import FilterItem from 'components/Common/Filter';
import TextField from 'components/TextField';
import palette from 'theme/palette';
import OrgSearch from 'components/OrgSearch';

type Props = {
  onCancel: () => void;
  onSubmit: (values: { title: string; mission: string; org1: Org; org2: Org }) => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
};

const Step1SelectDaos = ({ onSubmit, onCancel, footerRef }: Props) => {
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const [selectedOrg1, setSelectedOrg1] = useState(null);
  const [selectedOrg2, setSelectedOrg2] = useState(null);

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
    items: userOrgs?.getUserOrgs.map((org) => ({
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
      items: orgsSchema.items?.filter((org) => org.id !== selectedOrg2),
      label: selectedOrg1 ? null : DROPDOWN_PACEHOLDER.DAO1,
    }),
    [userOrgs, selectedOrg1, selectedOrg2]
  );

  // Unselect org from org1
  const org2Schema = useMemo(
    () => ({
      ...orgsSchema,
      items: orgsSchema.items?.filter((org) => org.id !== selectedOrg1),
      label: selectedOrg2 ? null : DROPDOWN_PACEHOLDER.DAO2,
    }),
    [userOrgs, selectedOrg1, selectedOrg2]
  );

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
              onChange={(orgId: any) => setSelectedOrg1(orgId)}
            />
            {console.log(selectedOrg1, org1Schema)}
            <Grid container sx={{ flex: '0 0 42px' }} justifyContent="center">
              <Dao2Dao />
            </Grid>
            <OrgSearch
              value={selectedOrg2}
              options={org2Schema.items}
              onChange={(orgId: any) => setSelectedOrg2(orgId)}
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
                    Next
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
