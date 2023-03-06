import { SafeImage } from 'components/Common/Image';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import React from 'react';
import styled from 'styled-components';
import palette from 'theme/palette';
import { Button as BorderButton } from 'components/Common/button';
import { blackColors, greyColors } from 'theme/colors';
import typography from 'theme/typography';

export const HeaderImageWrapper = styled.div`
  width: 100%;
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
  margin-top: 24px;
  display: flex;
  flex-direction: column;
`;

export const TokenEmptyLogo = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 50px;

  background: ${palette.black};
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
  min-height: 36px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down('md')} {
    flex-direction: column;
  }
`;

export const HeaderTopLeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 8px;
  width: 100%;
  gap: 10px;

  ${({ theme }) => theme.breakpoints.down('md')} {
    justify-content: center;
  }
`;

export const HeaderTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 20px;
    color: #ffffff;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

// used fo org username, not used rn
export const HeaderTag = styled(Typography)`
  && {
    color: ${palette.grey250};
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
  }
`;

export const RolePodMemberContainer = styled.div`
  display: flex;
  gap: 14px;
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

// this is the new primary button
export const HeaderButton = styled.button`
  border-radius: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: 35px;
  padding: 8px 24px;
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
  &:hover {
    ${({ reversed }) =>
      reversed
        ? `background: 
    linear-gradient(270deg, ${palette.highlightBlue} 0%, ${palette.highlightPurple} 100%);
    `
        : `background: ${palette.highlightPurple}`};
  }
`;

export const RoleButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: max-content;
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

export const HeaderText = styled.div`
  font-size: 15px;
  line-height: 22px;
  letter-spacing: 0.01em;
  color: #ffffff;
`;

export const MemberPodIconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${palette.grey940};
  border-radius: 50%;
  height: 28px;
  width: 28px;
`;
export const HeaderActivityLink = styled.a`
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${palette.highlightBlue};
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export const HeaderContributors = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  background: ${palette.grey85};
  padding: 3px 6px 3px 2px;
  border-radius: 1000px;
  transition: background 0.2s ease-in-out;

  :hover {
    background: ${palette.grey920};
  }
`;

export const PrivacyContainer = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  height: 18px;
  width: 44px;
  border-radius: 4px;
  background: ${palette.grey900};
  :hover {
    background: ${palette.grey920};
  }
`;

export const PrivacyText = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-family: 'Space Grotesk';
    font-weight: 600;
    font-size: 12px;
  }
`;

export const HeaderContributorsAmount = styled(Typography)`
  && {
    font-weight: 600;
    font-size: 13px;
    color: ${palette.white};
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

export const HeaderContributorsText = styled(HeaderContributorsAmount)`
  && {
    color: ${palette.grey51};
    font-weight: 600;
    width: max-content;
  }
`;

export const BoardsSubheaderWrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ isMobile }) => (isMobile ? 'none' : '1fr 1fr')};
  grid-row-gap: 20px;
  align-items: center;
  width: 95%;
  margin-top: 4px;

  ${({ theme }) => theme.breakpoints.down('large')} {
    grid-template-columns: 1fr;
  }
`;

export const Container = styled.div`
  width: 95%;
  margin-top: 24px;
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
