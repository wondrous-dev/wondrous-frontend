import { InputUnstyled } from '@mui/base';
import { ButtonBase, Typography } from '@mui/material';
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
  gap: 12px;
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

export const DaoNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
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

export const EditButton = styled(ButtonBase)`
  && {
    align-items: center;
    background: #282828;
    border-radius: 4px;
    gap: 6px;
    height: 26px;
    justify-content: center;
    padding: 10px 7px;
    display: flex;
  }
`;

export const EditButtonText = styled(Typography)`
  && {
    align-items: center;
    color: ${({ theme }) => theme.palette.highlightBlue};
    display: flex;
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    line-height: 0;
  }
`;

export const EditInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const EditInput = styled(InputUnstyled)`
  && {
    width: 70%;
    height: 26px;
    .MuiInput-input {
      background: transparent;
      border-radius: 4px;
      border: 1px solid #282828;
      color: ${({ theme }) => theme.palette.white};
      font-family: 'Space Grotesk';
      font-size: 14px;
      font-weight: 500;
      height: 100%;
      width: 100%;
      padding: 4px 7px;
      :focus-visible {
        outline: none;
      }
    }
  }
`;
