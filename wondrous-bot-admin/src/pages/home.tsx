import { useQuery } from '@apollo/client';
import { CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  LevelsIcon,
  OnboardedIcon,
  QuestIcon,
} from 'components/Icons/HomePageIcons';
import Header from 'components/Navbar';
import { OrgProfilePicture } from 'components/Shared/ProjectProfilePicture';
import { GET_ORG_QUEST_STATS } from 'graphql/queries';
import { useContext, useEffect } from 'react';
import GlobalContext from 'utils/context/GlobalContext';
import { pinkColors } from 'utils/theme/colors';

const typographyStyles = {
  fontFamily: 'Poppins',
  fontWeight: 700,
  fontSize: '62px',
  color: 'black',
};

const CardsComponent = ({ cards }) => (
  <Grid
    container
    gap='24px'
    justifyContent='center'
    alignItems='center'
    position='absolute'
    top='-40%'
    padding={{
      xs: '14px',
      sm: '42px',
    }}
    direction={{
      xs: 'column',
      sm: 'row',
    }}
  >
    {cards.map((card, idx) => (
      <Grid
        bgcolor={card.bgColor}
        display='flex'
        key={`card-${idx}`}
        border='2px solid #000212'
        borderRadius='16px'
        flexDirection='column'
        justifyContent='center'
        flex='1'
        width='100%'
        padding='10px'
        alignItems='center'
      >
        <card.Icon />
        <Typography {...typographyStyles}>{card.count}</Typography>
        <Typography
          {...typographyStyles}
          letterSpacing='0.08em'
          fontSize='20px'
          fontWeight={600}
        >
          {card.title}
        </Typography>
      </Grid>
    ))}
  </Grid>
);

const HomePage = () => {
  const { activeOrg } = useContext(GlobalContext);

  const { data, loading } = useQuery(GET_ORG_QUEST_STATS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const { totalMembers, totalQuests, totalSubmissions } = data?.getOrgQuestStats || {};

  const CARDS_CONFIG = [
    {
      title: 'Members Onboarded',
      count: totalMembers,
      Icon: OnboardedIcon,
      bgColor: '#F8642D',
    },
    {
      title: 'Quests',
      count: totalQuests,
      Icon: QuestIcon,
      bgColor: '#F8AFDB',
    },
    {
      title: 'Levels',
      count: 10,
      Icon: LevelsIcon,
      bgColor: '#84BCFF',
    },
  ];

  return (
    <Grid display='flex' flexDirection='column' height='100%' minHeight='100vh'>
      <Grid
        flex='1'
        display='flex'
        justifyContent='center'
        alignItems='center'
        gap='8px'
        flexDirection='column'
      >
        <OrgProfilePicture
          profilePicture={activeOrg?.profilePicture}
          style={{
            width: '100px',
            height: '100px',
          }}
        />

        <Typography
          fontFamily='Poppins'
          fontWeight={600}
          fontSize='28px'
          color='#06040A'
        >
          {activeOrg?.name}
        </Typography>
        <Typography
          fontFamily='Poppins'
          fontWeight={600}
          fontSize='14px'
          lineHeight='14px'
          color='black'
        >
          {loading ? null : `${totalSubmissions} Submissions Received`}
        </Typography>
      </Grid>
      <Grid
        flex='1'
        sx={{
          backgroundImage: 'url(/images/home-bg.png)',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        position='relative'
      >
        {loading ? (
          <CircularProgress
            size={60}
            thickness={5}
            sx={{
              color: '#2A8D5C',
              animationDuration: '10000ms',
            }}
          />
        ) : (
          <CardsComponent cards={CARDS_CONFIG} />
        )}
      </Grid>
    </Grid>
  );
};

export default HomePage;
