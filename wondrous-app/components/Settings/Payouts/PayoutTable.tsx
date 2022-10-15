import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import Tooltip from 'components/Tooltip';
import QuestionMarkIcon from 'components/Icons/QuestionMarkIcon';
import { BatchPayModal } from 'components/Settings/Payouts/BatchPayModal';

import { PaymentModalContext } from 'utils/contexts';
import { User } from 'types/User';
import { SELECTION } from './constants';

import { PayModal } from './modal';
import PayoutItem from './PayoutItem';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  BottomActionBar,
  BottomActionBarText,
  BottomActionBarPayButton,
  BottomActionBarMultipleChainSelectedErrorText,
  BottomActionBarButton,
  BottomActionBarMultipleChainSelectedError,
} from './styles';

export interface PayeeDetails {
  podId?: string;
  orgId?: string;
  assigneeId: string;
  assigneeUsername: string;
  taskTitle: string;
  submissionId: string;
}

export interface PayoutTableItem {
  taskTitle: string;
  taskId: string;
  submissionId: string;
  payeeId: string;
  payeeUsername: string;
  payeeProfilePicture?: string;
  payeeActiveEthAddress?: string;
  submissionApprovedAt?: string;
  payedAt?: string;
  paymentStatus: string;
  chain: string;
  amount: number;
  symbol: string;
  icon?: string;
  tokenName?: string;
  decimal?: number;
  tokenAddress?: string;
  safeAddress?: string;
  txHash?: string;
  safeTxHash?: string;
  additionalData?: {
    manualExplorerLink?: string;
    utopiaLink?: string;
  };
}

interface PayoutTableProps {
  paid?: boolean;
  processing?: boolean;
  paidList?: PayoutTableItem[];
  processingList?: PayoutTableItem[];
  unpaidList?: PayoutTableItem[];
  org?: {
    id: string;
    username: string;
  };
  podId?: string;
  selectAllFromChainSelected: string;
  handleClearSelectItemsBasedOnChain: () => void;
  handleDownloadToCSV: () => void;
  canViewPaymentLink?: boolean;
  viewingUser?: User;
  selectedItems?: {
    [key: string]: PayoutTableItem;
  };
  setSelectedItems?: Dispatch<SetStateAction<{}>>;
}

