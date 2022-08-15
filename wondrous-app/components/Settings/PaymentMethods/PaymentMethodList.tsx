import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { TokenLogoDisplay } from 'components/Settings/TokenGating/styles';
import palette from 'theme/palette';
import { HeaderBlock } from '../headerBlock';

import UserCheckIcon from '../../Icons/userCheckIcon';
import { DropDown, DropDownItem } from '../../Common/dropdown';
import { PaymentMethodDisplayWrapper, PaymentMethodNameHeader, PaymentMethodActionMenu } from './styles';
import { TaskMenuIcon } from '../../Icons/taskMenu';

const dropdownItemStyle = {
  marginRight: '12px',
  color: palette.white,
};

function PaymentMethodDisplay(props) {
  const { paymentMethod } = props;
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
              <DropDownItem key={`payment-method-deactivate${paymentMethod?.id}`} style={dropdownItemStyle}>
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
