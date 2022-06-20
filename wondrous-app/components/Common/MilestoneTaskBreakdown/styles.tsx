import styled from 'styled-components';
import { Box } from '@mui/material';

export const StyledTableContainer = styled.div``;

export const StyledBoxWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const StyledBox = styled(Box)`
  background: #0f0f0f;
  border-radius: 6px;
  display: flex;
  align-items: center;
  width: calc(33% - 4px);
  color: #ccbbff;
  font-size: 14px;
  font-weight: 500;
  padding: 6px;
  gap: 10px;
`;
