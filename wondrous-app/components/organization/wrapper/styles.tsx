import { SafeImage } from 'components/Common/Image';
import {
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  TextareaAutosize,
  MenuItem,
  ButtonBase,
  Checkbox,
} from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import palette from 'theme/palette';
import { Button as ButtonComponent, Button as BorderButton } from 'components/Common/button';
import {
  blackColors,
  blueColors,
  greenColors,
  greyColors,
  highlightBlue,
  highlightPurple,
  redColors,
  violetColors,
} from 'theme/colors';
import CloseModalIcon from 'components/Icons/closeModal';
import CheckMarkIcon from 'components/Icons/checkMark';
import CloseModalIconRed from 'components/Icons/closeModalRed';
import { BaseCard } from 'components/Common/card';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ActionButton } from 'components/Common/Task/styles';
import SuccessRole from 'components/Icons/successRole';
import typography from 'theme/typography';
import { LockedIconOutline } from 'components/Icons/userpass';
import { LogoCircle } from '../../Common/ci';
import { LinkIcon } from '../../Icons/linkIcon';

export const OverviewComponent = styled.section`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  //background-color: ${palette.background.default};
  background-color: ${greyColors.grey910};
  transition: 0.15s all ease;
  padding-bottom: 40px;
`;

export const RequestModalHorizontalAlign = styled.div`
  flex-direction: 'row';
  display: flex;
  align-items: center;
`;

export const RequestModalTokenGatingItem = styled.div`
  border: 1px solid ${redColors.red300};
  border-radius: 4px;
  padding: 4px;
`;

export const RequestModalTokenGatingLockBackground = styled.div`
  background-color: ${greyColors.grey920};
  border-radius: 4px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  display: flex;
`;

export const RequestModalTokenGatingSubtitle = styled.div`
  && {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Space Grotesk';
    color: ${(props) => props.color};
  }
`;

export const RequestModalLockedIconOutline = styled(LockedIconOutline)`
  width: 16px;
  height: 16px;
`;

export const RequestModalContainer = styled(Dialog)`
  width: 100%;
  max-width: none;
  display: inline-block;
  flex-direction: column;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0);
`;

export const RequestModalTitleBar = styled.div`
  flex-direction: row;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: ${greyColors.grey96};

  border-bottom: 0.5px dashed ${greyColors.grey75};
  ${(props) => props.style}
`;

export const RequestModalHelperDiv = styled.div`
  width: 100%;
`;
export const RequestModalHelperContainer = styled.div`
  flex-direction: row;
  display: flex;
`;
export const RequestMiddleContainer = styled.div`
  padding: 24px;
`;

export const RequestLightBoxContainer = styled.div`
  background-color: ${blackColors.black92};
  padding: 14px;
  margin-bottom: 18px;
`;

export const RequestModalNoRolesContainer = styled.div`
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RequestModalNoRolesSubtitle = styled(Typography)`
  && {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Space Grotesk';
    color: ${greyColors.grey57};
    margin-bottom: 12px;
  }
`;

export const RequestModalCheckPillCombo = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  border-bottom: 0.5px ${greyColors.grey75};
`;

export const RequestModalCheckbox = styled((props) => (
  <Checkbox
    disabled={props.disabled}
    checked={props.checked}
    sx={{
      padding: 0,
      margin: 0,
      marginRight: '8px',
      color: highlightPurple,
      '&.Mui-checked': {
        color: highlightPurple,
      },
    }}
  />
))``;

export const RequestModalRolesAbilityContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-self: center;
  flex: 1;
  margin-top: 14px;
  background-color: ${blackColors.black92};
`;

export const RequestModalRolesSuccessIcon = styled(SuccessRole)`
  align-self: center;
  width: 100%;
  display: flex;
`;

export const RequestModalSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  align-self: center;
  flex: 1;
  margin-top: 18px;
`;

export const RequestModalSubtitle = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 24px;
    line-height: 23px;
    color: white;
    background: -webkit-linear-gradient(
      180deg,
      ${blueColors.blue20} -5.62%,
      ${highlightPurple} 45.92%,
      ${highlightBlue} 103.12%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-right: 12px;
  }
