import {
  background,
  black,
  white,
  greyColors,
  redColors,
  blueColors,
  greenColors,
  yellowColors,
  violetColors,
  orangeColors,
  purpleColors,
  blackColors,
  midnight,
  highlightBlue,
  highlightPurple,
  highlightOrange,
  electricViolet,
  tundora,
  mineShaft,
} from 'theme/colors';

const palette = {
  primary: {
    main: '#161616',
    contrastText: white,
  },
  secondary: {
    main: blueColors.blue400,
    contrastText: white,
  },
  success: {
    main: greenColors.green400,
    contrastText: white,
  },
  background: {
    default: background,
  },
  white,
  black,
  midnight,
  highlightBlue,
  highlightPurple,
  highlightOrange,
  electricViolet,
  tundora,
  mineShaft,
  ...greyColors,
  ...redColors,
  ...blueColors,
  ...greenColors,
  ...yellowColors,
  ...violetColors,
  ...orangeColors,
  ...purpleColors,
  ...blackColors,
};

export default palette;
