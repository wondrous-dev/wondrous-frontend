import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLazyQuery, useMutation } from '@apollo/client';

import { AvatarList } from '../Common/AvatarList';
import SmartLink from 'components/Common/SmartLink';
import {
  StyledTableCell,
  MembersStyledTableRow as StyledTableRow,
  TasksCount,
  RequestMessage,
  PodOrgName,
} from './styles';
import { DAOIcon } from '../Icons/dao';
import { SafeImage } from '../Common/Image';
import { Button, GreyButton } from 'components/Button';
import { Text } from 'components/styled';
import MembershipRoleDropdown from './MembershipRoleDropdown';
import { GET_ORG_ROLES, GET_POD_ROLES, GET_USER_PROFILE, GET_USER_TASKS_COMPLETED_COUNT } from 'graphql/queries';
import { APPROVE_JOIN_POD_REQUEST, REJECT_JOIN_POD_REQUEST, UPDATE_USER_POD_ROLE } from 'graphql/mutations/pod';
import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { APPROVE_JOIN_ORG_REQUEST, REJECT_JOIN_ORG_REQUEST, UPDATE_USER_ORG_ROLE } from 'graphql/mutations/org';
import LinkBigIcon from 'components/Icons/link';
import { LinkSquareIcon } from 'components/Settings/linkSquareIcon';