`;

export const RequestModalCustomPopper = styled.div`
  position: absolute;
  background-color: black;
  border-bottom: 0.5px ${greyColors.grey75};
  width: 80%;
  border-radius: 6px;
  margin-top: 6px;
  margin-right: 24px;
`;

export const RequestModalTextareaWrapper = styled.div`
  margin-top: 42px;
  color: ${greyColors.grey33};
  background: ${greyColors.grey910};
  border-radius: 6px;
  padding: 15px 18px;
`;

export const RequestModalRolesSubtitle = styled(Typography)`
  && {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Space Grotesk';
    color: ${blueColors.blue20};
    margin-bottom: 12px;
  }
`;

export const RequestModalTypeText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    padding: 4px 12px 4px 12px;
    color: white;
    border-radius: 56px;
    border: 1px solid ${violetColors.violet210};
    align-self: center;
    align-items: center;
    width: 120px;
    text-align: center;
  }
`;

export const RequestModalTypeItem = styled(MenuItem)`
  && {
    color: ${palette.white};
    font-size: 14px;
    background: none;
    border-radius: 3px;
    padding: 6px;
    :hover {
      background-color: ${greyColors.grey57};
    }
  }
  &&.Mui-selected {
    background: none;
    :hover {
      background-color: ${greyColors.grey78};
    }
  }
`;

export const RequestModalTextarea = styled(TextareaAutosize)`
  color: ${greyColors.grey33};
  border-radius: 6px;
  background: ${greyColors.grey910};
  width: 100%;
  font-family: 'Space Grotesk';
  font-size: 14px;
  font-weight: 400;
  border: none;
  resize: none;

  &:focus {
    outline: none;
  }
`;

export const RequestModalRolesAbilityColumns = styled.div`
  display: inline-block;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
`;

export const RequestModalExploreRolesAbilityColumns = styled.div`
  display: inline-block;
  flex-direction: column;
  flex: 1;
  width: 100%;
  justify-content: flex-start;
  background-color: ${greyColors.grey920};
  margin: 8px;
  border-radius: 8px;
`;

export const RequestModalShowRole = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${greyColors.grey920};
  margin: 8px;
  margin-top: 18px;
  border-radius: 8px;
  padding: 12px;
`;

export const RequestModalExploreRolesAbilityColumnsTop = styled.div`
  padding: 24px;
`;

export const RequestModalRolesCircleContainer = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
`;

export const RequestModalRolesCircle = styled((props) => (
  <div
    style={{
      width: '12px',
      borderRadius: '2px',
      border: '2px solid',
      borderColor: props.active ? `${greenColors.green30}` : `${greyColors.grey78}`,
      backgroundColor: props.active ? `${greenColors.green350}` : null,
      height: '12px',
      marginLeft: '8px',
      marginRight: '8px',
    }}
  />
))``;

export const RequestModalClaimButton = styled(ActionButton)`
  text-align: center;
  background-color: white;
  display: flex;
`;

export const RequestModalRolesAbilityRows = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 12px;
`;

export const RequestModalButtonBackground = styled.div`
  padding: 16px 24px 16px 24px;
  background-color: black;
  border-radius: 0px 0px 8px 8px;
`;

export const RequestModalRolesAbilityCheckIcon = styled(CheckMarkIcon)`
  width: 24px;
  height: 24px;
  padding: 2px;
  background-color: ${greyColors.grey78};
  border-radius: 4px;
  margin-right: 16px;
`;

export const RequestModalRolesAbilityCloseIcon = styled(CloseModalIconRed)`
  width: 24px;
  height: 24px;
  background-color: ${greyColors.grey78};
  border-radius: 4px;
  margin-right: 16px;
`;

export const RequestModalRolesAbilityText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 15px;
    font-weight: 700;
    color: ${palette.white};
    white-space: nowrap;
  }
`;

export const RequestModalButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  background: ${greyColors.grey105};
  padding: 24px;
`;

export const RequestModalTitle = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 24px;
    font-weight: 700;
    color: ${palette.white};
    white-space: nowrap;
  }
`;

export const RequestModalCloseIcon = styled(CloseModalIcon)`
  transform: rotate(90deg);
  background: black;
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 6px;
  path {
    fill: ${greyColors.grey57};
  }
  :hover {
    background: rgba(122, 122, 122, 0.2);
  }
`;

