import styled from 'styled-components';
import Typography from '@mui/material/Typography';

import palette from 'theme/palette';
import typography from 'theme/typography';
import { Input } from 'components/SearchTasks/styles';

export const GlobalSearchWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: ${palette.background.default};
  border-radius: 4px;
  height: 40px;
  position: relative;
`;

export const SearchInput = styled(Input)`
  && {
    .MuiOutlinedInput-root {
      width: 100%;
      background: ${palette.background.default};
    }
  }
`;

export const SearchResults = styled.div`
  background: ${palette.background.default};
  top: 110%;
  position: absolute;
  width: fit-content;
  min-width: 100%;
  border-radius: 6px;
`;

export const SearchResultCategory = styled.ul``;

export const SearchResultItem = styled.li``;

export const SearchResultCategoryTitle = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: ${typography.body1.fontSize};
    letter-spacing: ${typography.body1.letterSpacing};
    font-weight: ${typography.h1.fontWeight};
  }
`;
