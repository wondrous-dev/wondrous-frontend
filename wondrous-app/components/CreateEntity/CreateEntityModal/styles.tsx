import { ButtonUnstyled, OptionUnstyled, PopperUnstyled, SelectUnstyled, TextareaAutosize } from '@mui/base';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import {
  Autocomplete,
  Input,
  InputAdornment,
  InputBase,
  MenuItem,
  Popper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from 'components/Common/button';
import { GradientHighlightHorizontal } from 'components/Common/gradients';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import scrollBarStyles from 'components/Common/ScrollbarStyles';
import AttachFileIcon from 'components/Icons/attachFile.svg';
import CloseModalIcon from 'components/Icons/closeModal';
import { DAOIcon } from 'components/Icons/dao';
import PlusIcon from 'components/Icons/plus';
import PodIcon from 'components/Icons/podIcon';
import PointsIcon from 'components/Icons/pointsIcon2.svg';
import SingleDatePicker from 'components/SingleDatePicker';
import styled, { css } from 'styled-components';
import { greyColors } from 'theme/colors';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { CloseIcon } from '../../Common/BoardFilters/styles';
import Arrow from '../../Icons/arrow.svg';
import OpenInFullIcon from '../../Icons/openInFull.svg';

const fullScreenStyle = css`
  max-height: 100vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  > :last-child {
    margin-top: auto;
  }
`;

export const CreateEntityForm = styled.form`
  max-height: 95vh;
  max-width: 599px;
  width: 100%;
  border-radius: 6px;
  overflow-y: auto;
  background: #1d1d1d;
  color: #fff;
  &::-webkit-scrollbar {
    display: none;
  }
  ${({ fullScreen }) => {
    if (fullScreen) {
      return fullScreenStyle;
    }
  }}
  transition: all 0.1s linear;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-height: 100vh;
  }
`;

export const CreateEntityHeader = styled.div`
  height: fit-content;
  background-color: ${palette.grey87};
  display: flex;
  align-items: flex-start;
  padding: 12px 24px;
  justify-content: space-between;
`;

export const CreateEntityFooter = styled(CreateEntityHeader)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    position: sticky;
    bottom: 0;
  }
`;

export const CreateEntitySelectRoot = styled.button`
  font-family: ${typography.fontFamily};
  font-weight: 500;
  font-size: 13px;
  width: 100%;
  min-width: 135px;
  height: fit-content;
  min-height: 32px;
  border-radius: 4px;
  background: #1f1f1f;
  border: 1px solid ${(props) => (props['aria-expanded'] ? `#7a7a7a` : `transparent`)};
  outline: 1px solid ${({ error }) => (error ? palette.red400 : 'transparent')};
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

export const CreateEntitySelectListbox = styled.ul`
  font-family: ${typography.fontFamily};
  color: ${palette.white};
  margin: 0;
  padding: 0;
`;

export const CreateEntitySelectPopper = styled(PopperUnstyled)`
  width: 250px;
  max-height: 222px;
  overflow-y: auto;
  border-radius: 4px;
  background-color: #1f1f1f;
  border: 1px solid #7a7a7a;
  z-index: 100;
  ${scrollBarStyles}
`;

export function CreateEntitySelect(props) {
  const components = {
    Root: CreateEntitySelectRoot,
    Listbox: CreateEntitySelectListbox,
    Popper: CreateEntitySelectPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} components={components} />;
}

export const CreateEntityOption = styled(OptionUnstyled)`
  list-style: none;
  height: fit-content;
  min-height: 34px;
  padding: 6px;
  display: ${({ hide }) => (hide ? 'none' : 'flex')};
  align-items: center;
  &:last-of-type {
    border-bottom: none;
  }

  :hover {
    cursor: pointer;
    background: rgba(122, 122, 122, 0.2);
  }
`;

export const CreateEntityOptionImageWrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  img {
    width: 20px;
    height: 20px;
    border-radius: 2px;
  }
  svg {
    width: 20px;
    height: 20px;
    border-radius: 2px;
  }
`;

export const CreateEntityDefaultDaoImage = styled(DAOIcon)``;

export const CreateEntityDefaultPodImage = styled((props) => (
  <div {...props}>
    <PodIcon />
  </div>
))`
  display: flex;
  align-items: center;
  background: ${({ color }) => color};
  border-radius: 50px;
  width: 20px;
  height: 20px;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const CreateEntityOptionLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    color: ${palette.white};
    margin-left: 6px;
  }
