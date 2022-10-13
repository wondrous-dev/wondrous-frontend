import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import format from 'date-fns/format';
import { Grid } from '@mui/material';

import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import Tooltip from 'components/Tooltip';
import QuestionMarkIcon from 'components/Icons/QuestionMarkIcon';
import { BatchPayModal } from 'components/Settings/Payouts/BatchPayModal';
import CalendarIcon from 'components/Icons/calendar';
import CopyIcon from 'components/Icons/copy';
import Ethereum from 'components/Icons/ethereumV2';
import { LinkIcon } from 'components/Icons/taskModalIcons';

import { capitalize } from 'utils/common';
import { PaymentModalContext } from 'utils/contexts';
import { constructGnosisRedirectUrl } from 'components/Common/Payment/SingleWalletPayment';
import { User } from 'types/User';

import palette from 'theme/palette';
import { PayModal } from './modal';
import {
  PayeeAddressTag,
  PayeeAddressTagContainer,
  PayeeProfileLink,
  PayeeUsername,
  StyledCheckbox,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  RewardChainHalfBox,
  PayoutItemLinkContainer,
  PayoutTaskTitleContainer,
  RewardChainHalfBoxText,
  PayoutTaskCompletionDate,
  PayoutTaskCompletionDateText,
  PayeePayButton,
  BottomActionBar,
  BottomActionBarText,
  BottomActionBarPayButton,
  BottomActionBarMultipleChainSelectedErrorText,
  BottomActionBarButton,
  BottomActionBarMultipleChainSelectedError,
} from './styles';
import { PAYMENT_TYPES } from './constants';

const imageStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  marginRight: '8px',
};

interface PayeeDetails {
  podId?: string;
  orgId?: string;
  assigneeId: string;
  assigneeUsername: string;
  taskTitle: string;
  submissionId: string;
}

