import React, { useEffect, useRef, useState, useContext } from 'react';
import Tab from '@mui/material/Tab';
import { BigNumber } from 'bignumber.js';
import { GRAPHQL_ERRORS, BOUNTY_TYPE, PERMISSIONS, ENTITIES_TYPES } from 'utils/constants';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_GRANT_APPLICATION_PAYMENT_INFO, GET_SUBMISSION_PAYMENT_INFO } from 'graphql/queries/payment';
import { parseUserPermissionContext } from 'utils/helpers';
import { SubmissionPaymentInfo } from 'components/Common/Payment/types';
import Link from 'next/link';
import palette from 'theme/palette';
import { ErrorText } from 'components/Onboarding/styles';
import { Modal } from 'components/Modal';
import GradientHeading from 'components/GradientHeading';
import Divider from 'components/Divider';
import { useGlobalContext } from 'utils/hooks';
import { useGetOrgOrPodWallet, useSelectedTab } from 'components/Common/Payment/helper';
import Grid from '@mui/material/Grid';
import { SafeImage } from '../Image';
import { useMe } from '../../Auth/withAuth';
import { DAOIcon } from '../../Icons/dao';
import OrganisationsCardNoLogo from '../../profile/about/styles';
import { OfflinePayment } from './OfflinePayment/OfflinePayment';
import { SingleWalletPayment } from './SingleWalletPayment';
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
  ChangePaymentButton,
  ChangePaymentAmountDiv,
  SaveNewRewardAmountButton,
  CancelNewRewardAmountButton,
} from './styles';
import PaymentDetails from './Fields/PaymentDetails';
import PaymentMethod from './Fields/PaymentMethod';

const GoBackStyle = {
  color: palette.white,
  width: '100%',
  textAlign: 'right',
  marginRight: '8px',
  textDecoration: 'underline',
  cursor: 'pointer',
};

// TODO: Adrian - we need to refactor this to make it generic for both tasks and grants

interface Props {
  open: boolean;
  handleClose: () => void;
  setShowPaymentModal: (showPaymentModal: boolean) => void;
  handleGoBack: any;
  submissionOrApplication: any; // taskSubmission or grantApplication
  taskOrGrant: any; // task or grant
  entityType?: string;
}