`;

export const CreateEntitySelectRootValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CreateEntitySelectRootValueWrapper = styled.div`
  color: ${palette.white};
  justify-content: flex-start;
  text-align: left;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CreateEntityHeaderWrapper = styled.div<{ showOnSmallScreen: boolean; hideOnLargeScreen: boolean }>`
  display: ${(props) => (props.hideOnLargeScreen ? 'none' : 'inline-flex')};
  gap: 12px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: ${(props) => (props.showOnSmallScreen ? 'inline-flex' : 'none')};

    .select-tooltip {
      min-width: 32px;
      height: 32px;
    }
  }
`;

export const CreateEntityOpenInFullIcon = styled((props) => (
  <div {...props}>
    <OpenInFullIcon />
  </div>
))`
  width: 32px;
  height: 32px;
  background: rgba(49, 49, 49, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    background: rgba(49, 49, 49, 1);
    cursor: pointer;
  }
`;

export const CreateEntityCloseIcon = styled((props) => (
  <div {...props}>
    <CloseIcon />
  </div>
))`
  width: 32px;
  height: 32px;
  background: rgba(49, 49, 49, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    background: rgba(49, 49, 49, 1);
    cursor: pointer;
  }
`;

export const CreateEntitySelectArrowIcon = styled(Arrow)`
  margin-left: 10px;
  transform: rotate(90deg);
  path {
    fill: ${palette.white};
  }
`;

export const CreateEntityHeaderArrowIcon = styled((props) => (
  <div {...props}>
    <Arrow />
  </div>
))`
  && {
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
  }
`;

export const CreateEntityBody = styled.div`
  padding: 16px;
  padding-bottom: 8px;
`;

export const CreateEntityTitle = styled(TextareaAutosize)`
  height: 42px;
  width: 100%;
  font-family: 'Space Grotesk';
  font-size: 24px;
  color: ${palette.white};
  background: transparent;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  resize: none;
  outline: 1px solid ${({ error }) => (error ? palette.red400 : 'transparent')};
  :focus {
    outline: none;
  }
  ${scrollBarStyles}
`;

export const CreateEntityLabelWrapper = styled.div`
  width: 200px;
`;

export const CreateEntityLabel = styled.div`
  width: fit-content;
  height: 32px;
  padding: 4px 8px;
  font-family: 'Space Grotesk';
  color: #ccbbff;
  font-weight: 500;
  border-radius: 4px;
  background: #282828;
`;

export const CreateEntityLabelAddButton = styled(ButtonUnstyled)`
  height: 28px;
  max-width: max-content;
  width: max-content;
  background: ${palette.grey920};
  border-radius: 4px;
  padding: 4px 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${palette.white};
  cursor: pointer;
  font-weight: 400;
`;

export const CreateEntityAddButtonIcon = styled(PlusIcon)`
  path {
    fill: ${palette.grey250};
  }
`;

export const CreateEntityAddButtonLabel = styled(Typography)`
  && {
    color: ${palette.grey58};
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 13px;
  }
`;

export const CreateEntitySelectErrorWrapper = styled.div`
  width: 100%;
  flex-basis: 49%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;

  > button {
    min-width: fit-content;
  }
`;

export const TemplatesGalleryText = styled(Typography)`
  && {
    font-size: 16px;
    color: ${palette.white};
    font-weight: 500;
    margin-left: -12px;
  }
`;

export const CreateEntitySelectWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  gap: 6px;
  div:nth-of-type(n + 3) {
    max-width: calc(50% - 3px);
  }
`;

export const CreateEntityTextfield = styled(TextField)`
  && {
    min-width: 45%;
    height: 28px;
    background: #141414;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    outline: 1px solid ${({ error }) => (error ? palette.red400 : 'transparent')};
    > .MuiInputBase-root {
      padding-right: 0;
      padding: 0 6px;
    }
    .MuiTextField-root {
      height: 28px;
    }
    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
    :focus-within {
      outline: 1px solid ${palette.highlightPurple};
    }
  }
`;

export const CreateEntityTextfieldInputPoints = styled(TextField)`
  && {
    padding: 0;
  }
  .MuiOutlinedInput-root {
    display: flex;
    gap: 6px;
    height: inherit;
    padding: 0;
    width: auto;
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    color: #ffffff;
  }
