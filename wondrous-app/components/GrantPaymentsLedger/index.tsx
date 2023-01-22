import { useQuery, useLazyQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CardsContainer } from 'components/Common/Boards/styles';
import { BountyBoardEmpty } from 'components/Common/BountyBoard/styles';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { ActionButton } from 'components/Common/Task/styles';
import { CreateFormModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityDiscardTask from 'components/CreateEntityDiscardTask';
import CreateGrant from 'components/CreateGrant';
import UnpaidApplicationRow from 'components/GrantPaymentsLedger/UnpaidApplicationRow';
import PaymentRow from 'components/GrantPaymentsLedger/PaymentRow';
import GrantsFilters from 'components/GrantsFilters';
import PlusIcon from 'components/Icons/plus';
import { Button } from 'components/Button';
import {
  GET_UNPAID_GRANT_APPLICATIONS_FOR_ORG,
  GET_UNPAID_GRANT_APPLICATIONS_FOR_POD,
  GET_GRANT_APPLICATION_PAYMENTS_FOR_ORG,
  GET_GRANT_APPLICATION_PAYMENTS_FOR_POD,
} from 'graphql/queries';
import Toggle from 'components/Common/Toggle';
import Tooltip from 'components/Tooltip';
import MakePaymentModal from 'components/Common/Payment/PaymentModal';

import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { LIMIT } from 'services/board';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { ENTITIES_TYPES, GRANTS_STATUSES } from 'utils/constants';
import { useOrgBoard, usePodBoard, useBoards } from 'utils/hooks';
import { delQuery } from 'utils/index';
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
  const displayList = view === ViewType.Paid ? paidList : unpaidList;
  const { board } = useBoards();
  const { orgId, podId } = board;
  console.log('paidList', paidList);
  console.log('unpaidList', unpaidList);
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

  const router = useRouter();
  const handlePay = (paymentInfo) => {
    setPaymodalOpen(true);
  };
  const handlePayModalClose = () => {
    setPaymodalOpen(false);
  };
  return (
    <>
      {payModalOpen && <MakePaymentModal open={payModalOpen} onClose={handlePayModalClose} />}
      <Grid display="flex" justifyContent="space-between" alignItems="center">
        <Button
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
