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
import { GET_SUBMISSIONS_PAYMENT_INFO } from '../../../graphql/queries/payment';
import { parseUserPermissionContext } from '../../../utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from '../../../utils/hooks';
import { PERMISSIONS } from '../../../utils/constants';
import { useMe } from '../../Auth/withAuth';
import { useRouter } from 'next/router';
import { DAOIcon } from '../../Icons/dao';
import { OrganisationsCardNoLogo } from '../../profile/about/styles';
import { OfflinePayment } from '../../Common/Payment/OfflinePayment';
import { BatchWalletPayment } from '../../Common/Payment/BatchWalletPayment';
import Link from 'next/link';
import { GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries';
import { delQuery } from '../../../utils';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

export const BatchPayModal = (props) => {
  const { podId, orgId, open, handleClose, unpaidSubmissions, chain } = props;
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('wallet');
  const [wallets, setWallets] = useState([]);
  const [submissionsPaymentInfo, setSubmissionsPaymentInfo] = useState(null);
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const PAYMENT_TABS = [{ name: 'wallet', label: 'Wallet', action: () => setSelectedTab('wallet') }];
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

  const [getSubmissionsPaymentInfo] = useLazyQuery(GET_SUBMISSIONS_PAYMENT_INFO, {
    onCompleted: (data) => {
      setSubmissionsPaymentInfo(data?.getSubmissionsPaymentInfo);
    },
    fetchPolicy: 'network-only',
  });
  const submissionIds = unpaidSubmissions && Object.keys(unpaidSubmissions)

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
    getSubmissionsPaymentInfo({
      variables: {
        submissionIds,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unpaidSubmissions]);
  return (
    <Modal open={open} onClose={handleClose}>
      <PaymentModal>
        <PaymentTitleDiv>
          <PaymentTitleTextDiv>
            <PaymentTitleText>
              Batch pay
            </PaymentTitleText>
            <PaymentDescriptionText>Pay the following submissions</PaymentDescriptionText>
          </PaymentTitleTextDiv>
        </PaymentTitleDiv>
        <StyledTabs value={selectedTab}>
          {PAYMENT_TABS.map((tab) => (
            <Tab value={tab.name} key={tab.name} label={tab.label} onClick={tab.action} />
          ))}
        </StyledTabs>
        <PaymentMethodWrapper>
          <BatchWalletPayment
            orgId={orgId}
            podId={podId}
            unpaidSubmissions={unpaidSubmissions}
            submissionIds={submissionIds}
            wallets={wallets}
            chain={chain}
            submissionsPaymentInfo={submissionsPaymentInfo}
          />
        </PaymentMethodWrapper>
      </PaymentModal>
    </Modal>
  );
};
