import { SafeImage } from 'components/Common/Image';
import React from 'react';
import {
  CreateEntitySelect,
  CreateEntityOption,
  CreateEntityOptionImageWrapper,
  CreateEntityOptionLabel,
  CreateEntityTextfieldInputPoints,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityTextfieldPoints,
  CreateEntityTextfieldInputLabel,
  CreateEntityTextfieldInputReward,
  CreateEntityPaymentMethodOptionIcon,
  CreateEntityPaymentMethodLabel,
  CreateEntityPaymentMethodLabelChain,
  CreateEntitySelectRootValue,
  CreateEntitySelectRootValueWrapper,
  CreateEntitySelectArrowIcon,
} from 'components/CreateEntity/CreateEntityModal/styles';

export function CreateEntityDropdownRenderOptions(value) {
  return (
    <CreateEntitySelectRootValue>
      <CreateEntitySelectRootValueWrapper>{value?.label}</CreateEntitySelectRootValueWrapper>
      <CreateEntitySelectArrowIcon />
    </CreateEntitySelectRootValue>
  );
}

export function CreateEntityDropdown(props) {
  const {
    value,
    options,
    onChange,
    name,
    renderValue = CreateEntityDropdownRenderOptions,
    DefaultImageComponent,
    error,
    onFocus,
    disabled,
  } = props;
  const dropdownValue = value === null ? 'placeholder' : value;
  const placeholderText = { podId: 'Select Pod', orgId: 'Select Org' };
  return (
    <CreateEntitySelect
      name={name}
      renderValue={renderValue}
      onChange={onChange}
      disabled={disabled || options.length == 0}
      value={dropdownValue}
      error={error}
      onFocus={onFocus}
    >
      <CreateEntityOption key="placeholder" value="placeholder" hide>
        <CreateEntityOptionImageWrapper>
          <DefaultImageComponent color="#474747" />
        </CreateEntityOptionImageWrapper>
        <CreateEntityOptionLabel>{placeholderText[name]}</CreateEntityOptionLabel>
      </CreateEntityOption>
      {options.map((i) => {
        const { imageUrl, label, value, color = '' } = i;
        return (
          <CreateEntityOption key={value} value={i.value}>
            <CreateEntityOptionImageWrapper>
              {imageUrl ? <SafeImage useNextImage={false} src={imageUrl} /> : <DefaultImageComponent color={color} />}
            </CreateEntityOptionImageWrapper>
            <CreateEntityOptionLabel>{label}</CreateEntityOptionLabel>
          </CreateEntityOption>
        );
      })}
    </CreateEntitySelect>
  );
}

export const CreateEntityTextfieldInputPointsComponent = React.forwardRef((props, ref) => (
  <CreateEntityTextfieldInputPoints
    {...props}
    fullWidth={false}
    ref={ref}
    inputProps={{
      maxLength: 3,
    }}
    InputProps={{
      startAdornment: (
        <CreateEntityAutocompletePopperRenderInputAdornment position="start">
          <CreateEntityTextfieldPoints />
        </CreateEntityAutocompletePopperRenderInputAdornment>
      ),
      endAdornment: (
        <CreateEntityAutocompletePopperRenderInputAdornment position="end">
          <CreateEntityTextfieldInputLabel>PTS</CreateEntityTextfieldInputLabel>
        </CreateEntityAutocompletePopperRenderInputAdornment>
      ),
    }}
  />
));

export const CreateEntityTextfieldInputRewardComponent = React.forwardRef((props, ref) => (
  <CreateEntityTextfieldInputReward {...props} ref={ref} />
));

export const CreateEntityPaymentMethodItem = ({ icon, chain, symbol }) => (
  <>
    <CreateEntityPaymentMethodOptionIcon>{icon}</CreateEntityPaymentMethodOptionIcon>
    <CreateEntityPaymentMethodLabel>
      {symbol}
      <CreateEntityPaymentMethodLabelChain>{chain}</CreateEntityPaymentMethodLabelChain>
    </CreateEntityPaymentMethodLabel>
    {/* {deactivatedAt && (
      // since there's less space either show icon if exist or show symbol
      <>
        {icon ? (
          <CreateEntityPaymentMethodOptionIcon>{icon}</CreateEntityPaymentMethodOptionIcon>
        ) : (
          <CreateEntityPaymentMethodLabel> {symbol} </CreateEntityPaymentMethodLabel>
        )}
        <CreateEntityPaymentMethodLabel>Deactivated</CreateEntityPaymentMethodLabel>
      </>
    )} */}
  </>
);