`;

export const CreateEntityTextfieldPoints = styled(PointsIcon)``;

export const CreateEntityTextfieldInputLabel = styled(Typography)`
  && {
    color: #c4c4c4;
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    background: -webkit-linear-gradient(#ffffff, #ffd653);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    :hover {
      cursor: default;
    }
  }
`;

export const CreateEntityAutocomplete = styled(Autocomplete)`
  background: #141414;
  border-radius: 4px;
  outline: 1px solid ${({ error }) => (error ? palette.red400 : 'transparent')};
  :focus-within {
    outline: 1px solid #7a7a7a;
  }

  && > .MuiInput-root {
    padding: 0 6px;
  }
`;

export const CreateEntityAutocompletePopper = styled(({ className, ...props }) => (
  <CreateEntityAutocomplete
    {...props}
    classes={{ paper: className }}
    sx={{
      '&&:focus-within': [{ outline: `1px solid ${palette.highlightPurple}` }],
      height: '28px',
      '.Mui-disabled': {
        color: palette.white,
      },
    }}
    tabIndex={0}
  />
))`
  .MuiAutocomplete-listbox {
    margin-top: 8px;
    border-color: #7a7a7a;
    scroll-padding-right: 0;
    max-height: 200px;
    ${scrollBarStyles}
  }

  .MuiAutocomplete-noOptions {
    background: ${palette.grey79} !important;
    font-family: 'Space Grotesk';
    color: ${palette.white};
    font-weight: 500;
    border-color: #7a7a7a;
    padding: 8px;
    font-size: 13px;
    margin-top: 8px;
    font-size: 14px;
  }
  }
`;

export const CreateEntityAutocompletePopperRenderInput = styled(Input)`
  && {
    border: none;
    outline: none;
    height: 28px;
    color: #c4c4c4;
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    > .MuiInputBase-input {
      padding: 0;
    }
  }
  /* &:focus-within { */
  /*   outline: 1px solid ${palette.highlightPurple}; */
  /* } */
`;

export const CreateEntityAutocompletePopperRenderInputAdornment = styled(InputAdornment)`
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: 50px;
  }
`;

export const CreateEntityAutocompletePopperRenderInputIcon = styled(CloseModalIcon)`
  && {
    path {
      fill: #c4c4c4;
    }
  }
`;

export const CreateEntityAutocompleteOption = styled.li`
  && {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    background: #1f1f1f;
    min-height: 36px;
    padding: 6px 12px;

    &&[aria-selected='true'],
    &&[aria-selected='true'].Mui-focused,
    &&.Mui-focused {
      background: #474747;
    }

    img {
      width: 24px;
      height: 24px;
      border-radius: 50px;
    }
  }
`;

export const CreateEntityAutocompleteOptionTypography = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    color: ${palette.white};
    margin-left: 6px;
    font-weight: 500;

    span {
      color: #c4c4c4;
    }
  }
`;

export const CreateEntityLabelSelectWrapper = styled.div`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  margin-top: 10px;
`;

export const CreateEntityPrivacyRoot = styled.button`
  padding: 0;
  width: ${({ width }) => width ?? 'fit-content'};
  height: 28px;
  border-radius: 4px;
  background: #1f1f1f;
  border: 0;
  outline: 1px solid ${(props) => (props['aria-expanded'] || props.open ? palette.highlightPurple : `transparent`)};
  opacity: ${({ disabled }) => (disabled ? '0.7' : '1')};
  :hover {
    cursor: pointer;
  }
`;

export const CreateEntityPrivacyList = styled.ul`
  font-family: 'Space Grotesk';
  color: ${palette.white};
  margin: 0;
  padding: 0;
`;

export const CreateEntityPrivacyPopper = styled((props) => (
  <PopperUnstyled
    {...props}
    disablePortal
    modifiers={[
      {
        name: 'offset',
        enabled: true,
        options: {
          offset: [0, 8],
        },
      },
    ]}
  />
))`
  max-height: 222px;
  min-width: 132px;
  width: ${({ width }) => width};
  background-color: #1f1f1f;
  border: 1px solid #7a7a7a;
  z-index: 100;
`;

export function CreateEntityPrivacySelect(props) {
  const components = {
    Root: CreateEntityPrivacyRoot,
    Listbox: CreateEntityPrivacyList,
    Popper: CreateEntityPrivacyPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} components={components} />;
}