const PayoutTable = (props: PayoutTableProps) => {
  const {
    paid,
    processing,
    paidList,
    unpaidList,
    processingList,
    org,
    podId,
    selectAllFromChainSelected,
    handleClearSelectItemsBasedOnChain,
    handleDownloadToCSV,
    canViewPaymentLink = false,
    viewingUser,
    selectedItems,
    setSelectedItems,
  } = props;

  const [payeeDetails, setPayeeDetails] = useState<PayeeDetails | null>(null);

  const [showPayModal, setShowPayModal] = useState(false);
  const [showBatchPayModal, setShowBatchPayModal] = useState(false);

  const paymentslist = paid ? paidList : processing ? processingList : unpaidList;
  const unpaid = !paid && !processing;
  const chainSelected = selectedItems[Object.keys(selectedItems)[0]]?.chain;

  const showBatchPayButton =
    unpaid &&
    Object.values(selectedItems).every(
      (item: PayoutTableItem) =>
        item?.amount &&
        item?.payeeActiveEthAddress &&
        item?.chain === (Object.values(selectedItems)[0] as PayoutTableItem)?.chain
    );

  useEffect(() => {
    if (selectAllFromChainSelected) {
      const chain = selectAllFromChainSelected?.toLowerCase();

      const newSelectedItems = paymentslist.reduce((acc, item) => {
        if (chain === SELECTION.All || item?.chain?.toLowerCase() === chain) {
          acc[item?.submissionId] = item;
        }

        return acc;
      }, {});

      setSelectedItems(newSelectedItems);
    }
  }, [selectAllFromChainSelected, paymentslist]);

  useEffect(() => {
    if (payeeDetails?.submissionId) {
      setShowPayModal(true);
    } else {
      setShowPayModal(false);
    }
  }, [payeeDetails?.submissionId]);

  const handleItemOnCheck = (item) => {
    handleClearSelectItemsBasedOnChain();

    const isItemAlreadyChecked = selectedItems[item?.submissionId];

    if (isItemAlreadyChecked) {
      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[item?.submissionId];
      setSelectedItems((_) => newSelectedItems);
    } else {
      setSelectedItems((_) => ({ ...selectedItems, [item?.submissionId]: item }));
    }
  };

  const handleClearSelections = () => {
    handleClearSelectItemsBasedOnChain();
    setSelectedItems({});
  };

  const handlePayIndividualPayee = (payee: PayeeDetails) => {
    setPayeeDetails(payee);
  };

  const handleBatchPay = () => {
    setShowBatchPayModal(true);
  };

  const handlePaymentCompletion = () => {
    setPayeeDetails(null);
    setShowPayModal(false);
    setShowBatchPayModal(false);
  };

  const renderBatchPayButton = () =>
    showBatchPayButton ? (
      <BottomActionBarPayButton onClick={handleBatchPay}>Continue to payment method</BottomActionBarPayButton>
    ) : (
      <BottomActionBarMultipleChainSelectedError>
        <QuestionMarkIcon />
        <BottomActionBarMultipleChainSelectedErrorText>
          You can batch pay <span>one</span> chain at a time. But you can{' '}
          <button type="button" onClick={handleDownloadToCSV}>
            download CSV
          </button>{' '}
          records.
        </BottomActionBarMultipleChainSelectedErrorText>
      </BottomActionBarMultipleChainSelectedError>
    );

  return (
    <>
      <PaymentModalContext.Provider
        value={{
          onPaymentComplete: handlePaymentCompletion,
        }}
      >
        {showPayModal && (
          <PayModal
            podId={podId}
            orgId={org?.id}
            open={showPayModal}
            handleClose={handlePaymentCompletion}
            assigneeId={payeeDetails?.assigneeId}
            assigneeUsername={payeeDetails?.assigneeUsername}
            taskTitle={payeeDetails?.taskTitle}
            submissionId={payeeDetails?.submissionId}
          />
        )}
        {showBatchPayModal && (
          <BatchPayModal
            chain={chainSelected}
            podId={podId}
            orgId={org?.id}
            open={showBatchPayModal}
            handleClose={() => setShowBatchPayModal(false)}
            unpaidSubmissions={selectedItems}
          />
        )}
      </PaymentModalContext.Provider>
      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell align="left" width="30%">
                <Tooltip title="Person assigned to task" placement="top">
                  <div>Payee</div>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="center" width="15%">
                <Tooltip title={paid ? 'Amount paid' : 'Amount owed'} placement="top">
                  <div>Reward</div>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="center" width="15%">
                <Tooltip title="Payment network" placement="top">
                  <div>Chain</div>
                </Tooltip>
              </StyledTableCell>
              {!unpaid && (
                <StyledTableCell align="center" width="5%">
                  <Tooltip title="Proof of payment" placement="top">
                    <div>Link</div>
                  </Tooltip>
                </StyledTableCell>
              )}
              <StyledTableCell align="center" width="25%">
                <Tooltip title="Task title" placement="top">
                  <div>Task title</div>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="center" width="15%">
                <Tooltip title="Task completed on" placement="top">
                  <div>Complete</div>
                </Tooltip>
              </StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            {paymentslist.map((item) => (
              <PayoutItem
                key={item.submissionId}
                item={item}
                checked={!!selectedItems[item?.submissionId]}
                org={org}
                podId={podId}
                selectedItemsLength={Object.keys(selectedItems)?.length}
                canViewPaymentLink={(canViewPaymentLink || viewingUser?.id === item?.payeeId) && !unpaid}
                handlePay={handlePayIndividualPayee}
                handleCheck={handleItemOnCheck}
              />
            ))}
          </StyledTableBody>
        </StyledTable>
      </StyledTableContainer>

      <BottomActionBar isVisible={Object.keys(selectedItems)?.length}>
        <BottomActionBarText>{Object.keys(selectedItems)?.length} selected</BottomActionBarText>

        <Grid display="flex" alignItems="center" gap="12px">
          <BottomActionBarButton onClick={handleClearSelections}>Clear Selection</BottomActionBarButton>
          {unpaid && renderBatchPayButton()}
          {!unpaid && <BottomActionBarButton onClick={handleDownloadToCSV}>Download to CSV</BottomActionBarButton>}
        </Grid>
      </BottomActionBar>
    </>
  );
};

export default PayoutTable;
