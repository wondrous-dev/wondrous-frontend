import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { MentionsInput, Mention } from 'react-mentions';
import { White } from '../../theme/colors';

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
    color: ${White};
    margin-left: 4px;
  }
`;

export const StyledMention = styled(Mention).attrs`

`;
