import React, { useCallback, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Tab } from '@mui/material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { GET_SUBMISSION_PAYMENT_INFO } from 'graphql/queries/payment';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { OfflinePayment } from '../../Common/Payment/OfflinePayment/OfflinePayment';
import { SingleWalletPayment } from '../../Common/Payment/SingleWalletPayment';
import {
  PaymentModal,
  PaymentModalHeader,
  PaymentTitleDiv,
  PaymentTitleTextDiv,
  PaymentTitleText,
  PaymentDescriptionText,
  StyledTabs,
  PaymentMethodWrapper,
  WarningTypography,
} from '../../Common/Payment/styles';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

function PayModal(props) {
  const { podId, orgId, open, handleClose, assigneeId, assigneeUsername, taskTitle, submissionId } = props;
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('wallet');
  const [wallets, setWallets] = useState([]);
  const [submissionPaymentInfo, setSubmissionPaymentInfo] = useState(null);
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const PAYMENT_TABS = [
    { name: 'wallet', label: 'Wallet', action: () => setSelectedTab('wallet') },
    { name: 'off_platform', label: 'Off platform', action: () => setSelectedTab('off_platform') },
  ];
  const [getOrgWallet, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_WALLET, {
    onCompleted: (data) => {
      setWallets(data?.getOrgWallet);
    },
    fetchPolicy: 'network-only',
  });
  const [getPodWallet] = useLazyQuery(GET_POD_WALLET, {
    fetchPolicy: 'network-only',
  });
  const [getPodById] = useLazyQuery(GET_POD_BY_ID);
  const [getSubmissionPaymentInfo] = useLazyQuery(GET_SUBMISSION_PAYMENT_INFO, {
    onCompleted: (data) => {
      setSubmissionPaymentInfo(data?.getSubmissionPaymentInfo);
    },
    fetchPolicy: 'network-only',
  });
  const getWallets = useCallback(
    async (podId, orgId) => {
      if (podId) {
        try {
          const result = await getPodWallet({
            variables: {
              podId,
            },
          });
          const wallets = result?.data?.getPodWallet;
          if (!wallets || wallets?.length === 0) {
            const podResult = await getPodById({
              variables: {
                podId,
              },
            });
            const pod = podResult?.data?.getPodById;
            getOrgWallet({
              variables: {
                orgId: pod?.orgId,
              },
            });
          } else {
            setWallets(wallets);
          }
        } catch (err) {
          console.error(`failed to fetch wallet: ${err?.message}`);
        }
      } else if (orgId) {
        getOrgWallet({
          variables: {
            orgId,
          },
        });
      }
    },
    [podId, orgId]
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getWallets(podId, orgId);
  }, [podId, orgId]);
  useEffect(() => {
    getSubmissionPaymentInfo({
      variables: {
        submissionId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);
  return (
    <Modal open={open} onClose={handleClose}>
      <PaymentModal>
        <PaymentTitleDiv>
          <PaymentTitleTextDiv>
            <PaymentTitleText>
              Payout to{' '}
              <Link href={`/profile/${assigneeId}/about`}>
                <a
                  style={{
                    color: '#ffffff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  target="_blank"
                >
                  {assigneeUsername}
                </a>
              </Link>{' '}
            </PaymentTitleText>
            <PaymentDescriptionText>Task: {taskTitle}</PaymentDescriptionText>
          </PaymentTitleTextDiv>
        </PaymentTitleDiv>
        <StyledTabs value={selectedTab}>
          {PAYMENT_TABS.map((tab) => (
            <Tab value={tab.name} key={tab.name} label={tab.label} onClick={tab.action} />
          ))}
        </StyledTabs>
        <PaymentMethodWrapper>
          {selectedTab === 'off_platform' && (
            <OfflinePayment
              submissionPaymentInfo={submissionPaymentInfo}
              approvedSubmission={{
                id: submissionId,
              }}
              handleClose={() => {
                const query = {
                  view: ViewType.Paid,
                };

                router.push({ query }, undefined, { scroll: false, shallow: true });
                handleClose();
              }}
            />
          )}

          {selectedTab === 'wallet' && (
            <SingleWalletPayment
              approvedSubmission={{
                id: submissionId,
              }}
              fetchedTask={{
                rewards: [],
              }}
              wallets={wallets}
              submissionPaymentInfo={submissionPaymentInfo}
              orgId={orgId}
              podId={podId}
            />
          )}
        </PaymentMethodWrapper>
      </PaymentModal>
    </Modal>
  );
}

export default PayModal;
