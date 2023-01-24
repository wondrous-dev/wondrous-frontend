import { useQuery, useLazyQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import { CardsContainer } from 'components/Common/Boards/styles';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import UnpaidApplicationRow from 'components/GrantPaymentsLedger/UnpaidApplicationRow';
import PaymentRow from 'components/GrantPaymentsLedger/PaymentRow';
import { Button } from 'components/Button';
import {
  GET_UNPAID_GRANT_APPLICATIONS_FOR_ORG,
  GET_UNPAID_GRANT_APPLICATIONS_FOR_POD,
  GET_GRANT_APPLICATION_PAYMENTS_FOR_ORG,
  GET_GRANT_APPLICATION_PAYMENTS_FOR_POD,
} from 'graphql/queries';
import Toggle from 'components/Common/Toggle';
import Tooltip from 'components/Tooltip';
import GrantLedgerPayModal from 'components/GrantPaymentsLedger/GrantLedgerPayModal';
import { GrantPaymentSelected } from 'components/Settings/Payouts/types';
import { parseUserPermissionContext } from 'utils/helpers';
import { PERMISSIONS } from 'utils/constants';

import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { LIMIT } from 'services/board';
import palette from 'theme/palette';
import { useGlobalContext, useBoards } from 'utils/hooks';
import EmptyGrantsBoard from './EmptyState';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from './styles';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

const GrantPaymentsLedger = () => {
  const [view, setView] = useState(ViewType.Unpaid);
  const [hasMore, setHasMore] = useState(false);
  const [paidList, setPaidList] = useState([]);
  const [unpaidList, setUnpaidList] = useState([]);
  const [payModalOpen, setPaymodalOpen] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState<GrantPaymentSelected | null>(null);

  const displayList = view === ViewType.Paid ? paidList : unpaidList;
  const { board } = useBoards();

  const orgData = board?.orgData; // used for routing

  const router = useRouter();
  const { orgId, podId } = board;
  const { userPermissionsContext } = useGlobalContext();

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId,
    podId,
  });

  const canPay = permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);

  const [getGrantApplicationPaymentsForOrg, { fetchMore: fetchMoreOrgPayments }] = useLazyQuery(
    GET_GRANT_APPLICATION_PAYMENTS_FOR_ORG,
    {
      fetchPolicy: 'network-only',
    }
  );
  const [getGrantApplicationPaymentsForPod, { fetchMore: fetchMorePodPayments }] = useLazyQuery(
    GET_GRANT_APPLICATION_PAYMENTS_FOR_POD,
    {
      fetchPolicy: 'network-only',
    }
  );
  const [getUnpaidGrantApplicationsForOrg, { fetchMore: fetchMoreUnpaidForOrg }] = useLazyQuery(
    GET_UNPAID_GRANT_APPLICATIONS_FOR_ORG,
    {
      fetchPolicy: 'network-only',
    }
  );
  const [getUnpaidGrantApplicationsForPod, { fetchMore: fetchMoreUnpaidForPod }] = useLazyQuery(
    GET_UNPAID_GRANT_APPLICATIONS_FOR_POD,
    {
      fetchPolicy: 'network-only',
    }
  );

  const toggleItems = [
    {
      label: 'Unpaid',
      isActive: view === ViewType.Unpaid || view === null,
      onChange: () => setView(ViewType.Unpaid),
      gradient: `linear-gradient(266.31deg, ${palette.highlightPurple} 1.4%, ${palette.highlightBlue} 119.61%)`,
    },
    {
      label: 'Paid',
      isActive: view === ViewType.Paid,
      onChange: () => setView(ViewType.Paid),
      gradient: `linear-gradient(266.31deg, ${palette.highlightPurple} 1.4%, ${palette.highlightBlue} 119.61%)`,
    },
  ];

  useEffect(() => {
    if (orgId && view === ViewType.Unpaid) {
      getUnpaidGrantApplicationsForOrg({
        variables: {
          input: {
            orgId,
            orgOnly: false,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const applications = result?.data?.getUnpaidGrantApplicationsForOrg;
        setUnpaidList(applications || []);
        setHasMore(applications?.length >= LIMIT);
      });
    } else if (podId && view === ViewType.Unpaid) {
      getUnpaidGrantApplicationsForPod({
        variables: {
          input: {
            podId,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const applications = result?.data?.getUnpaidGrantApplicationsForPod;
        setUnpaidList(applications || []);
        setHasMore(applications?.length >= LIMIT);
      });
    } else if (orgId && view === ViewType.Paid) {
      getGrantApplicationPaymentsForOrg({
        variables: {
          input: {
            orgId,
            orgOnly: false, // TODO add toggle to see pod payments, default to false
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const payments = result?.data?.getGrantApplicationPaymentsForOrg;
        setPaidList(payments || []);
        setHasMore(payments?.length >= LIMIT);
      });
    } else if (podId && view === ViewType.Paid) {
      getGrantApplicationPaymentsForPod({
        variables: {
          input: {
            podId,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const payments = result?.data?.getGrantApplicationPaymentsForPod;
        setPaidList(payments || []);
        setHasMore(payments?.length >= LIMIT);
      });
    }
  }, [orgId, podId, view, LIMIT]);

  const handlePay = (paymentInfo: GrantPaymentSelected) => {
    setPaymentSelected(paymentInfo);
    setPaymodalOpen(true);
  };
  const handlePayModalClose = () => {
    setPaymentSelected(null);
    setPaymodalOpen(false);
  };
  return (
    <>
      {payModalOpen && (
        <GrantLedgerPayModal
          orgId={orgId}
          podId={podId}
          open={payModalOpen}
          handleClose={handlePayModalClose}
          paymentSelected={paymentSelected}
        />
      )}
      <Grid display="flex" justifyContent="space-between" alignItems="center">
        <Button
          onClick={() =>
            router.push(
              { pathname: podId ? `/pod/${podId}/grants` : `/organization/${orgData?.username}/grants` },
              undefined,
              { shallow: true }
            )
          }
          buttonTheme={{
            paddingX: 16,
            paddingY: 7,
            fontSize: '14px',
            fontWeight: 500,
          }}
          borderRadius={6}
          color="secondary"
          height={28}
        >
          Back to Grants
        </Button>
        <Toggle items={toggleItems} />
      </Grid>
      <CardsContainer numberOfColumns={2} isFullWidth={false}>
        <StyledTableContainer>
          <StyledTable>
            {view === ViewType.Unpaid && (
              <StyledTableHead>
                <StyledTableRow>
                  <StyledTableCell align="left" width="5%">
                    <div>action</div>
                  </StyledTableCell>
                  <StyledTableCell align="left" width="10%">
                    <Tooltip title="User that applied to the grant" placement="top">
                      <div>Applicant</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="10%">
                    <Tooltip title="Wallet" placement="top">
                      <div>Recipient Address</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="20%">
                    <Tooltip title="Title of grant application" placement="top">
                      <div>Application Title</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="10%">
                    <Tooltip title="Indicated grant amount" placement="top">
                      <div>Amount</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="20%">
                    <Tooltip title="Grant" placement="top">
                      <div>Grant</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="20%">
                    <Tooltip title="Approval date of application" placement="top">
                      <div>Approval Date</div>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              </StyledTableHead>
            )}
            {view === ViewType.Paid && (
              <StyledTableHead>
                <StyledTableRow>
                  <StyledTableCell align="left" width="10%">
                    <Tooltip title="User that applied to the grant" placement="top">
                      <div>Applicant</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="10%">
                    <Tooltip title="Wallet" placement="top">
                      <div>Recipient Address</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="20%">
                    <Tooltip title="Title of grant application" placement="top">
                      <div>Application Title</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="10%">
                    <Tooltip title="Indicated grant amount" placement="top">
                      <div>Amount</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="20%">
                    <Tooltip title="Grant" placement="top">
                      <div>Grant</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="20%">
                    <Tooltip title="Link to proof of payment" placement="top">
                      <div>Link</div>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center" width="20%">
                    <Tooltip title="Approval date of application" placement="top">
                      <div>Date</div>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              </StyledTableHead>
            )}
            <StyledTableBody>
              {view === ViewType.Unpaid &&
                unpaidList.map((item) => (
                  <UnpaidApplicationRow
                    key={item.grantApplicationId}
                    item={item}
                    orgId={orgId}
                    podId={podId}
                    handlePay={handlePay}
                    canPay={canPay}
                  />
                ))}
              {view === ViewType.Paid &&
                paidList.map((item) => (
                  <PaymentRow
                    key={item.grantApplicationId}
                    item={item}
                    // canViewPaymentLink={}
                    // setPaymentDetailId={}
                  />
                ))}
            </StyledTableBody>
          </StyledTable>
          {displayList?.length === 0 && <EmptyGrantsBoard />}
        </StyledTableContainer>
      </CardsContainer>
    </>
  );
};

export default GrantPaymentsLedger;