export const RequestModalBackButton = styled(ChevronLeft)`
  background: black;
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 6px;
  margin-right: 12px;
  path {
    fill: white;
  }
  :hover {
    background: rgba(122, 122, 122, 0.2);
  }
`;
export const RequestModalForwardButton = styled(ChevronRight)`
  background: black;
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 6px;
  margin-right: 12px;
  path {
    fill: white;
  }
  :hover {
    background: rgba(122, 122, 122, 0.2);
  }
`;

export const RequestModalBox = styled.div`
  && {
    background-color: ${greyColors.grey98};
  }
`;

export const RequestModalLevelContainer = styled.div`
  && {
    background-color: rgba(0, 0, 0, 1);

    height: 40px;
    border-radius: 3px;
    min-width: 120px;
    outline: 1px solid ${palette.grey80};
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px;
    cursor: pointer;
    & > svg {
      ${({ open }) => open && `transform: rotate(180deg)`}
    }
  }
`;

export const HeaderImageWrapper = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
  position: relative;
`;

export const HeaderImage = styled((props) => (
  <SafeImage
    {...props}
    useNextImage={false}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />
))``;

export const TokenHeader = styled.div`
  position: relative;
  width: 95%;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
`;

export const TokenLogo = styled(LogoCircle)`
  position: absolute;
  width: 103px;
  height: 103px;
  top: -50px;
  left: -20px;
`;

export const TokenEmptyLogo = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 50px;

  background: ${palette.black};
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ContentContainer = styled.div`
  max-width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

export const HeaderMainBlock = styled.div`
  width: 100%;
  min-height: 40px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitleIcon = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
  & > * {
    margin-left: 10px;
    :first-child {
      margin-left: 0;
    }
  }
`;

export const HeaderTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 26px;
    line-height: 36px;
    display: flex;
    align-items: center;
    color: #ffffff;
    margin-left: 20px;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

export const HeaderTag = styled(Typography)`
  && {
    color: ${palette.grey250};
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 18px;
    margin-left: 20px;
  }
`;

export const HeaderButtons = styled.div`
  width: fit-content;
  height: 100%;
  display: flex;
  gap: 4px;
`;

export const HeaderFollowButton = styled(Button)`
  && {
    width: 100px;
    height: 40px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    border-radius: 204px;
    border: 1px solid deepskyblue;
  }
`;

export const HeaderFollowButtonText = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    width: fit-content;
    display: flex;
    align-items: center;
    color: #ffffff;
  }
`;

export const HeaderFollowButtonIcon = styled.img`
  width: 22px;
  height: 22px;
`;

export const HeaderInviteButton = styled(Button)`
  && {
    color: white;
    font-weight: 600;
    font-size: 15px;
    background: ${blackColors.black92};
    width: 98px;
    height: 39px;
    padding: 7px 7px 7px 14px;
    display: flex;
    justify-content: space-between;

    :hover {
      background: ${greyColors.grey88};

      .MuiButton-label > div {
        background: ${blackColors.black92};
      }
    }
  }
`;

export const PlusIconWrapper = styled.div`
  background: ${greyColors.grey88};
  border-radius: 100%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;

  // TODO: look for other ways to do this
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

export const HeaderContributeButton = styled(Button)`
  && {
    background: linear-gradient(267.08deg, #ccbbff -2.92%, #7427ff 81.21%, #00baff 174.59%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 204px;
    padding: 8px 10px;
    width: 135px;
    height: 40px;

    //button text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    display: flex;
    align-items: center;
    text-align: center;
    color: #ffffff;
  }
`;

export function HeaderManageSettingsButton(props) {
  return (
    <BorderButton
      style={{
        background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
        borderRadius: '204px',
        width: 'fit-content',
        height: '40px',
        minHeight: '0',
      }}
      onClick={props?.onClick}
    >
      {props.children}
    </BorderButton>
  );
}

export const HeaderButton = styled.button`
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: max-content;
  ${({ reversed }) => (reversed ? `background: ${palette.highlightPurple}` : `background: transparent`)};
  border: 1px solid ${palette.highlightPurple};
  cursor: pointer;
  color: ${palette.white};
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 150%;
  margin-right: 10px;
`;

