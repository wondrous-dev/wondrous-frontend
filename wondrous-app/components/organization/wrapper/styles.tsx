import { SafeImage } from 'components/Common/Image';
import { Button, IconButton, Typography, ButtonBase } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import palette from 'theme/palette';
import { Button as BorderButton } from 'components/Common/button';
import { blackColors, greyColors } from 'theme/colors';
import { BaseCard } from 'components/Common/card';
import typography from 'theme/typography';
import { LogoCircle } from 'components/Common/ci';
import { LinkIcon } from 'components/Icons/linkIcon';

export const OverviewComponent = styled.section`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  //background-color: ${palette.background.default};
  background-color: ${greyColors.grey910};
  transition: 0.15s all ease;
  padding-bottom: 40px;
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
  gap: 6px;
  cursor: pointer;
  margin-right: 14px;
  background: ${(props) => (props?.isInPodPage ? palette.grey950 : palette.grey98)};
  padding: 12px;
  border-radius: 1000px;
  transition: background 0.2s ease-in-out;

  :hover {
    background: ${palette.grey920};
  }
`;

export const HeaderContributorsAmount = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 15px;
    line-height: 150%;
    display: flex;
    align-items: center;
    color: ${palette.highlightBlue};
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

export const HeaderContributorsText = styled(HeaderContributorsAmount)`
  && {
    color: ${palette.white};
  }
`;

export const HeaderPods = styled(HeaderContributors)``;

export const HeaderPodsAmount = styled(HeaderContributorsAmount)``;

export const HeaderPodsText = styled(HeaderContributorsText)``;

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
    padding: 8px 24px;
    width: max-content;
  }
`;
