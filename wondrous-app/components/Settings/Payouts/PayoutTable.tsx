import { Grid } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { ErrorText } from 'components/Common';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { constructGnosisRedirectUrl } from 'components/Common/Payment/SingleWalletPayment';
import CopyIcon from 'components/Icons/copy';
import Ethereum from 'components/Icons/ethereumV2';
import Tooltip from 'components/Tooltip';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import palette from 'theme/palette';
import { capitalize } from 'utils/common';
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
  TableCellText,
  RewardChainHalfBox,
} from './styles';

const imageStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  marginRight: '8px',
};

const PayoutItem = (props) => {
  const {
    item,
    checked,
    org,
    podId,
    chain,
    setChainSelected,
    paymentSelected,
    setPaymentsSelected,
    canViewPaymentLink,
    viewingUser,
  } = props;
  const [hasAddressBeenCopied, setHasAddressBeenCopied] = useState(false);

  const taskHref = org
    ? `/organization/${org?.username}/boards?task=${item.taskId}`
    : `/pod/${podId}/boards?task=${item.taskId}`;

  let link;
  let linkText = null;

  if (item?.additionalData?.manualExplorerLink) {
    link = item?.additionalData?.manualExplorerLink;
    linkText = item?.additionalData?.manualExplorerLink;
  } else if (item?.additionalData?.utopiaLink) {
    link = item?.additionalData?.utopiaLink;
    linkText = item?.additionalData?.utopiaLink;
  } else if ((item.chain, item.safeAddress, item.safeTxHash)) {
    link = constructGnosisRedirectUrl(item.chain, item.safeAddress, item.safeTxHash);
    linkText = item.safeTxHash;
  }

  const disabled =
    (chain && item?.chain !== chain) ||
    item?.paymentStatus === 'processing' ||
    item?.paymentStatus === 'paid' ||
    !item.payeeActiveEthAddress;

  const showWorkingCheckbox = item.paymentStatus !== 'paid' && item.payeeActiveEthAddress;

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

  const handleItemOnCheck = (ev) => {
    console.log({ ev });
    // if (checked) {
    //   const newObj = { ...paymentSelected };
    //   delete newObj[item.submissionId];
    //   setPaymentsSelected(newObj);
    // } else if (!checked) {
    //   const newObj = {
    //     ...paymentSelected,
    //     [item.submissionId]: item,
    //   };
    //   setPaymentsSelected(newObj);
    // }
    // setChecked(!checked);
    // setChainSelected(item.chain);
  };

  return (
    <>
      {/* <PaymentModalContext.Provider
        value={{
          onPaymentComplete: () => {},
        }}
      >
        {openModal && (
          <PayModal
            podId={podId}
            orgId={org?.id}
            open={openModal}
            handleClose={() => setOpenModal(false)}
            assigneeId={item.payeeId}
            assigneeUsername={item.payeeUsername}
            taskTitle={item.taskTitle}
            submissionId={item.submissionId}
          />
        )}
      </PaymentModalContext.Provider> */}
      <StyledTableRow>
        <StyledTableCell>
          <Grid display="flex" alignItems="center" gap="12px">
            <Grid display="flex" alignItems="center" gap="6px">
              {showWorkingCheckbox ? (
                <StyledCheckbox
                  checked={checked}
                  disabled={disabled}
                  onChange={handleItemOnCheck}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              ) : (
                <Tooltip title="User has no web3 address" placement="top">
                  <StyledCheckbox checked={false} disabled={disabled} inputProps={{ 'aria-label': 'controlled' }} />
                </Tooltip>
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

        <StyledTableCell className="justify-right">
          <RewardChainHalfBox isRewardBox>
            <Ethereum />
            {item?.amount} {item?.symbol}
          </RewardChainHalfBox>
        </StyledTableCell>

        <StyledTableCell>
          <RewardChainHalfBox>{capitalize(item?.chain)}</RewardChainHalfBox>
        </StyledTableCell>

        {/* <StyledTableCell> */}
        {/* <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TableCellText>
              {showCheckbox && (
                <Checkbox
                  style={{
                    border: disabled ? `1px solid ${palette.grey800}` : `none`,
                    width: 24,
                    height: 24,
                    color: disabled ? palette.grey800 : palette.white,
                  }}
                  checked={checked}
                  disabled={disabled}
                  onChange={handleItemOnCheck}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              )}
            </TableCellText>
          </div> */}
        {/* {item.paymentStatus !== 'paid' && (
                  <>
                    {item.paymentStatus !== 'processing' && (
                      <BatchPayoutButton onClick={() => setOpenModal(true)}> Pay </BatchPayoutButton>
                    )}
                  </>
                )} */}

        {/* : (
               <ErrorText>User has no web3 address</ErrorText>
             )} */}
        {/* <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '8px',
            }}
          >
            {item?.payeeProfilePicture ? (
              <SafeImage useNextImage={false} src={item?.payeeProfilePicture} style={imageStyle} />
            ) : (
              <DefaultUserImage style={imageStyle} />
            )}
            <TableCellText>{item?.payeeUsername}</TableCellText>
          </div> */}
        {/* </StyledTableCell> */}

        {/* <StyledTableCell>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '8px',
            }}
          >
            {item?.payeeProfilePicture ? (
              <SafeImage useNextImage={false} src={item?.payeeProfilePicture} style={imageStyle} />
            ) : (
              <DefaultUserImage style={imageStyle} />
            )}
            <TableCellText>{item?.payeeUsername}</TableCellText>
          </div>
        </StyledTableCell> */}
        {/* <StyledTableCell
          style={{
            minWidth: '120px',
          }}
        >
          {item?.amount ? (
            <CompensationPill
              style={{
                backGround: 'none',
              }}
            >
              <IconContainer>
                <SafeImage
                  useNextImage={false}
                  src={item?.icon}
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                />
              </IconContainer>
              <CompensationAmount>
                {item?.amount} {item?.symbol}
              </CompensationAmount>
            </CompensationPill>
          ) : (
            <ErrorText>Reward removed from task</ErrorText>
          )}
        </StyledTableCell> */}
        {/* <StyledTableCell>
          <Link href={taskHref}>
            <a
              target="_blank"
              rel="noreferrer"
              style={{
                color: palette.white,
              }}
            >
              {cutString(item?.taskTitle, 30)}
            </a>
          </Link>
        </StyledTableCell> */}
        {/* <StyledTableCell>
          {(canViewPaymentLink || viewingUser?.id === item?.payeeId) && (
            <a
              style={{
                color: palette.white,
              }}
              target="_blank"
              rel="noreferrer"
              href={link}
            >
              {cutString(linkText, 15)}
            </a>
          )}
        </StyledTableCell> */}
        {/* {item.chain ? (
          <StyledTableCell>
            <TableCellText>{item.chain}</TableCellText>
          </StyledTableCell>
        ) : (
          <StyledTableCell />
        )}
        {item.submissionApprovedAt && (
          <StyledTableCell>
            <TableCellText>{format(new Date(item.submissionApprovedAt), 'MM/dd/yyyy')}</TableCellText>
          </StyledTableCell>
        )}
        {item.payedAt && (
          <StyledTableCell>
            <TableCellText>{format(new Date(item.payedAt), 'MM/dd/yyyy')}</TableCellText>
          </StyledTableCell>
        )} */}
      </StyledTableRow>
    </>
  );
};

const PayoutTable = (props) => {
  const {
    paid,
    view,
    paidList,
    unpaidList,
    org,
    podId,
    chain,
    canViewPaymentLink,
    user,
    chainSelected,
    setChainSelected,
    paymentSelected,
    setPaymentsSelected,
  } = props;

  const paymentslist = paid ? paidList : unpaidList;
  console.log({ paymentslist });

  return (
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
            <StyledTableCell align="center" width="5%">
              <Tooltip title="Proof of payment" placement="top">
                <div>Link</div>
              </Tooltip>
            </StyledTableCell>
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
            <PayoutItem key={item.id || item.task?.id} item={item} checked org={org} podId={podId} chain={chain} />
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
  );
};

export default PayoutTable;
