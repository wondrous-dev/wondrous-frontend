import { SelectUnstyled } from '@mui/base';
import { TextField } from '@mui/material';
import {
  CreateEntityPaymentMethodRoot,
  CreateEntityPaymentMethodList,
  CreateEntityPaymentMethodPopper,
  CreateEntityTextfield,
} from 'components/CreateEntity/CreateEntityModal/styles';
import styled from 'styled-components';
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
  }
`;
