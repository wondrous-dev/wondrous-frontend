import { Button, ButtonBase, Chip, Grid, IconButton, Modal, Popper, TextField, Typography } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import React from 'react';
import styled from 'styled-components';
import palette from 'theme/palette';
import { BaseCard } from '../Common/card';
import { LogoSquare } from '../Common/ci';
import DropdownSelect from '../Common/DropdownSelect/dropdownSelect';
import BountyIcon from '../Icons/createBounty.svg';
import CreateDaoIcon from '../Icons/createDao';
import CreateMilestoneIcon from '../Icons/createMilestone';
import CreatePodIcon from '../Icons/createPod.svg';
import CreateProposalIcon from '../Icons/createProposal.svg';
import CreateTaskIcon from '../Icons/createTask.svg';
import WonderTokenIcon from '../Icons/wonderToken';

export const MediaUploadGrid = styled(Grid)`
  && {
  }
`;
export const CreateModalOverlay = styled(Modal)`
  position: absolute;
  width: 100%;
  overflow-y: scroll;
  height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const CreateFormModalOverlay = styled(CreateModalOverlay)`
  z-index: 20;
  padding-top: 0;
  height: 100vh;
  margin: auto;
`;

export const CreateLayoutsModal = styled(BaseCard)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 330px;
    z-index: 2100;
  }
`;
export const MediaUploadDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: -8px;
  flex-flow: wrap;
`;

export const CreateLayoutsModalHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CreateLayoutsModalTitle = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    color: white;
    background: -webkit-linear-gradient(180deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const CreateLayoutsModalCloseButton = styled(IconButton)`
  && {
    width: 34px;
    height: 34px;
    padding: 0;
    background: #2d2e2d;
  }
`;

export const CreateLayoutsModalItemContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
`;

export const CreateLayoutsModalItem = styled.div`
  width: 100%;
  height: 50px;
  background: #0f0f0f;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: #262626;
  }
`;

export const CreateLayoutsModalItemTitleBlock = styled.div`
  display: flex;

  & svg {
    margin-right: 10px;
  }
`;

export const CreateLayoutTaskIcon = styled(CreateTaskIcon)`
  margin-right: 10px;
`;

export const CreateLayoutMilestoneIcon = styled(CreateMilestoneIcon)`
  margin-right: 10px;
`;

export const CreateLayoutPodsIcon = styled(CreatePodIcon)`
  margin-right: 10px;
`;

export const CreateLayoutBountyIcon = styled(BountyIcon)`
  margin-right: 10px;
`;

export const CreateLayoutDaoIcon = styled(CreateDaoIcon)`
  margin-right: 10px;
`;

export const CreateLayoutProposalIcon = styled(CreateProposalIcon)``;

export const CreateLayoutDaoMenuItemIcon = styled(LogoSquare)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

export const CreateFormMainBlockTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
    margin-bottom: 10px;
  }
`;

export const MultiMediaUploadButton = styled(ButtonBase)`
  && {
    border-radius: 6px;
    border: 1px solid rgba(116, 39, 255, 1);
    padding: 8px;
  }
`;

export const MultiMediaUploadButtonText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 14px;
    line-height: 22px;
  }
`;

export const CreateLayoutsModalItemTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    display: flex;
    align-items: center;
    color: #ffffff;
  }
`;

export const CreateFormBaseModal = styled(BaseCard)`
  width: 680px;
  max-height: 95vh;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  && > div:first-child {
    min-height: inherit;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  & .hbhroD > *:not(:last-child) {
    margin-bottom: 0;
  }
`;

export const CreateFormBaseModalHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px 25px;
`;

export const CreateFormBaseModalHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  & svg {
    margin-right: 10px;
  }
`;

export const CreateFormBaseModalCloseBtn = styled(IconButton)`
  && {
    /* position: absolute;
    right: 20px;
    top: 20px; */
    width: 35px;
    height: 35px;
    background: #0f0f0f;
  }
`;

export const CreateFormBaseModalTitle = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 20px;
    line-height: 26px;
    color: #ffffff;
  }
`;

export const CreateFormMainSection = styled.div`
  max-width: 635px;
  width: 100%;
  padding: 35px 40px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  border-top: 1px solid #363636;
  border-bottom: 1px solid #363636;

  & .hbhroD > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

export const CreateFormMainSelects = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

export const CreateFormMainInputBlock = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 28px;

  & .MuiTextField-root {
    width: 100%;
  }
`;

export const CreateFormRewardCurrency = styled(DropdownSelect)``;

export const CreateRewardAmountDiv = styled.div`
  width: 50%;
  margin-bottom: 25px;
  :last-child {
    margin-bottom: 0;
  }
`;

export const CreateFormMainTitleInput = styled(TextField)({
  '& .MuiInputBase-root': {
    background: '#0F0F0F',
    borderRadius: 6,
    width: '100% !important',
    height: 40,
    padding: '10px 15px',

    '& .MuiTextField-root': {
      width: '100%',
    },

    //text
    fontSize: 14,
    lineHeight: '19px',
    letterSpacing: '0.01em',
    color: '#C4C4C4',

    '& .MuiFormControl-root': {
      width: '100% !important',
    },

    '&.MuiInput-underline:before': {
      display: 'none',
      width: '100% !important',
    },
  },
});

export const CreateFormMainDescriptionInput = styled(CreateFormMainTitleInput)({
  '& .MuiInputBase-root': {
    height: 156,
  },
});

export const CreateFormMainDescriptionInputSymbolCounter = styled(Typography)`
  && {
    position: absolute;
    right: 15px;
    font-size: 12px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #7a7a7a;
  }
`;

//Task Requirements Block
export const CreateFormTaskRequirements = styled.div`
  width: 100%;
  padding: 35px 40px 55px;
  border-bottom: 1px solid #363636;
`;

export const CreateFormTaskRequirementsTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
    margin-bottom: 10px;
  }
