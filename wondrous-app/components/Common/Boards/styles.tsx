import React from 'react';
import styled from 'styled-components';
import { Button, MenuItem, TextField } from '@material-ui/core';
import { Black92, White, Grey85 } from '../../../theme/colors';
import { Typography } from '@material-ui/core';
import { Masonry } from '@mui/lab';
export const BoardsContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 22px;
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

export const BoardsCardMedia = styled.div`
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
  width: 100%;
  margin-top: 12px;
`;
// BOARDS CARD SHARED UI COMPONENTS

export const BoardsCardSubheader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

export const BoardsCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;

export const BoardsCardBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

export const BoardsRewardLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  gap: 6px;
  background: #363636;
  border-radius: 35px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 14px;
  color: ${White};
  letter-spacing: 0.01em;
`;

export const BoardsPrivacyLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 8px;
  gap: 10px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  display: flex;
  align-items: center;
  background: #363636;
  border-radius: 4px;
  color: ${White};
`;

export const BoardsCardFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding-top: 10px;
  border-top: 1px solid ${Grey85};
  padding-bottom: 15px;
`;

export const BoardsCardBodyTitle = styled(Typography)`
  && {
    color: ${White};
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 23px;
  }
`;

export const BoardsCardBodyDescription = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    letter-spacing: 0.01em;
    color: #828282;
  }
`;

const CardsContainerInnerWrapper = styled.div`
  margin-top: 32px;
`;

export const CardsContainer = ({ isFullWidth, numberOfColumns, children }) => {
  return (
    <CardsContainerInnerWrapper>
      {isFullWidth ? (
        <div>{children}</div>
      ) : (
        <Masonry style={{ alignContent: 'flex-start' }} spacing={2} columns={{ xs: 1, sm: 2, lg: numberOfColumns }}>
          {children}
        </Masonry>
      )}
    </CardsContainerInnerWrapper>
  );
};
