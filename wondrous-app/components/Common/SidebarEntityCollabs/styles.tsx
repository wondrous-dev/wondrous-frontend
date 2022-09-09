import { Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const CreateButton = styled.button`
  border-radius: 4px;
  background: transparent;
  height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  border: 0;
  color: ${palette.white};
  background: ${({ isActive, theme }) => isActive && `${theme.palette.black101}`};
  justify-content: flex-start;
  gap: 9px;
  font-family: ${typography.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;

  :hover {
    background: ${palette.grey58};
  }
`;

export const CollabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CollabsWrapper = styled.a`
  display: flex;
  flex-direction: column;
  cursor: ${({ isPending }) => !isPending && 'pointer'};
  gap: 6px;
  padding: 8px;
  background: ${palette.grey99};
  border-radius: 4px;
  text-decoration: none;
  :hover {
    background: ${({ isPending }) => !isPending && palette.grey58};
  }
`;

export const CollabRequestTitle = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    color: ${palette.white};
    opacity: ${({ isPending }) => (isPending ? '0.4' : '1')};
  }
`;

export const CollabRequestAction = styled.button`
  border: 0;
  font-family: ${typography.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  background: 0;
  cursor: pointer;
  text-align: left;
  color: ${palette.white};
  :hover {
    color: ${palette.grey58};
  }
`;

export const CollabRequestLogoWrapper = styled.div`
  display: flex;
  gap: 8px;
  font-family: ${typography.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 16px;
  color: ${palette.grey250};
  align-items: center;
  opacity: ${({ isPending }) => (isPending ? '0.4' : '1')};
`;
