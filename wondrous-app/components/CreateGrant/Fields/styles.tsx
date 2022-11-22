import styled from 'styled-components';
import { SelectUnstyled } from '@mui/base';
import { TextField } from '@mui/material';
import {
  CreateEntityPaymentMethodRoot,
  CreateEntityPaymentMethodList,
  CreateEntityPaymentMethodPopper,
  CreateEntityTextfield,
} from 'components/CreateEntity/CreateEntityModal/styles';
import palette from 'theme/palette';
import typography from 'theme/typography';

const GrantChainSelectRoot = styled(CreateEntityPaymentMethodRoot)`
  && {
    background: ${palette.grey99};
  }
`;

export const GrantChainSelect = (props) => {
  const components = {
    Root: GrantChainSelectRoot,
    Listbox: CreateEntityPaymentMethodList,
    Popper: CreateEntityPaymentMethodPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} components={components} />;
};

export const GrantTextFieldInput = styled(TextField)`
  && {
    padding: 0;
  }
  .MuiOutlinedInput-root {
    height: 32px;
    padding: 0;
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 500;
    color: ${palette.white};
    .MuiOutlinedInput-input {
      padding: 0;
    }
    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;
export const GrantTextField = styled(CreateEntityTextfield)`
  && {
    background: ${palette.grey99};
    min-width: min-content;
    flex: 1;
    .Mui-disabled {
      color: ${palette.white} !important;
    }
  }
`;

export const ApplyPolicyWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 32px;
  align-items: center;
  border-radius: 4px;
  background: ${palette.grey99};
  padding: 4px;
`;

export const ApplyPolicyItemButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: transparent;
  height: 100%;
  font-family: ${typography.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  line-height: 14px;
  border: none;
  color: ${palette.grey57};
  ${({ isActive }) =>
    isActive &&
    `
    background: ${palette.black92};
    border: 1px solid ${palette.highlightBlue};
    color: ${palette.highlightBlue};
    border-radius: 4px;
  `};
`;
