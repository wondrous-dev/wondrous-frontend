import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

import {
  StyledTable,
  StyledTableBody,
  StyledTableContainer,
  StyledTableHead,
  MembersStyledTableRow as StyledTableRow,
  StyledTableHeaderCell,
  ApprovedUserSnackBar,
} from './styles';
import { useUserBoard } from 'utils/hooks';
import { LoadMore } from '../Common/KanbanBoard/styles';

import { Text } from 'components/styled';
import { MembershipRequest } from 'components/Table/MembershipRequest';

export const MembershipRequestTable = (props) => {
  const { isAdmin } = props;
  const [approvedUser, setApprovedUser] = useState(null);
  const [ref, inView] = useInView({});
  const userBoard = useUserBoard();

  useEffect(() => {
    const requestsCount = userBoard?.joinPodRequests?.length + userBoard?.joinOrgRequests?.length;

    if (inView && userBoard.hasMore && requestsCount) {
      userBoard.onLoadMore();
    }
  }, [inView, userBoard.hasMore, userBoard.onLoadMore]);

  let requests = [];

  if (userBoard?.joinOrgRequests) {
    requests = [...requests, ...userBoard?.joinOrgRequests];
  }

  if (userBoard?.joinPodRequests) {
    requests = [...requests, ...userBoard.joinPodRequests];
  }

  requests = requests.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <StyledTableContainer>
      {approvedUser ? (
        <ApprovedUserSnackBar>
          <div style={{ display: 'flex' }}>
            You added&nbsp;
            <Link passHref={true} href={`/profile/${approvedUser.userUsername}/about`}>
              <Text style={{ textDecoration: 'underline' }} fontSize={15} lineHeight="19px">
                @{approvedUser.userUsername}
              </Text>
            </Link>
            &nbsp;as a&nbsp;<Text style={{ textDecoration: 'underline' }}>{approvedUser.role.name}</Text>
          </div>
        </ApprovedUserSnackBar>
      ) : null}

      <StyledTable>
        <StyledTableHead>
          <StyledTableRow>
            <StyledTableHeaderCell width="56px">DAO</StyledTableHeaderCell>
            <StyledTableHeaderCell width="105px">Member</StyledTableHeaderCell>
            <StyledTableHeaderCell width="378px">Role Requested</StyledTableHeaderCell>
            <StyledTableHeaderCell width="101px">in Discord</StyledTableHeaderCell>
            <StyledTableHeaderCell width="90px">Tasks</StyledTableHeaderCell>
            {isAdmin ? <StyledTableHeaderCell width="252px">Decision</StyledTableHeaderCell> : null}
          </StyledTableRow>
        </StyledTableHead>
        <StyledTableBody>
          {requests?.map((request, index) => (
            <MembershipRequest
              key={request.id}
              request={request}
              isAdmin={isAdmin}
              onApproved={(user) => {
                setApprovedUser(user);
                setTimeout(() => setApprovedUser(null), 3000);
              }}
            />
          ))}
        </StyledTableBody>
      </StyledTable>

      <LoadMore ref={ref} hasMore={userBoard.hasMore} />
    </StyledTableContainer>
  );
};
