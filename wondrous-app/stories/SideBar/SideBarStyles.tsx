import styled from 'styled-components';
import { Divider, Drawer, IconButton, List, ListItem } from '@material-ui/core';

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

export const DrawerBottomBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 120px;
`;

export const DrawerComponent = styled(Drawer)`
  && {
    & .MuiDrawer-paperAnchorDockedLeft {
      background-color: #141414;
      z-index: 200;
      margin-top: 50px;
      transition: 0.3s;
    }

    &.active .MuiDrawer-paperAnchorDockedLeft {
      left: -80px;
    }
  }
`;

export const DrawerContainer = styled.div`
  width: 80px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 50px;
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

export const DrawerTopBlock = styled.div`
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const DrawerTopBlockItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;
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

export const PodButtonDiv = styled.div`
  display: flex;
  justify-content: center;
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
