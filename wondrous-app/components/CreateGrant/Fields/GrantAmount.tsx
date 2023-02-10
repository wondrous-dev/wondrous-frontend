import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import Grid from '@mui/material/Grid';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { InfoPoint, TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
import { StyledLink } from 'components/Common/text';
import {
  CreateEntityPaymentMethodItem,
  filterPaymentMethods,
  useGetPaymentMethods
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon, CreateEntityError, CreateEntityLabel,
  CreateEntityLabelWrapper, CreateEntityPaymentMethodOption, CreateEntityPaymentMethodSelected,
  CreateEntitySelectArrowIcon, CreateEntityWrapper
} from 'components/CreateEntity/CreateEntityModal/styles';
import { GRANT_STYLE_MAP } from './GrantStyle';
import { GrantChainSelect, GrantTextField, GrantTextFieldInput } from './styles';

const GrantAmount = ({
  value,
  onChange = (key, val) => {},
  orgId,
  setError = (key, val) => {},
  error = null,
  disablePaymentSelect = false,
  disableAmountOfRewards = false,
  disableInput = false,
  grantStyle = null,
  numOfGrant = null,
}) => {
  const router = useRouter();
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated

  useEffect(() => {
    if (activePaymentMethods?.length && !value?.paymentMethodId) {
      onChange('reward', { ...value, paymentMethodId: activePaymentMethods[0].id });
    }
  }, [activePaymentMethods?.length]);

  const handlePaymentMethodRedirect = () => {
    router.push(`/organization/settings/${orgId}/payment-method`);
  };

  const label = grantStyle === GRANT_STYLE_MAP.FIXED ? 'Grant amount' : 'Grant total';

  const helperInfo = useMemo(() => {
    if (value.rewardAmount && grantStyle) {
      const paymentMethod = activePaymentMethods?.find((method) => method.id === value.paymentMethodId);
      if (grantStyle === GRANT_STYLE_MAP.FIXED) {
        return `You are granting ${numOfGrant} x ${value.rewardAmount} ${paymentMethod?.symbol} = ${
          parseInt(value.rewardAmount) * numOfGrant
        } ${paymentMethod?.symbol}`;
      }
      return `You are granting from a pool ${value.rewardAmount} ${paymentMethod?.symbol}`;
    }
  }, [grantStyle, value.rewardAmount, numOfGrant, activePaymentMethods, value.paymentMethodId]);

  
  return (
    <TaskSectionDisplayDiv alignItems="start">
      {activePaymentMethods?.length === 0 && (
        <StyledLink onClick={handlePaymentMethodRedirect} style={{ cursor: 'pointer' }}>
          Set up payment method
        </StyledLink>
      )}
      {activePaymentMethods?.length > 0 && (
        <>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>{label}</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntityWrapper>
            <Grid display="flex" direction="column" gap="4px" width="100%">
              <Grid display="flex" gap="6px">
                <GrantChainSelect
                  name="rewards-payment-method"
                  value={value.paymentMethodId}
                  disabled={disablePaymentSelect}
                  onChange={(paymentMethodValue) => {
                    onChange('reward', { ...value, paymentMethodId: paymentMethodValue });
                  }}
                  renderValue={(selectedItem) => {
                    if (!selectedItem?.label?.props) return null;
                    return (
                      <CreateEntityPaymentMethodSelected>
                        <CreateEntityPaymentMethodItem
                          icon={selectedItem.label.props.icon}
                          symbol={selectedItem.label.props.symbol}
                          chain={null}
                        />
                        {!disablePaymentSelect ? <CreateEntitySelectArrowIcon /> : null}
                      </CreateEntityPaymentMethodSelected>
                    );
                  }}
                >
                  {activePaymentMethods.map(({ symbol, icon, id, chain }) => (
                    <CreateEntityPaymentMethodOption key={id} value={id}>
                      <CreateEntityPaymentMethodItem icon={icon} symbol={symbol} chain={chain} />
                    </CreateEntityPaymentMethodOption>
                  ))}
                </GrantChainSelect>
                <GrantTextField
                  autoComplete="off"
                  readOnly={disableInput}
                  autoFocus={!value.rewardAmount}
                  name="rewardAmount"
                  onChange={(e) => {
                    onChange('reward', { ...value, rewardAmount: e.target.value });
                  }}
                  placeholder="Enter grant amount"
                  value={value.rewardAmount}
                  fullWidth
                  InputProps={{
                    inputComponent: GrantTextFieldInput,
                    type: 'number',
                    disabled: disableInput,
                    endAdornment: !disableInput && (
                      <CreateEntityAutocompletePopperRenderInputAdornment
                        position="end"
                        onClick={() => onChange('reward', { ...value, rewardAmount: '' })}
                      >
                        <CreateEntityAutocompletePopperRenderInputIcon />
                      </CreateEntityAutocompletePopperRenderInputAdornment>
                    ),
                  }}
                  error={error}
                  onFocus={() => setError('reward', undefined)}
                />
              </Grid>
              {helperInfo ? <InfoPoint>{helperInfo}</InfoPoint> : null}
              {error?.rewardAmount ? <CreateEntityError>{error.rewardAmount}</CreateEntityError> : null}
            </Grid>
          </CreateEntityWrapper>
        </>
      )}
    </TaskSectionDisplayDiv>
  );
};

export default GrantAmount;