export const MembershipRequest = ({ request, isAdmin, onApproved }) => {
  const [role, setRole] = useState(null);
  const [getPodRoles, { data: podRoleData }] = useLazyQuery(GET_POD_ROLES, {
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgRoles, { data: orgRoleData }] = useLazyQuery(GET_ORG_ROLES, {
    fetchPolicy: 'cache-and-network',
  });

  const [getUserTasksCompletedCount, { data: getUserTasksCompletedCountData }] = useLazyQuery(
    GET_USER_TASKS_COMPLETED_COUNT,
    {
      fetchPolicy: 'cache-and-network',
    }
  );
  const [getUser, { data: getUserProfileData }] = useLazyQuery(GET_USER_PROFILE, {
    fetchPolicy: 'cache-and-network',
  });

  const [approveJoinOrgRequest] = useMutation(APPROVE_JOIN_ORG_REQUEST, {
    refetchQueries: ['getJoinOrgRequests', 'getWorkFlowBoardReviewableItemsCount'],
  });
  const [rejectJoinOrgRequest] = useMutation(REJECT_JOIN_ORG_REQUEST, {
    refetchQueries: ['getJoinOrgRequests', 'getWorkFlowBoardReviewableItemsCount'],
  });
  const [approveJoinPodRequest] = useMutation(APPROVE_JOIN_POD_REQUEST, {
    refetchQueries: ['getJoinOrgRequests', 'getWorkFlowBoardReviewableItemsCount'],
  });
  const [rejectJoinPodRequest] = useMutation(REJECT_JOIN_POD_REQUEST, {
    refetchQueries: ['getJoinOrgRequests', 'getWorkFlowBoardReviewableItemsCount'],
  });
  const [updateUserOrgRole] = useMutation(UPDATE_USER_ORG_ROLE);
  const [updateUserPodRole] = useMutation(UPDATE_USER_POD_ROLE);

  const { ref, inView } = useInView();
  const roles = podRoleData?.getPodRoles || orgRoleData?.getOrgRoles || [];

  useEffect(() => {
    if (!role) {
      const role = roles.find((role) => role.default);

      setRole(role);
    }
  }, [roles]);

  useEffect(() => {
    if (inView && !getUserTasksCompletedCountData) {
      getUserTasksCompletedCount({
        variables: {
          userId: request.userId,
        },
      });

      getUser({
        variables: {
          userId: request.userId,
        },
      });

      if (request.podId) {
        getPodRoles({
          variables: {
            podId: request.podId,
          },
        });
      } else {
        getOrgRoles({
          variables: {
            orgId: request.orgId,
          },
        });
      }
    }
  }, [inView]);

  return (
    <StyledTableRow ref={ref}>
      <StyledTableCell align="center">
        <SmartLink href={`/organization/${request?.orgUsername}/boards`} asLink>
          {request.orgProfilePicture ? (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <SafeImage
                src={request.orgProfilePicture}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                }}
              />
            </div>
          ) : (
            <DAOIcon />
          )}
        </SmartLink>
      </StyledTableCell>

      <StyledTableCell
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        {request?.userProfilePicture && (
          <AvatarList
            align="center"
            users={[
              {
                avatar: {
                  url: request.userProfilePicture,
                },
                id: request.username,
                initials: request.username,
              },
            ]}
          />
        )}
        <SmartLink href={`/profile/${request.userUsername}/about`} asLink>
          <Text color="#C4C4C4" fontSize={12} lineHeight="19px" marginTop="5px">
            @{request.userUsername}
          </Text>
        </SmartLink>
      </StyledTableCell>

      <StyledTableCell
        style={{
          color: 'white',
          fontWeight: '700',
          fontSize: '15px',
          lineHeight: '19px',
        }}
      >
        <span>{role?.name || ''} in </span>

        {request.podId ? (
          <>
            <SmartLink href={`/pod/${request.podId}/boards`} asLink>
              <PodOrgName>{request.podName}</PodOrgName>
            </SmartLink>
            <span> pod</span>
          </>
        ) : (
          <>
            <SmartLink href={`/organization/${request.orgId}/boards`} asLink>
              <PodOrgName>{request.orgName}</PodOrgName>
            </SmartLink>
            <span> org</span>
          </>
        )}

        <div style={{ marginTop: '10px' }}>
          <RequestMessage>&quot;{request.message}&quot;</RequestMessage>
        </div>

        {getUserProfileData?.getUser.links ? (
          <Box sx={{ width: '30px', textAlign: 'center', marginTop: '15px' }}>
            <LinkSquareIcon title="Links" icon={<LinkBigIcon />} style={{ width: '30px', height: '30px' }} />
            <Text color="#7a7a7a" fontSize="12px" marginTop="3px">
              {getUserProfileData?.getUser.links.length}
            </Text>
          </Box>
        ) : null}
      </StyledTableCell>

      <StyledTableCell align="center">
        {getUserProfileData ? (
          <Text color="white" fontWeight="700" fontSize="15px">
            {getUserProfileData?.getUser?.userInfo?.discordUsername ? 'Yes' : 'No'}
          </Text>
        ) : (
          <LinearProgress />
        )}
      </StyledTableCell>

      <StyledTableCell align="center" style={{ padding: '17px 18px' }}>
        {getUserTasksCompletedCountData ? (
          <TasksCount>{getUserTasksCompletedCountData?.getUserTasksCompletedCount}</TasksCount>
        ) : (
          <LinearProgress />
        )}
      </StyledTableCell>

      {isAdmin && (
        <StyledTableCell>
          <MembershipRoleDropdown role={role} roles={roles} onChange={setRole} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button
              style={{ marginRight: '5px' }}
              onClick={async () => {
                if (request.podId) {
                  await approveJoinPodRequest({
                    variables: {
                      podId: request.podId,
                      userId: request.userId,
                    },
                  });

                  updateUserPodRole({
                    variables: {
                      input: {
                        userId: request.userId,
                        podId: request.podId,
                        roleId: role.id,
                      },
                    },
                  });
                } else {
                  await approveJoinOrgRequest({
                    variables: {
                      orgId: request.orgId,
                      userId: request.userId,
                    },
                  });

                  updateUserOrgRole({
                    variables: {
                      input: {
                        userId: request.userId,
                        orgId: request.orgId,
                        roleId: role.id,
                      },
                    },
                  });
                }

                onApproved({
                  ...request,
                  role,
                });
              }}
            >
              Approve
            </Button>
            <GreyButton
              style={{ marginLeft: '5px' }}
              onClick={() => {
                if (request.podId) {
                  rejectJoinPodRequest({
                    variables: {
                      podId: request.podId,
                      userId: request.userId,
                    },
                  });
                } else {
                  rejectJoinOrgRequest({
                    variables: {
                      orgId: request.orgId,
                      userId: request.userId,
                    },
                  });
                }
              }}
            >
              Decline
            </GreyButton>
          </Box>
        </StyledTableCell>
      )}
    </StyledTableRow>
  );
};
