import React, { useCallback, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Tab from '@mui/material/Tab';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_SUBMISSION_PAYMENT_INFO } from 'graphql/queries/payment';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GET_TASK_SUBMISSION_BY_ID } from 'graphql/queries';
import { ENTITIES_TYPES } from 'utils/constants';
import { SubmissionPaymentInfo } from 'components/Common/Payment/types';
import { useGetOrgOrPodWallet, useSelectedTab } from 'components/Common/Payment/helper';
import { PaymentSelected } from 'components/Settings/Payouts/types';
import palette from 'theme/palette';
import { OfflinePayment } from 'components/Common/Payment/OfflinePayment/OfflinePayment';
import { SingleWalletPayment } from 'components/Common/Payment/SingleWalletPayment';
import {
  PaymentModal,
  PaymentTitleDiv,
  PaymentTitleTextDiv,
  PaymentTitleText,
  PaymentDescriptionText,
  StyledTabs,
  PaymentMethodWrapper,
} from '../../Common/Payment/styles';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}
interface Props {
  orgId?: string;
  podId?: string;
  open: boolean;
  handleClose: () => void;
  paymentSelected: PaymentSelected;
}

function TaskLedgePayModal(props: Props) {
  // used for payment ledger, different from MakePaymentModal because availabel data is different
  const { podId, orgId, open, handleClose, paymentSelected } = props;

  const router = useRouter();
  const { selectedTab, PAYMENT_TABS } = useSelectedTab();
  const wallets = useGetOrgOrPodWallet(podId, orgId);

  const { data: submissionData } = useQuery(GET_TASK_SUBMISSION_BY_ID, {
    variables: {
      submissionId: paymentSelected?.submissionId,
    },
    skip: !paymentSelected?.submissionId,
  });

  const isBounty = submissionData?.getTaskSubmissionById?.task?.type === ENTITIES_TYPES.BOUNTY;

  const [getSubmissionPaymentInfo, { data: submissionPaymentInfo }] = useLazyQuery(GET_SUBMISSION_PAYMENT_INFO, {
    onError: (err) => {},
    fetchPolicy: 'network-only',
  });
  const paymentInfo: SubmissionPaymentInfo = submissionPaymentInfo?.getSubmissionPaymentInfo;

  useEffect(() => {
    if (paymentSelected?.submissionId) {
      getSubmissionPaymentInfo({
        variables: {
          submissionId: paymentSelected?.submissionId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSelected?.submissionId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <PaymentModal>
        <PaymentTitleDiv>
          <PaymentTitleTextDiv>
            <PaymentTitleText>
              Payout
              <span style={{ color: palette.blue20 }}>
                {' '}
                {paymentSelected?.amount} {paymentSelected?.symbol?.toUpperCase()}{' '}
              </span>
              to{' '}
              <Link
                href={`/profile/${paymentSelected?.payeeId}/about`}
                target="_blank"
                style={{
                  color: '#ffffff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {paymentSelected?.payeeUsername}
              </Link>{' '}
            </PaymentTitleText>
            <PaymentDescriptionText>
              {isBounty ? 'Bounty' : 'Task'}: {paymentSelected?.taskTitle}
            </PaymentDescriptionText>
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
              submissionOrApplicationId={paymentSelected?.submissionId}
              paymentData={paymentInfo?.paymentData[0]}
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
              submissionOrApplicationId={paymentSelected?.submissionId}
              wallets={wallets}
              paymentData={paymentInfo?.paymentData[0]}
              orgId={orgId}
              podId={podId}
              reward={{
                rewardAmount: paymentSelected?.amount,
                symbol: paymentSelected?.symbol,
              }}
            />
          )}
        </PaymentMethodWrapper>
      </PaymentModal>
    </Modal>
  );
}

export default TaskLedgePayModal;
