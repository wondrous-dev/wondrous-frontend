import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import pluralize from 'pluralize';

import { GET_ORG_BY_ID, GET_ORG_ROLES, GET_ORG_USERS } from 'graphql/queries/org';
import { GET_POD_BY_ID, GET_POD_ROLES, GET_POD_USERS } from 'graphql/queries/pod';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import palette from 'theme/palette';
import { Text } from 'components/styled';
import Grid from '@mui/material/Grid';
import { DropDown, DropDownItem } from 'components/Common/dropdown';
import { KICK_ORG_USER } from 'graphql/mutations/org';
import { KICK_POD_USER } from 'graphql/mutations/pod';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import ConfirmModal, { SubmitButtonStyle } from 'components/Common/ConfirmModal';
import { NewOrgInviteLinkModal } from 'components/Common/NewInviteLinkModal/OrgInviteLink';
import MemberRoles from '../MemberRoles';
import MemberRoleDropdown from './MemberRoleDropdown';
import InviteMember from './InviteMember';
import { SafeImage } from '../../Common/Image';
import {
  DefaultProfilePicture,
  PodsCount,
  SeeMoreText,
  StyledTable,
  StyledTableBody,
  StyledTableHeaderCell,
} from './styles';
import { StyledTableCell, StyledTableContainer, StyledTableHead, StyledTableRow } from '../../Table/styles';
import { RolesContainer } from '../Roles/styles';
import MembersIcon from '../../Icons/membersSettings';
import { HeaderBlock } from '../headerBlock';
import { SettingsWrapper } from '../settingsWrapper';

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

function Members(props) {
  const router = useRouter();
  const { orgId, podId } = router.query;
  const [hasMore, setHasMore] = useState(true);
  const [userToRemove, setUserToRemove] = useState(null);
  const [users, setUsers] = useState([]);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);

  const [getOrgUsers, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_USERS, {
    fetchPolicy: 'network-only',
  });

  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const [getOrg, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);

  const [getPodUsers] = useLazyQuery(GET_POD_USERS, {
    onCompleted: (data) => {
      setUsers(data?.getPodUsers);
      setHasMore(data?.hasMore || data?.getPodUsers.length >= LIMIT);
    },
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
      });
      getPodRoles({
        variables: {
          podId,
        },
      });
    }
  }, [orgId, podId]);

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      fetchMore({
        variables: {
          offset: users.length,
          limit: LIMIT,
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
              {userToRemove?.firstName} {userToRemove?.lastName}
            </Text>
            ‘ from this DAO. This action cannot be undone.
          </Text>
        </ConfirmModal>

        <HeaderBlock
          icon={<MembersIcon circle />}
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
        />

        <MemberRoles users={users} roleList={roleList} isDAO={!!orgId} />

        {podId ? (
          <InviteMember users={users} setUsers={setUsers} orgId={orgId} podId={podId} roleList={roleList} />
        ) : null}

        <StyledTableContainer>
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableHeaderCell width="50%">Members</StyledTableHeaderCell>
                <StyledTableHeaderCell width="30%">Role</StyledTableHeaderCell>
                <StyledTableHeaderCell width="15%">Pods</StyledTableHeaderCell>
                <StyledTableHeaderCell width="5%">Edit</StyledTableHeaderCell>
              </StyledTableRow>
            </StyledTableHead>
            <StyledTableBody>
              {users ? (
                users.map(({ user, role }) => {
                  const userId = user?.id;

                  return (
                    <StyledTableRow key={userId}>
                      <StyledTableCell>
                        <Link href={`/profile/${user?.username}/about`} passHref>
                          <Grid container direction="row" alignItems="center" style={{ cursor: 'pointer' }}>
                            {user?.thumbnailPicture ? (
                              <SafeImage
                                useNextImage={false}
                                src={user?.thumbnailPicture}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  marginRight: '10px',
                                }}
                              />
                            ) : (
                              <DefaultProfilePicture />
                            )}

                            <Grid direction="column" alignItems="center">
                              <Text color="white" fontSize={15} fontWeight={700} lineHeight="20px">
                                {user?.firstName} {user?.lastName}
                              </Text>

                              <Text color="#C4C4C4" fontSize={12} lineHeight="17px">
                                @{user?.username}
                              </Text>
                            </Grid>
                          </Grid>
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell>
                        <MemberRoleDropdown
                          userId={userId}
                          orgId={orgId}
                          podId={podId}
                          existingRole={role}
                          roleList={roleList}
                          username={user?.username}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <PodsCount>
                          {user?.additionalInfo?.podCount || 0} {pluralize('Pod', user?.additionalInfo?.podCount || 0)}{' '}
                        </PodsCount>
                      </StyledTableCell>

                      <StyledTableCell>
                        <DropDown DropdownHandler={TaskMenuIcon}>
                          <DropDownItem
                            onClick={() => setUserToRemove(user)}
                            style={{
                              color: palette.white,
                            }}
                          >
                            Remove Member
                          </DropDownItem>
                        </DropDown>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })
              ) : (
                <StyledTableRow>
                  <StyledTableCell colspan={5} align="center">
                    <CircularProgress />
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
        {hasMore && (
          <div
            style={{
              textAlign: 'center',
            }}
            onClick={() => handleLoadMore()}
          >
            <SeeMoreText>See more</SeeMoreText>
          </div>
        )}
      </RolesContainer>
    </SettingsWrapper>
  );
}

export default Members;