export const EditEntityPrivacySelect = (props) => {
  const components = {
    Root: CreateEntityPrivacyRoot,
    Listbox: CreateEntityPrivacyList,
    Popper: (popperProps) => <CreateEntityPrivacyPopper {...popperProps} open={props.open} width={props.width} />,
    ...props.components,
  };

  return <SelectUnstyled {...props} components={components} />;
};

export const CreateEntityPrivacySelectRender = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
`;

export const CreateEntityApplicationsSelectRender = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  color: white;
  width: 100%;
  flex-wrap: wrap;
`;

export const CreateEntityPrivacySelectRenderLabel = styled.div`
  display: flex;
  align-items: center;
  color: white;
  text-transform: capitalize;
`;

export const CreateEntityPrivacySelectRenderLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const CreateEntityPrivacyIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CreateEntityPrivacyLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 400;
    color: ${palette.white};
    font-size: 13px;
    text-align: left;
    margin-left: 10px;
  }
`;

export const CreateEntityPrivacySelectOption = styled(OptionUnstyled)`
  list-style: none;
  font-family: 'Space Grotesk';
  font-size: 13px;
  font-weight: 400;
  height: 34px;
  padding: 8px;
  display: flex;
  align-items: center;

  &:last-of-type {
    border-bottom: none;
  }

  :hover {
    cursor: pointer;
    background: rgba(122, 122, 122, 0.2);
  }
`;

export const CreateEntityCancelButton = styled(ButtonUnstyled)`
  width: 107px;
  height: 34px;
  background: #232323;
  color: ${palette.white};
  border: none;
  border-radius: 50px;
  font-family: 'Space Grotesk';
  font-size: 15px;
  font-weight: 600;
  :hover {
    cursor: pointer;
    background: #454545;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: ${(props) => (props.showOnSmallScreen ? 'flex' : 'none')};
  }
`;

export const CreateEntityTemplateInput = styled.div`
  flex-direction: 'row';
  display: 'flex';
`;

export const CreateEntityCreateTaskButton = styled(Button)`
  && {
    min-height: 0;
    height: 34px;
    min-width: 143px;
    ${GradientHighlightHorizontal}
    button {
      text-transform: capitalize;
      min-height: 0;
      font-size: 15px;
      font-weight: 600;
      font-family: 'Space Grotesk';
      background: ${palette.background};
    }
  }
