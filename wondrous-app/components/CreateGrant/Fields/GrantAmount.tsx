import { useEffect } from 'react';
import {
  CreateEntityPaymentMethodItem,
  filterPaymentMethods,
  useGetPaymentMethods,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityWrapper,
  CreateEntityPaymentMethodSelected,
  CreateEntitySelectArrowIcon,
  CreateEntityPaymentMethodOption,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityLabel,
  CreateEntityLabelWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
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
  numOfGrant = null,
}) => {
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated

  useEffect(() => {
    if (activePaymentMethods?.length && !value?.paymentMethodId) {
      onChange('reward', { ...value, paymentMethodId: activePaymentMethods[0].id });
    }
  }, [activePaymentMethods?.length]);

  return (
    <TaskSectionDisplayDiv alignItems="start">
      {activePaymentMethods?.length > 0 && (
        <>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Grant amount</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntityWrapper>
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
              placeholder="Enter value"
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
              error={error?.reward?.rewardAmount}
              onFocus={() => setError('reward', undefined)}
            />
            {!disableAmountOfRewards && (
              <GrantTextField
                autoComplete="off"
                autoFocus={!numOfGrant}
                name="amount"
                onChange={(e) => onChange('numOfGrant', e.target.value)}
                placeholder="x amount"
                value={numOfGrant}
                fullWidth
                InputProps={{
                  inputComponent: GrantTextFieldInput,
                  type: 'number',

                  endAdornment: (
                    <CreateEntityAutocompletePopperRenderInputAdornment
                      position="end"
                      onClick={() => onChange('numOfGrant', '')}
                    >
                      <CreateEntityAutocompletePopperRenderInputIcon />
                    </CreateEntityAutocompletePopperRenderInputAdornment>
                  ),
                }}
                error={error?.numOfGrant}
                onFocus={() => setError('numOfGrant', undefined)}
              />
            )}
          </CreateEntityWrapper>
        </>
      )}
    </TaskSectionDisplayDiv>
  );
};

export default GrantAmount;
