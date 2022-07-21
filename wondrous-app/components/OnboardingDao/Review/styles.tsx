import { Typography } from '@mui/material';
import Image from 'next/image';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const LabelWrapper = styled.div`
  min-width: 185px;
`;

export const LabelText = styled.div`
  align-items: center;
  background: #282828;
  border-radius: 4px;
  color: ${({ theme }) => theme.palette.blue20};
  display: flex;
  font-family: 'Space Grotesk';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  height: 26px;
  justify-content: center;
  padding: 4px 8px;
  width: fit-content;
`;

export const ChildrenWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Text = styled(Typography)`
  && {
    align-items: center;
    color: ${({ theme }) => theme.palette.white};
    display: flex;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 500;
  }
`;

export const Logo = styled(Image)`
  && {
    border-radius: 4px;
  }
`;

export const Category = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 26px;
  background: #141414;
  border-radius: 4px;
  padding: 4px 9px;
`;