export const RoleButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: max-content;
`;

export const RoleText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    color: ${palette.grey250};
  }
`;

export const RoleButton = styled(HeaderButton)`
  && {
    border-radius: 1000px;
    border-color: ${palette.green300};
    padding: 5.5px 7px;
    text-transform: capitalize;
    font-size: 13px;
    line-height: 13px;
  }
`;

export function HeaderSettingsLockedButton(props) {
  return (
    <BorderButton
      style={{
        background: '#474747',
        cursor: 'default',
        borderRadius: '204px',
        width: 'fit-content',
        height: '40px',
        minHeight: '0',
        visibility: 'hidden',
        ...props?.style,
      }}
      buttonInnerStyle={{
        color: '#474747',
        fontFamily: 'Space Grotesk',
        padding: '8px',
      }}
    >
      {props.children}
    </BorderButton>
  );
}

export const HeaderText = styled(Typography)`
  && {
    font-size: 15px;
    line-height: 22px;
    letter-spacing: 0.01em;
    color: #ffffff;
    margin-bottom: 8px;
    margin-top: 24px;
  }
`;

export const HeaderActivity = styled.div`
  flex-wrap: wrap;
  width: 100%;
  min-height: 23px;
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

export const HeaderActivityLink = styled.a`
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ccbbff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-right: 12px;
`;

export const HeaderActivityLinkIcon = styled(LinkIcon)`
  height: 23px;
  width: 23px;
  margin-right: 8px;
  margin-top: 8px;
`;

export const HeaderContributors = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-right: 8px;
`;

export const HeaderContributorsAmount = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 15px;
    line-height: 150%;
    display: flex;
    align-items: center;
    color: #ffffff;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    margin-right: 5px;
  }
`;

export const HeaderContributorsText = styled(HeaderContributorsAmount)`
  color: #6c6c6c;
`;

export const HeaderPods = styled(HeaderContributors)``;

export const HeaderPodsAmount = styled(HeaderContributorsAmount)``;

export const HeaderPodsText = styled(HeaderContributorsAmount)`
  color: #6c6c6c;
`;

export const HeaderGr15Sponsor = styled.div``;
// cardStyles
export const PostsContainer = styled.div`
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

// cardStyles
export const PostComponent = styled(BaseCard)`
  margin-top: 22px;
  height: 540px;
`;

export const PostBlock = styled.div`
  position: relative;
  padding: 0 26px 18px;
  border-left: 1px solid ${greyColors.grey75};
  margin-bottom: 0 !important;
`;

export const PostSetting = styled(IconButton)`
  && {
    position: absolute;
    right: -12px;
    top: -4px;
    width: 24px;
    height: 24px;
    background: #0f0f0f;
    padding: 0;
  }
`;

export const PostAuthor = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const PostAuthorPhoto = styled.img`
  position: absolute;
  left: -40px;
  width: 28px;
  height: 28px;
  margin-right: 10px;
`;

export const PostAuthorNickname = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
  }
`;

export const PostAuthorText = styled(Typography)`
  && {
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
  }
`;

export const PostTask = styled.div`
  max-width: 625px;
  width: 100%;
  padding: 14px 14px 18px;

  border: 1px solid ${greyColors.grey75};
  border-top-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

export const PostTaskHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PostTaskHeaderText = styled(PostAuthorText)`
  display: flex;
  align-items: flex-end;
  max-width: 380px;
  width: 100%;
`;

export const PostTaskHeaderAuthor = styled(PostAuthor)`
  display: flex;
  justify-content: space-between;
  max-width: 460px;
  width: 100%;
`;

export const PostTaskHeaderAuthorNickname = styled(PostAuthorNickname)`
  padding-right: 5px;
`;

export const PostTaskHeaderImage = styled.img`
  width: 28px;
  height: 28px;
`;

export const PostTaskHeaderButtons = styled.div`
  max-width: 90px;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const PostTaskHeaderCheckedButton = styled(IconButton)`
  && {
    width: 28px !important;
    height: 28px !important;
    background-color: #0f0f0f;
    border: 1px solid #474747;
    padding: 0;
  }
