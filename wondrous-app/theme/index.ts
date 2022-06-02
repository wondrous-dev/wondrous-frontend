import { createTheme } from '@mui/material';
import palette from './palette';
import typography from './typography';
import components from './components';

const theme = createTheme({
  palette,
  typography,
  components,
});

export default theme;
