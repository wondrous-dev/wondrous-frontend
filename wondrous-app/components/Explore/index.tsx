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
    username: 'BanklessDAOlationships',
    imageUrl: 'https://pbs.twimg.com/profile_images/1389400052448247816/qsOU0pih_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1380589844838055937/1634756837/1500x500',
    bio: 'Manage and build relationships across the universe of DAOs as part of BanklessDAO',
    name: 'Bankless DAOlationships',
  },
  {
    username: 'Radicle',
    imageUrl: 'https://pbs.twimg.com/profile_images/1372563232850870274/aREQff_C_400x400.jpg',
    bio: 'A peer-to-peer stack for building software together 🌞',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1054235330516320257/1606739593/1500x500',
    name: 'Radicle',
  },
  {
    username: 'dYdX',
    imageUrl: 'https://pbs.twimg.com/profile_images/1422398038904123409/1t8muDVp_400x400.jpg',
    bio: 'Empowering traders with powerful & decentralized infrastructure. Trade & stake to earn rewards, and vote on the future of dydx',
    headerUrl: 'https://pbs.twimg.com/profile_banners/909929047626354688/1614178652/1500x500',
    name: 'dYdX',
  },
  {
    username: 'Gitcoin',
    imageUrl: 'https://pbs.twimg.com/profile_images/1461700151383400450/3Kwlnvl__400x400.png',
    bio: "Gitcoin is where the world's leading web3 projects are born, validated & funded.",
    headerUrl: 'https://pbs.twimg.com/profile_banners/856446453157376003/1654125991/1500x500',
    name: 'Gitcoin',
  },
  {
    username: 'PrimeDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1399376178453090305/RJD82RrV_400x400.jpg',
    bio: 'Building tools that turn DeFi into a cooperative ecosystem. #DAO2DAO products and services.',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1280797106886901761/1622472257/1500x500',
    name: 'Prime DAO',
  },
  {
    username: 'talentDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1492177780791861253/aK138-gB_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1468727203219193859/1651863023/1500x500',
    bio: 'Unlock talent | Decentralize knowledge | #DeSci DAO Building the Journal of Decentralized Work',
    name: 'Talent DAO',
  },
  {
    username: 'MetricsDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1453392380250443782/UC8erEKz_400x400.png',
    bio: 'Uniting the best analytical minds in the space to build the future of crypto analytics.',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1451248797582077954/1643664064/1500x500',
    name: 'MetricsDAO',
  },
  {
    username: 'colorsxdao',
    imageUrl: 'https://pbs.twimg.com/profile_images/1532037515074383873/9rufaHjb_400x400.jpg',
    bio: 'A global community of creatives supporting each other across disciplines.',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1485243400379158532/1654101182/1500x500',
    name: 'Colors DAO',
  },
  {
    username: 'yup',
    imageUrl: 'https://pbs.twimg.com/profile_images/1489008618712096770/T2FtCQJL_400x400.jpg',
    bio: '✺ curate ✺ NFTs, Tweets, Videos, Tokens, Articles, Songs... you get the idea',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1678435962/1633377828/1500x500',
    name: 'Yup',
  },
  {
    username: 'ReadyPlayerDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1499459429304979470/8XBS173g_400x400.png',
    bio: 'The future of gaming is decentralized and permissionless, and this time, the players are in charge.',
    name: 'Ready Player DAO',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1420405430400991236/1638824655/1500x500',
  },
  {
    username: 'Stems',
    imageUrl: 'https://pbs.twimg.com/profile_images/1516504445726588933/YHGzp2MT_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1449068116663754760/1651273720/1500x500',
    bio: 'make music with your favorite artist',
    name: 'StemsDAO',
  },
  {
    username: 'blu3dao',
    imageUrl: 'https://pbs.twimg.com/profile_images/1488749682251628553/c7l6JtMr_400x400.png',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1488735321319612418/1643780570/1500x500',
    bio: '🦋 making the impossible, possible. ✨ a DAO focused on empowering women & non-binary people to earn, learn & play in web3 via mentorship, community & funding',
    name: 'Blu3 DAO',
  },
  {
    username: 'harmony',
    imageUrl: 'https://pbs.twimg.com/profile_images/1526408675186790400/Tc9iFPMC_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1006055524666826754/1652811355/1500x500',
    bio: 'Harmony is an open and fast layer-1 blockchain: Our mainnet runs Ethereum applications with 2-second transaction finality and 100 times lower fees.',
    name: 'Harmony',
  },
  {
    username: 'bobanetwork',
    imageUrl: 'https://pbs.twimg.com/profile_images/1428352421160394754/y8NXfOmP_400x400.png',
    headerUrl: 'https://pbs.twimg.com/profile_banners/831847934534746114/1648941627/1500x500',
    bio: 'Lower gas, faster, secured in Ethereum, supercharged with Hybrid Compute: bridge at http://gateway.boba.network',
    name: 'Boba Network',
  },
  {
    username: 'Layer2DAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1481858736935215105/AXt1mSp__400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1480302068602576897/1642437751/1500x500',
    bio: 'Layer2DAO invests in promising L2 ecosystem projects.',
    name: 'Layer2 DAO',
  },
  {
    username: 'RVRSProtocol',
    name: 'Reverse Protocol',
    imageUrl: 'https://pbs.twimg.com/profile_images/1518631802360971264/U5sZ3gRA_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1452749248831819781/1650908414/1500x500',
    bio: '#DeFi 2.0 protocol generating passive income for $RVRS stakers through a community governed treasury ',
  },
  {
    username: 'atlantis0x',
    name: 'Atlantis World',
    bio: 'Web3 social, gaming and education in one lightweight metaverse 🎮',
    imageUrl: 'https://pbs.twimg.com/profile_images/1533910925077467137/szDWfd81_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1396594850598957061/1650731101/1500x500',
  },
  {
    username: 'jokedao',
    name: 'jokedao',
    bio: 'bottom-up, on-chain governance. for user-generated roadmaps, grants, endorsements, bounties, curation, and community-driven decisions',
    imageUrl: 'https://pbs.twimg.com/profile_images/1488257098018430979/pon20B_g_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1483660647858638851/1642618802/1500x500',
  },
  {
    username: 'Lobby3',
    name: 'Lobby3',
    bio: 'Join our fight to advance economic opportunity and Web3 technology in D.C. 👾',
    imageUrl: 'https://pbs.twimg.com/profile_images/1501218472973504512/xWitV8PR_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1483865970724589568/1645050021/1500x500',
  },
  {
    username: 'clubrareNFT',
    name: 'ClubRare',
    bio: 'Buy, sell, and trade IRL collectibles on the premiere NFT marketplace for physical goods. Gear Up for the metaverse, the mall, and beyond. $MPWR 🚀',
    imageUrl: 'https://pbs.twimg.com/profile_images/1532032190904680451/rG_Dodiu_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1420196888330981377/1653600728/1500x500',
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
              objectFit: 'cover',
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
            padding: '40px',
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Background>
            <BackgroundText>
              Where world-changing DAOs <br />
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
