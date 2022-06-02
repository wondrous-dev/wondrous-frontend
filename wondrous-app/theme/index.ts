import palette from './palette';
import typography from './typography';
import components from './components';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette,
  typography,
  components,
});

export default theme;
