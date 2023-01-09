import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import format from 'date-fns/format';
import CalendarIcon from 'components/Icons/calendar';
import CopyIcon from 'components/Icons/copy';
import { capitalize } from 'utils/common';
import { GET_PAYMENT_BY_ID } from 'graphql/queries/payment';
import { cutString } from 'utils/helpers';

import {
  PaymentViewModalBody,
  PaymentViewModalCard,
  PaymentViewModalFooter,
  PaymentViewFooterButton,
  PaymentViewModalHeaderSection,
  PaymentViewCloseModalIcon,
  PaymentViewModalHeaderText,
  PaymentViewSectionWrapper,
  PaymentViewText,
  PaymentViewTextWrapper,
  PaymentViewSectionLabel,
  PaymentViewModalWrapper,
  RewardTextRightPill,
  RewardTextLefPill,
  RewardText,
  PaymentMediaWrapper,
} from 'components/Common/Payment/PaymentViewModal/styles';
import palette from 'theme/palette';

function PaymentViewModal(props) {
  const { open = false, handleClose = () => {}, paymentId } = props;
  const [getPaymentById, { data: paymentData }] = useLazyQuery(GET_PAYMENT_BY_ID, {
    fetchPolicy: 'cache-and-network',
  });
  const paymentDetails = paymentData?.getPaymentById;
  const paymentLink =
    paymentDetails?.additionalData?.manualExplorerLink || paymentDetails?.additionalData?.explorerLink;

  useEffect(() => {
    getPaymentById({
      variables: {
        paymentId,
      },
    });
  }, [paymentId]);

  return (
    <PaymentViewModalWrapper open={open} onClose={handleClose} closeAfterTransition>
      <PaymentViewModalCard>
        <PaymentViewModalHeaderSection>
          <PaymentViewModalHeaderText>Payment Detail</PaymentViewModalHeaderText>
          <PaymentViewCloseModalIcon onClick={handleClose} />
        </PaymentViewModalHeaderSection>
        <PaymentViewModalBody>
          <PaymentViewSectionWrapper>
            <PaymentViewSectionLabel>Receipient</PaymentViewSectionLabel>
            <PaymentViewTextWrapper>
              <PaymentViewText>{paymentDetails?.payee?.username}</PaymentViewText>
            </PaymentViewTextWrapper>
          </PaymentViewSectionWrapper>
          <PaymentViewSectionWrapper>
            <PaymentViewSectionLabel>Amount Paid</PaymentViewSectionLabel>
            <div style={{ display: 'flex' }}>
              <RewardTextLefPill>
                <RewardText>
                  {paymentDetails?.amount} {paymentDetails?.paymentMethod?.symbol}{' '}
                </RewardText>
              </RewardTextLefPill>
              <RewardTextRightPill>
                <RewardText>{capitalize(paymentDetails?.paymentMethod?.chain)}</RewardText>
              </RewardTextRightPill>
            </div>
          </PaymentViewSectionWrapper>
          {paymentDetails?.payedAt && (
            <PaymentViewSectionWrapper>
              <PaymentViewSectionLabel>Date</PaymentViewSectionLabel>
              <PaymentViewTextWrapper>
                <CalendarIcon />
                <PaymentViewText>{format(new Date(paymentDetails?.payedAt), 'MM-dd-yy')} </PaymentViewText>
              </PaymentViewTextWrapper>
            </PaymentViewSectionWrapper>
          )}
          {paymentDetails?.recipientAddress && (
            <PaymentViewSectionWrapper>
              <PaymentViewSectionLabel>Receipient Address</PaymentViewSectionLabel>
              <PaymentViewTextWrapper>
                <CalendarIcon />
                <PaymentViewText>{paymentDetails?.recipientAddress} </PaymentViewText>
              </PaymentViewTextWrapper>
            </PaymentViewSectionWrapper>
          )}
          {paymentLink && (
            <PaymentViewSectionWrapper>
              <PaymentViewSectionLabel>Link</PaymentViewSectionLabel>
              <PaymentViewTextWrapper>
                <PaymentViewText>{cutString(paymentLink)} </PaymentViewText>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    navigator.clipboard.writeText(paymentLink);
                  }}
                >
                  <CopyIcon color={palette.blue20} />
                </div>
              </PaymentViewTextWrapper>
            </PaymentViewSectionWrapper>
          )}
          {paymentDetails?.media && paymentDetails?.media.length > 0 && (
            <PaymentViewSectionWrapper>
              <PaymentMediaWrapper media={paymentDetails?.media} />
            </PaymentViewSectionWrapper>
          )}
        </PaymentViewModalBody>
        <PaymentViewModalFooter>
          <PaymentViewFooterButton onClick={handleClose}>Close</PaymentViewFooterButton>
        </PaymentViewModalFooter>
      </PaymentViewModalCard>
    </PaymentViewModalWrapper>
  );
}

export default PaymentViewModal;
