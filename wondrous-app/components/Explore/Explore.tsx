import React, { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from 'utils/hooks';
import { Button } from 'components/Button';
import MuiButton from '@mui/material/Button';
import { Box } from '@mui/material';

import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import { DaosCube, BountyCone, GR15DEI } from 'components/Icons/ExplorePageIcons';
import { useQuery } from '@apollo/client';
import { FILTER_BOUNTIES_TO_EXPLORE } from 'graphql/queries/task';
import { useRouter } from 'next/router';
import palette from 'theme/palette';
import { GR15DEICategoryName, LINK, TABS_LABELS } from 'utils/constants';
import { gridMobileStyles } from 'utils/styles';

import BountySection from 'components/BountySection';
import DaoSection from 'components/DaoSection';
import ExploreFilters from 'components/ExploreFilters';

import ChooseEntityToCreate from 'components/CreateEntity';
import styles, {
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
import { OverviewComponent } from '../Wrapper/styles';

const LIMIT = 10;

function ExploreComponent() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(null);
  const [hasMoreBounties, setHasMoreBounties] = useState(true);
  const router = useRouter();
  const {
    data: bounties,
    fetchMore,
    refetch,
    variables,
  } = useQuery(FILTER_BOUNTIES_TO_EXPLORE, {
    variables: {
      input: {
        limit: LIMIT,
        offset: 0,
      },
    },
    onCompleted: ({ getTaskExplore }) => {
      if (getTaskExplore.length < LIMIT && hasMoreBounties) setHasMoreBounties(false);
      if (getTaskExplore.length === LIMIT) setHasMoreBounties(true);
    },
  });

  const [openFilters, setOpenFilters] = useState(false);

  const getTaskExploreFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        input: {
          ...variables.input,
          offset: bounties?.getTaskExplore.length,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setHasMoreBounties(fetchMoreResult?.getTaskExplore?.length >= LIMIT);
        const getTaskExplore = [...prev?.getTaskExplore, ...fetchMoreResult?.getTaskExplore];
        return {
          getTaskExplore,
        };
      },
    }).catch((error) => {
      console.error(error);
    });
  }, [bounties?.getTaskExplore, fetchMore, variables]);

  const filterBounties = useCallback(
    (filters) => {
      refetch({ input: { ...variables.input, limit: LIMIT, offset: 0, ...filters } });
    },
    [refetch, variables]
  );

  const getGr15ExploreTasks = useCallback(() => {
    filterBounties({
      category: GR15DEICategoryName,
    });
  }, [filterBounties]);

  const handleTabClick = (tab) => {
    if (tab === activeTab) {
      setActiveTab(null);
    } else if (activeTab === null && router.query.tab === tab) {
      setActiveTab(tab);
    } else {
      router.push({ query: { tab } }, undefined, {
        shallow: true,
      });
    }
  };

  const tabs = [
    {
      title: 'Explore Projects',
      action: () => handleTabClick(TABS_LABELS.ORGS),
      color: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
      hoverColor: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
      key: TABS_LABELS.ORGS,
      rotateDeg: '20deg',
      icon: <DaosCube />,
    },
    {
      title: 'Explore work',
      color: 'linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)',
      rotateDeg: '-70deg',
      action: () => {
        handleTabClick(TABS_LABELS.BOUNTY);
      },
      iconPseudoStyleWidth: '110%',
      key: TABS_LABELS.BOUNTY,
      icon: <BountyCone />,
      hoverColor: 'linear-gradient(88.88deg, #525252 24.45%, #FFD653 91.22%)',
    },
    // {
    //   title: 'GR15 Members',
    //   color: 'linear-gradient(91.14deg, #C1ADFE 1.96%, #83CCB9 48.21%, #FBA3B8 98.48%, #FFE98A 130.65%)',
    //   hoverColor: 'linear-gradient(91.14deg, #C1ADFE 1.96%, #83CCB9 48.21%, #FBA3B8 98.48%, #FFE98A 130.65%)',
    //   action: () => {
    //     handleTabClick(TABS_LABELS.GR15_DEI);
    //   },
    //   key: TABS_LABELS.GR15_DEI,
    //   rotateDeg: '-40deg',
    //   icon: <GR15DEI />,
    // },
  ];

  useEffect(() => {
    if (router?.query?.tab && activeTab !== router?.query?.tab) {
      setActiveTab(router.query?.tab);
      if (router?.query?.tab === TABS_LABELS.GR15_DEI) {
        getGr15ExploreTasks();
      } else if (router?.query?.tab === TABS_LABELS.BOUNTY) {
        filterBounties({ category: undefined });
      }
    }
  }, [router.query?.tab, getGr15ExploreTasks, filterBounties]);

  return (
    <OverviewComponent
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <TaskViewModalWatcher />
      <ChooseEntityToCreate />
      <BackgroundContainer style={isMobile ? gridMobileStyles : {}}>
        <BackgroundImg src="/images/explore/explore-page-banner.svg" />
        <Wheel />
        <BackgroundTextWrapper>
          <BackgroundTextHeader>Enter the project metaverse</BackgroundTextHeader>
          <BackgroundTextSubHeader>Earn crypto by contributing to your favorite web3 projects</BackgroundTextSubHeader>
        </BackgroundTextWrapper>
      </BackgroundContainer>
      <Box sx={{ display: 'flex', width: '100%', position: 'relative' }}>
        {activeTab === TABS_LABELS.BOUNTY && (
          <ExploreFilters open={openFilters} setOpen={setOpenFilters} updateFilter={filterBounties} />
        )}
        <ExplorePageContentWrapper filtersOpen={activeTab === TABS_LABELS.BOUNTY && openFilters}>
          <TabsWrapper>
            {activeTab === TABS_LABELS.BOUNTY && (
              <MuiButton sx={styles.filterButton} onClick={() => setOpenFilters(!openFilters)}>
                Add filters
              </MuiButton>
            )}
            <Box
              sx={{
                ml: activeTab === TABS_LABELS.BOUNTY ? 'none' : 'auto',
                mr: 'auto',
                display: 'flex',
                gap: 3,
              }}
            >
              {tabs.map((tab, idx) => (
                <Tab
                  hoverColor={tab.hoverColor}
                  iconPseudoStyleWidth={tab.iconPseudoStyleWidth}
                  key={tab.key}
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
            </Box>
          </TabsWrapper>
          {(activeTab === null || activeTab === TABS_LABELS.BOUNTY) && (
            <BountySection
              bounties={bounties?.getTaskExplore}
              fetchMore={getTaskExploreFetchMore}
              hasMore={hasMoreBounties}
              gr15DEI={false}
            />
          )}
          {(activeTab === null || activeTab === TABS_LABELS.ORGS) && <DaoSection isMobile={isMobile} />}
          {/* {(activeTab === null || activeTab === TABS_LABELS.GR15_DEI) && (
            <BountySection
              bounties={bounties?.getTaskExplore}
              fetchMore={getTaskExploreFetchMore}
              hasMore={hasMoreBounties}
              gr15DEI
            />
          )} */}
        </ExplorePageContentWrapper>
      </Box>

      {activeTab === TABS_LABELS.ORGS && (
        <ExplorePageFooter>
          <BackgroundImg src="/images/explore/explore-page-footer-bg.svg" />
          <MetheorSvg />
          <PartnershipRequest>
            <PartnershipRequestHeader>Launch you own project.</PartnershipRequestHeader>
            <PartnershipRequestSubheader>Want your organization to use Wonder?</PartnershipRequestSubheader>
            <Button marginTop="28px">
              <a
                style={{
                  textDecoration: 'none',
                  color: palette.white,
                }}
                href={`${LINK}/onboarding-dao`}
                target="_blank"
                rel="noreferrer"
              >
                Launch Project
              </a>
            </Button>
          </PartnershipRequest>
        </ExplorePageFooter>
      )}
    </OverviewComponent>
  );
}

export default ExploreComponent;
