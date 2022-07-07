import React, { useState, useCallback } from 'react';
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
  ExplorePageFooter,
  MetheorSvg,
  PartnershipRequest,
  PartnershipRequestHeader,
  PartnershipRequestSubheader,
} from './styles';
import { useIsMobile } from 'utils/hooks';
import { Button } from 'components/Button';
import { gridMobileStyles, TABS_LABELS } from './constants';
import { DaoSection, BountySection } from './sections';
import { DaosCube, BountyCone } from 'components/Icons/ExplorePageIcons';
import { useQuery } from '@apollo/client';
import { GET_BOUNTIES_TO_EXPLORE } from 'graphql/queries/task';
import palette from 'theme/palette';

const LIMIT = 10;

const ExploreComponent = () => {
  const [minimized, setMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [hasMoreBounties, setHasMoreBounties] = useState(true);
  const isMobile = useIsMobile();
  const {
    data: bounties,
    loading,
    error,
    fetchMore,
  } = useQuery(GET_BOUNTIES_TO_EXPLORE, {
    variables: {
      limit: LIMIT,
      offset: 0,
    },
    onCompleted: ({ getBountiesToExplore }) => {
      if (getBountiesToExplore.length < LIMIT && hasMoreBounties) setHasMoreBounties(false);
    },
  });

  const getBountiesToExploreFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: bounties?.getBountiesToExplore.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setHasMoreBounties(fetchMoreResult?.getBountiesToExplore?.length >= LIMIT);
        const getBountiesToExplore = [...prev?.getBountiesToExplore, ...fetchMoreResult?.getBountiesToExplore];
        return {
          getBountiesToExplore,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [bounties?.getBountiesToExplore, fetchMore]);

  const tabs = [
    {
      title: 'Explore DAOs',
      action: () => setActiveTab(TABS_LABELS.DAOS),
      color: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
      hoverColor: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
      key: TABS_LABELS.DAOS,
      rotateDeg: '20deg',
      icon: <DaosCube />,
    },
    {
      title: 'Explore work',
      color: 'linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)',
      rotateDeg: '-70deg',
      action: () => setActiveTab(TABS_LABELS.BOUNTY),
      iconPseudoStyleWidth: '110%',
      key: TABS_LABELS.BOUNTY,
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
            paddingBottom: '0px',
          }}
        >
          <BackgroundContainer style={isMobile ? gridMobileStyles : {}}>
            <BackgroundImg src="/images/explore/explore-page-banner.svg" />
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
                  isActive={activeTab === tab.key}
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
              <BountySection
                isMobile={isMobile}
                bounties={bounties?.getBountiesToExplore}
                fetchMore={getBountiesToExploreFetchMore}
                hasMore={hasMoreBounties}
              />
            )}
          </ExplorePageContentWrapper>
          <ExplorePageFooter>
            <BackgroundImg src="/images/explore/explore-page-footer-bg.svg" />
            <MetheorSvg />
            <PartnershipRequest>
              <PartnershipRequestHeader>Become a partner.</PartnershipRequestHeader>
              <PartnershipRequestSubheader>Want your organization to use Wonder?</PartnershipRequestSubheader>
              <Button
                style={{
                  textDecoration: 'none',
                  color: palette.white,
                  alignSelf: 'center',
                  marginTop: '28px',
                }}
              >
                <a
                  style={{
                    textDecoration: 'none',
                    color: palette.white,
                  }}
                  href="https://ffc0pc28hgd.typeform.com/to/txrIA5p1"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sign up here!
                </a>
              </Button>
            </PartnershipRequest>
          </ExplorePageFooter>
        </OverviewComponent>
      </SideBarContext.Provider>
    </>
  );
};

export default ExploreComponent;
