import { useMemo, useState } from 'react';
import { useMe } from 'components/Auth/withAuth';
import { ActionButton } from 'components/Common/Task/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OrgSearch from 'components/OrgSearch';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { REDEEM_COLLAB_TOKEN } from 'graphql/mutations';
import { PERMISSIONS } from 'utils/constants';
import { Wrapper, WrapperHeader, WrapperSubheader } from './styles';

export const LoggedOutUser = ({ user, token }) => (
  <Wrapper>
    <WrapperHeader>My Org is on Wonder</WrapperHeader>
    <WrapperSubheader>Log-in and accept the invitation</WrapperSubheader>
    <Link href={`/login?collabInvite=${token}`}>
      <ActionButton>Log in and accept</ActionButton>
    </Link>
  </Wrapper>
);

export const MissingUserActions = ({ user, token }) => {
  const href = user ? `/onboarding-dao?collabInvite=${token}` : `/login?collabInvite=${token}`;
  return (
    <Wrapper>
      <WrapperHeader>My org is not on Wonder</WrapperHeader>
      <WrapperSubheader>Easy, just create a workspace and accept!</WrapperSubheader>
      <Link href={href}>
        <ActionButton>Create org and accept</ActionButton>
      </Link>
    </Wrapper>
  );
};

export const SelectOrgs = ({ token, requestOrg }) => {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const router = useRouter();
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [redeemCollabToken] = useMutation(REDEEM_COLLAB_TOKEN, {
    onCompleted: ({ redeemOrgCollabRequestInviteToken }) => {
      const { username } = redeemOrgCollabRequestInviteToken;
      router.push(`/collaboration/${username}/boards`);
    },
  });
  const { data: userOrgs } = useQuery(GET_USER_ORGS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      excludeSharedOrgs: true,
    },
  });

  const permissions = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;

  const options = useMemo(
    () =>
      userOrgs?.getUserOrgs?.filter(
        (org) => org?.id !== requestOrg?.id && permissions?.orgPermissions[org?.id].includes(PERMISSIONS.FULL_ACCESS)
      ),
    [userOrgs, requestOrg, permissions]
  );

  const handleInviteRedeem = (orgId, token) => redeemCollabToken({ variables: { orgId, token } });

  return (
    <Wrapper>
      <WrapperHeader>My Org is on Wonder</WrapperHeader>
      <WrapperSubheader>Easy, just select the DAO and accept!</WrapperSubheader>

      <OrgSearch
        value={selectedOrg}
        options={options}
        label="Select your project"
        onChange={(org: any) => setSelectedOrg(org)}
      />
      <ActionButton disabled={!selectedOrg} onClick={() => handleInviteRedeem(selectedOrg?.id, token)}>
        Accept collab
      </ActionButton>
    </Wrapper>
  );
};

const CONFIG = {
  NO_LOGGED_IN_USER: [LoggedOutUser, MissingUserActions],
  LOGGED_IN_USER: [MissingUserActions, SelectOrgs],
};

const Actions = ({ requestOrg }) => {
  const user = useMe();

  const router = useRouter();
  const { token } = router.query;

  const componentsConfig = user ? CONFIG.LOGGED_IN_USER : CONFIG.NO_LOGGED_IN_USER;

  return (
    <>
      {componentsConfig.map((Component, index) => (
        <Component key={index} requestOrg={requestOrg} user={user} token={token} />
      ))}
    </>
  );
};

export default Actions;
