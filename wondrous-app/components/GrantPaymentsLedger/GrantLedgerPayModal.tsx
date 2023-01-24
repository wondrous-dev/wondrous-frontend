import React, { useCallback, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Tab from '@mui/material/Tab';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_GRANT_APPLICATION_PAYMENT_INFO } from 'graphql/queries/payment';
import { useRouter } from 'next/router';
import { GrantApplicationPaymentInfo } from 'components/Common/Payment/types';
import { useGetOrgOrPodWallet, useSelectedTab } from 'components/Common/Payment/helper';
import { GrantPaymentSelected } from 'components/Settings/Payouts/types';
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
} from 'components/Common/Payment/styles';
import { ENTITIES_TYPES } from 'utils/constants';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}
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

  const router = useRouter();
  const { selectedTab, PAYMENT_TABS } = useSelectedTab();
  const wallets = useGetOrgOrPodWallet(podId, orgId);

  const [getGrantApplicationPaymentInfo, { data: applicationPaymentInfo }] = useLazyQuery(
    GET_GRANT_APPLICATION_PAYMENT_INFO,
    {
      onError: (err) => {},
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
              to {paymentSelected?.paymentAddress}
            </PaymentTitleText>
            <PaymentDescriptionText>Grant Application: {paymentSelected?.grantApplicationTitle}</PaymentDescriptionText>
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
              submissionOrApplicationId={paymentSelected?.grantApplicationId}
              paymentData={paymentInfo?.paymentData[0]}
              handleClose={() => {
                const query = {
                  view: ViewType.Paid,
                };

                router.push({ query }, undefined, { scroll: false, shallow: true });
                handleClose();
              }}
              entityType={ENTITIES_TYPES.GRANT_APPLICATION}
            />
          )}
          {selectedTab === 'wallet' && (
            <SingleWalletPayment
              submissionOrApplicationId={paymentSelected?.grantApplicationId}
              wallets={wallets}
              paymentData={paymentInfo?.paymentData[0]}
              orgId={orgId}
              podId={podId}
              reward={{
                rewardAmount: paymentSelected?.amount,
                symbol: paymentSelected?.symbol,
              }}
              entityType={ENTITIES_TYPES.GRANT_APPLICATION}
            />
          )}
        </PaymentMethodWrapper>
      </PaymentModal>
    </Modal>
  );
}

export default GrantLedgerPayModal;