function MakePaymentModal(props: Props) {
  const { open, handleClose, setShowPaymentModal, handleGoBack, submissionOrApplication, taskOrGrant, entityType } =
    props;

  const footerRef = useRef();
  const footerLeftRef = useRef();

  const [rewardAmount, setRewardAmount] = useState('');
  const [changeRewardAmount, setChangeRewardAmount] = useState(false);
  const [changedRewardAmount, setChangedRewardAmount] = useState(null);
  const [userChangedRewardAmount, setUserChangedRewardAmount] = useState(false);
  const [submissionPaymentError, setSubmissionPaymentError] = useState(null);
  const [changeRewardErrorText, setChangeRewardErrorText] = useState('');
  const { selectedTab, PAYMENT_TABS } = useSelectedTab();
  const { userPermissionsContext } = useGlobalContext();
  const wallets = useGetOrgOrPodWallet(submissionOrApplication?.podId, submissionOrApplication?.orgId);

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: submissionOrApplication?.orgId,
    podId: submissionOrApplication?.podId,
  });

  const [getSubmissionPaymentInfo, { data: submissionPaymentInfo }] = useLazyQuery(GET_SUBMISSION_PAYMENT_INFO, {
    onError: (err) => {
      if (err?.graphQLErrors[0]?.extensions?.message === GRAPHQL_ERRORS.NO_RECIPIENT_WEB_3_ADDRESS) {
        setSubmissionPaymentError(
          'Recipient has no active wallet. Please inform them to connect their wallet to their account'
        );
      }
    },
    fetchPolicy: 'network-only',
  });

  const [getGrantApplicationPaymentInfo, { data: grantApplicationPaymentInfo }] = useLazyQuery(
    GET_GRANT_APPLICATION_PAYMENT_INFO,
    {
      onError: (err) => {
        if (err?.graphQLErrors[0].extensions?.message === GRAPHQL_ERRORS.NO_RECIPIENT_WEB_3_ADDRESS) {
          setSubmissionPaymentError(
            'Recipient has no active wallet. Please inform them to connect their wallet to their account'
          );
        }
      },
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (taskOrGrant?.rewards?.length) {
      setRewardAmount(taskOrGrant?.rewards[0]?.rewardAmount);
    }
    if (taskOrGrant.reward) {
      setRewardAmount(taskOrGrant?.reward?.rewardAmount);
    }
  }, [taskOrGrant?.rewards?.length, taskOrGrant.reward]);

  useEffect(() => {
    if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
      getGrantApplicationPaymentInfo({
        variables: {
          grantApplicationId: submissionOrApplication?.id,
        },
      });
    } else {
      getSubmissionPaymentInfo({
        variables: {
          submissionId: submissionOrApplication?.id,
        },
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionOrApplication]);

  const handleCloseAll = () => {
    handleClose();
    setShowPaymentModal(false);
  };

  const canPay = permissions.includes(PERMISSIONS.APPROVE_PAYMENT) || permissions.includes(PERMISSIONS.FULL_ACCESS);

  const isBountyOrGrantApplication =
    taskOrGrant?.type === ENTITIES_TYPES.BOUNTY || entityType === ENTITIES_TYPES.GRANT_APPLICATION;
  let displayEntity = 'Task';
  if (taskOrGrant?.type === ENTITIES_TYPES.BOUNTY) {
    displayEntity = 'Bounty';
  } else if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
    displayEntity = 'Grant';
  }

  const paymentInfo: SubmissionPaymentInfo =
    submissionPaymentInfo?.getSubmissionPaymentInfo || grantApplicationPaymentInfo?.getGrantApplicationPaymentInfo;

  if (!paymentInfo) {
    return null;
  }
  if (!canPay) {
    return null;
  }
  const reward = taskOrGrant?.reward || (taskOrGrant?.rewards?.length ? taskOrGrant?.rewards[0] : null);

  return (
    // <Modal open={open} onClose={handleCloseAll}>
    //   <PaymentModal>
    //     <PaymentModalHeader>
    //       <PodNameTypography style={GoBackStyle} onClick={handleGoBack}>
    //         Back to {displayEntity}
    //       </PodNameTypography>
    //     </PaymentModalHeader>
    //     <PaymentTitleDiv>
    //       <PaymentTitleTextDiv>
    //         <PaymentTitleText>
    //           Payout
    //           <span style={{ color: palette.blue20 }}>
    //             {' '}
    //             {rewardAmount} {taskOrGrant?.rewards[0]?.tokenName?.toUpperCase()}{' '}
    //           </span>
    //           to{' '}
    //           {entityType === ENTITIES_TYPES.GRANT_APPLICATION ? (
    //             <Link
    //               href={`/grantApplication/${submissionOrApplication?.id}`}
    //               style={{
    //                 color: '#ffffff',
    //                 textDecoration: 'underline',
    //                 cursor: 'pointer',
    //               }}
    //               target="_blank"
    //             >
    //               {submissionOrApplication?.title}
    //             </Link>
    //           ) : (
    //             <Link
    //               href={`/profile/${submissionOrApplication?.creator?.id}/about`}
    //               style={{
    //                 color: '#ffffff',
    //                 textDecoration: 'underline',
    //                 cursor: 'pointer',
    //               }}
    //               target="_blank"
    //             >
    //               {submissionOrApplication?.creator?.username}
    //             </Link>
    //           )}
    //         </PaymentTitleText>
    //         <PaymentDescriptionText>
    //           {displayEntity}: {taskOrGrant?.title}
    //         </PaymentDescriptionText>
    //         {isBountyOrGrantApplication && changeRewardAmount ? (
    //           <>
    //             <ChangePaymentAmountDiv>
    //               <InputForm
    //                 style={{
    //                   marginTop: '12px',
    //                   width: 'fit-content',
    //                   paddingRight: '12px',
    //                 }}
    //                 type="number"
    //                 min="0"
    //                 placeholder="Enter new reward amount"
    //                 search={false}
    //                 value={changedRewardAmount}
    //                 onChange={(e) => setChangedRewardAmount(e.target.value)}
    //               />
    //               <PaymentDescriptionText
    //                 style={{
    //                   marginLeft: '12px',
    //                   marginTop: '12px',
    //                 }}
    //               >
    //                 {taskOrGrant?.rewards[0]?.tokenName?.toUpperCase()}{' '}
    //               </PaymentDescriptionText>
    //               <SaveNewRewardAmountButton
    //                 onClick={() => {
    //                   const bigChangedRewardAmount = new BigNumber(changedRewardAmount);
    //                   const initialBigRewardAmount = new BigNumber(taskOrGrant?.rewards[0]?.rewardAmount);
    //                   if (bigChangedRewardAmount.isLessThan(initialBigRewardAmount)) {
    //                     setChangeRewardErrorText('New reward must be greater than minimum');
    //                   } else {
    //                     setRewardAmount(changedRewardAmount);
    //                     setChangeRewardAmount(false);
    //                     setUserChangedRewardAmount(true);
    //                   }
    //                 }}
    //               >
    //                 Save changes
    //               </SaveNewRewardAmountButton>
    //               <CancelNewRewardAmountButton
    //                 onClick={() => {
    //                   setChangeRewardAmount(false);
    //                 }}
    //               >
    //                 Cancel
    //               </CancelNewRewardAmountButton>
    //             </ChangePaymentAmountDiv>
    //             <ErrorText>{changeRewardErrorText}</ErrorText>
    //           </>
    //         ) : (
    //           <ChangePaymentButton onClick={() => setChangeRewardAmount(true)}>
    //             Change payment amount
    //           </ChangePaymentButton>
    //         )}
    //       </PaymentTitleTextDiv>
    //     </PaymentTitleDiv>
    //     <StyledTabs value={selectedTab}>
    //       {PAYMENT_TABS.map((tab) => (
    //         <Tab
    //           style={{
    //             color: 'white !important',
    //           }}
    //           value={tab.name}
    //           key={tab.name}
    //           label={tab.label}
    //           onClick={tab.action}
    //         />
    //       ))}
    //     </StyledTabs>
    //     <PaymentMethodWrapper>
    //       {selectedTab === 'off_platform' && (
    //         <OfflinePayment
    //           handleClose={handleCloseAll}
    //           submissionOrApplicationId={submissionOrApplication?.id}
    //           paymentData={paymentInfo?.paymentData[0]}
    //           entityType={entityType}
    //         />
    //       )}
    //       {selectedTab === 'wallet' && (
    //         <SingleWalletPayment
    //           submissionOrApplicationId={submissionOrApplication?.id}
    //           wallets={wallets}
    //           paymentData={paymentInfo?.paymentData[0]}
    //           orgId={submissionOrApplication?.orgId}
    //           podId={submissionOrApplication?.podId}
    //           changedRewardAmount={userChangedRewardAmount ? rewardAmount : null}
    //           parentError={submissionPaymentError}
    //           entityType={entityType}
    //           reward={taskOrGrant?.reward}
    //         />
    //       )}
    //     </PaymentMethodWrapper>
    //   </PaymentModal>
    // </Modal>
    <Modal
      open={open}
      maxWidth={620}
      title="Payment"
      onClose={handleCloseAll}
      footerRight={<div ref={footerRef} />}
      footerLeft={<div ref={footerLeftRef} />}
    >
      <GradientHeading fontSize={24}>Payout</GradientHeading>
      <Grid display="flex" direction="column" gap="24px">
        <PaymentDetails
          rewardAmount={rewardAmount}
          setRewardAmount={setRewardAmount}
          tokenName={reward?.tokenName}
          payee={{
            profilePicture: submissionOrApplication?.creator?.profilePicture,
            username: submissionOrApplication?.creator?.username,
          }}
          error={changeRewardErrorText}
        />
        <Divider />
        <PaymentMethod
          submissionOrApplicationId={submissionOrApplication?.id}
          wallets={wallets}
          paymentData={paymentInfo?.paymentData[0]}
          ref={footerRef}
          onClose={handleCloseAll}
          orgId={submissionOrApplication?.orgId}
          podId={submissionOrApplication?.podId}
          changedRewardAmount={userChangedRewardAmount ? rewardAmount : null}
          parentError={submissionPaymentError}
          entityType={entityType}
          reward={taskOrGrant?.reward}
        />
      </Grid>
    </Modal>
  );
}

export default MakePaymentModal;
