import { Box } from '@mui/system';
import styled from 'styled-components';

const Divider = styled(Box)`
  border-top: 1px solid ${({ theme }) => theme.palette.grey75};
  border-radius: 6px;
  height: 5px;
  width: 100%;
`;

export default Divider;
