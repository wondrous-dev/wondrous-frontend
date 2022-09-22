import React from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import format from 'date-fns/format';
import { Grid, Typography } from '@mui/material';

import { ACTIVATE_PAYMENT_METHOD, DEACTIVATE_PAYMENT_METHOD } from 'graphql/mutations/payment';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';

import { TaskMenuIcon } from 'components/Icons/taskMenu';
import Dropdown from 'components/Common/Dropdown';
import DropdownItem from 'components/Common/DropdownItem';
import WalletIcon from 'components/Icons/WalletIcon';
import CalendarIcon from 'components/Icons/calendar';
import { EmptyStatePaymentMethodIcon } from 'components/Icons/emptyStates';
import palette from 'theme/palette';

import {
  PaymentMethodDisplayWrapper,
  PaymentMethodActionMenu,
  TokenLogoDisplay,
  PaymentMethodTokenDetailsWrapper,
  PaymentMethodTokenInfo,
  PaymentMethodTokenInfoLabel,
  PaymentMethodTokenInfoValue,
  PaymentMethodTokenInfoValueText,
  PaymentMethodTokenMetadataWrapper,
  PaymentMethodEmptyStateContainer,
  HelpText,
  PaymentMethodTokenDetails,
} from './styles';

const dropdownItemStyle = {
  marginRight: '12px',
  color: palette.white,
};

function PaymentMethodDisplay(props) {
  const { paymentMethod } = props;

  const isPaymentMethodDisabled = !!paymentMethod?.deactivatedAt;

  const [deactivatePaymentMethod] = useMutation(DEACTIVATE_PAYMENT_METHOD, {
    refetchQueries: [GET_PAYMENT_METHODS_FOR_ORG],
  });

  const [activatePaymentMethod] = useMutation(ACTIVATE_PAYMENT_METHOD, {
    refetchQueries: [GET_PAYMENT_METHODS_FOR_ORG],
  });

  const handleDeactivate = () => {
    deactivatePaymentMethod({
      variables: {
        paymentMethodId: paymentMethod?.id,
      },
    });
  };

  const handleActivate = () => {
    activatePaymentMethod({
      variables: {
        paymentMethodId: paymentMethod?.id,
      },
    });
  };

  return (
    <PaymentMethodDisplayWrapper>
      <PaymentMethodTokenDetailsWrapper>
        <Grid display="flex" alignItems="center" justifyContent="space-between">
          <PaymentMethodTokenDetails isDisabled={isPaymentMethodDisabled}>
            <PaymentMethodTokenInfo>
              <PaymentMethodTokenInfoLabel>Token</PaymentMethodTokenInfoLabel>
              <PaymentMethodTokenInfoValue>
                <TokenLogoDisplay src={paymentMethod?.icon} />
                <PaymentMethodTokenInfoValueText>{paymentMethod?.tokenName}</PaymentMethodTokenInfoValueText>
              </PaymentMethodTokenInfoValue>
            </PaymentMethodTokenInfo>
            <PaymentMethodTokenInfo>
              <PaymentMethodTokenInfoLabel>Chain</PaymentMethodTokenInfoLabel>
              <PaymentMethodTokenInfoValue>
                <PaymentMethodTokenInfoValueText>{paymentMethod?.chain}</PaymentMethodTokenInfoValueText>
              </PaymentMethodTokenInfoValue>
            </PaymentMethodTokenInfo>
            <PaymentMethodTokenInfo>
              <PaymentMethodTokenInfoLabel>Symbol</PaymentMethodTokenInfoLabel>
              <PaymentMethodTokenInfoValue>
                <TokenLogoDisplay src={paymentMethod?.icon} />
                <PaymentMethodTokenInfoValueText uppercase>{paymentMethod?.symbol}</PaymentMethodTokenInfoValueText>
              </PaymentMethodTokenInfoValue>
            </PaymentMethodTokenInfo>
          </PaymentMethodTokenDetails>

          <PaymentMethodActionMenu right="true">
            <Dropdown
              DropdownHandler={() => (
                <TaskMenuIcon fill={palette.black92} fillOnHover={palette.black60} stroke={palette.grey57} />
              )}
            >
              {isPaymentMethodDisabled && (
                <DropdownItem
                  key={`payment-method-activate${paymentMethod?.id}`}
                  onClick={handleActivate}
                  style={dropdownItemStyle}
                >
                  Activate
                </DropdownItem>
              )}
              {!isPaymentMethodDisabled && (
                <DropdownItem
                  key={`payment-method-deactivate${paymentMethod?.id}`}
                  style={dropdownItemStyle}
                  onClick={handleDeactivate}
                >
                  Deactivate
                </DropdownItem>
              )}
            </Dropdown>
          </PaymentMethodActionMenu>
        </Grid>

        {paymentMethod?.tokenAddress && paymentMethod?.tokenAddress !== '0x0000000000000000000000000000000000000000' && (
          <PaymentMethodTokenInfo isDisabled={isPaymentMethodDisabled}>
            <PaymentMethodTokenInfoLabel>Token Address</PaymentMethodTokenInfoLabel>
            <PaymentMethodTokenInfoValue>
              <PaymentMethodTokenInfoValueText>{paymentMethod?.tokenAddress}</PaymentMethodTokenInfoValueText>
            </PaymentMethodTokenInfoValue>
          </PaymentMethodTokenInfo>
        )}
      </PaymentMethodTokenDetailsWrapper>
      <PaymentMethodTokenMetadataWrapper isDisabled={isPaymentMethodDisabled}>
        <Grid display="flex" alignItems="center" gap="9px">
          <CalendarIcon stroke={palette.grey250} />
          <Typography fontSize="12px" color={palette.grey250}>
            {format(new Date(paymentMethod?.createdAt), 'dd MMM yyyy')}
          </Typography>
        </Grid>
      </PaymentMethodTokenMetadataWrapper>
    </PaymentMethodDisplayWrapper>
  );
}

function PaymentMethodEmptyState() {
  return (
    <PaymentMethodEmptyStateContainer>
      <EmptyStatePaymentMethodIcon />
      <Typography fontSize="13px" color={palette.grey57}>
        No payment methods yet
      </Typography>
      <HelpText href="mailto:support@wonderverse.xyz">Have an issue?</HelpText>
    </PaymentMethodEmptyStateContainer>
  );
}

function PaymentMethodList(props) {
  const router = useRouter();
  const { paymentMethods } = props;

  return (
    <div>
      <Grid display="flex" alignItems="center" marginTop="35px" gap="11px">
        <WalletIcon />
        <Typography fontSize="16px" fontWeight={500} color={palette.blue20}>
          {paymentMethods?.length} Payment {paymentMethods?.length > 1 ? 'Methods' : 'Method'}
        </Typography>
      </Grid>
      {paymentMethods?.length ? (
        paymentMethods.map((paymentMethod) => (
          <PaymentMethodDisplay key={paymentMethod.id} paymentMethod={paymentMethod} />
        ))
      ) : (
        <PaymentMethodEmptyState />
      )}
    </div>
  );
}

export default PaymentMethodList;
