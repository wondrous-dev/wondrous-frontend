import React from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@mui/material';

import { Tag, Text } from 'components/styled';
import { Role } from 'types/common';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import PodIconWithoutBg from 'components/Icons/podIconWithoutBg';
import typography from 'theme/typography';
import palette from 'theme/palette';

export const Container = styled.div`
  color: white;
  margin: 23px 0;
  padding: 14px 0;
  line-height: 28px;
  align-items: center;
  font-weight: 500;
  font-size: 15px;
  border-top: 1px solid #232323;
  border-bottom: 1px solid #232323;
`;

export const PodMembers = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  svg {
    margin: 0 8px;
  }
`;

export const Avatars = styled.div`
  border: 1px solid #6accbc;
  border-radius: 190px;
  padding: 2px;
  height: 34px;
  position: relative;

  img {
    height: 30px;
    width: 30px;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
    top: 1px;
  }
`;

export const MemberRole = styled(Button)`
  && {
    min-width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 500;
    color: ${palette.white};
    padding: 2px 7px;
    border: 1px solid ${(props) => (props.borderColor ? props.borderColor : palette.white)};
    border-radius: 1000px;

    background: ${(props) => (props.isActive ? `${props.borderColor}66` : 'transparent')};
  }
`;
