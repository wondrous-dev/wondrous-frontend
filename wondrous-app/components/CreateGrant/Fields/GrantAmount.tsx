import Dropdown from 'components/Common/Dropdown';
import DropdownItem from 'components/Common/DropdownItem';
import {
  CreateEntityPaymentMethodItem,
  handleRewardOnChange,
  CreateEntityTextfieldInputRewardComponent,
  filterPaymentMethods,
  useGetPaymentMethods,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityWrapper,
  CreateEntityPaymentMethodSelect,
  CreateEntityPaymentMethodSelected,
  CreateEntitySelectArrowIcon,
  CreateEntityPaymentMethodOption,
  CreateEntityTextfield,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityLabel,
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import { useState } from 'react';
import palette from 'theme/palette';
import { GrantChainSelect, GrantTextField, GrantTextFieldInput } from './styles';

const GrantAmount = ({
  value,
  onChange,
  orgId,
  onReset,
  onFocus,
  error,
}) => {
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated

  return (
    <div>
      {activePaymentMethods?.length > 0 && (
        <CreateEntityLabelSelectWrapper show>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Grant amount</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntityWrapper>
            <GrantChainSelect
              name="rewards-payment-method"
              value={value.paymentMethodId}
              onChange={(value) => onChange({ paymentMethodId: value })}
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
              onChange={(value) => onChange({ rewardAmount: value })}
              placeholder="Enter value"
              value={value.rewardAmount}
              fullWidth
              InputProps={{
                inputComponent: GrantTextFieldInput,
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
              error={error.rewardAmount}
              onFocus={onFocus}
            />
            <GrantTextField
              autoComplete="off"
              autoFocus={!value.amount}
              name="amount"
              onChange={(value) => onChange({ amount: value })}
              placeholder="x amount"
              value={value.amount}
              fullWidth
              InputProps={{
                inputComponent: GrantTextFieldInput,
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
              error={error.amount}
              onFocus={onFocus}
            />
          </CreateEntityWrapper>
        </CreateEntityLabelSelectWrapper>
      )}
    </div>
  );
};

export default GrantAmount;
