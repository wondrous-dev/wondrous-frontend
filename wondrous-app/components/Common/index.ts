import { Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const CenteredFlexRow = styled(FlexRow)`
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.marginTop || 0};
`;

export const ErrorText = styled(Typography)`
  && {
    color: ${palette.red400};
    font-size: 13px;
    margin-top: 5px;
  }
`;
