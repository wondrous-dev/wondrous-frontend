import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';

import Tooltip from 'components/Tooltip';
import Button from 'components/Button';
import QuestionMarkIcon from 'components/Icons/QuestionMarkIcon';
import { BatchPayModal } from 'components/Settings/Payouts/BatchPayModal';

import palette from 'theme/palette';

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
  const router = useRouter();

  const [paymentMade, setPaymentMade] = useState(false);
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

  const renderBatchPayButton = () =>
    showBatchPayButton ? (
      <Button
        buttonTheme={{
          paddingX: 24,
          paddingY: 8,
          background: palette.background.default,
          borderColor: `linear-gradient(270deg, ${palette.green30} -5.62%, ${palette.highlightPurple} 103.12%), linear-gradient(0deg, ${palette.background.default}, ${palette.background.default})`,
          fontWeight: 500,
          hover: {
            background: 'transparent',
          },
        }}
        minWidth="auto"
        onClick={handleBatchPay}
      >
        Continue to payment method
      </Button>
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
          onPaymentComplete: () => {
            setPaymentMade(true);
          },
        }}
      >
        {showPayModal && (
          <PayModal
            podId={podId}
            orgId={org?.id}
            open={showPayModal}
            handleClose={() => {
              setShowPayModal(false);
              if (paymentMade) {
                router.reload();
              }
            }}
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
            handleClose={() => {
              setShowBatchPayModal(false);
              if (paymentMade) {
                router.reload();
              }
            }}
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
          <Button
            buttonTheme={{
              paddingX: 24,
              paddingY: 8,
              background: palette.grey78,
              borderColor: palette.grey78,
              fontWeight: 500,
              hover: {
                background: palette.grey85,
              },
            }}
            minWidth="auto"
            onClick={handleClearSelections}
          >
            Clear Selection
          </Button>
          {unpaid ? (
            renderBatchPayButton()
          ) : (
            <BottomActionBarButton onClick={handleDownloadToCSV}>Download to CSV</BottomActionBarButton>
          )}
        </Grid>
      </BottomActionBar>
    </>
  );
};

export default PayoutTable;
