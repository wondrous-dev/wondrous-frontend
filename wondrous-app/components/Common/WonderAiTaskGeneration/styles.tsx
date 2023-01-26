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

export const PromptInputContainer = styled.div`
  position: relative;
  width: 100%;
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
    .MuiInputBase-root {
      width: 100%;
      overflow-x: scroll;
    }
  }
`;

export const EntityInput = styled(PromptInput)`
  && {
    width: 100%;
    margin-left: 0;
    margin-right: 8px;
  }
`;

export const RightPanelSection = styled.div`
  background: ${palette.black92};
  min-height: 100vh;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export const ActionButton = styled.button`
  padding: 8px 24px;
  background: ${palette.highlightPurple};
  border-radius: 35px;
  border: none;
  cursor: pointer;
`;

export const ActionButtonText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    color: ${palette.white};
    font-size: 15px;
    font-weight: 500;
  }
`;

export const HelperFlexDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const SmallRobotImg = styled.img`
  margin-right: 14px;
`;

export const HelperText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    color: ${palette.grey51};
    font-size: 13px;
    font-weight: bold;
    margin-left: 14px;
  }
`;

export const SuggestionRowContainer = styled.div`
  cursor: pointer;
  padding: 8px;
  &:hover {
    background: ${palette.grey920};
  }
  margin-bottom: 14px;
  border-radius: 8px;
`;

export const SuggestionRowText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    color: ${palette.white};
    font-weight: 600;
    font-size: 15px;
  }
`;

export const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

export const LoadingText = styled(SuggestionRowText)`
  && {
    font-size: 13px;
    margin-left: 8px;
  }
`;

export const RegenerateText = styled(HelperText)`
  && {
    color: ${palette.highlightBlue};
    cursor: pointer;
  }
`;

export const HeaderText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    color: ${palette.blue20};
    font-size: 13px;
    margin-bottom: 0px;
    font-weight: 600;
  }
`;

export const GeneratedTaskRowContainer = styled(SuggestionRowContainer)`
  && {
    display: flex;
    align-items: center;
    margin-left: -14px;
    margin-bottom: 0px;
    padding: 2px 8px;
  }
`;

export const GeneratedTaskRowText = styled(SuggestionRowText)`
  && {
  }
`;
