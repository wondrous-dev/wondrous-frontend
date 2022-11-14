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
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
import { GrantChainSelect, GrantTextField, GrantTextFieldInput } from './styles';

const GrantAmount = ({
  value,
  onChange,
  orgId,
  onReset,
  onFocus,
  error,
  disablePaymentSelect = false,
  disableAmountOfRewards = false,
}) => {
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated

  console.log(activePaymentMethods, value?.paymentMethodId);
  useEffect(() => {
    if (activePaymentMethods?.length && !value?.paymentMethodId) {
      onChange('paymentMethodId', activePaymentMethods[0].id);
    }
  }, [activePaymentMethods?.length]);

  return (
    <TaskSectionDisplayDiv alignItems="start">
      {activePaymentMethods?.length > 0 && (
        <CreateEntityLabelSelectWrapper show>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Grant amount</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntityWrapper>
            <GrantChainSelect
              name="rewards-payment-method"
              value={value.paymentMethodId}
              disabled={disablePaymentSelect}
              onChange={(value) => onChange('paymentMethodId', value)}
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
              autoFocus={!value.rewardAmount}
              name="rewardAmount"
              onChange={(e) => {
                onChange('rewardAmount', e.target.value);
              }}
              placeholder="Enter value"
              value={value.rewardAmount}
              fullWidth
              InputProps={{
                inputComponent: GrantTextFieldInput,
                type: 'number',
                endAdornment: (
                  <CreateEntityAutocompletePopperRenderInputAdornment position="end" onClick={() => onReset()}>
                    <CreateEntityAutocompletePopperRenderInputIcon />
                  </CreateEntityAutocompletePopperRenderInputAdornment>
                ),
              }}
              error={error?.rewardAmount}
              onFocus={onFocus}
            />
            {!disableAmountOfRewards && (
              <GrantTextField
                autoComplete="off"
                autoFocus={!value.amount}
                name="amount"
                onChange={(e) => onChange('amount', e.target.value)}
                placeholder="x amount"
                value={value.amount}
                fullWidth
                InputProps={{
                  inputComponent: GrantTextFieldInput,
                  type: 'number',

                  endAdornment: (
                    <CreateEntityAutocompletePopperRenderInputAdornment
                      position="end"
                      onClick={
                        () => onReset()
                        // form.setFieldValue('rewards', []);
                      }
                    >
                      <CreateEntityAutocompletePopperRenderInputIcon />
                    </CreateEntityAutocompletePopperRenderInputAdornment>
                  ),
                }}
                error={error?.amount}
                onFocus={onFocus}
              />
            )}
          </CreateEntityWrapper>
        </CreateEntityLabelSelectWrapper>
      )}
    </TaskSectionDisplayDiv>
  );
};

export default GrantAmount;
