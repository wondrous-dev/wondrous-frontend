import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { HeaderBlock } from '../headerBlock';

import { CircularProgress } from '@material-ui/core';
import UserCheckIcon from '../../Icons/userCheckIcon';
import { useRouter } from 'next/router';
import { PaymentMethodDisplayWrapper, PaymentMethodNameHeader } from './styles';
import {
  TokenLogoDisplay,
} from 'components/Settings/TokenGating/styles';

const PaymentMethodDisplay = (props) => {
  const { paymentMethod } = props;
  return (
    <PaymentMethodDisplayWrapper>
      <div style={{ display: 'flex' }}>
        <TokenLogoDisplay src={paymentMethod?.icon}/>
        <PaymentMethodNameHeader>Token Name: {paymentMethod?.tokenName}</PaymentMethodNameHeader>
        <PaymentMethodNameHeader style={{ marginLeft: '30px' }}>Chain: {paymentMethod?.chain}</PaymentMethodNameHeader>
        <PaymentMethodNameHeader style={{ marginLeft: '30px' }}>Symbol: {paymentMethod?.symbol}</PaymentMethodNameHeader>
      </div>
      {paymentMethod?.tokenAddress && paymentMethod?.tokenAddress !== '0x0000000000000000000000000000000000000000' && (
        <PaymentMethodNameHeader>Token Address: {paymentMethod?.tokenAddress}</PaymentMethodNameHeader>
      )}
    </PaymentMethodDisplayWrapper>
  );
};

const PaymentMethodList = (props) => {
  const router = useRouter();
  const { paymentMethods } = props;

  return (
    <div>
      {paymentMethods &&
        paymentMethods.map((paymentMethod) => {
          return <PaymentMethodDisplay key={paymentMethod.id} paymentMethod={paymentMethod} />;
        })}
    </div>
  );
};

export default PaymentMethodList;
