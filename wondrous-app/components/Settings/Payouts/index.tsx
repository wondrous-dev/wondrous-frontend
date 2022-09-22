import { useLazyQuery, useQuery } from '@apollo/client';
import Checkbox from '@mui/material/Checkbox';
import { useInView } from 'react-intersection-observer';
import { useMe } from 'components/Auth/withAuth';
import { ErrorText } from 'components/Common';
import { CompensationAmount, CompensationPill, IconContainer } from 'components/Common/Compensation/styles';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { constructGnosisRedirectUrl } from 'components/Common/Payment/SingleWalletPayment';
import ToggleViewButton from 'components/Common/ToggleViewButton';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import { PayoutSettingsHeaderIcon } from 'components/Icons/PayoutSettingsHeaderIcon';
import { HeaderBlock } from 'components/Settings/headerBlock';
import { SeeMoreText } from 'components/Settings/Members/styles';
import { BatchPayModal } from 'components/Settings/Payouts/BatchPayModal';
import { exportSubmissionPaymentCsv } from 'components/Settings/Payouts/exportSubmissionPaymentCsv';
import { PayModal } from 'components/Settings/Payouts/modal';
import {
  BatchPayoutButton,
  LedgerHeaderButtonsContainer,
  TableCellText,
  LoadMore,
} from 'components/Settings/Payouts/styles';
import SubmissionPaymentCSVModal from 'components/Settings/Payouts/SubmissionPaymentCSVModal';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { GeneralSettingsContainer } from 'components/Settings/styles';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from 'components/Table/styles';
import Tooltip from 'components/Tooltip';
import { format } from 'date-fns';
import { GET_ORG_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_UNPAID_SUBMISSIONS_FOR_ORG,
  GET_UNPAID_SUBMISSIONS_FOR_POD,
} from 'graphql/queries/payment';
import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import palette from 'theme/palette';
import { delQuery } from 'utils';
import { PERMISSIONS } from 'utils/constants';
import { PaymentModalContext } from 'utils/contexts';
import { cutString, parseUserPermissionContext } from 'utils/helpers';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

