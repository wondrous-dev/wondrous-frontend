import { useLazyQuery, useMutation } from '@apollo/client';
import { useMe, withAuth } from 'components/Auth/withAuth';

import EntitySidebar from 'components/Common/SidebarEntity';
import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import { CONFIG } from 'components/ProjectOnboarding/Shared/constants';
import { CREATE_ORG, REDEEM_COLLAB_TOKEN, UPDATE_ORG } from 'graphql/mutations';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_ORG_FROM_USERNAME, GET_USER_ORGS } from 'graphql/queries';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { ANALYTIC_EVENTS } from 'utils/constants';
import { OrgBoardContext } from 'utils/contexts';
import { usePageDataContext } from 'utils/hooks';
import { sendAnalyticsData } from './Shared';

const useCreateOrg = () => {
  const router = useRouter();
  const { collabInvite } = router.query;
  const [redeemCollabToken, { loading: redeemLoading, data }] = useMutation(REDEEM_COLLAB_TOKEN, {
    notifyOnNetworkStatusChange: true,
  });
  const [createOrg, { loading, data: createOrgData }] = useMutation(CREATE_ORG, {
    refetchQueries: ['getUserOrgs'],
    onCompleted: ({ createOrg }) => {
      const { id } = createOrg;
      if (collabInvite) {
        redeemCollabToken({ variables: { orgId: id, token: collabInvite } });
      }
    },
  });
  return {
    createOrg,
    loading: loading || redeemLoading,
    createOrgData,
    collabUsername: data?.redeemOrgCollabRequestInviteToken?.username,
  };
};

const ProjectOnboarding = ({ orgUsername = '', defaultStep = 0, withEntitySidebar = false }) => {
  const user = useMe();
  const { createOrg, loading: createOrgLoading, createOrgData, collabUsername } = useCreateOrg();
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
      sendAnalyticsData(ANALYTIC_EVENTS.ONBOARDING_PROJECT_CREATE, { orgId: data?.createOrg?.id, userId: user?.id });
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
        collabUsername,
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
