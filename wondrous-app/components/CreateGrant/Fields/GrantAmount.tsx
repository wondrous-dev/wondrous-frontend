import { useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  CreateEntityPaymentMethodItem,
  filterPaymentMethods,
  useGetPaymentMethods,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import { StyledLink } from 'components/Common/text';
import {
  CreateEntityWrapper,
  CreateEntityPaymentMethodSelected,
  CreateEntitySelectArrowIcon,
  CreateEntityPaymentMethodOption,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityLabel,
  CreateEntityLabelWrapper,
  CreateEntityError,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
import Grid from '@mui/material/Grid';
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

  return (
    <TaskSectionDisplayDiv alignItems="start">
      {/* {activePaymentMethods?.length === 0 && (
        <CreateEntityWrapper>
          <Grid display="flex" direction="column" gap="4px" width="100%">
            <StyledLink onClick={handlePaymentMethodRedirect} style={{ cursor: 'pointer' }}>
              {' '}
              Set up payment method
            </StyledLink>
          </Grid>
        </CreateEntityWrapper>
      )} */}
      {activePaymentMethods?.length > 0 && (
        <>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Grant amount</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntityWrapper>
            <Grid display="flex" direction="column" gap="4px" width="100%">
              <Grid display="flex" gap="6px">
                <GrantChainSelect
                  name="rewards-payment-method"
                  value={value.paymentMethodId}
                  disabled={disablePaymentSelect}
                  onChange={(value) => {
                    onChange('reward', { ...value, paymentMethodId: value });
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
                        <CreateEntitySelectArrowIcon />
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
              {error?.rewardAmount ? <CreateEntityError>{error.rewardAmount}</CreateEntityError> : null}
            </Grid>
          </CreateEntityWrapper>
        </>
      )}
    </TaskSectionDisplayDiv>
  );
};

export default GrantAmount;
