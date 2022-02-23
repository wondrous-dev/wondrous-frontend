import React from 'react';
import styled from 'styled-components';
import { IconButton, Typography } from '@material-ui/core';

import { BaseCard } from '../../../Common/card';
import { LogoSquare } from '../../../Common/ci';

//cardStyles
export const PostsContainer = styled.div`
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

//cardStyles
export const PostComponent = styled(BaseCard)`
  margin-top: 22px;
  height: 540px;
`;

export const PostBlock = styled.div`
  position: relative;
  padding: 0 26px 18px;
  border-left: 1px solid #4b4b4b;
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

  border: 1px solid #4b4b4b;
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

export const PostTaskHeaderLogo = styled(LogoSquare)`
  width: 28px;
  height: 28px;
`;

export const PostTaskHeaderImage = styled.img`
  width: 28px;
  height: 28px;
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
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    display: flex;
    align-items: center;
    color: #ffffff;

    & svg {
      margin-right: 10px;
    }
  }
`;

export const PostComments = styled(PostLikes)``;
export const PostShares = styled(PostLikes)``;
