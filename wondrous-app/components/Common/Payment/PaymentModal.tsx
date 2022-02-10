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
} from './styles';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from '../../../graphql/queries/wallet';
import { GET_SUBMISSION_PAYMENT_INFO } from '../../../graphql/queries/payment';
import { SafeImage } from '../Image';
import { parseUserPermissionContext } from '../../../utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks';
import { PERMISSIONS } from '../../../utils/constants';
import { useMe } from '../../Auth/withAuth';
import { useRouter } from 'next/router';
import { DAOIcon } from '../../Icons/dao';
import { OrganisationsCardNoLogo } from '../../profile/about/styles';
import { OfflinePayment } from './OfflinePayment';
import { SingleWalletPayment } from './SingleWalletPayment';
import Link from 'next/link';
import { GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries';

export const MakePaymentModal = (props) => {
  const { open, handleClose, setShowPaymentModal, approvedSubmission, fetchedTask } = props;
  const [selectedTab, setSelectedTab] = useState('wallet');
  const [wallets, setWallets] = useState([]);
  const [submissionPaymentInfo, setSubmissionPaymentInfo] = useState(null);
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard || userBoard;
  const router = useRouter();
  const user = useMe();

  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const PAYMENT_TABS = [
    { name: 'wallet', label: 'Wallet', action: () => setSelectedTab('wallet') },
    { name: 'off_platform', label: 'Off platform', action: () => setSelectedTab('off_platform') },
  ];
  const userPermissionsContext = userPermissionsContextData?.getUserPermissionContext
    ? JSON.parse(userPermissionsContextData?.getUserPermissionContext)
    : null;
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: fetchedTask?.orgId,
    podId: fetchedTask?.podId,
  });
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
    if (fetchedTask?.podId) {
      getPodWallet({
        variables: {
          podId: fetchedTask?.podId,
        },
      });
    } else if (fetchedTask?.orgId) {
      getOrgWallet({
        variables: {
          orgId: fetchedTask?.orgId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedTask]);

  useEffect(() => {
    getSubmissionPaymentInfo({
      variables: {
        submissionId: approvedSubmission?.id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvedSubmission]);

  const handleCloeAll = () => {
    handleClose();
    setShowPaymentModal(false);
  };
  const canPay = permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);
  return (
    <>
      <Modal open={open} onClose={handleCloeAll}>
        <PaymentModal>
          <PaymentModalHeader>
            {fetchedTask?.orgProfilePicture ? (
              <SafeImage
                src={fetchedTask?.orgProfilePicture}
                style={{
                  width: '29px',
                  height: '28px',
                  borderRadius: '4px',
                  marginRight: '8px',
                }}
              />
            ) : (
              <OrganisationsCardNoLogo style={{ height: '29px', width: '28px' }}>
                <DAOIcon />
              </OrganisationsCardNoLogo>
            )}
            {fetchedTask?.podName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <PodNameTypography>{fetchedTask?.podName}</PodNameTypography>
              </div>
            )}
          </PaymentModalHeader>
          <PaymentTitleDiv>
            <PaymentTitleTextDiv>
              <PaymentTitleText>
                Payout to{' '}
                <Link href={`/profile/${fetchedTask?.assigneeId}/about`}>
                  <a
                    style={{
                      color: '#ffffff',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    target=")blank"
                  >
                    {fetchedTask.assigneeUsername}
                  </a>
                </Link>{' '}
              </PaymentTitleText>
              <PaymentDescriptionText>Task: {fetchedTask.title}</PaymentDescriptionText>
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
                <OfflinePayment />
              </>
            )}

            {selectedTab === 'wallet' && (
              <SingleWalletPayment
                approvedSubmission={approvedSubmission}
                fetchedTask={fetchedTask}
                wallets={wallets}
                submissionPaymentInfo={submissionPaymentInfo}
              />
            )}
          </PaymentMethodWrapper>
        </PaymentModal>
      </Modal>
    </>
  );
};
