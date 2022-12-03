import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { greyColors } from 'theme/colors';
import palette from 'theme/palette';

export const Flex = styled.div`
  flex: 1;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const CenteredFlexRow = styled(FlexRow)`
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.marginTop || 0};
`;

export const NewCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
`;

export const ErrorText = styled(Typography)`
  && {
    color: ${palette.red400};
    font-size: 13px;
    margin-top: 5px;
  }
`;
