import { InputUnstyled } from '@mui/base';
import { ButtonBase, Typography } from '@mui/material';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import Image from 'next/image';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
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
  align-items: flex-start;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  word-break: break-all;
`;

export const Text = styled(Typography)`
  && {
    align-items: center;
    color: ${({ theme }) => theme.palette.white};
    display: flex;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 500;
    width: 100%;
  }
`;

export const TextAndInputWrapper = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;
  cursor: pointer;
  width: 100%;
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

export const EditButton = styled(({ children, ...props }) => (
  <ButtonBase {...props}>
    <div>{children}</div>
  </ButtonBase>
))`
  && {
    align-items: stretch;
    background: #282828;
    border-radius: 4px;
    display: flex;
    height: 26px;
    padding: 1px;
    min-width: 60px;
    :hover {
      background: linear-gradient(88.36deg, #ccbbff 12.48%, #00baff 98.91%);
    }
    > div {
      align-items: center;
      background: #282828;
      border-radius: inherit;
      display: flex;
      gap: 6px;
      justify-content: center;
      padding: 10px 7px;
      width: 100%;
    }
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

export const InputErrorWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EditInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

export const EditInput = styled(InputUnstyled)`
  && {
    width: 100%;
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

export const EditInputMulti = styled(InputUnstyled)`
  && {
    width: 90%;
    min-height: 150px;
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
      resize: none;
      padding: 4px 7px;
      :focus-visible {
        outline: none;
      }
      ${ScrollBarStyles}
    }
  }
`;
