import { withAuth } from 'components/Auth/withAuth';
import { useLazyQuery, useMutation } from '@apollo/client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_ORG_FROM_USERNAME, GET_USER_ORGS } from 'graphql/queries';
import { CREATE_ORG, UPDATE_ORG } from 'graphql/mutations';
import { CONFIG } from 'components/ProjectOnboarding/Shared/constants';
import { usePageDataContext } from 'utils/hooks';
import { OrgBoardContext } from 'utils/contexts';
import EntitySidebar from 'components/Common/SidebarEntity';
import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';

const ProjectOnboarding = ({ orgUsername = '', defaultStep = 0, withEntitySidebar = false }) => {
  const [createOrg, { data: createOrgData, loading: createOrgLoading }] = useMutation(CREATE_ORG, {
    refetchQueries: ['getUserOrgs'],
  });

  const { setPageData } = usePageDataContext();

  const [getOrgFromUsername, { data, loading: orgLoading, refetch, startPolling, stopPolling }] =
    useLazyQuery(GET_ORG_FROM_USERNAME);

  const [updateOrg, { data: updateOrgData, loading: updateLoading }] = useMutation(UPDATE_ORG, {
    refetchQueries: ['getUserOrgs'],
  });

  const [step, setStep] = useState(defaultStep);

  useEffect(() => {
    if (orgUsername) getOrgFromUsername({ variables: { username: orgUsername } });
  }, [orgUsername]);
  const moveForward = () => setStep((prev) => prev + 1);

  const { Component } = CONFIG[step];

  const handleOrgCreate = async (input) => {
    try {
      moveForward();
      const { data } = await createOrg({ variables: { input } });
      setTimeout(() => {
        if (data?.createOrg?.id) moveForward();
      }, 600);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const { id, username, name, description, category, profilePicture, headerPicture, links } =
    data?.getOrgFromUsername || updateOrgData?.updateOrg || createOrgData?.createOrg || {};

  const twitterUsername = useMemo(
    () => links?.find((link) => link.type === 'twitter')?.url?.split('twitter.com/')?.[1],
    [links]
  );

  const orgData = {
    orgId: id,
    username,
    name,
    description,
    category,
    profilePicture,
    headerPicture,
    twitterUsername,
  };

  useEffect(() => {
    if (orgData) {
      setPageData({ orgData });
    }
  }, [orgData?.orgId, orgData?.username, orgData?.profilePicture, orgData?.name]);

  useEffect(() => () => setPageData({}), []);

  const handleOrgUpdate = async (input) => {
    try {
      const { data } = await updateOrg({ variables: { orgId: orgData.orgId, input } });
      return data;
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const ChildrenWrapper = withEntitySidebar ? EntitySidebar : Fragment;
  return (
    <OrgBoardContext.Provider
      value={{
        setStep,
        createOrg: handleOrgCreate,
        orgData,
        updateOrg: handleOrgUpdate,
        refetch,
        startPolling,
        stopPolling,
        getOrgFromUsername,
        orgId: orgData?.orgId,
      }}
    >
      <TaskViewModalWatcher />
      <ChildrenWrapper>
        <Component />
      </ChildrenWrapper>
    </OrgBoardContext.Provider>
  );
};

export default withAuth(ProjectOnboarding);