`;

export const CreateFormTaskRequirementsContainer = styled.div`
  max-width: 515px;
  width: 100%;
  min-height: 100px;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
`;

export const CreateFormTaskRequirementsItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 80px;
  width: 90px;
  cursor: pointer;

  & svg {
    margin-right: 10px;
  }
`;

export const CreateFormTaskRequirementsItemText = styled(Typography)`
  && {
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
  }
`;

//Add more details block
export const CreateFormAddDetailsSection = styled.div`
  position: relative;
  width: 100%;
`;

export const CreateFormAddDetailsButton = styled(Button)`
  && {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: #0f0f0f;
    height: 40px;
    padding: 9px 15px;
  }
`;

export const CreateFormAddDetailsButtonText = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    color: #707070;
    margin-right: 8px;
  }
`;

export const CreateFormAddDetailsAppearBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const CreateFormAddDetailsAppearBlockContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 30px 40px 35px;
  border-bottom: 1px solid #363636;

  &:last-child {
    border-bottom: none;
  }
`;

export const CreateFormAddDetailsInputs = styled(CreateFormMainSelects)`
  flex-wrap: wrap;
`;

export const CreateFormAddDetailsInputBlock = styled.div`
  width: 262px;
  margin-bottom: 15px;

  :last-child {
    margin: 0;
  }
`;

export const CreateFormAddDetailsInputLabel = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    color: #ccbbff;
    margin-bottom: 3px;
  }
`;

export const CreateFormAddDetailsInput = styled(CreateFormMainTitleInput)`
  && {
    width: 100%;
  }
`;

export const CreateFormAddDetailsSelects = styled(CreateFormMainSelects)`
  display: flex;
  flex-wrap: wrap;
`;

export const CreateFormAddDetailsLocalizationProvider = styled.div`
  width: 262px;
`;

export const CreateFormAddDetailsTab = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

export const CreateFormSetPodPrivacy = styled(CreateFormAddDetailsTab)`
  margin-top: 0;
`;

export const CreateFormAddDetailsTabLabel = styled(CreateFormAddDetailsInputLabel)`
  && {
    width: 100%;
    margin: 0 0 15px 10px;
  }
`;

//members section
export const CreateFormMembersSection = styled.div`
  width: 100%;
  height: 280px;
`;

export const CreateFormMembersSectionInput = styled(CreateFormMainTitleInput)`
  && {
    width: 100%;
    margin-bottom: 15px;
  }
`;

export const CreateFormMembersBlock = styled.div`
  width: 100%;
`;

export const CreateFormMembersBlockTitle = styled(Typography)`
  && {
    font-size: 12px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #7a7a7a;
  }
`;

export const CreateFormLinkAttachmentBlock = styled.div`
  width: 100%;
  border-bottom: 1px solid #363636;
`;

export const CreateFormLinkAttachmentLabel = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
    margin-bottom: 10px;
  }
`;

export const CreateFormLinkAttachmentInput = styled(CreateFormMainTitleInput)`
  width: 100%;
`;

//bottom buttons
export const CreateFormFooterButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  margin-top: 30px;
  align-items: center;
`;

export const CreateFormButtonsBlock = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CreateFormCancelButton = styled(Button)`
  && {
    min-width: 96px;
    height: 100%;
    background: #232323;

    //text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;
    margin-left: 25px;
    padding-left: 12px;
    padding-right: 12px;
  }
