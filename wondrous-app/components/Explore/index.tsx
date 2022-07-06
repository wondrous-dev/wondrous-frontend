import React, { useState } from 'react';
import { SideBarContext } from 'utils/contexts';
import Header from '../Header';
import SideBarComponent from '../SideBar';
import { OverviewComponent } from '../Wrapper/styles';
import {
  BackgroundContainer,
  BackgroundTextWrapper,
  BackgroundTextHeader,
  BackgroundTextSubHeader,
  TabsWrapper,
  Tab,
  IconWrapper,
  BackgroundImg,
  Wheel,
  ExplorePageContentWrapper,
} from './styles';
import { useIsMobile } from 'utils/hooks';
import { gridMobileStyles, TABS_LABELS } from './constants';
import { DaoSection, BountySection } from './sections';
import { DaosCube, BountyCone } from 'components/Icons/ExplorePageIcons';

const ExploreComponent = () => {
  const [minimized, setMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const isMobile = useIsMobile();

  const tabs = [
    {
      title: 'Explore DAOs',
      action: () => setActiveTab(TABS_LABELS.DAOS),
      color: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
      hoverColor: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',

      rotateDeg: '20deg',
      icon: <DaosCube />,
    },
    {
      title: 'Explore work',
      color: 'linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)',
      rotateDeg: '-70deg',
      action: () => setActiveTab(TABS_LABELS.BOUNTY),
      iconPseudoStyleWidth: '110%',
      icon: <BountyCone />,
      hoverColor: 'linear-gradient(88.88deg, #525252 24.45%, #FFD653 91.22%)',
    },
  ];
  return (
    <>
      <Header />
      <SideBarContext.Provider
        value={{
          minimized,
          setMinimized,
        }}
      >
        <SideBarComponent />
        <OverviewComponent
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '40px',
          }}
        >
          <BackgroundContainer style={isMobile ? gridMobileStyles : {}}>
            <BackgroundImg src="/images/explore-page-banner.svg" />
            <Wheel />
            <BackgroundTextWrapper>
              <BackgroundTextHeader>Enter the project wormhole</BackgroundTextHeader>
              <BackgroundTextSubHeader>
                Join your next favorite project and ean crypto by contributing to one of our Partners
              </BackgroundTextSubHeader>
            </BackgroundTextWrapper>
          </BackgroundContainer>
          <ExplorePageContentWrapper>
            <TabsWrapper>
              {tabs.map((tab, idx) => (
                <Tab
                  hoverColor={tab.hoverColor}
                  iconPseudoStyleWidth={tab.iconPseudoStyleWidth}
                  key={idx}
                  onClick={tab.action}
                  type="button"
                  color={tab.color}
                  rotateDeg={tab.rotateDeg}
                >
                  <span>{tab.title}</span>
                  <IconWrapper>{tab?.icon}</IconWrapper>
                </Tab>
              ))}
            </TabsWrapper>
            {(activeTab === null || activeTab === TABS_LABELS.DAOS) && <DaoSection isMobile={isMobile} />}
            {(activeTab === null || activeTab === TABS_LABELS.BOUNTY) && (
              <BountySection isMobile={isMobile} bounties={[]} />
            )}
          </ExplorePageContentWrapper>
        </OverviewComponent>
      </SideBarContext.Provider>
    </>
  );
};

export default ExploreComponent;
