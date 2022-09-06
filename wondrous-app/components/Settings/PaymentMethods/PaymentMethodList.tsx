import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { useRouter } from 'next/router';
import palette from 'theme/palette';
import { DEACTIVATE_PAYMENT_METHOD } from 'graphql/mutations/payment';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';

import { TaskMenuIcon } from 'components/Icons/taskMenu';
import { DropDown, DropDownItem } from 'components/Common/dropdown';
import { PaymentMethodDisplayWrapper, PaymentMethodNameHeader, PaymentMethodActionMenu, TokenLogoDisplay } from './styles';

const dropdownItemStyle = {
  marginRight: '12px',
  color: palette.white,
};

function PaymentMethodDisplay(props) {
  const { paymentMethod } = props;
  const [deactivatePaymentMethod] = useMutation(DEACTIVATE_PAYMENT_METHOD, {
    refetchQueries: [GET_PAYMENT_METHODS_FOR_ORG],
  });
  const handleDeactivate = () => {
    deactivatePaymentMethod({
      variables: {
        paymentMethodId: paymentMethod.id,
      },
    });
  };
  return (
    <PaymentMethodDisplayWrapper>
      <div style={{ display: 'flex' }}>
        <TokenLogoDisplay src={paymentMethod?.icon} />
        <PaymentMethodNameHeader>Token Name: {paymentMethod?.tokenName}</PaymentMethodNameHeader>
        <PaymentMethodNameHeader style={{ marginLeft: '30px' }}>Chain: {paymentMethod?.chain}</PaymentMethodNameHeader>
        <PaymentMethodNameHeader style={{ marginLeft: '30px' }}>
          Symbol: {paymentMethod?.symbol}
        </PaymentMethodNameHeader>
        <PaymentMethodNameHeader style={{ marginLeft: '30px' }}>
          Active: {paymentMethod?.deactivatedAt ? 'False' : 'True'}
        </PaymentMethodNameHeader>
        <PaymentMethodActionMenu right="true">
          <DropDown DropdownHandler={TaskMenuIcon}>
            {paymentMethod?.deactivatedAt && (
              <DropDownItem
                key={`payment-method-activate${paymentMethod?.id}`}
                onClick={() => {}}
                style={dropdownItemStyle}
              >
                Activate
              </DropDownItem>
            )}
            {!paymentMethod?.deactivatedAt && (
              <DropDownItem
                key={`payment-method-deactivate${paymentMethod?.id}`}
                style={dropdownItemStyle}
                onClick={handleDeactivate}
              >
                Deactivate
              </DropDownItem>
            )}
          </DropDown>
        </PaymentMethodActionMenu>
      </div>
      {paymentMethod?.tokenAddress && paymentMethod?.tokenAddress !== '0x0000000000000000000000000000000000000000' && (
        <PaymentMethodNameHeader>Token Address: {paymentMethod?.tokenAddress}</PaymentMethodNameHeader>
      )}
    </PaymentMethodDisplayWrapper>
  );
}

function PaymentMethodList(props) {
  const router = useRouter();
  const { paymentMethods } = props;

  return (
    <div>
      {paymentMethods &&
        paymentMethods.map((paymentMethod) => (
          <PaymentMethodDisplay key={paymentMethod.id} paymentMethod={paymentMethod} />
        ))}
    </div>
  );
}

export default PaymentMethodList;