`;

export const CreateFormPreviewButton = styled(Button)`
  && {
    padding: 8px 12px;
    height: 40px;
    background: #0f0f0f;
    border: 1px solid deepskyblue;
    margin-left: 25px;

    //text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;

    .MuiCircularProgress-root {
      margin-right: 10px;
    }

    &:disabled {
      color: #7a7a7a;
      border-color: #7a7a7a;
      cursor: not-allowed;
    }
  }
`;

export const MakeSubmissionPaymentButton = styled(Button)`
  && {
    padding: 8px 12px;
    height: 40px;
    background: #0f0f0f;
    border: 1px solid deepskyblue;
    margin-left: 25px;

    //text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;
  }
`;

export const StyledAutocomplete = styled(Autocomplete).attrs((props) => ({
  className: 'MuiAutocomplete-root',
}))`
  display: flex;
  align-items: center;
  background: #0f0f0f;
  border-radius: 6px;
  min-height: 40px;
  color: ${palette.white};
  position: relative;
  padding-right: 0;

  .MuiInputBase-adornedStart {
    padding-right: 10px !important;
  }
  color: ${palette.white};

  input {
    color: #c4c4c4;
    top: -10px;
    left: 8px;
    font-size: 14px;
    height: 30px;

    &::placeholder {
      color: #c4c4c4;
      opacity: 1;
    }
  }

  .search-icon {
    right: 10px;
    height: 11px;
    position: absolute;
  }

  svg {
    color: #c4c4c4;
  }

  .MuiAutocomplete-popper {
    background: #0f0f0f;
  }

  .MuiAutocomplete-endAdornment {
    top: auto;
  }
`;

export const AutocompleteList = styled(Popper).attrs((props) => ({
  className: `${autocompleteClasses.listbox}`,
}))`
  .MuiPaper-root {
    background: #0f0f0f !important;
    top: auto;
    bottom: auto;
  }

  li {
    font-family: Space Grotesk;
    font-size: 14px;
    color: ${palette.white};
    display: flex;
    align-items: center;
  }

  .MuiAutocomplete-noOptions {
    font-family: Space Grotesk;
    font-size: 14px;
    color: ${palette.white};
  }
`;

export const StyledAutocompletePopper = styled(({ className, ...props }) => {
  return <StyledAutocomplete {...props} classes={{ paper: className }} />;
})`
  && {
    background: #0f0f0f;
  }

  & .MuiAutocomplete-noOptions {
    font-family: 'Space Grotesk';
    color: ${palette.white};
    font-size: 14px;
  }
`;

export const OptionDiv = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #474747;
  }

  img {
    width: 18px;
    height: 18px;
    margin: 8px;
  }
`;

export const OptionTypography = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-size: 14px;
    color: ${palette.white};
    margin-left: 6px;

    span {
      color: #c4c4c4;
    }
  }
`;

export const StyledChip = styled(Chip)`
  && {
    margin: 3px 5px 3px 0;
    color: #c4c4c4;
    background: #0f0f0f;
    border: 1px solid rgb(116, 39, 255);

    & .MuiSvgIcon-root {
      :hover {
        color: ${palette.white};
      }
    }
  }
`;

export const CreateFormSubmitButton = styled(Button)`
  && {
    padding: 2px;
    height: 40px;
    min-height: 40px;
    margin-left: 25px;

    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;
  }
`;

export const RewardCurrencyTokenIcon = styled(WonderTokenIcon)`
  margin-right: 12px;
`;

export const CreateFormAddTagsSection = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 1px solid #363636;
  align-items: center;
  margin: 0 auto;
  padding: 30px 40px 10px;
`;

const editorPadding = 12;
const editorMinHeight = 100;
export const EditorContainer = styled.div`
  padding: ${editorPadding}px;
  min-height: ${editorMinHeight}px;
  border-radius: 6px;
  background: rgb(15, 15, 15);
  overflow: auto;
`;
export const EditorPlaceholder = styled.div`
  min-height: ${editorMinHeight - editorPadding * 2}px;
`;
export const EditorToolbar = styled.div`
  margin-bottom: 4px;
`;

export const TextInputDiv = styled.div`
  height: 100px;
`;

export const SnapshotButtonBlock = styled(CreateFormButtonsBlock)`
  && {
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: auto;
  }
`;

export const SnapshotErrorText = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  margin: 0;
  line-height: 10px;
`;

export const SnapshotButton = styled(CreateFormPreviewButton)`
  && {
    border: 1px solid gold;
    .MuiCircularProgress-svg {
      width: 100%;
      height: 100%;
    }
  }
`;
