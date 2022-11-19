import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Tab } from '@mui/material';
import { BigNumber } from 'bignumber.js';
import { GRAPHQL_ERRORS, BOUNTY_TYPE, PERMISSIONS } from 'utils/constants';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { GET_SUBMISSION_PAYMENT_INFO } from 'graphql/queries/payment';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';
import palette from 'theme/palette';
import CloseModalIcon from 'components/Icons/closeModal';
import { ErrorText } from 'components/Onboarding/styles';
import { SafeImage } from '../Image';
import { useMe } from '../../Auth/withAuth';
import { DAOIcon } from '../../Icons/dao';
import OrganisationsCardNoLogo from '../../profile/about/styles';
import { OfflinePayment } from './OfflinePayment/OfflinePayment';
import { SingleWalletPayment } from './SingleWalletPayment';
import { CreateFormPreviewButton, CreateFormRewardCurrency } from '../../CreateEntity/styles';
import InputForm from '../InputForm/inputForm';
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
  ChangePaymentButton,
  ChangePaymentAmountDiv,
  SaveNewRewardAmountButton,
  CancelNewRewardAmountButton,
} from './styles';

const GoBackStyle = {
  color: palette.white,
  width: '100%',
  textAlign: 'right',
  marginRight: '8px',
  textDecoration: 'underline',
  cursor: 'pointer',
};

