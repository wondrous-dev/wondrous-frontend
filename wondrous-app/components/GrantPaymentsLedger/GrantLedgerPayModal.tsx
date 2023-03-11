import React, { useMemo, useEffect, useState, useRef } from 'react';
import { GRAPHQL_ERRORS, PERMISSIONS, ENTITIES_TYPES } from 'utils/constants';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_GRANT_APPLICATION_PAYMENT_INFO } from 'graphql/queries/payment';
import { GrantApplicationPaymentInfo } from 'components/Common/Payment/types';
import { useGetOrgOrPodWallet } from 'components/Common/Payment/helper';
import { GrantPaymentSelected } from 'components/Settings/Payouts/types';
import { PaymentDescriptionText } from 'components/Common/Payment/styles';
import { Modal } from 'components/Modal';
import GradientHeading from 'components/GradientHeading';
import Divider from 'components/Divider';
import Grid from '@mui/material/Grid';
import { BigNumber } from 'bignumber.js';
import PaymentDetails from 'components/Common/Payment/Fields/PaymentDetails';
import PaymentMethodSelector from 'components/Common/Payment/Fields/PaymentMethodSelector';

interface Props {
  orgId?: string;
  podId?: string;
  open: boolean;
  handleClose: () => void;
  paymentSelected: GrantPaymentSelected;
}

function GrantLedgerPayModal(props: Props) {
  // used for payment ledger, different from MakePaymentModal because availabel data is different
  const { podId, orgId, open, handleClose, paymentSelected } = props;
  const footerRef = useRef();
  const footerLeftRef = useRef();
  const [rewardAmount, setRewardAmount] = useState(null);
  const [grantPaymentError, setGrantPaymentError] = useState(null);
  const [changeRewardErrorText, setChangeRewardErrorText] = useState('');

  const wallets = useGetOrgOrPodWallet(podId, orgId);

  const [getGrantApplicationPaymentInfo, { data: applicationPaymentInfo }] = useLazyQuery(
    GET_GRANT_APPLICATION_PAYMENT_INFO,
    {
      onError: (err) => {
        setGrantPaymentError('Error fetching payment info');
      },
      fetchPolicy: 'network-only',
    }
  );
  const paymentInfo: GrantApplicationPaymentInfo = applicationPaymentInfo?.getGrantApplicationPaymentInfo;

  useEffect(() => {
    if (paymentSelected?.grantApplicationId) {
      getGrantApplicationPaymentInfo({
        variables: {
          grantApplicationId: paymentSelected?.grantApplicationId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSelected?.grantApplicationId]);

  useEffect(() => {
    setRewardAmount(paymentSelected?.amount);
  }, [paymentSelected?.amount]);

  const rewardAmountChanged = useMemo(
    () => paymentSelected?.amount !== rewardAmount,
    [paymentSelected?.amount, rewardAmount]
  );

  const handleRewardAmountChange = (e) => {
    const bigChangedRewardAmount = new BigNumber(e.target.value);
    const initialBigRewardAmount = new BigNumber(paymentSelected?.amount);
    const rewardIsSmaller = bigChangedRewardAmount.isLessThan(initialBigRewardAmount);
    if (rewardIsSmaller) {
      setChangeRewardErrorText('New reward must be greater than minimum');
    } else if (!rewardIsSmaller && changeRewardErrorText) {
      setChangeRewardErrorText('');
    }
    setRewardAmount(e.target.value);
  };

  return (
    <Modal
      open={open}
      maxWidth={620}
      title="Payment"
      onClose={handleClose}
      footerRight={<div ref={footerRef} />}
      footerLeft={<div ref={footerLeftRef} />}
    >
      <GradientHeading fontSize={24}>Payment for </GradientHeading>
      <PaymentDescriptionText>Grant Application: {paymentSelected?.grantApplicationTitle}</PaymentDescriptionText>

      <Grid display="flex" direction="column" gap="24px">
        <PaymentDetails
          rewardAmount={rewardAmount}
          onChange={handleRewardAmountChange}
          tokenName={paymentSelected?.symbol}
          paymentData={paymentInfo?.paymentData[0]}
          entityType={ENTITIES_TYPES.GRANT_APPLICATION}
          error={changeRewardErrorText}
        />
        <Divider />
        <PaymentMethodSelector
          submissionOrApplicationId={paymentSelected?.grantApplicationId}
          wallets={wallets}
          paymentData={paymentInfo?.paymentData[0]}
          ref={footerRef}
          onClose={handleClose}
          orgId={paymentSelected?.orgId}
          podId={paymentSelected?.podId}
          changedRewardAmount={rewardAmountChanged ? rewardAmount : null}
          parentError={grantPaymentError}
          entityType={ENTITIES_TYPES.GRANT_APPLICATION}
          reward={{
            rewardAmount: paymentSelected?.amount,
            symbol: paymentSelected?.symbol,
          }}
        />
      </Grid>
    </Modal>
  );
}

export default GrantLedgerPayModal;
