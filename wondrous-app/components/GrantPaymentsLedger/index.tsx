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

import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { LIMIT } from 'services/board';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { ENTITIES_TYPES, GRANTS_STATUSES } from 'utils/constants';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
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

  const router = useRouter();

  return (
    <>
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
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell align="left" width="5%">
                  <div>action</div>
                </StyledTableCell>
                <StyledTableCell align="left" width="10%">
                  <Tooltip title="Person assigned to task" placement="top">
                    <div>Payee</div>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align="center" width="10%">
                  <Tooltip title="Wallet" placement="top">
                    <div>Wallet</div>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align="center" width="20%">
                  <Tooltip title="Title of grant application" placement="top">
                    <div>Application</div>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align="center" width="10%">
                  <Tooltip title="Indicated grant amount" placement="top">
                    <div>Amount</div>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align="center" width="10%">
                  <Tooltip title="Chain to be paid on" placement="top">
                    <div>Chain</div>
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
            {/* <StyledTableBody>
          </StyledTableBody> */}
          </StyledTable>
          <EmptyGrantsBoard />
        </StyledTableContainer>
      </CardsContainer>
    </>
  );
};

export default GrantPaymentsLedger;
