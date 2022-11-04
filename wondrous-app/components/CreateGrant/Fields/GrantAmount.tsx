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
} from 'components/CreateEntity/CreateEntityModal/styles';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import { useState } from 'react';
import palette from 'theme/palette';
import { GrantChainSelect, GrantTextField, GrantTextFieldInput } from './styles';

const GrantAmount = ({
  value,
  onChange,
  rewardAmount,
  handleRewardOnChange,
  orgId,
  paymentMethodId,
  onReset,
  onFocus,
  error,
}) => {
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated

  console.log(activePaymentMethods);
  return (
    <div>
      {activePaymentMethods?.length > 0 && (
        <CreateEntityWrapper>
          <GrantChainSelect
            name="rewards-payment-method"
            value={value}
            onChange={onChange}
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
            autoFocus={!rewardAmount}
            name="rewards"
            onChange={() => handleRewardOnChange()}
            placeholder="Enter value"
            value={rewardAmount}
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
            error={error}
            onFocus={onFocus}
          />
          <GrantTextField
            autoComplete="off"
            autoFocus={!rewardAmount}
            name="amount"
            onChange={() => handleRewardOnChange()}
            placeholder="x amount"
            value={rewardAmount}
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
            error={error}
            onFocus={onFocus}
          />
        </CreateEntityWrapper>
      )}
    </div>
  );
};

export default GrantAmount;
