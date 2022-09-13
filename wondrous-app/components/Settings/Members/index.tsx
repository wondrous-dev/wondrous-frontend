import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import debounce from 'lodash/debounce';

import { GET_ORG_BY_ID, GET_ORG_ROLES, GET_ORG_USERS } from 'graphql/queries/org';
import { GET_POD_BY_ID, GET_POD_ROLES, GET_POD_USERS } from 'graphql/queries/pod';
import { useRouter } from 'next/router';
import { CircularProgress, Typography } from '@mui/material';
import palette from 'theme/palette';
import { Text } from 'components/styled';
import Grid from '@mui/material/Grid';
import { KICK_ORG_USER } from 'graphql/mutations/org';
import { KICK_POD_USER } from 'graphql/mutations/pod';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import ConfirmModal, { SubmitButtonStyle } from 'components/Common/ConfirmModal';
import { NewOrgInviteLinkModal } from 'components/Common/NewInviteLinkModal/OrgInviteLink';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { useWonderWeb3 } from 'services/web3';
import MemberRoles from '../MemberRoles';
import MemberRoleDropdown from './MemberRoleDropdown';
import InviteMember from './InviteMember';
import { SafeImage } from '../../Common/Image';
import {
  SearchMembers,
  SeeMoreText,
  SeeMoreTextWrapper,
  StyledTable,
  StyledTableBody,
  StyledTableHeaderCell,
} from './styles';
import { StyledTableCell, StyledTableContainer, StyledTableHead, StyledTableRow } from '../../Table/styles';
import { RolesContainer } from '../Roles/styles';
import MembersIcon from '../../Icons/membersSettings';
import { HeaderBlock } from '../headerBlock';
import MemberTableRow from './MembersTableRow';
import { exportMembersDataToCSV } from './helpers';

const LIMIT = 10;
// const LIMIT = Number.POSITIVE_INFINITY;

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

function Members(props) {
  const router = useRouter();
  const { orgId, podId } = router.query;
  const [hasMore, setHasMore] = useState(true);
  const [userToRemove, setUserToRemove] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);

  const wonderWeb3 = useWonderWeb3();

  useEffect(() => {
    if (users?.length) {
      setFilteredUsers(users);
    }
  }, [users]);

  const [getOrgUsers, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_USERS, {
    fetchPolicy: 'network-only',
  });

  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const [getOrg, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);

  const [getPodUsers] = useLazyQuery(GET_POD_USERS, {
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
        if (!firstTimeFetch) {
          const users = result?.data?.getOrgUsers;
          setUsers(users);
          setHasMore(result?.data?.hasMore || result?.data?.getOrgUsers.length >= LIMIT);
          setFirstTimeFetch(true);
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
        if (!firstTimeFetch) {
          const users = result?.data?.getPodUsers;
          setUsers(users);
          setHasMore(result?.data?.hasMore || result?.data?.getPodUsers.length >= LIMIT);
          setFirstTimeFetch(true);
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

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      fetchMore({
        variables: {
          offset: users.length,
          limit: LIMIT,
          searchString: '',
        },
      })
        .then((fetchMoreResult) => {
          if (orgId) {
            const orgUsers = fetchMoreResult?.data?.getOrgUsers;
            const hasMore = orgUsers.length >= LIMIT;
            setUsers([...users, ...orgUsers]);
            if (!hasMore) {
              setHasMore(false);
            }
          } else if (podId) {
            const podUsers = fetchMoreResult?.data?.getPodUsers;
            const hasMore = podUsers.length >= LIMIT;
            setUsers([...users, ...podUsers]);
            if (!hasMore) {
              setHasMore(false);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [hasMore, users, fetchMore, orgId, podId]);

  const orgOrPodName = orgData?.getOrgById?.name || podData?.getPodById?.name;
  const handleKickMember = useKickMember(orgId, podId, users, setUsers);

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

  const handleSearchQueryOnChange = useCallback((ev: React.ChangeEvent) => {
    const searchQuery = (ev.target as HTMLInputElement).value;
    setSearchQuery(searchQuery);
  }, []);

  const handleSearchMembers = useCallback(
    debounce(async (searchQuery: string) => {
      // const searchQuery = (ev.target as HTMLInputElement).value;

      if (!searchQuery.length) {
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
          },
        }).then(({ data }) => {
          const hasUsersCorrespondingToSearchQuery = data?.getOrgUsers?.length > 0;
          setFilteredUsers(hasUsersCorrespondingToSearchQuery ? data?.getOrgUsers : null);
        });
      } else {
        getPodUsers({
          variables: {
            podId,
            searchString: isSearchQueryENS ? walletAddress : searchQuery,
          },
        }).then(({ data }) => {
          const hasUsersCorrespondingToSearchQuery = data?.getPodUsers?.length > 0;
          setFilteredUsers(hasUsersCorrespondingToSearchQuery ? data?.getPodUsers : null);
        });
      }
    }, 500),
    [users]
  );

  useEffect(() => {
    if (firstTimeFetch) {
      handleSearchMembers(searchQuery);
    }
  }, [searchQuery, firstTimeFetch]);

  return (
    <SettingsWrapper showPodIcon={false}>
      <NewOrgInviteLinkModal
        orgOrPodName={orgOrPodName}
        orgId={orgId}
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

        <MemberRoles users={users} roleList={roleList} isDAO={!!orgId} />

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

        {hasMore && !searchQuery?.length && (
          <SeeMoreTextWrapper onClick={() => handleLoadMore()}>
            <SeeMoreText>See more</SeeMoreText>
          </SeeMoreTextWrapper>
        )}
      </RolesContainer>
    </SettingsWrapper>
  );
}

export default Members;
