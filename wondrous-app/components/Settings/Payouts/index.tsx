import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Checkbox from '@mui/material/Checkbox';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import { PayoutSettingsHeaderIcon } from '../../Icons/PayoutSettingsHeaderIcon';
import { GeneralSettingsContainer } from '../styles';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';
import { delQuery } from '../../../utils';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { useLazyQuery } from '@apollo/client';
import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_UNPAID_SUBMISSIONS_FOR_ORG,
  GET_UNPAID_SUBMISSIONS_FOR_POD,
} from '../../../graphql/queries/payment';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import { StyledCheckbox, TableCellText } from './styles';
import { CompensationAmount, CompensationPill, IconContainer } from '../../Common/Compensation/styles';
import { GET_ORG_BY_ID } from '../../../graphql/queries';
import Link from 'next/link';
import { cutString } from '../../../utils/helpers';
import { constructGnosisRedirectUrl } from '../../Common/Payment/SingleWalletPayment';
import { White, Grey800 } from '../../../theme/colors';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';
import { PayModal } from './modal';
import { BatchPayModal } from './BatchPayModal';
import { PaymentModalContext } from '../../../utils/contexts';
import { SeeMoreText } from '../Members/styles';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

const LIMIT = 10;
const PaymentItem = (props) => {
  const { item, org, podId, chain, setChainSelected, setEnableBatchPay, paymentSelected, setPaymentsSelected } = props;
  const [openModal, setOpenModal] = useState(false);
  const [checked, setChecked] = useState(false);
  // useEffect(() => {
  //   setChecked(chain === item?.chain);
  // }, [chain, item?.chain]);
  const imageStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    marginRight: '8px',
  };
  const taskHref = org
    ? `/organization/${org?.username}/boards?task=${item.taskId}`
    : `/pod/${podId}/boards?task=${item.taskId}`;
  let link,
    linkText = null;
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
    chain && item?.chain !== chain && (item?.paymentStatus === 'processing' || item?.paymentStatus === 'paid');
  return (
    <>
      <PaymentModalContext.Provider
        value={{
          onPaymentComplete: () => {},
        }}
      >
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
      </PaymentModalContext.Provider>
      <StyledTableRow
        style={{
          width: '150%',
        }}
      >
        {item.paymentStatus !== 'paid' && (
          <StyledTableCell>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TableCellText>
                <Checkbox
                  style={{
                    border: disabled ? `1px solid ${Grey800}` : `none`,
                    width: '24px',
                    height: '24px',
                    color: disabled ? Grey800 : White,
                  }}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    if (checked) {
                      const newObj = { ...paymentSelected };
                      delete newObj[item.submissionId];
                      setPaymentsSelected(newObj);
                    } else if (!checked) {
                      const newObj = {
                        ...paymentSelected,
                        [item.submissionId]: item,
                      };
                      setPaymentsSelected(newObj);
                    }
                    setChecked(!checked);
                    setChainSelected(item.chain);

                    setEnableBatchPay(true);
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </TableCellText>
              {item.paymentStatus !== 'paid' && (
                <>
                  {item.paymentStatus !== 'processing' && (
                    <CreateFormPreviewButton
                      style={{
                        marginLeft: '12px',
                      }}
                      onClick={() => setOpenModal(true)}
                    >
                      {' '}
                      Pay{' '}
                    </CreateFormPreviewButton>
                  )}
                </>
              )}
            </div>
          </StyledTableCell>
        )}
        <StyledTableCell>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '8px',
            }}
          >
            {item?.payeeProfilePicture ? (
              <SafeImage src={item?.payeeProfilePicture} style={imageStyle} />
            ) : (
              <DefaultUserImage style={imageStyle} />
            )}
            <TableCellText>{item?.payeeUsername}</TableCellText>
          </div>
        </StyledTableCell>
        <StyledTableCell
          style={{
            minWidth: '120px',
          }}
        >
          <CompensationPill
            style={{
              backGround: 'none',
            }}
          >
            <IconContainer>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <SafeImage
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
        </StyledTableCell>
        <StyledTableCell>
          <Link href={taskHref}>
            <a
              target="_blank"
              rel="noreferrer"
              style={{
                color: White,
              }}
            >
              {cutString(item?.taskTitle, 30)}
            </a>
          </Link>
        </StyledTableCell>
        <StyledTableCell>
          <a
            style={{
              color: White,
            }}
            target={'_blank'}
            rel="noreferrer"
            href={link}
          >
            {cutString(linkText, 15)}
          </a>
        </StyledTableCell>
        {item.paymentStatus !== 'paid' && (
          <StyledTableCell>
            <TableCellText>{item.paymentStatus}</TableCellText>
          </StyledTableCell>
        )}
        {item.chain && (
          <StyledTableCell>
            <TableCellText>{item.chain}</TableCellText>
          </StyledTableCell>
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
        )}
      </StyledTableRow>
    </>
  );
};