interface PayoutTableItem {
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

interface PayoutItemProps {
  item: PayoutTableItem;
  checked?: boolean;
  org?: {
    id: string;
    username: string;
  };
  podId?: string;
  selectedItemsLength?: number;
  canViewPaymentLink?: boolean;
  handlePay?: (payeeDetails: PayeeDetails) => void;
  handleCheck?: (item: PayoutTableItem) => void;
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

const PayoutItem = (props: PayoutItemProps) => {
  const { item, checked = false, org, podId, selectedItemsLength, canViewPaymentLink, handlePay, handleCheck } = props;
  const [hasAddressBeenCopied, setHasAddressBeenCopied] = useState(false);

  let link;

  if (item?.additionalData?.manualExplorerLink) {
    link = item?.additionalData?.manualExplorerLink;
  } else if (item?.additionalData?.utopiaLink) {
    link = item?.additionalData?.utopiaLink;
  } else if (item.chain && item.safeAddress && item.safeTxHash) {
    link = constructGnosisRedirectUrl(item.chain, item.safeAddress, item.safeTxHash);
  }

  const completionDate = item?.submissionApprovedAt || item?.payedAt;

  const isPayButtonDisabled = useMemo(
    () =>
      selectedItemsLength ||
      !item?.amount ||
      item.paymentStatus !== PAYMENT_TYPES.UNPAID ||
      !item?.payeeActiveEthAddress,
    [selectedItemsLength, item?.amount, item?.paymentStatus, item?.payeeActiveEthAddress]
  );

  const address = item?.payeeActiveEthAddress;
  const addressTag = useMemo(() => {
    if (!address) {
      return '';
    }
    return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
  }, [address]);

  const handleAddressCopy = () => {
    navigator.clipboard.writeText(address);
    setHasAddressBeenCopied(true);

    setTimeout(() => {
      setHasAddressBeenCopied(false);
    }, 1500);
  };

  const handlePayeePayButton = () => {
    if (isPayButtonDisabled) return;

    handlePay({
      podId,
      orgId: org?.username,
      assigneeId: item?.payeeId,
      assigneeUsername: item?.payeeUsername,
      taskTitle: item?.taskTitle,
      submissionId: item?.submissionId,
    });
  };

  return (
    <StyledTableRow>
      <StyledTableCell>
        <Grid display="flex" alignItems="center" gap="12px">
          <Grid display="flex" alignItems="center" gap="8px">
            <StyledCheckbox
              checked={checked}
              onChange={() => handleCheck(item)}
              inputProps={{ 'aria-label': 'controlled' }}
            />

            {item.paymentStatus === PAYMENT_TYPES.UNPAID && (
              <PayeePayButton disabled={isPayButtonDisabled} onClick={handlePayeePayButton}>
                Pay
              </PayeePayButton>
            )}

            <Link href={`/profile/${item?.payeeUsername}/about`} passHref>
              <PayeeProfileLink>
                <Grid display="flex" alignItems="center" gap="6px">
                  <SafeImage
                    useNextImage={false}
                    src={item?.payeeProfilePicture}
                    style={imageStyle}
                    placeholderComp={<DefaultUserImage style={imageStyle} />}
                  />
                  <PayeeUsername>{item?.payeeUsername}</PayeeUsername>
                </Grid>
              </PayeeProfileLink>
            </Link>
          </Grid>
          {!!addressTag && (
            <PayeeAddressTagContainer onClick={handleAddressCopy}>
              <PayeeAddressTag hasAddressBeenCopied={hasAddressBeenCopied}>
                {hasAddressBeenCopied ? 'Address copied!' : addressTag}
              </PayeeAddressTag>
              <CopyIcon color={hasAddressBeenCopied ? palette.green30 : palette.blue20} />
            </PayeeAddressTagContainer>
          )}
        </Grid>
      </StyledTableCell>

      <StyledTableCell>
        {item?.amount ? (
          <RewardChainHalfBox isRewardBox>
            <Ethereum />
            <RewardChainHalfBoxText>
              {item?.amount} {item?.symbol}
            </RewardChainHalfBoxText>
          </RewardChainHalfBox>
        ) : (
          <RewardChainHalfBox isRewardBox hasNoReward>
            <RewardChainHalfBoxText hasNoReward>reward</RewardChainHalfBoxText>
          </RewardChainHalfBox>
        )}
      </StyledTableCell>

      <StyledTableCell>
        {item?.amount ? (
          <RewardChainHalfBox>
            <RewardChainHalfBoxText>{capitalize(item?.chain)}</RewardChainHalfBoxText>
          </RewardChainHalfBox>
        ) : (
          <RewardChainHalfBox hasNoReward>
            <RewardChainHalfBoxText hasNoReward>removed</RewardChainHalfBoxText>
          </RewardChainHalfBox>
        )}
      </StyledTableCell>

      {canViewPaymentLink && (
        <StyledTableCell>
          {!!link && (
            <PayoutItemLinkContainer href={link} target="_blank" rel="noreferrer noopener">
              <LinkIcon />
            </PayoutItemLinkContainer>
          )}
        </StyledTableCell>
      )}

      <StyledTableCell>
        <PayoutTaskTitleContainer>{item?.taskTitle}</PayoutTaskTitleContainer>
      </StyledTableCell>

      <StyledTableCell>
        {!!completionDate && (
          <PayoutTaskCompletionDate>
            <CalendarIcon />
            <PayoutTaskCompletionDateText>{format(new Date(completionDate), 'MM-dd-yy')}</PayoutTaskCompletionDateText>
          </PayoutTaskCompletionDate>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

const PayoutTable = (props: PayoutTableProps) => {
  const {
    paid,
    processing,
    // view,
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
    // user,
    // setChainSelected,
    // paymentSelected,
    // setPaymentsSelected,
  } = props;

  // const [chainSelected, setChainSelected] = useState([]);
  // const [selectedItems, setSelectedItems] = useState({});

  const [payeeDetails, setPayeeDetails] = useState<PayeeDetails | null>(null);

  const [showPayModal, setShowPayModal] = useState(false);
  const [showBatchPayModal, setShowBatchPayModal] = useState(false);

  const paymentslist = paid ? paidList : processing ? processingList : unpaidList;
  const unpaid = !paid && !processing;
  const chainSelected = selectedItems[Object.keys(selectedItems)[0]]?.chain;

  // const showBatchPayButton =
  //   unpaid &&
  //   paymentslist.every((item) => item?.amount && item?.payeeWeb3Address && item?.chain === paymentslist[0]?.chain);

  const showBatchPayButton =
    unpaid &&
    Object.values(selectedItems).every(
      (item: PayoutTableItem) =>
        item?.amount &&
        item?.payeeActiveEthAddress &&
        item?.chain === (Object.values(selectedItems)[0] as PayoutTableItem)?.chain
    );

  useEffect(() => {
    const newSelectedItems = {} as { [key: string]: PayoutTableItem };
    if (selectAllFromChainSelected === 'all') {
      paymentslist.forEach((item) => {
        newSelectedItems[item?.submissionId] = item;
      });
      setSelectedItems((_) => newSelectedItems);
    } else if (selectAllFromChainSelected) {
      const chain = selectAllFromChainSelected?.toLowerCase();
      paymentslist.forEach((item) => {
        if (item?.chain?.toLowerCase() === chain) {
          newSelectedItems[item?.submissionId] = item;
        }
      });
      setSelectedItems((_) => newSelectedItems);
    }
  }, [selectAllFromChainSelected]);

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
          {/* <StyledTableBody>
          {view === ViewType.Paid ? (
            <>
              {paidList?.map((item) => (
                <PaymentItem
                  key={item?.id}
                  item={{
                    ...item,
                    paymentStatus: 'paid',
                  }}
                  org={org}
                  podId={podId}
                  canViewPaymentLink={canViewPaymentLink}
                  viewingUser={user}
                />
              ))}
            </>
          ) : (
            <>
              {unpaidList?.map((item) => (
                <PaymentItem
                  chain={chainSelected}
                  setChainSelected={setChainSelected}
                  key={item?.id}
                  item={item}
                  org={org}
                  podId={podId}
                  paymentSelected={paymentSelected}
                  setPaymentsSelected={setPaymentsSelected}
                  canViewPaymentLink={canViewPaymentLink}
                  viewingUser={user}
                />
              ))}
            </>
          )}
        </StyledTableBody> */}
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