const LIMIT = 10;
function PaymentItem(props) {
  const {
    item,
    org,
    podId,
    chain,
    setChainSelected,
    paymentSelected,
    setPaymentsSelected,
    canViewPaymentLink,
    viewingUser,
  } = props;
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
    (chain && item?.chain !== chain) || item?.paymentStatus === 'processing' || item?.paymentStatus === 'paid';

  return (
    <>
      <PaymentModalContext.Provider
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
      </PaymentModalContext.Provider>
      <StyledTableRow
        style={{
          width: '150%',
        }}
      >
        {item.paymentStatus !== 'paid' && (
          <StyledTableCell>
            {item.payeeActiveEthAddress ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <TableCellText>
                  <Checkbox
                    style={{
                      border: disabled ? `1px solid ${palette.grey800}` : `none`,
                      width: 24,
                      height: 24,
                      color: disabled ? palette.grey800 : palette.white,
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
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </TableCellText>
                {item.paymentStatus !== 'paid' && (
                  <>
                    {item.paymentStatus !== 'processing' && (
                      <BatchPayoutButton onClick={() => setOpenModal(true)}> Pay </BatchPayoutButton>
                    )}
                  </>
                )}
              </div>
            ) : (
              <ErrorText>User has no web3 address</ErrorText>
            )}
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
              <SafeImage useNextImage={false} src={item?.payeeProfilePicture} style={imageStyle} />
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
          {item?.amount ? (
            <CompensationPill
              style={{
                backGround: 'none',
              }}
            >
              <IconContainer>
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
        </StyledTableCell>
        <StyledTableCell>
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
        </StyledTableCell>
        <StyledTableCell>
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
        </StyledTableCell>
        {item.paymentStatus !== 'paid' && (
          <StyledTableCell>
            <TableCellText>{item.paymentStatus}</TableCellText>
          </StyledTableCell>
        )}
        {item.chain ? (
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
        )}
      </StyledTableRow>
    </>
  );
}

function Payouts(props) {
  const { orgId, podId } = props;
  const [view, setView] = useState(null);
  const router = useRouter();
  const { view: payView } = router.query;
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(false);
  const [chainSelected, setChainSelected] = useState(null);
  const [paymentSelected, setPaymentsSelected] = useState(null);
  const [openBatchPayModal, setOpenBatchPayModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [noPaymentSelectedError, setNoPaymentSelectedError] = useState(null);
  useEffect(() => {
    setNoPaymentSelectedError(false);
    if (!paymentSelected || Object.keys(paymentSelected).length === 0) {
      setChainSelected(null);
    }
  }, [paymentSelected]);

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
  const [getUnpaidSubmissionsForOrg, { fetchMore: fetchMoreUnpaidSubmissionsForOrg }] = useLazyQuery(
    GET_UNPAID_SUBMISSIONS_FOR_ORG,
    {
      fetchPolicy: 'network-only',
    }
  );
  const [getUnpaidSubmissionsForPod, { fetchMore: fetchMoreUnpaidSubmissionsForPod }] = useLazyQuery(
    GET_UNPAID_SUBMISSIONS_FOR_POD,
    {
      fetchPolicy: 'network-only',
    }
  );
  const [paidList, setPaidList] = useState([]);
  const [unpaidList, setUnpaidList] = useState([]);
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const userPermissionsContext = userPermissionsContextData?.getUserPermissionContext
    ? JSON.parse(userPermissionsContextData?.getUserPermissionContext)
    : null;

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId,
    podId,
  });
  const canViewPaymentLink =
    permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);
  const user = useMe();
  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);

  const org = orgData?.getOrgById;
  const paid = view === ViewType.Paid;

  const handleMoreData = useCallback(
    (data) => {
      if (data?.length > 0) {
        if (paid) {
          setPaidList((state) => [...state, ...data]);
        } else {
          setUnpaidList((state) => [...state, ...data]);
        }
      }

      setHasMore(data?.length >= LIMIT);
    },
    [paid]
  );

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      const list = paid ? paidList : unpaidList;

      if (orgId) {
        if (paid) {
          fetchMoreOrgPayments({
            variables: {
              input: {
                offset: list?.length,
                limit: LIMIT,
                orgId,
                orgOnly: false,
              },
            },
          }).then((fetchMoreResult) => {
            const results = fetchMoreResult?.data?.getPaymentsForOrg;
            handleMoreData(results);
          });
        } else {
          fetchMoreUnpaidSubmissionsForOrg({
            variables: {
              input: {
                offset: list?.length,
                limit: LIMIT,
                orgId,
                orgOnly: false,
              },
            },
          }).then((fetchMoreResult) => {
            const results = fetchMoreResult?.data?.getUnpaidSubmissionsForOrg;
            handleMoreData(results);
          });
        }
      } else if (podId) {
        if (paid) {
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
            handleMoreData(results);
          });
        } else {
          fetchMoreUnpaidSubmissionsForPod({
            variables: {
              input: {
                offset: list?.length,
                limit: LIMIT,
                podId,
              },
            },
          }).then((fetchMoreResult) => {
            const results = fetchMoreResult?.data?.getUnpaidSubmissionsForPod;
            handleMoreData(results);
          });
        }
      }
    }
  }, [paidList, unpaidList, hasMore]);

  const handleBatchPayButtonClick = () => {
    setOpenBatchPayModal(true);
  };

  const handleExportButtonClick = () => {
    if (!paymentSelected || isEmpty(paymentSelected)) {
      setNoPaymentSelectedError(true);
      return;
    }
    setOpenExportModal(true);
  };

  const paymentSelectedAmount = paymentSelected && Object.keys(paymentSelected).length;

  useEffect(() => {
    setView(ViewType.Unpaid);
  }, []);

  useEffect(() => {
    if (orgId) {
      getOrgById({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId, podId, view]);

  useEffect(() => {
    if (orgId && view === ViewType.Unpaid) {
      getUnpaidSubmissionsForOrg({
        variables: {
          input: {
            orgId,
            orgOnly: false,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const submissions = result?.data?.getUnpaidSubmissionsForOrg;
        setUnpaidList(submissions || []);
        setHasMore(submissions?.length >= LIMIT);
      });
    } else if (podId && view === ViewType.Unpaid) {
      getUnpaidSubmissionsForPod({
        variables: {
          input: {
            podId,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const submissions = result?.data?.getUnpaidSubmissionsForPod;
        setUnpaidList(submissions || []);
        setHasMore(submissions?.length >= LIMIT);
      });
    } else if (orgId && view === ViewType.Paid) {
      getPaymentsForOrg({
        variables: {
          input: {
            orgId,
            orgOnly: false, // TODO add toggle to see pod payments, default to false
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
  }, [orgId, podId, view]);

  useEffect(() => {
    if (payView) {
      if (payView === ViewType.Paid) {
        setView(ViewType.Paid);
      } else if (payView === ViewType.Unpaid) {
        setView(ViewType.Unpaid);
      }
    }
  }, [payView]);

  useEffect(() => {
    if (inView && hasMore) {
      handleLoadMore();
    }
  }, [inView, hasMore, handleLoadMore]);

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock icon={<PayoutSettingsHeaderIcon />} title="Payment Ledger" description="Manage all payouts" />
      </GeneralSettingsContainer>
      <SubmissionPaymentCSVModal
        chain={chainSelected}
        podId={podId}
        orgId={orgId}
        open={openExportModal}
        handleClose={() => setOpenExportModal(false)}
        exportPaymentCSV={exportSubmissionPaymentCsv}
        unpaidSubmissions={paymentSelected}
      />

      <LedgerHeaderButtonsContainer>
        <ToggleViewButton
          options={listViewOptions}
          style={{
            marginTop: '32px',
            marginBottom: '-16px',
          }}
        />
        {!paid && (
          <div>
            <CreateFormPreviewButton onClick={handleExportButtonClick}> Export to csv</CreateFormPreviewButton>
            {noPaymentSelectedError && <ErrorText>No payments selected</ErrorText>}
          </div>
        )}
      </LedgerHeaderButtonsContainer>
      <StyledTableContainer
        style={{
          width: '100%',
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
                <Tooltip title="Person assigned to task" placement="top">
                  <div>Assignee</div>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="center" width={paid ? '20%' : '16%'}>
                <Tooltip title={paid ? 'Amount paid' : 'Amount owed'} placement="top">
                  <div>Payout</div>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="center" width="20%">
                Deliverable
              </StyledTableCell>
              <StyledTableCell align="center" width={paid ? '20%' : '16%'}>
                <Tooltip title="Proof of payment" placement="top">
                  <div>Link</div>
                </Tooltip>
              </StyledTableCell>
              {view === ViewType.Unpaid && (
                <StyledTableCell width="10%">
                  <Tooltip title="Payment status" placement="top">
                    <div>Status</div>
                  </Tooltip>
                </StyledTableCell>
              )}
              <StyledTableCell>
                <Tooltip title="Payment network" placement="top">
                  <div>Chain</div>
                </Tooltip>
              </StyledTableCell>
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

      {hasMore && <LoadMore ref={ref} hasMore={hasMore} />}
    </SettingsWrapper>
  );
}

export default Payouts;
