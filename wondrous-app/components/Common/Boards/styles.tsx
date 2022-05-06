import React from 'react';
import styled from 'styled-components';
import { Button, MenuItem, TextField } from '@material-ui/core';
import { Black92 } from '../../../theme/colors';

export const BoardsContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 22px;
`;

export const BoardsActivity = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  & > div {
    margin-left: 18px;
    :first-child {
      margin: 0;
    }
  }
`;

export const BoardsActivityInput = styled(TextField)({
  '&.MuiTextField-root': {
    width: '100%',
    maxWidth: '100%',
    height: 40,
    backgroundColor: '#0F0F0F',
    borderRadius: 6,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    border: '1px solid #4B4B4B',
    marginRight: '8px',
  },
  '& .MuiInputBase-input': {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: '0.01em',
    color: '#C4C4C4',
  },
  '& .MuiInput-underline:before': {
    display: 'none',
  },
  '& .MuiInput-underline:after': {
    display: 'none',
  },
});

export const BoardsActivityFilterMenuItem = styled(MenuItem)`
  background-color: blue;
  border-radius: 4px;
`;

export const ResultsCount = styled.div`
  color: #6c6c6c;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid ${Black92};

  span {
    color: white;
  }
`;

export const SearchType = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: white;
  display: flex;
  align-items: center;
  margin-top: 47px;

  svg {
    margin-right: 15px;
  }
`;

export const ResultsCountRight = styled.div`
  display: flex;

  div {
    margin-left: 30px;
  }
`;

export const ShowAllSearchResults = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  margin: 19px 0 44px;
  &::before {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    background: #232323;
    top: 50%;
  }
`;

export const ShowAllButton = styled(Button)`
  && {
    color: white;
    font-weight: 500;
    font-size: 14px;
    background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
    width: 228px;
    height: 39px;
    padding: 7px 14px;
    display: flex;
    justify-content: space-between;

    svg {
      transform: rotate(270deg);
    }

    :hover {
      background: #3d3d3d;

      .MuiButton-label > div {
        background: #232323;
      }
    }
  }
`;
