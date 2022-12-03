import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';

export const ListType = styled.ul`
  color: white;
`;

export const DiscordTitle = styled(Typography)`
  && {
    font-size: 24px;
    color: ${palette.white};
    font-weight: bolder;
  }
`;

export const DiscordParagraph = styled(Typography)`
  && {
    font-size: 16px;
    color: ${palette.white};
    margin-top: 20px;
    max-width: 1020px;
  }
`;

export const BoldParagraph = styled(DiscordParagraph)`
  && {
    font-weight: bolder;
  }
`;

export const ListItem = styled.li`
  margin-top: -8px;
`;

export const BoldSpan = styled.span`
  font-weight: bolder;
`;

export const SmallerTopParagraph = styled(DiscordParagraph)`
  && {
    margin-top: 12px;
  }
`;
