import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import debounce from 'lodash/debounce';

import { GET_ORG_BY_ID, GET_ORG_ROLES, GET_ORG_USERS } from 'graphql/queries/org';
import { GET_POD_BY_ID, GET_POD_ROLES, GET_POD_USERS } from 'graphql/queries/pod';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import palette from 'theme/palette';
import { Text } from 'components/styled';
import Grid from '@mui/material/Grid';
import { KICK_ORG_USER } from 'graphql/mutations/org';
import { KICK_POD_USER } from 'graphql/mutations/pod';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import ConfirmModal, { SubmitButtonStyle } from 'components/Common/ConfirmModal';
import { NewInviteLinkModal } from 'components/Common/NewInviteLinkModal/InviteLink';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { useWonderWeb3 } from 'services/web3';
import MemberRoles from '../MemberRoles';
import InviteMember from './InviteMember';
import { SearchMembers, SeeMoreText, SeeMoreTextWrapper } from './styles';
import { RolesContainer } from '../Roles/styles';
import { HeaderBlock } from '../headerBlock';
import MemberTableRow from './MembersTableRow';
import { exportMembersDataToCSV } from './helpers';

const LIMIT = 10;

const useKickMember = (orgId, podId, users, setUsers) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const kickMemberSuccessful = () => {
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage(<>Member kicked successfully!</>);
  };
  const [kickOrgUser] = useMutation(KICK_ORG_USER, {
    onCompleted: kickMemberSuccessful,
  });
  const [kickPodUser] = useMutation(KICK_POD_USER, {
    onCompleted: kickMemberSuccessful,
  });
  const handleKickMember = (userId) => {
    setUsers(users.filter((user) => user?.user?.id !== userId));
    if (orgId) {
      kickOrgUser({
        variables: {
          orgId,
          userId,
        },
      });
    }
    if (podId) {
      kickPodUser({
        variables: {
          podId,
          userId,
        },
      });
    }
  };
  return handleKickMember;
};

