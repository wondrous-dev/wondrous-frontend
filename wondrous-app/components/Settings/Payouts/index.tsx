import React, { useCallback, useEffect, useState } from 'react';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';

import { CircularProgress } from '@material-ui/core';
import UserCheckIcon from '../../Icons/userCheckIcon';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { PaymentsContainer, SeeMoreText } from './styles';
import { GET_ORG_PAYOUTS, GET_POD_PAYOUTS } from '../../../graphql/queries/payment';

const LIMIT = 20;

const Payouts = (props) => {
  const router = useRouter();
  const { orgId, podId } = router.query;
  const [hasMore, setHasMore] = useState(false);
  const [payments, setPayments] = useState([]);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);

  const [getOrgPayments, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_PAYOUTS, {
    onCompleted: (data) => {
      if (!firstTimeFetch) {
        setPayments(data?.getOrgPayments);
        setHasMore(data?.hasMore || data?.getOrgPayments.length >= LIMIT);
        setFirstTimeFetch(true);
      }
    },
    fetchPolicy: 'network-only',
  });

  const [getPodPayments] = useLazyQuery(GET_POD_PAYOUTS, {
    onCompleted: (data) => {
      setPayments(data?.getPodPayments);
      setHasMore(data?.hasMore || data?.getPodPayments.length >= LIMIT);
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (orgId) {
      getOrgPayments({
        variables: {
          orgId,
          limit: LIMIT,
        },
      });
    } else if (podId) {
      getPodPayments({
        variables: {
          podId,
          limit: LIMIT,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, podId]);

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      fetchMore({
        variables: {
          offset: payments.length,
          limit: LIMIT,
        },
      })
        .then((fetchMoreResult) => {
          if (orgId) {
            const orgPayments = fetchMoreResult?.data?.getOrgPayments;
            const hasMore = orgPayments.length >= LIMIT;
            if (hasMore) {
              setPayments([...payments, ...orgPayments]);
            } else {
              setHasMore(false);
            }
          } else if (podId) {
            const podPayments = fetchMoreResult?.data?.getPodPayments;
            const hasMore = podPayments.length >= LIMIT;
            if (hasMore) {
              setPayments([...payments, ...podPayments]);
            } else {
              setHasMore(false);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [hasMore, payments, fetchMore, orgId, podId]);

  return (
    <SettingsWrapper>
      <PaymentsContainer>
        <HeaderBlock
          icon={<UserCheckIcon circle />}
          title="Configure Payments"
          description="Define Payouts from Tasks completions"
        />
        <StyledTableContainer>
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell align="center" width="30%">
                  Task
                </StyledTableCell>
                <StyledTableCell align="center" width="30%">
                  Amount
                </StyledTableCell>
                <StyledTableCell align="center" width="40%">
                  Status
                </StyledTableCell>
              </StyledTableRow>
            </StyledTableHead>
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {loading && <CircularProgress />}
            </div>
            <StyledTableBody>
              {payments &&
                payments.map((payment) => {
                  return (
                    <StyledTableRow key={payment?.id}>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </StyledTableRow>
                  );
                })}
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
      </PaymentsContainer>
    </SettingsWrapper>
  );
};

export default Payouts;