`;

export const CreateEntityAttachment = styled(ButtonUnstyled)<{ showOnSmallScreen: boolean }>`
  background: #282828;
  font-family: 'Space Grotesk';
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: ${palette.white};
  border: none;
  border-radius: 4px;
  padding: 8px;
  display: ${(props) => (props.showOnSmallScreen ? 'none' : 'flex')};
  align-items: center;
  justify-content: space-between;
  :hover {
    cursor: pointer;
    background: #454545;
    filter: drop-shadow(0 8px 2px #171717);
    transition: all ease-in-out 0.2s;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    display: ${(props) => (props.showOnSmallScreen ? 'flex' : 'none')};
  }
`;

export const CreateEntitySaveTemplateButton = styled(ButtonUnstyled)`
  background: ${greyColors.grey90};
  font-family: 'Space Grotesk';
  font-size: 14px;
  height: 32px;
  width: 225px;
  font-weight: 500;
  text-align: left;
  color: ${palette.white};
  border: none;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  :hover {
    cursor: pointer;
    background: #454545;
    filter: drop-shadow(0 8px 2px ${greyColors.grey100});
    transition: all ease-in-out 0.2s;
  }
`;

export const CreateEntitySaveTemplateButtonDisabled = styled(ButtonUnstyled)`
  background: #282828;
  font-family: 'Space Grotesk';
  font-size: 14px;
  height: 32px;
  width: 225px;
  font-weight: 500;
  text-align: left;
  color: ${palette.white};
  border: none;
  border-radius: 4px;
  opacity: 0.3;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CreateEntityAttachmentIcon = styled(AttachFileIcon)`
  && {
    margin-right: 8px;
  }
`;

export const CreateEntitySaveIcon = styled(SaveAltOutlined)`
  && {
    margin-right: 8px;
  }
`;

export const CreateEntityDivider = styled.div`
  height: 1px;
  width: 100%;
  border-top: 1px dashed #282828;
  margin: 18px 0;
`;

export const MediaUploadDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  margin-bottom: -8px;
  flex-flow: wrap;
`;

export const CreateEntityWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 14px;
  align-items: flex-start;
`;

export const CreateEntityPaymentMethodRoot = styled.button`
  padding: 0;
  max-width: fit-content;
  height: 28px;
  border-radius: 4px;
  background: #141414;
  border: 1px solid ${(props) => (props['aria-expanded'] ? palette.highlightPurple : `transparent`)};
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

export const CreateEntityTextfieldInputReward = styled(TextField)`
  && {
    padding: 0;
  }
  .MuiOutlinedInput-root {
    height: 32px;
    padding: 0;
    font-family: 'Space Grotesk';
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

export const CreateEntityTextfieldInputTemplate = styled(TextField)`
  && {
    padding: 0;
  }
  .MuiOutlinedInput-root {
    height: 32px;
    padding: 0;
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    color: #ffffff;
    .MuiOutlinedInput-input {
      padding: 0;
    }
    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;

export const CreateEntityPaymentMethodList = styled.ul`
  font-family: 'Space Grotesk';
  color: ${palette.white};
  margin: 0;
  padding: 0;
`;

export const CreateEntityPaymentMethodPopper = styled((props) => (
  <Popper
    {...props}
    modifiers={[
      {
        name: 'offset',
        enabled: true,
        options: {
          offset: [0, 8],
        },
      },
    ]}
  />
))`
  max-height: 222px;
  width: 200px;
  border-radius: 4px;
  background-color: #1f1f1f;
  border: 1px solid #7a7a7a;
  z-index: 100;
  overflow-y: auto;
  ${scrollBarStyles}
`;

export function CreateEntityPaymentMethodSelect(props) {
  const components = {
    Root: CreateEntityPaymentMethodRoot,
    Listbox: CreateEntityPaymentMethodList,
    Popper: CreateEntityPaymentMethodPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} components={components} />;
}

export const CreateEntityPaymentMethodSelected = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
`;

export const CreateEntityPaymentMethodOption = styled(OptionUnstyled)`
  list-style: none;
  font-family: 'Space Grotesk';
  font-size: 13px;
  font-weight: 400;
  height: 34px;
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

export const CreateEntityPaymentMethodOptionIcon = styled.div`
  && {
    width: 24px;
    height: 24px;
    img[style] {
      width: 100% !important;
      height: 100% !important;
    }
  }
`;

export const CreateEntityPaymentMethodSelectRender = styled.div`
  max-width: fit-content;
  padding: 0 8px;
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: 'Space Grotesk';
  font-size: 13px;
  color: white;
  justify-content: space-between;
`;

export const CreateEntityPaymentMethodLabel = styled(Typography)`
  && {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    gap: 6px;
  }
`;

export const CreateEntityPaymentMethodLabelChain = styled.div`
  && {
    color: #7a7a7a;
    font-weight: 400;
  }
`;

export const CreateEntityError = styled(Typography)`
  && {
    color: ${palette.red400};
    font-size: 13px;
    font-family: 'Space Grotesk';
    font-weight: 400;
    display: flex;
    align-items: center;
  }
`;

export const CreateEntityDueDate = styled(({ className, ...props }) => (
  <SingleDatePicker {...props} className={className} />
))`
  // This is to override the default styles of the SingleDatePicker
  && {
    margin: 0;
    height: 28px;
    width: 100%;
    max-width: 100%;
    > .MuiFormControl-root {
      height: 28px
      width: 100%;
      border-radius: 4px;
      padding: 0;
      :focus-within {
        outline: 1px solid ${palette.highlightPurple};
      }
      .MuiInputBase-input {
        padding: 0;
      }
      > .MuiOutlinedInput-root {
        background: #141414;
        height: 32px;
        font-size: 13px;
        font-weight: 500;
        border: none;
        outline: none;
        padding: 0 6px;
        .MuiOutlinedInput-notchedOutline {
          border: none;
        }
        .MuiInputAdornment-root {
          margin: 0;
          background: transparent;
          .MuiIconButton-root {
            padding: 0;
          }
        }
      }
    }
    + div {
      // Popper
      width: 370px;
      z-index: 999;
      > .MuiBox-root {
        margin-bottom: 12px;
        > .MuiBox-root {
          background: #1d1d1d;
          > .MuiBox-root {
            > .MuiFormControl-root {
              width: 100%;
              border-radius: 4px;
              padding: 0;
              :focus-within {
                outline: 1px solid #7a7a7a;
              }
              .MuiInputBase-input {
                padding: 0;
              }
              > .MuiOutlinedInput-root {
                height: 32px;
                font-size: 13px;
                font-weight: 500;
                border: none;
                outline: none;
                padding: 0 6px;
                .MuiOutlinedInput-notchedOutline {
                  border: none;
                }
                .MuiInputAdornment-root {
                  margin: 0;
                  background: transparent;
                  .MuiIconButton-root {
                    padding: 0;
                  }
                }
              }
            }
          }
          > .DayPicker {
            width: inherit;
            margin: 0 auto;
          }
        }
      }
    }
  }
`;

export const CreateEntityDefaultUserImage = styled(DefaultUserImage)`
  && {
    width: 24px;
    height: 24px;
    margin: 0;
  }
`;

const editorPadding = 0;
const editorMinHeight = 100;
export const EditorToolbar = styled.div`
  margin: 6px 0 18px;
`;
export const EditorContainer = styled.div`
  padding: ${editorPadding}px;
  min-height: ${editorMinHeight}px;
  overflow: auto;
  cursor: text;
  ${scrollBarStyles};
`;
export const EditorPlaceholder = styled.div`
  min-height: ${editorMinHeight - editorPadding * 2}px;
`;

export const ApplicationInputWrapper = styled.div``;

export const ApplicationInputUnassignContainer = styled.div`
  padding-top: 9px;
  padding-bottom: 9px;
  display: flex;
  align-items: center;
  font-family: 'Space Grotesk';
  font-size: 13px;
  font-weight: 500;
  color: ${palette.white};
  margin-left: 6px;
  gap: 9px;
  .MuiCheckbox-root {
    padding: 0px;
  }
`;

export const SnapshotErrorText = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  margin: 0;
  line-height: 10px;
`;

export const SnapshotButtonBlock = styled.div`
  display: flex;
  justify-content: left;
  margin-left: 24px;
`;

export const StyledProposalSelect = styled(Select)`
  && {
    background: ${palette.grey940};
    width: 100%;
    color: ${palette.white};
    border-radius: 4px;
    font-size: 14px;
  }

  .MuiSelect-select {
    padding: 8px;
    padding-left: 12px;
  }

  & .MuiSelect-root {
    padding-left: 12px;
  }

  & .MuiInputBase-root {
    border-radius: 0 6px 6px 0;
  }

  svg {
    color: ${palette.white};
    transition: transform 0.2s ease-out;
  }
  & .MuiInput-underline {
    :hover:not(.Mui-disabled)::before {
      border: none;
      ::before {
        border: none;
      }
      ::before {
        border: none;
      }
    }
  }
`;
export const ProposalVoteSelect = styled(({ className, ...props }) => (
  <StyledProposalSelect {...props} {...className} MenuProps={{ classes: { paper: className } }} />
))`
  &.MuiPaper-root {
    background: ${palette.black101};
    border: 1px solid ${palette.grey79};
    width: 100%;
    color: ${palette.white};
    max-width: 513px;
  }

  &.MuiPaper-root > .MuiList-padding {
    padding: 12px;
  }
`;

export const ProposalVoteSelectMenuItem = styled(MenuItem)`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${palette.black98} !important;
    color: ${palette.white};
    border-radius: 4px;
    padding: 8px;
    transition: background 0.2s ease-out;
    position: relative;
  }
`;

export const ProposalVoteSelectMenuItemText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 500;
    color: ${palette.white};
  }
`;

export const CustomProposalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px;

  background: ${palette.black92};
  border-radius: 6px;
  margin-top: 14px;
`;

export const CustomProposalInput = styled(InputBase)`
  && {
    width: 100%;
    height: 40px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    background: ${palette.black101};
    color: ${palette.white};
    padding: 10px 15px;
    margin-bottom: 10px;
  }
`;

export const CustomAddOptionButton = styled.div`
  background: ${palette.grey79};
  padding: 4px 8px;
  gap: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
`;

export const CustomAddOptionButtonText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    color: ${palette.grey130};
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
  }
`;

export const CustomAddOptionDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const SubmitterWalletConnectContainer = styled.div`
  font-family: 'Space Grotesk';
  font-weight: 500;
  font-size: 13px;
  min-width: 130px;
  max-width: 250px;
  border-radius: 4px;
  background: #262626;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  margin-left: 20px;
  height: 45.5px;
  padding-right: 12px;
`;

export const SubmitterWalletConnectText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    color: ${palette.white};
    margin-right: 4px;
  }
`;
