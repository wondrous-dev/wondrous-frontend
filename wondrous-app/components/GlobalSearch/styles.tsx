import styled from 'styled-components';
import Typography from '@mui/material/Typography';

import palette from 'theme/palette';
import typography from 'theme/typography';
import { Input } from 'components/SearchTasks/styles';
import { SearchIconWrapped } from 'components/SearchTasks/styles';

export const GlobalSearchWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  position: relative;
  min-width: 40px;
  cursor: pointer;
  border-radius: 6px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: ${({ isExpanded }) => (isExpanded ? 'linear-gradient(90deg, #ccbbff 1.14%, #7427ff 100.09%)' : '')};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
  &:hover ${SearchIconWrapped} {
    path {
      stroke: url(#linear);
    }
  }
`;

export const SearchInput = styled(Input)`
  && {
    .MuiOutlinedInput-root {
      width: 100%;
      padding-left: 12px;
      background: ${palette.background.default};
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      .MuiOutlinedInput-input {
        z-index: 100;
      }
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
  overflow: scroll;
  max-height: 60vh;
  border: 0.5px solid ${palette.grey85};
`;

export const SearchResultCategory = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid ${palette.grey85};
`;

export const SearchResultItem = styled.li`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  img {
    max-height: 29px;
    max-width: 29px;
    border-radius: 6px;
  }
`;

export const SearchResultCategoryTitle = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: ${typography.body1.fontSize};
    letter-spacing: ${typography.body1.letterSpacing};
    font-weight: ${typography.h1.fontWeight};
    font-family: ${typography.fontFamily};
  }
`;

export const SearchInputWrapper = styled.div`
  transition: width 0.3s;
  background: transparent;
  width: ${({ isExpanded }) => (isExpanded ? '100%' : '0%')};
  overflow: hidden;
  .MuiFormControl-root {
    margin: 0;
  }
`;

export const SearchIconWrapper = styled.div`
  background: ${palette.background.default};
  height: 40px;
  min-width: 40px;
  justify-content: center;
  align-items: center;
  display: flex;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  transition: border-radius 0.3s;
  ${({ isExpanded }) => !isExpanded && 'border-radius: 6px;'};
`;
