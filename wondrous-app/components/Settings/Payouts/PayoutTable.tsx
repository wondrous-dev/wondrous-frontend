import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';

import Tooltip from 'components/Tooltip';
import Button from 'components/Button';
import QuestionMarkIcon from 'components/Icons/QuestionMarkIcon';
import BatchPayModal from 'components/Settings/Payouts/BatchPayModal';
import TaskLedgePayModal from 'components/Settings/Payouts/TaskLedgePayModal';
import PaymentViewModal from 'components/Common/Payment/PaymentViewModal';
import { PaymentSelected, PayoutTableItem } from 'components/Settings/Payouts/types';
import palette from 'theme/palette';

import { PaymentModalContext } from 'utils/contexts';
import { User } from 'types/User';
import { SELECTION } from './constants';

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
  BottomActionBarMultipleChainSelectedErrorText,
  BottomActionBarButton,
  BottomActionBarMultipleChainSelectedError,
} from './styles';

interface PayoutTableProps {
  paid?: boolean;
  processing?: boolean;
  paidList?: PayoutTableItem[];
  processingList?: PayoutTableItem[];
  unpaidList?: PayoutTableItem[];
  orgId?: string;
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
    orgId,
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
  const [paymentSelected, setPaymentSelected] = useState<PaymentSelected | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentDetailId, setPaymentDetailId] = useState(null);
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
    if (paymentSelected?.submissionId) {
      setShowPayModal(true);
    } else {
      setShowPayModal(false);
    }
  }, [paymentSelected?.submissionId]);

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

  const handlePayIndividualPayee = (paymentInfo: PaymentSelected) => {
    setPaymentSelected(paymentInfo);
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
          You can only batch pay <span>one</span> chain at a time. Please also make sure the selected contributors have
          a wallet. But you can{' '}
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
        {paymentDetailId && (
          <PaymentViewModal
            open={!!paymentDetailId}
            paymentId={paymentDetailId}
            handleClose={() => setPaymentDetailId(null)}
          />
        )}
        {showPayModal && (
          <TaskLedgePayModal
            podId={podId}
            orgId={orgId}
            open={showPayModal}
            handleClose={() => {
              setPaymentSelected(null);
              setShowPayModal(false);
              if (paymentMade) {
                router.reload();
              }
            }}
            paymentSelected={paymentSelected}
          />
        )}
        {showBatchPayModal && (
          <BatchPayModal
            chain={chainSelected}
            podId={podId}
            orgId={orgId}
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
              {unpaid && (
                <StyledTableCell align="center" width="15%">
                  <Tooltip title="Task completed on" placement="top">
                    <div>Date</div>
                  </Tooltip>
                </StyledTableCell>
              )}
              {!unpaid && (
                <StyledTableCell align="center" width="15%">
                  <Tooltip title="Payment made on" placement="top">
                    <div>Date</div>
                  </Tooltip>
                </StyledTableCell>
              )}
              {!unpaid && <StyledTableCell align="center" width="5%" />}
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            {paymentslist.map((item) => (
              <PayoutItem
                key={item.submissionId}
                item={item}
                checked={!!selectedItems[item?.submissionId]}
                orgId={orgId}
                podId={podId}
                selectedItemsLength={Object.keys(selectedItems)?.length}
                canViewPaymentLink={(canViewPaymentLink || viewingUser?.id === item?.payeeId) && !unpaid}
                handlePay={handlePayIndividualPayee}
                handleCheck={handleItemOnCheck}
                setPaymentDetailId={setPaymentDetailId}
              />
            ))}
          </StyledTableBody>
        </StyledTable>
      </StyledTableContainer>

      <BottomActionBar isVisible={Object.keys(selectedItems)?.length && !showBatchPayModal}>
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
