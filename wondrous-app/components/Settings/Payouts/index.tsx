import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useInView } from 'react-intersection-observer';
import { useMe } from 'components/Auth/withAuth';
import { PayoutSettingsHeaderIcon } from 'components/Icons/PayoutSettingsHeaderIcon';
import { HeaderBlock } from 'components/Settings/headerBlock';
import { exportSubmissionPaymentCsv } from 'components/Settings/Payouts/exportSubmissionPaymentCsv';
import {
  LoadMore,
  LedgerActionButtonsContainer,
  LedgerDownloadButton,
  PayoutSelectionSelect,
  PayoutSelectionSelectValueDisplay,
  PayoutSelectionSelectValueDisplayText,
  PayoutSelectionSelectMenuItem,
  PayoutCount,
} from 'components/Settings/Payouts/styles';
import SubmissionPaymentCSVModal from 'components/Settings/Payouts/SubmissionPaymentCSVModal';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { GeneralSettingsContainer } from 'components/Settings/styles';
import { GET_ORG_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_PROCESSING_PAYMENTS_FOR_ORG,
  GET_PROCESSING_PAYMENTS_FOR_POD,
  GET_UNPAID_SUBMISSIONS_FOR_ORG,
  GET_UNPAID_SUBMISSIONS_FOR_POD,
} from 'graphql/queries/payment';
import { delQuery } from 'utils';
import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import Toggle from 'components/Common/Toggle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { capitalize } from 'utils/common';
import typography from 'theme/typography';
import palette from 'theme/palette';
import PayoutTable from './PayoutTable';
import { INITIAL_SELECTION_OPTIONS } from './constants';
import { useGetPaymentMethodsForOrg } from './hooks';

enum ViewType {
  Paid = 'paid',
  Processing = 'processing',
  Unpaid = 'unpaid',
}

const LIMIT = 30;

function Payouts(props) {
  const { orgId, podId } = props;

  const router = useRouter();

  const [view, setView] = useState(null);

  const { view: payView } = router.query;

  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(false);

  const [selectAllFromChainSelected, setSelectAllFromChainSelected] = useState('');

  const [submissionsToExport, setSubmissionsToExport] = useState({});

  const [selectedItems, setSelectedItems] = useState({});

  const [openExportModal, setOpenExportModal] = useState(false);

  const [paidList, setPaidList] = useState([]);
  const [unpaidList, setUnpaidList] = useState([]);
  const [processingList, setProcessingList] = useState([]);

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
  }, [orgId, podId, view, LIMIT]);

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

  const handleSetSubmissionsToExport = (submissions) => {
    const submissionsToExport = {};
    submissions?.forEach((payment) => {
      submissionsToExport[payment?.submissionId] = payment;
    });
    setSubmissionsToExport(submissionsToExport);
  };

  useEffect(() => {
    if (openExportModal) {
      if (Object.keys(selectedItems)?.length) {
        setSubmissionsToExport(selectedItems);
      } else if (orgId) {
        if (view === ViewType.Unpaid) {
          getUnpaidSubmissionsForOrg({
            variables: {
              input: {
                orgId,
                orgOnly: false,
                limit: Number.POSITIVE_INFINITY,
              },
            },
          }).then((result) => {
            const submissions = result?.data?.getUnpaidSubmissionsForOrg;
            handleSetSubmissionsToExport(submissions);
          });
        } else if (view === ViewType.Processing) {
          getProcessingPaymentsForOrg({
            variables: {
              input: {
                orgId,
                orgOnly: false,
                limit: Number.POSITIVE_INFINITY,
              },
            },
          }).then((result) => {
            const submissions = result?.data?.getProcessingPaymentsForOrg;
            handleSetSubmissionsToExport(submissions);
          });
        } else if (view === ViewType.Paid) {
          getPaymentsForOrg({
            variables: {
              input: {
                orgId,
                orgOnly: false,
                limit: Number.POSITIVE_INFINITY,
              },
            },
          }).then((result) => {
            const submissions = result?.data?.getPaymentsForOrg;
            handleSetSubmissionsToExport(submissions);
          });
        }
      } else if (podId) {
        if (view === ViewType.Unpaid) {
          getUnpaidSubmissionsForPod({
            variables: {
              input: {
                podId,
                limit: Number.POSITIVE_INFINITY,
              },
            },
          }).then((result) => {
            const submissions = result?.data?.getUnpaidSubmissionsForPod;
            handleSetSubmissionsToExport(submissions);
          });
        } else if (view === ViewType.Processing) {
          getProcessingPaymentsForPod({
            variables: {
              input: {
                podId,
                limit: Number.POSITIVE_INFINITY,
              },
            },
          }).then((result) => {
            const submissions = result?.data?.getProcessingPaymentsForPod;
            handleSetSubmissionsToExport(submissions);
          });
        } else if (view === ViewType.Paid) {
          getPaymentsForPod({
            variables: {
              input: {
                podId,
                limit: Number.POSITIVE_INFINITY,
              },
            },
          }).then((result) => {
            const submissions = result?.data?.getPaymentsForPod;
            handleSetSubmissionsToExport(submissions);
          });
        }
      }
    }
  }, [orgId, podId, selectedItems, openExportModal, view]);

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

  const handleClearSelectItemsBasedOnChain = () => {
    if (selectAllFromChainSelected) {
      setSelectAllFromChainSelected((_) => '');
    }
  };

  const handleDownloadToCSV = () => {
    setOpenExportModal(true);
  };

  const renderSelectionValue = () => (
    <Grid display="flex" alignItems="center" gap="8px">
      <Typography
        fontFamily={typography.fontFamily}
        fontWeight={400}
        fontSize="15px"
        lineHeight="19.14px"
        color={palette.white}
      >
        Select all
      </Typography>
    </Grid>
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

      <SubmissionPaymentCSVModal
        podId={podId}
        orgId={orgId}
        open={openExportModal}
        handleClose={() => setOpenExportModal(false)}
        exportPaymentCSV={exportSubmissionPaymentCsv}
        unpaidSubmissions={submissionsToExport}
      />

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
          <LedgerDownloadButton onClick={handleDownloadToCSV}>Download to CSV</LedgerDownloadButton>
        </Grid>

        <Toggle items={toggleItems} />
      </LedgerActionButtonsContainer>

      {!!paymentCount && (
        <Typography fontFamily={typography.fontFamily} fontSize="14px" fontWeight={500} color={palette.blue20}>
          {paymentCount} {capitalize(view)} transactions
        </Typography>
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
        handleClearSelectItemsBasedOnChain={handleClearSelectItemsBasedOnChain}
        handleDownloadToCSV={handleDownloadToCSV}
        canViewPaymentLink={canViewPaymentLink}
        viewingUser={user}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />

      <LoadMore ref={ref} hasMore={hasMore} />
    </SettingsWrapper>
  );
}

export default Payouts;
