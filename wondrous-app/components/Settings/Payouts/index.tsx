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
  TableCellText,
  LoadMore,
  LedgerActionButtonsContainer,
  LedgerDownloadButton,
  LedgerClearSelectionButton,
  PayoutSelectionSelect,
  PayoutSelectionSelectValueDisplay,
  PayoutSelectionSelectValueDisplayText,
  PayoutSelectionSelectMenuItem,
  PayoutCount,
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
} from 'components/Settings/Payouts/styles';
import SubmissionPaymentCSVModal from 'components/Settings/Payouts/SubmissionPaymentCSVModal';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { GeneralSettingsContainer } from 'components/Settings/styles';
import Tooltip from 'components/Tooltip';
import { format } from 'date-fns';
import { GET_ORG_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_PROCESSING_PAYMENTS_FOR_ORG,
  GET_PROCESSING_PAYMENTS_FOR_POD,
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
import Toggle from 'components/Common/Toggle';
import { Grid } from '@mui/material';
import { capitalize } from 'utils/common';
import { INITIAL_SELECTION_OPTIONS } from './constants';
import PayoutTable from './PayoutTable';
import { useGetPaymentMethodsForOrg } from './hooks';

enum ViewType {
  Paid = 'paid',
  Processing = 'processing',
  Unpaid = 'unpaid',
}

const imageStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  marginRight: '8px',
};

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

  const router = useRouter();

  const [view, setView] = useState(null);

  const { view: payView } = router.query;

  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(false);

  const [selectAllFromChainSelected, setSelectAllFromChainSelected] = useState('');

  const [chainSelected, setChainSelected] = useState(null);

  const [paymentSelected, setPaymentsSelected] = useState(null);
  const [openBatchPayModal, setOpenBatchPayModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [noPaymentSelectedError, setNoPaymentSelectedError] = useState(null);

  const [paidList, setPaidList] = useState([]);
  const [unpaidList, setUnpaidList] = useState([]);
  const [processingList, setProcessingList] = useState([]);

  // no payments selected error while downloading
  // useEffect(() => {
  //   setNoPaymentSelectedError(false);
  //   if (!paymentSelected || Object.keys(paymentSelected).length === 0) {
  //     setChainSelected(null);
  //   }
  // }, [paymentSelected]);

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
  const [getProcessingPaymentsForOrg, { fetchMore: fetchMoreProcessingPaymentsForOrg }] = useLazyQuery(
    GET_PROCESSING_PAYMENTS_FOR_ORG,
    {
      fetchPolicy: 'network-only',
    }
  );
  const [getProcessingPaymentsForPod, { fetchMore: fetchMoreProcessingPaymentsForPod }] = useLazyQuery(
    GET_PROCESSING_PAYMENTS_FOR_POD,
    {
      fetchPolicy: 'network-only',
    }
  );

  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);

  const paid = view === ViewType.Paid;
  const processing = view === ViewType.Processing;

  const handleMoreData = useCallback(
    (data) => {
      if (data?.length > 0) {
        if (paid) {
          setPaidList((state) => [...state, ...data]);
        } else if (processing) {
          setProcessingList((state) => [...state, ...data]);
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
      const list = paid ? paidList : processing ? processingList : unpaidList;

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
        } else if (processing) {
          fetchMoreProcessingPaymentsForOrg({
            variables: {
              input: {
                offset: list?.length,
                limit: LIMIT,
                orgId,
                orgOnly: false,
              },
            },
          }).then((fetchMoreResult) => {
            const results = fetchMoreResult?.data?.getProcessingPaymentsForOrg;
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
        } else if (processing) {
          fetchMoreProcessingPaymentsForPod({
            variables: {
              input: {
                offset: list?.length,
                limit: LIMIT,
                podId,
              },
            },
          }).then((fetchMoreResult) => {
            const results = fetchMoreResult?.data?.getProcessingPaymentsForPod;
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
  }, [paidList, unpaidList, processingList, hasMore]);

  const handleBatchPayButtonClick = () => {
    setOpenBatchPayModal(true);
  };

  const handleExportButtonClick = () => {
    // if (!paymentSelected || isEmpty(paymentSelected)) {
    //   setNoPaymentSelectedError(true);
    //   return;
    // }
    // setOpenExportModal(true);
  };

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
    } else if (orgId && view === ViewType.Processing) {
      getProcessingPaymentsForOrg({
        variables: {
          input: {
            orgId,
            orgOnly: false,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const payments = result?.data?.getProcessingPaymentsForOrg;
        setProcessingList(payments || []);
        setHasMore(payments?.length >= LIMIT);
      });
    } else if (podId && view === ViewType.Processing) {
      getProcessingPaymentsForPod({
        variables: {
          input: {
            podId,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const payments = result?.data?.getProcessingPaymentsForPod;
        setProcessingList(payments || []);
        setHasMore(payments?.length >= LIMIT);
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
      } else if (payView === ViewType.Processing) {
        setView(ViewType.Processing);
      }
    }
  }, [payView]);

  useEffect(() => {
    if (inView && hasMore) {
      handleLoadMore();
    }
  }, [inView, hasMore, handleLoadMore]);

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

  const org = orgData?.getOrgById;

  const toggleItems = [
    {
      label: 'Unpaid',
      isActive: view === ViewType.Unpaid || view === null,
      onChange: () => router.replace(`${delQuery(router.asPath)}?view=${ViewType.Unpaid}`),
      gradient: 'linear-gradient(266.31deg, #7427FF 1.4%, #00BAFF 119.61%)',
    },
    {
      label: 'Processing',
      isActive: view === ViewType.Processing,
      onChange: () => router.replace(`${delQuery(router.asPath)}?view=${ViewType.Processing}`),
      gradient: 'linear-gradient(266.31deg, #7427FF 1.4%, #00BAFF 119.61%)',
    },
    {
      label: 'Paid',
      isActive: view === ViewType.Paid,
      onChange: () => router.replace(`${delQuery(router.asPath)}?view=${ViewType.Paid}`),
      gradient: 'linear-gradient(266.31deg, #7427FF 1.4%, #00BAFF 119.61%)',
    },
  ];

  // const paymentSelectedAmount = paymentSelected && Object.keys(paymentSelected).length;

  const paymentMethods = useGetPaymentMethodsForOrg(orgId)?.map((method) => method.chain);
  const supportedPaymentChains = Array.from(new Set(paymentMethods));

  const selectionOptions = [
    ...INITIAL_SELECTION_OPTIONS,
    ...supportedPaymentChains?.map((chain: string) => ({
      label: `Select all from ${capitalize(chain)}`,
      value: chain,
    })),
  ];

  const paymentCount = paidList?.length || unpaidList?.length || processingList?.length;

  const handleSelectItemsBasedOnChain = (ev) => {
    const { value } = ev.target;
    setSelectAllFromChainSelected((_) => value);
  };

  const renderSelectionValue = () => (
    <PayoutSelectionSelectValueDisplay>
      <PayoutSelectionSelectValueDisplayText isActive>Select all</PayoutSelectionSelectValueDisplayText>
    </PayoutSelectionSelectValueDisplay>
  );

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock
          icon={<PayoutSettingsHeaderIcon />}
          title="Payment Ledger"
          description="Where you manage all your projects payouts"
        />
      </GeneralSettingsContainer>
      {/* <SubmissionPaymentCSVModal
        chain={chainSelected}
        podId={podId}
        orgId={orgId}
        open={openExportModal}
        handleClose={() => setOpenExportModal(false)}
        exportPaymentCSV={exportSubmissionPaymentCsv}
        unpaidSubmissions={paymentSelected}
      /> */}

      <LedgerActionButtonsContainer>
        <Grid display="flex" alignItems="center" gap="18px">
          <PayoutSelectionSelect
            value={selectAllFromChainSelected || true}
            renderValue={renderSelectionValue}
            onChange={handleSelectItemsBasedOnChain}
          >
            {selectionOptions.map((option) => (
              <PayoutSelectionSelectMenuItem
                key={option.value}
                value={option.value}
                isSelected={selectAllFromChainSelected === option.value}
              >
                {option.label}
              </PayoutSelectionSelectMenuItem>
            ))}
          </PayoutSelectionSelect>
          <LedgerClearSelectionButton>Clear selection</LedgerClearSelectionButton>
        </Grid>

        {!paid && <LedgerDownloadButton onClick={handleExportButtonClick}>Download to CSV</LedgerDownloadButton>}
        {/* <div>
          <LedgerDownloadButton onClick={handleExportButtonClick}>Download to CSV</LedgerDownloadButton>
          {noPaymentSelectedError && <ErrorText>No payments selected</ErrorText>}
        </div> */}

        <Toggle items={toggleItems} />
      </LedgerActionButtonsContainer>

      {!!paymentCount && (
        <PayoutCount>
          {paymentCount} {capitalize(view)} transactions
        </PayoutCount>
      )}

      <PayoutTable
        org={org}
        podId={podId}
        paid={paid}
        processing={processing}
        paidList={paidList}
        unpaidList={unpaidList}
        processingList={processingList}
        selectAllFromChainSelected={selectAllFromChainSelected}
        canViewPaymentLink={canViewPaymentLink}
      />

      {/* <StyledTableContainer>
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
      </StyledTableContainer> */}

      {/* <PaymentModalContext.Provider
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
      </PaymentModalContext.Provider> */}

      {/* <LoadMore style={{ height: '2px' }} ref={ref} hasMore={hasMore} /> */}
    </SettingsWrapper>
  );
}

export default Payouts;
