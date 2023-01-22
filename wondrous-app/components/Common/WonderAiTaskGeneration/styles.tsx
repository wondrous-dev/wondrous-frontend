import { OptionUnstyled, PopperUnstyled, SelectUnstyled } from '@mui/base';
import { TextField, Typography } from '@mui/material';
import styled from 'styled-components';
import scrollBarStyles from 'components/Common/ScrollbarStyles';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const PromptContainer = styled.div`
  padding: 24px;
`;

export const PromptBox = styled.div`
  width: 100%;
  background: ${palette.black92};
  border-radius: 24px;
  padding: 24px;
`;

export const PromptBoxTitle = styled(Typography)`
  && {
    font-weight: bold;
    font-size: ${(props) => props.fontSize || 18}px;
    background: linear-gradient(273.13deg, #fefec0 20.13%, #36a9ff 95.72%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export const PromptBoxDescription = styled(Typography)`
  && {
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: ${palette.white};
    margin-top: 8px;
  }
`;

export const PromptGenerationTypeRoot = styled.button`
  padding: 8px;
  border-radius: 4px;
  background: #141414;
  border: 1px solid ${(props) => (props['aria-expanded'] ? `#7a7a7a` : `transparent`)};
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

export const PromptGenerationTypeSelected = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
`;

export const PromptGenerationTypeList = styled.ul`
  font-family: 'Space Grotesk';
  color: ${palette.white};
  margin: 0;
  padding: 0;
`;

export const PromptGenerationTypePopper = styled(PopperUnstyled)`
  border-radius: 4px;
  background-color: #1f1f1f;
  border: 1px solid #7a7a7a;
  z-index: 100;
  overflow-y: auto;
  width: fit-content;
  ${scrollBarStyles}
`;

export function PromptGenerationTypeSelect(props) {
  const components = {
    Root: PromptGenerationTypeRoot,
    Listbox: PromptGenerationTypeList,
    Popper: PromptGenerationTypePopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} components={components} />;
}

export const PromptGenerationTypePopperOption = styled(OptionUnstyled)`
  list-style: none;
  font-family: 'Space Grotesk';
  font-size: 13px;
  font-weight: 400;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:last-of-type {
    border-bottom: none;
  }

  :hover {
    cursor: pointer;
    background: rgba(122, 122, 122, 0.2);
  }
`;

export const PromptGenerationPopperOptionText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    color: ${palette.white};
    font-size: 15px;
  }
`;

export const PromptInputDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

export const PromptInput = styled(TextField)`
  && {
    margin-left: 14px;
    background: #141414;
    border-radius: 4px;
    display: flex;
    width: calc(100% - 220px);
    color: ${palette.white};
    justify-content: space-between;
    align-items: flex-start;
    outline: 1px solid ${({ error }) => (error ? palette.red400 : 'transparent')};
    > .MuiInputBase-root {
      padding-right: 0;
      padding: 0 6px;
    }
    .MuiTextField-root {
      color: ${palette.white};
    }
    .MuiInputBase-input {
      color: ${palette.white};
      padding: 8.5px;
      text-align: left;
      font-size: 15px;
    }
    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
    .MuiOutlinedInput-notchedOutline input {
      color: ${palette.white};
    }
    :focus-within {
      outline: 1px solid #7a7a7a;
    }
  }
`;

export const EntityInput = styled(PromptInput)`
  && {
    width: 100%;
    margin-left: 0;
    .MuiInputBase-root {
      width: 100%;
    }
  }
`;
