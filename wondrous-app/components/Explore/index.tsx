import React, { useCallback, useEffect, useState } from 'react';
import { PERMISSIONS, SIDEBAR_WIDTH } from '../../utils/constants';
import { SideBarContext } from '../../utils/contexts';
import WonderverseSvg from './wonderverse.svg';
import ReadyPlayerDAOSvg from './readyplayerdao.svg';
import Header from '../Header';
import SideBarComponent from '../SideBar';
import { OverviewComponent } from '../Wrapper/styles';
import {
  Background,
  BackgroundText,
  ExploreButton,
  OrgDescription,
  OrgName,
  StyledGridContainer,
  StyledGridItem,
  StyledGridItemContainer,
} from './styles';
import { SafeImage } from '../Common/Image';
import { Grid } from '@material-ui/core';
import { useRouter } from 'next/router';

const FeaturedList = [
  {
    username: 'wonderverse',
    imageUrl: 'https://pbs.twimg.com/profile_images/1457839097637060612/0t2GiVRC_400x400.png',
    bio: 'Helping DAOs succeed with web3 native collaboration tools.',
    headerImage: (
      <WonderverseSvg
        key="wonderverse"
        style={{
          width: '100%',
        }}
      />
    ),
    name: 'Wonderverse',
  },
  {
    username: 'ReadyPlayerDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1494802465069305858/6lmUwzeG_400x400.jpg',
    bio: 'The future of gaming is decentralized and permissionless, and this time, the players are in charge.',
    name: 'Ready Player DAO',
    headerImage: (
      <ReadyPlayerDAOSvg
        key="readyplayer"
        style={{
          width: '100%',
        }}
      />
    ),
  },
  {
    username: 'UnchainDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1497415345782415360/DaolUUU8_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1496831116971548678/1645823564/1500x500',
    bio: 'Co-ordinate Web3 efforts to fundraise for humanitarian aid in Ukraine',
    name: 'Unchain DAO',
  },
];

const OrgItem = ({ org }) => {
  const { username, headerUrl, bio, imageUrl, name, headerImage } = org;
  const router = useRouter();
  return (
    <StyledGridItemContainer item md={4}>
      <StyledGridItem key={username}>
        {headerImage && <>{headerImage}</>}
        {headerUrl && (
          <SafeImage
            style={{
              height: '279px',
              width: '100%',
              borderRadius: '12px 12px 0px 0px',
            }}
            src={headerUrl}
          />
        )}
        <div>
          <SafeImage
            src={imageUrl}
            style={{
              borderRadius: '5px',
              width: '64px',
              height: '64px',
              marginTop: '-32px',
              marginBottom: '16px',
              objectFit: 'cover',
            }}
          />
        </div>
        <OrgName>{name}</OrgName>
        <OrgDescription>{bio}</OrgDescription>
        <ExploreButton
          onClick={() => {
            router.push(`/organization/${username}/boards`, undefined, {
              shallow: true,
            });
          }}
        >
          Explore
        </ExploreButton>
      </StyledGridItem>
    </StyledGridItemContainer>
  );
};
const ExploreComponent = () => {
  const [minimized, setMinimized] = useState(false);
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
            overflow: 'scroll',
            padding: '40px',
          }}
        >
          <Background>
            <BackgroundText>
              Where world changing DAOs <br />
              are being built.
            </BackgroundText>
          </Background>
          <StyledGridContainer container spacing={2}>
            {FeaturedList.map((org, index) => (
              <OrgItem key={index} org={org} />
            ))}
          </StyledGridContainer>
        </OverviewComponent>
      </SideBarContext.Provider>
    </>
  );
};

export default ExploreComponent;