export function MakePaymentModal(props) {
  const { open, handleClose, setShowPaymentModal, approvedSubmission, fetchedTask, getTaskSubmissionsForTask } = props;
  const [selectedTab, setSelectedTab] = useState('wallet');
  const [wallets, setWallets] = useState([]);
  const [submissionPaymentInfo, setSubmissionPaymentInfo] = useState(null);
  const [rewardAmount, setRewardAmount] = useState('');
  const [changeRewardAmount, setChangeRewardAmount] = useState(false);
  const [changedRewardAmount, setChangedRewardAmount] = useState(null);
  const [useChangedRewardAmount, setUseChangedRewardAmount] = useState(false);
  const [submissionPaymentError, setSubmissionPaymentError] = useState(null);
  const [tokenName, setTokenName] = useState('');
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const [changeRewardErrorText, setChangeRewardErrorText] = useState('');
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
    fetchPolicy: 'network-only',
  });

  const [getSubmissionPaymentInfo] = useLazyQuery(GET_SUBMISSION_PAYMENT_INFO, {
    onCompleted: (data) => {
      setSubmissionPaymentInfo(data?.getSubmissionPaymentInfo);
    },
    onError: (err) => {
      if (err?.graphQLErrors[0].extensions?.message === GRAPHQL_ERRORS.NO_RECIPIENT_WEB_3_ADDRESS) {
        setSubmissionPaymentError(
          'Recipient has no active wallet. Please inform them to connect their wallet to their account'
        );
      }
    },
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (fetchedTask?.podId) {
      getPodWallet({
        variables: {
          podId: fetchedTask?.podId,
        },
      }).then((result) => {
        const wallets = result?.data?.getPodWallet;
        if (!wallets || wallets?.length === 0) {
          getOrgWallet({
            variables: {
              orgId: fetchedTask?.orgId,
            },
          });
        } else {
          setWallets(wallets);
        }
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
    setRewardAmount(fetchedTask?.rewards[0]?.rewardAmount);
    setTokenName(fetchedTask?.rewards[0]?.tokenName);
  }, [fetchedTask]);

  useEffect(() => {
    getSubmissionPaymentInfo({
      variables: {
        submissionId: approvedSubmission?.id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvedSubmission]);
  const handleCloseAll = () => {
    handleClose();
    setShowPaymentModal(false);
  };

  const handleGoBackToTask = () => {
    setShowPaymentModal(false);
    getTaskSubmissionsForTask({
      variables: {
        taskId: fetchedTask?.id,
      },
    });
  };

  const canPay = permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);

  const isBounty = fetchedTask.type === BOUNTY_TYPE;
  const payee = {
    userId: isBounty ? approvedSubmission?.createdBy : fetchedTask?.assigneeId,
    username: isBounty ? approvedSubmission?.creator.username : fetchedTask.assigneeUsername,
  };

  return (
    <Modal open={open} onClose={handleCloseAll}>
      <PaymentModal>
        <PaymentModalHeader>
          {fetchedTask?.orgProfilePicture ? (
            <SafeImage
              useNextImage={false}
              src={fetchedTask?.orgProfilePicture}
              style={{
                width: '29px',
                height: '28px',
                borderRadius: '4px',
                marginRight: '8px',
              }}
              alt="Organization logo"
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
          <>
            <PodNameTypography style={GoBackStyle} onClick={handleGoBackToTask}>
              Back to Task
            </PodNameTypography>
          </>
        </PaymentModalHeader>
        <PaymentTitleDiv>
          <PaymentTitleTextDiv>
            <PaymentTitleText>
              Payout
              <span style={{ color: palette.blue20 }}>
                {' '}
                {rewardAmount} {tokenName?.toUpperCase()}{' '}
              </span>
              to{' '}
              <Link
                href={`/profile/${payee.userId}/about`}
                style={{
                  color: '#ffffff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                target="_blank"
              >
                {payee.username}
              </Link>{' '}
            </PaymentTitleText>
            <PaymentDescriptionText>Task: {fetchedTask.title}</PaymentDescriptionText>
            {fetchedTask?.type === BOUNTY_TYPE && (
              <>
                {changeRewardAmount ? (
                  <>
                    <ChangePaymentAmountDiv>
                      <InputForm
                        style={{
                          marginTop: '12px',
                          width: 'fit-content',
                          paddingRight: '12px',
                        }}
                        type="number"
                        min="0"
                        placeholder="Enter new reward amount"
                        search={false}
                        value={changedRewardAmount}
                        onChange={(e) => setChangedRewardAmount(e.target.value)}
                      />
                      <PaymentDescriptionText
                        style={{
                          marginLeft: '12px',
                          marginTop: '12px',
                        }}
                      >
                        {tokenName?.toUpperCase()}{' '}
                      </PaymentDescriptionText>
                      <SaveNewRewardAmountButton
                        onClick={() => {
                          const bigChangedRewardAmount = new BigNumber(changedRewardAmount);
                          const initialBigRewardAmount = new BigNumber(fetchedTask?.rewards[0]?.rewardAmount);
                          if (bigChangedRewardAmount.isLessThan(initialBigRewardAmount)) {
                            setChangeRewardErrorText('New reward must be greater than minimum');
                          } else {
                            setRewardAmount(changedRewardAmount);
                            setChangeRewardAmount(false);
                            setUseChangedRewardAmount(true);
                          }
                        }}
                      >
                        Save changes
                      </SaveNewRewardAmountButton>
                      <CancelNewRewardAmountButton
                        onClick={() => {
                          setChangeRewardAmount(false);
                        }}
                      >
                        Cancel
                      </CancelNewRewardAmountButton>
                    </ChangePaymentAmountDiv>
                    <ErrorText>{changeRewardErrorText}</ErrorText>
                  </>
                ) : (
                  <ChangePaymentButton onClick={() => setChangeRewardAmount(true)}>
                    Change payment amount
                  </ChangePaymentButton>
                )}
              </>
            )}
          </PaymentTitleTextDiv>
        </PaymentTitleDiv>
        <StyledTabs value={selectedTab}>
          {PAYMENT_TABS.map((tab) => (
            <Tab
              style={{
                color: 'white !important',
              }}
              value={tab.name}
              key={tab.name}
              label={tab.label}
              onClick={tab.action}
            />
          ))}
        </StyledTabs>
        <PaymentMethodWrapper>
          {selectedTab === 'off_platform' && (
            <OfflinePayment
              handleClose={handleCloseAll}
              approvedSubmission={approvedSubmission}
              fetchedTask={fetchedTask}
              submissionPaymentInfo={submissionPaymentInfo}
            />
          )}
          {selectedTab === 'wallet' && (
            <SingleWalletPayment
              setShowPaymentModal={setShowPaymentModal}
              approvedSubmission={approvedSubmission}
              fetchedTask={fetchedTask}
              wallets={wallets}
              submissionPaymentInfo={submissionPaymentInfo}
              orgId={approvedSubmission?.orgId}
              podId={approvedSubmission?.podId}
              changedRewardAmount={useChangedRewardAmount ? rewardAmount : null}
              parentError={submissionPaymentError}
            />
          )}
        </PaymentMethodWrapper>
      </PaymentModal>
    </Modal>
  );
}
