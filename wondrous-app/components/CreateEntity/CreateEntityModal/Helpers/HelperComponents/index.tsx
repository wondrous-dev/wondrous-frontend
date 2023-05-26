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
import palette from 'theme/palette';

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
              {imageUrl ? (
                <SafeImage useNextImage={false} src={imageUrl} alt="Image" />
              ) : (
                <DefaultImageComponent color={color} />
              )}
            </CreateEntityOptionImageWrapper>
            <CreateEntityOptionLabel hideOnSmallScreen>{label}</CreateEntityOptionLabel>
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
      maxLength: 9,
    }}
    InputProps={{
      startAdornment: (
        <CreateEntityAutocompletePopperRenderInputAdornment
          position="start"
          sx={{
            background: palette.grey900,
            height: '24px',
            width: '24px',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            margin: '0',
            minWidth: '24px',
            minHeight: '24px',
          }}
        >
          <CreateEntityTextfieldPoints />
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
  </>
);
