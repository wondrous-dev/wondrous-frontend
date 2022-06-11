import React from 'react';
import styled from 'styled-components';
import { Divider, Drawer, IconButton, List, ListItem, Typography } from '@material-ui/core';
import { Black99, White } from '../../theme/colors';
import { SIDEBAR_WIDTH } from 'utils/constants';

export const DrawerComponent = styled(Drawer)`
  && {
    & .MuiDrawer-paperAnchorDockedLeft {
      background-color: ${Black99};
      z-index: 199;
      margin-top: 50px;
      transition: 0.3s;
    }

    &.active .MuiDrawer-paperAnchorDockedLeft {
      left: -80px;
    }
  }
`;

export const DrawerContainer = styled.div`
  width: ${SIDEBAR_WIDTH};
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 50px;
`;

export const DrawerTopBlock = styled.div`
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const DrawerUserImage = styled.img`
  display: flex;
  margin: 0 auto;
  width: 48px;
  height: 48px;
`;

export const DrawerTopBlockItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;
`;

export const DrawerList = styled(List)`
  && {
    min-height: 152px;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-content: center;
    justify-content: flex-start;
    padding: 0;
    margin: 1em auto;
  }
`;
export const DrawerListItem = styled(ListItem)`
  & {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    padding: 0.5em auto;
    margin: 0.5em auto;
  }
`;

export const DrawerListItemIcon = styled.img`
  width: 36px;
  height: 36px;
`;

export const DrawerBottomBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 120px;
`;
export const DrawerBottomButton = styled(IconButton)`
  && {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      background: linear-gradient(283.63deg, rgba(75, 75, 75, 0.6) 11.03%, rgba(35, 35, 35, 0.6) 92.07%);
    }
  }
`;

export const DrawerBackButton = styled(DrawerBottomButton)`
  && {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);

    transition: transform 0.2s;

    &.active {
      transform: rotate(180deg);
    }
  }
`;

export const NoLogoDAO = styled.div`
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: 36px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: linear-gradient(0deg, #141414 0%, #474747 219.88%, rgba(20, 20, 20, 0) 219.9%);
`;

export const StyledDivider = styled(Divider)`
  && {
    border: 1px solid #4b4b4b;
    width: 36px;
  }
`;

export const StyledDividerDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 32px;
`;

export const PodButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`;

export const PodModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const PodModalFooterInfoWrapper = styled.div`
  background: linear-gradient(0deg, rgba(196, 196, 196, 0.07), rgba(196, 196, 196, 0.07)), #0f0f0f;
  border-radius: 4px;
  padding: 4px 8px;
  margin-right: 8px;
`;

export const PodModalFooterInfoWrapperText = styled(Typography)`
  && {
    color: ${White};
    font-size: 13px;
  }
`;
