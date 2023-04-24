import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  LevelsIcon,
  OnboardedIcon,
  QuestIcon,
} from 'components/Icons/HomePageIcons';
import Header from 'components/Navbar';
import { pinkColors } from 'utils/theme/colors';

const CARDS_CONFIG = [
  {
    title: 'Members Onboarded',
    count: 201,
    Icon: OnboardedIcon,
    bgColor: '#F8642D',
  },
  {
    title: 'Quests',
    count: 11,
    Icon: QuestIcon,
    bgColor: '#F8AFDB',
  },
  {
    title: 'Levels',
    count: 14,
    Icon: LevelsIcon,
    bgColor: '#84BCFF',
  },
];

const typographyStyles = {
  fontFamily: 'Poppins',
  fontWeight: 700,
  fontSize: '62px',
  color: 'black',
};

const CardsComponent = () => (
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
    {CARDS_CONFIG.map((card, idx) => (
      <Grid
        bgcolor={card.bgColor}
        display='flex'
        border='2px solid #000212'
        borderRadius='16px'
        flexDirection='column'
        justifyContent='center'
        flex='1'
        width='100%'
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
        <Typography
          fontFamily='Poppins'
          fontWeight={600}
          fontSize='28px'
          color='#06040A'
        >
          DegenGodz
        </Typography>
        <Typography
          fontFamily='Space Grotesk'
          fontWeight={600}
          fontSize='14px'
          lineHeight='14px'
          color='black'
        >
          10.9K Engagements Received
        </Typography>
      </Grid>
      <Grid flex='1' sx={{
        backgroundImage: 'url(/images/home-bg.png)',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }} position='relative'>
        <CardsComponent />
      </Grid>
    </Grid>
  );
};

export default HomePage;
