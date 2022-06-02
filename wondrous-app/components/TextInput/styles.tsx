import { Typography } from '@mui/material';
import styled from 'styled-components';
import { Mention } from 'react-mentions';
import { white } from 'theme/colors';

export const UserSuggestionWrapper = styled.div`
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  top: 10px;
  div {
    top: 10px;
  }
`;

export const UserSuggestionTypography = styled(Typography)`
  && {
    color: ${white};
    margin-left: 4px;
  }
`;

export const StyledMention = styled(Mention).attrs`

`;
