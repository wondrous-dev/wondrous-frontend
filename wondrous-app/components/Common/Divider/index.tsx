import Box from '@mui/material/Box';
import styled from 'styled-components';
import palette from 'theme/palette';

const Divider = styled(Box)`
  border-top: 1px dashed ${palette.grey75};
  border-radius: 6px;
  height: 5px;
  width: 100%;
`;

export default Divider;
