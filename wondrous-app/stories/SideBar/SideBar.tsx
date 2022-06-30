import React from 'react';
import {
  DrawerBackButton,
  DrawerBottomBlock,
  DrawerBottomButton,
  DrawerComponent,
  DrawerContainer,
  DrawerList,
  DrawerListItem,
  DrawerTopBlock,
  DrawerTopBlockItem,
  NoLogoDAO,
  PodButtonDiv,
  StyledDivider,
  StyledDividerDiv,
} from './SideBarStyles';
import { DAOIcon, DefaultUserImage, PodButton, SettingsIcon, BackArrowIcon } from './icons';

export const SideBar = (props) => {
  const { minimized, onClick, item, isActive } = props;

  return (
    <DrawerComponent variant="permanent" anchor="left" className={minimized ? 'active' : ''}>
      <DrawerContainer>
        <DrawerTopBlock>
          <DrawerTopBlockItem id="tour-user-profile" onClick={onClick}>
            <DefaultUserImage />
          </DrawerTopBlockItem>
          <DrawerList id={'tour-sidebar-daos'}>
            <DrawerListItem button key={item} isActive={isActive}>
              <NoLogoDAO>
                <DAOIcon />
              </NoLogoDAO>
            </DrawerListItem>
            <StyledDividerDiv>
              <StyledDivider />
            </StyledDividerDiv>
            <PodButtonDiv>
              <PodButton
                style={{
                  cursor: 'pointer',
                }}
              />
            </PodButtonDiv>
          </DrawerList>
        </DrawerTopBlock>
        <DrawerBottomBlock>
          <DrawerBottomButton>
            <SettingsIcon />
          </DrawerBottomButton>
        </DrawerBottomBlock>
      </DrawerContainer>
      <DrawerBackButton onClick={onClick} className={minimized ? 'active' : ''}>
        <BackArrowIcon />
      </DrawerBackButton>
    </DrawerComponent>
  );
};