`;

export const PostTaskHeaderButton = styled(Button)`
  && {
    width: 60px;
    height: 28px;
    padding: 7px 10px;
    background: #363636;
    border-radius: 300px;

    //text
    color: #fff;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
  }
`;

export const PostTaskHeaderButtonImg = styled.img`
  width: 10px;
  height: 10px;
`;

export const PostTaskContent = styled.div``;

export const PostTaskTextBlock = styled.div`
  width: 100%;
  min-height: 50px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 10px;
`;

export const PostTaskTitle = styled(Typography)`
  && {
    width: 100%;
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
  }
`;

export const PostTaskText = styled(Typography)`
  && {
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
  }
`;

export const PostTaskImageBlock = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PostTaskImage = styled.img`
  width: 290px;
  height: auto;
`;

export const PostLeftImage = styled.div`
  width: 290px;
  height: 240px;
  background-image: url('/images/overview/gradient.png');
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PostActivity = styled.div`
  //margin-top: 20px;
  max-width: 190px;
  width: 100%;
  height: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PostLikes = styled(Typography)`
  && {
    //width: 45px;
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    display: flex;
    align-items: center;
    color: #ffffff;

    & img {
      margin-right: 10px;
    }
  }
`;

export const PostActivityIcon = styled.img`
  width: auto;
  height: auto;
`;

export const PostComments = styled(PostLikes)``;
export const PostShares = styled(PostLikes)``;

// token gated related components TODO move elsewhere
export const TokenGatedRoleWrapper = styled(Box)`
  && {
    background: #0f0f0f;
    border-radius: 6px;
    padding: 16px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
`;

export const TokenGatedRoleTitle = styled(Typography)`
  && {
    font-weight: 300;
    font-size: 20px;
    line-height: 36px;
    display: flex;
    align-items: center;
    color: #ffffff;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

export const TokenGatedRoleDescription = styled(Typography)`
  && {
    font-weight: 200;
    font-size: 15px;
    line-height: 36px;
    display: flex;
    align-items: center;
    color: #ccbbff;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

export function TokenLogoDisplay(props) {
  return (
    <SafeImage
      useNextImage={false}
      src={props?.src}
      style={{
        width: '29px',
        height: '28px',
        borderRadius: '4px',
        marginRight: '5px',
      }}
    />
  );
}

export const ClaimRoleButton = styled(ButtonComponent)`
  && {
    background: -webkit-linear-gradient(
      180deg,
      ${blueColors.blue20} -5.62%,
      ${highlightPurple} 45.92%,
      ${highlightBlue} 103.12%
    );
    min-height: 0;
    min-width: 0;
    height: 40px;
    display: flex;
    padding: 4px 2px;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    color: #ffffff;
    opacity: 0.8;
    transition: opacity 0.25s;
    button {
      padding: 4px 8px;
      background: rgba(20, 20, 20, 1);
      font-size: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    :hover {
      opacity: 1;
    }
  }
`;

export const ClaimRoleLabel = styled(Typography)`
  && {
    margin-left: 6px;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: -1%;
  }
`;

export const RoleActionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const BoardsSubheaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 20px;
  align-items: center;
`;

export const Container = styled.div`
  width: 95%;
  margin-top: 22px;
`;

export const SettingsButton = styled(ButtonBase)`
  && {
    align-items: center;
    background: ${palette.grey75};
    border-radius: 216px;
    color: ${palette.white};
    cursor: pointer;
    display: flex;
    font-family: ${typography.fontFamily};
    font-size: 14px;
    font-weight: 500;
    height: 36px;
    justify-content: center;
    min-width: 110px;
  }
`;

export const InviteButton = styled(ButtonBase)`
  && {
    align-items: center;
    background: linear-gradient(82.03deg, ${palette.highlightPurple} 50.7%, ${palette.highlightBlue} 107.99%);
    border-radius: 216px;
    color: ${palette.white};
    cursor: pointer;
    display: flex;
    font-family: ${typography.fontFamily};
    font-size: 14px;
    font-weight: 500;
    height: 36px;
    justify-content: center;
    min-width: 110px;
  }
`;
