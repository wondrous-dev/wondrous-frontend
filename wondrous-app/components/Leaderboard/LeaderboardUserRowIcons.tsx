import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LeaderboardGoldIcon from 'components/Icons/leaderboardGold.svg';
import LeaderboardSilverIcon from 'components/Icons/leaderboardSilver.svg';
import LeaderboardBronzeIcon from 'components/Icons/leaderboardBronze.svg';
import LeaderboardPurpleIcon from 'components/Icons/leaderboardPurple.svg';

const LeaderboardIcon = ({ colorStart, colorEnd, Icon, label, noShadow = false }) => (
  <Grid
    container
    item
    position="relative"
    width="22px"
    height="22px"
    alignItems="center"
    justifyContent="center"
    sx={{
      filter: !noShadow && `drop-shadow(0px 0px 4px ${colorEnd})`,
    }}
  >
    <Grid container item alignItems="center" justifyContent="center" zIndex="2">
      <Typography
        fontSize="11px"
        fontWeight="700"
        alignItems="center"
        textAlign="center"
        bgcolor={colorEnd}
        lineHeight="1"
        sx={{
          backgroundImage: `linear-gradient(180deg, ${colorStart} 0%, ${colorEnd} 50.52%)`,
          backgroundSize: '100%',
          backgroundRepeat: 'repeat',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {label}
      </Typography>
    </Grid>
    <Grid container item position="absolute" width="fit-content" zIndex="1">
      <Icon />
    </Grid>
  </Grid>
);

const LeaderboardGold = (props) => (
  <LeaderboardIcon colorStart="#FFE7B6" colorEnd="#f8b62d" Icon={LeaderboardGoldIcon} label={1} />
);

const LeaderboardSilver = (props) => (
  <LeaderboardIcon
    colorEnd="#9DB4B6"
    colorStart="linear-gradient(180deg, #E4E4E4 0%, #9DB4B6 54.69%)"
    Icon={LeaderboardSilverIcon}
    label={2}
  />
);

const LeaderboardBronze = (props) => (
  <LeaderboardIcon
    colorEnd="#F58F16"
    colorStart="linear-gradient(180deg, #FFD39E0%, #F58F16 54.69%)"
    Icon={LeaderboardBronzeIcon}
    label={3}
  />
);

const LeaderboardPurple = ({ index }) => (
  <LeaderboardIcon
    colorEnd="#CCBBFF"
    colorStart="linear-gradient(180deg, #F58F16, #CCBBFF, 54.69%)"
    Icon={LeaderboardPurpleIcon}
    label={index + 1}
    noShadow
  />
);

const LeaderboardUserRowIcons = ({ index }) => {
  const icons = [LeaderboardGold, LeaderboardSilver, LeaderboardBronze, LeaderboardPurple];
  const SelectedIcon = icons.at(index) ?? icons.at(-1);
  return <SelectedIcon index={index} />;
};

export default LeaderboardUserRowIcons;