function Members() {
  const router = useRouter();
  const { orgId, podId } = router.query;
  const [hasMore, setHasMore] = useState(true);
  const [userToRemove, setUserToRemove] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [firstTimeFetch, setFirstTimeFetch] = useState(true);
  const [openInvite, setOpenInvite] = useState(false);

  const wonderWeb3 = useWonderWeb3();

  useEffect(() => {
    if (users?.length) {
      setFilteredUsers(users);
    }
  }, [users]);

  const [getOrgUsers, { fetchMore: fetchMoreOrgUsers }] = useLazyQuery(GET_ORG_USERS, {
    fetchPolicy: 'network-only',
  });

  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const [getOrg, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);

  const [getPodUsers, { fetchMore: fetchMorePodUsers }] = useLazyQuery(GET_POD_USERS, {
    fetchPolicy: 'network-only',
  });

  const [getPodRoles, { data: podRoleData }] = useLazyQuery(GET_POD_ROLES);
  const [getOrgRoles, { data: orgRoleData }] = useLazyQuery(GET_ORG_ROLES);
  const roleList = podRoleData?.getPodRoles || orgRoleData?.getOrgRoles;
  useEffect(() => {
    if (orgId) {
      getOrg({
        variables: {
          orgId,
        },
      });

      getOrgUsers({
        variables: {
          orgId,
          limit: LIMIT,
        },
      }).then((result) => {
        if (firstTimeFetch) {
          const users = result?.data?.getOrgUsers;
          setUsers(users);
          setHasMore(result?.data?.hasMore || result?.data?.getOrgUsers.length >= LIMIT);
          setFirstTimeFetch(false);
        }
      });
      getOrgRoles({
        variables: {
          orgId,
        },
      });
    } else if (podId) {
      getPod({
        variables: {
          podId,
        },
      });
      getPodUsers({
        variables: {
          podId,
          limit: LIMIT,
        },
      }).then((result) => {
        if (firstTimeFetch) {
          const users = result?.data?.getPodUsers;
          setUsers(users);
          setHasMore(result?.data?.hasMore || result?.data?.getPodUsers.length >= LIMIT);
          setFirstTimeFetch(false);
        }
      });
      getPodRoles({
        variables: {
          podId,
        },
      });
    }
  }, [orgId, podId]);

  const isOrg = !!orgId;

  const handleMoreData = (data) => {
    const hasMore = data.length >= LIMIT;
    setUsers([...users, ...data]);
    if (!hasMore) {
      setHasMore(false);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      const variables = {
        offset: users.length,
        limit: LIMIT,
        searchString: null,
        filterByRoles: [],
      };

      if (orgId) {
        fetchMoreOrgUsers({
          variables,
        })
          .then((result) => {
            handleMoreData(result?.data?.getOrgUsers);
          })
          .catch((error) => {
            console.error(error);
            Sentry.captureException(error);
          });
      }

      if (podId) {
        fetchMorePodUsers({
          variables,
        })
          .then((result) => {
            handleMoreData(result?.data?.getPodUsers);
          })
          .catch((error) => {
            console.error(error);
            Sentry.captureException(error);
          });
      }
    }
  }, [hasMore, users, fetchMoreOrgUsers, orgId, podId]);

  const orgOrPodName = orgData?.getOrgById?.name || podData?.getPodById?.name;
  const handleKickMember = useKickMember(orgId, podId, users, setUsers);
  const showHasMore = hasMore && !searchQuery?.length && !selectedRoleIds?.length;

  const handleDownloadToCSV = () => {
    if (isOrg) {
      getOrgUsers({
        variables: {
          orgId,
          limit: Number.POSITIVE_INFINITY,
        },
      }).then(({ data }) => {
        exportMembersDataToCSV(orgOrPodName, data?.getOrgUsers);
      });
    } else {
      getPodUsers({
        variables: {
          podId,
          limit: Number.POSITIVE_INFINITY,
        },
      }).then(({ data }) => {
        exportMembersDataToCSV(orgOrPodName, data?.getPodUsers);
      });
    }
  };

  const handleRoleFilterChange = useCallback((roleId: string) => {
    setSelectedRoleIds((selectedRoleIds) => {
      const isSelected = selectedRoleIds.includes(roleId);
      if (isSelected) {
        return selectedRoleIds.filter((role) => role !== roleId);
      }
      return [...selectedRoleIds, roleId];
    });
  }, []);

  const handleSearchQueryOnChange = useCallback((ev: React.ChangeEvent) => {
    const searchQuery = (ev.target as HTMLInputElement).value;
    setSearchQuery(searchQuery);
  }, []);

  const handleSearchMembers = useCallback(
    debounce(async () => {
      if (!searchQuery?.length && !selectedRoleIds?.length) {
        setFilteredUsers(users);
        return;
      }

      const isSearchQueryENS = searchQuery.endsWith('.eth');
      let walletAddress = null;
      if (isSearchQueryENS) {
        walletAddress = await wonderWeb3.getAddressFromENS(searchQuery);
      }
      if (isOrg) {
        getOrgUsers({
          variables: {
            orgId,
            searchString: isSearchQueryENS ? walletAddress : searchQuery,
            filterByRoles: selectedRoleIds,
          },
        }).then(({ data }) => {
          const hasUsersCorrespondingToSearchQuery = data?.getOrgUsers?.length > 0;
          setFilteredUsers((_) => (hasUsersCorrespondingToSearchQuery ? data?.getOrgUsers : null));
        });
      } else {
        getPodUsers({
          variables: {
            podId,
            searchString: isSearchQueryENS ? walletAddress : searchQuery,
            filterByRoles: selectedRoleIds,
          },
        }).then(({ data }) => {
          const hasUsersCorrespondingToSearchQuery = data?.getPodUsers?.length > 0;
          setFilteredUsers((_) => (hasUsersCorrespondingToSearchQuery ? data?.getPodUsers : null));
        });
      }
    }, 500),
    [users, searchQuery, selectedRoleIds, isOrg]
  );

  useEffect(() => {
    if (!firstTimeFetch) {
      handleSearchMembers();
    }
  }, [searchQuery, selectedRoleIds?.length, firstTimeFetch]);

  return (
    <SettingsWrapper showPodIcon={false}>
      <NewInviteLinkModal
        orgOrPodName={orgOrPodName}
        orgId={orgId}
        podId={podId}
        open={openInvite}
        onClose={() => setOpenInvite(false)}
      />
      <RolesContainer>
        <ConfirmModal
          open={!!userToRemove}
          onClose={() => setUserToRemove(null)}
          onSubmit={() => {
            handleKickMember(userToRemove.id);
            setUserToRemove(null);
          }}
          title="Remove user from Wonder?"
          submitLabel="Remove user"
          submitButtonStyle={SubmitButtonStyle.Delete}
        >
          <Text color="#C4C4C4" fontSize="16px">
            This will remove the user ‘
            <Text color="white" as="strong">
              {userToRemove?.username}
            </Text>
            ‘ from this DAO. This action cannot be undone.
          </Text>
        </ConfirmModal>

        <HeaderBlock
          title={
            <>
              Members&nbsp;
              {orgOrPodName ? (
                <Text as="span">
                  {' '}
                  of{' '}
                  <Text as="span" color="#CCBBFF">
                    {orgOrPodName}
                  </Text>
                </Text>
              ) : null}
            </>
          }
          description="Use roles to organize contributors and admins"
          onInvite={() => setOpenInvite(true)}
          handleDownloadToCSV={handleDownloadToCSV}
        />

        <MemberRoles
          users={users}
          roleList={roleList}
          isDAO={!!orgId}
          selectedRoleIds={selectedRoleIds}
          handleRoleFilterChange={handleRoleFilterChange}
        />

        {podId ? (
          <InviteMember users={users} setUsers={setUsers} orgId={orgId} podId={podId} roleList={roleList} />
        ) : null}

        <SearchMembers placeholder="Search members..." orgId={orgId} onChange={handleSearchQueryOnChange} />

        {filteredUsers?.length > 0 ? (
          <Grid display="flex" flexDirection="column" gap="25px" width="100%" maxWidth="770px">
            {filteredUsers.map(({ user, role }) => (
              <MemberTableRow
                user={user}
                role={role}
                key={user?.id}
                orgId={orgId}
                podId={podId}
                roleList={roleList}
                promptRemoveUser={setUserToRemove}
              />
            ))}
          </Grid>
        ) : (
          <Typography width="770px" color={palette.white} fontWeight={500} textAlign="center">
            No users found corresponding to your search.
          </Typography>
        )}

        {showHasMore && (
          <SeeMoreTextWrapper onClick={() => handleLoadMore()}>
            <SeeMoreText>See more</SeeMoreText>
          </SeeMoreTextWrapper>
        )}
      </RolesContainer>
    </SettingsWrapper>
  );
}

export default Members;