const Payouts = (props) => {
  const { orgId, podId } = props;
  const [view, setView] = useState(ViewType.Unpaid);
  const router = useRouter();
  const { view: payView } = router.query;
  const [hasMore, setHasMore] = useState(false);
  const [chainSelected, setChainSelected] = useState(null);
  const [enableBatchPay, setEnableBatchPay] = useState(null);
  const [paymentSelected, setPaymentsSelected] = useState(null);
  const [openBatchPayModal, setOpenBatchPayModal] = useState(false);
  const listViewOptions = [
    {
      name: 'Unpaid',
      active: view === ViewType.Unpaid || view === null,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.Unpaid}`);
      },
    },
    {
      name: 'Paid',
      active: view === ViewType.Paid,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.Paid}`);
      },
    },
  ];

  const [getPaymentsForOrg, { fetchMore: fetchMoreOrgPayments }] = useLazyQuery(GET_PAYMENTS_FOR_ORG, {
    fetchPolicy: 'network-only',
  });
  const [getPaymentsForPod, { fetchMore: fetchMorePodPayments }] = useLazyQuery(GET_PAYMENTS_FOR_POD, {
    fetchPolicy: 'network-only',
  });
  const [getUnpaidSubmissionsForOrg] = useLazyQuery(GET_UNPAID_SUBMISSIONS_FOR_ORG, {
    fetchPolicy: 'network-only',
  });
  const [getUnpaidSubmissionsForPod] = useLazyQuery(GET_UNPAID_SUBMISSIONS_FOR_POD, {
    fetchPolicy: 'network-only',
  });
  const [paidList, setPaidList] = useState([]);
  const [unpaidList, setUnpaidList] = useState([]);
  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);
  useEffect(() => {
    if (orgId) {
      getOrgById({
        variables: {
          orgId,
        },
      });
    }
    if (orgId && view === ViewType.Unpaid) {
      getUnpaidSubmissionsForOrg({
        variables: {
          orgId,
        },
      }).then((result) => {
        const submissions = result?.data?.getUnpaidSubmissionsForOrg;
        setUnpaidList(submissions || []);
      });
    } else if (podId && view === ViewType.Unpaid) {
      getUnpaidSubmissionsForPod({
        variables: {
          podId,
        },
      }).then((result) => {
        const submissions = result?.data?.getUnpaidSubmissionsForPod;
        setUnpaidList(submissions || []);
      });
    } else if (orgId && view === ViewType.Paid) {
      getPaymentsForOrg({
        variables: {
          input: {
            orgId,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const payments = result?.data?.getPaymentsForOrg;
        setPaidList(payments || []);
        setHasMore(payments?.length >= LIMIT);
      });
    } else if (podId && view === ViewType.Paid) {
      getPaymentsForPod({
        variables: {
          input: {
            podId,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const payments = result?.data?.getPaymentsForPod;
        setPaidList(payments || []);
        setHasMore(payments?.length >= LIMIT);
      });
    }
    if (payView) {
      if (payView === ViewType.Paid) {
        setView(ViewType.Paid);
      } else if (payView === ViewType.Unpaid) {
        setView(ViewType.Unpaid);
      }
    }
  }, [orgId, podId, view, payView]);
  const org = orgData?.getOrgById;
  const paid = view === ViewType.Paid;
  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      const list = paid ? paidList : unpaidList;
      if (orgId) {
        fetchMoreOrgPayments({
          variables: {
            input: {
              offset: list?.length,
              limit: LIMIT,
              orgId,
            },
          },
        }).then((fetchMoreResult) => {
          const results = fetchMoreResult?.data?.getPaymentsForOrg;
          if (results && results?.length > 0) {
            if (paid) {
              setPaidList([...paidList, ...results]);
            } else {
              setUnpaidList([...unpaidList, ...results]);
            }
          } else {
            setHasMore(false);
          }
        });
      } else if (podId) {
        fetchMorePodPayments({
          variables: {
            input: {
              offset: list?.length,
              limit: LIMIT,
              podId,
            },
          },
        }).then((fetchMoreResult) => {
          const results = fetchMoreResult?.data?.getPaymentsForPod;
          if (results && results?.length > 0) {
            if (paid) {
              setPaidList([...paidList, ...results]);
            } else {
              setUnpaidList([...unpaidList, ...results]);
            }
          } else {
            setHasMore(false);
          }
        });
      }
    }
  }, [paidList, unpaidList, hasMore]);
  const handleBatchPayButtonClick = () => {
    setOpenBatchPayModal(true);
  };
  const paymentSelectedAmount = paymentSelected && Object.keys(paymentSelected).length;
  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock icon={<PayoutSettingsHeaderIcon />} title="Payment Ledger" description="Manage all payouts" />
      </GeneralSettingsContainer>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ToggleViewButton
          options={listViewOptions}
          style={{
            marginTop: '32px',
            marginBottom: '-16px',
          }}
        />
      </div>
      <StyledTableContainer
        style={{
          marginLeft: '-3%',
          width: '110%',
        }}
      >
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              {!paid && (
                <StyledTableCell width={paid ? '20%' : '16%'}>
                  {!!paymentSelectedAmount && paymentSelectedAmount > 1 && (
                    <CreateFormPreviewButton
                      style={{
                        width: '120px',
                        marginLeft: '0',
                      }}
                      onClick={handleBatchPayButtonClick}
                    >
                      Batch pay
                    </CreateFormPreviewButton>
                  )}
                </StyledTableCell>
              )}
              <StyledTableCell align="center" width={paid ? '20%' : '16%'}>
                Assignee
              </StyledTableCell>
              <StyledTableCell align="center" width={paid ? '20%' : '16%'}>
                Payout
              </StyledTableCell>
              <StyledTableCell align="center" width="20%">
                Deliverable
              </StyledTableCell>
              <StyledTableCell align="center" width={paid ? '20%' : '16%'}>
                Link
              </StyledTableCell>
              {view === ViewType.Unpaid && <StyledTableCell width="10%">Status</StyledTableCell>}
              <StyledTableCell>Chain</StyledTableCell>
              <StyledTableCell align="center" width="25%">
                {view === ViewType.Paid ? 'Paid at' : 'Approved at'}
              </StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
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
                  />
                ))}
              </>
            ) : (
              <>
                {unpaidList?.map((item) => (
                  <PaymentItem
                    setEnableBatchPay={setEnableBatchPay}
                    chain={chainSelected}
                    setChainSelected={setChainSelected}
                    key={item?.id}
                    item={item}
                    org={org}
                    podId={podId}
                    paymentSelected={paymentSelected}
                    setPaymentsSelected={setPaymentsSelected}
                  />
                ))}
              </>
            )}
          </StyledTableBody>
        </StyledTable>
      </StyledTableContainer>
      <PaymentModalContext.Provider
        value={{
          onPaymentComplete: () => {},
        }}
      >
        <BatchPayModal
          chain={chainSelected}
          podId={podId}
          orgId={orgId}
          open={openBatchPayModal}
          handleClose={() => setOpenBatchPayModal(false)}
          unpaidSubmissions={paymentSelected}
        />
      </PaymentModalContext.Provider>

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
    </SettingsWrapper>
  );
};

export default Payouts;
