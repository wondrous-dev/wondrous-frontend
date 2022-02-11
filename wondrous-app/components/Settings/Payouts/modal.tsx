import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';
import { Tab } from '@material-ui/core';
import {
  PodNameTypography,
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
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from '../../../graphql/queries/wallet';
import { GET_SUBMISSION_PAYMENT_INFO } from '../../../graphql/queries/payment';
import { parseUserPermissionContext } from '../../../utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks';
import { PERMISSIONS } from '../../../utils/constants';
import { useMe } from '../../Auth/withAuth';
import { useRouter } from 'next/router';
import { DAOIcon } from '../../Icons/dao';
import { OrganisationsCardNoLogo } from '../../profile/about/styles';
import { OfflinePayment } from '../../Common/Payment/OfflinePayment';
import { SingleWalletPayment } from '../../Common/Payment/SingleWalletPayment';
import Link from 'next/link';
import { GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries';
import { delQuery } from '../../../utils';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

export const PayModal = (props) => {
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
    onCompleted: (data) => {
      setWallets(data?.getPodWallet);
    },
    fetchPolicy: 'network-only',
  });

  const [getSubmissionPaymentInfo] = useLazyQuery(GET_SUBMISSION_PAYMENT_INFO, {
    onCompleted: (data) => {
      setSubmissionPaymentInfo(data?.getSubmissionPaymentInfo);
    },
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (podId) {
      getPodWallet({
        variables: {
          podId,
        },
      });
    } else if (orgId) {
      getOrgWallet({
        variables: {
          orgId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <>
              <WarningTypography>
                This link will only be visible to the assignee and other admins with the payment permission
              </WarningTypography>
              <OfflinePayment
                approvedSubmission={{
                  id: submissionId,
                }}
                handleClose={() => {
                  router.replace(`${delQuery(router.asPath)}?view=${ViewType.Paid}`);
                  handleClose();
                }}
              />
            </>
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
            />
          )}
        </PaymentMethodWrapper>
      </PaymentModal>
    </Modal>
  );
};
