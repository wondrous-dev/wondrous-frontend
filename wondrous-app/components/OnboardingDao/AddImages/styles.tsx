import Typography from '@mui/material/Typography';
import { SafeImage } from 'components/Common/Image';
import Image from 'next/image';
import styled from 'styled-components';

export const LogoUpload = styled.label`
  && {
    align-items: center;
    background: ${({ theme }) => theme.palette.grey85};
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    height: 80px;
    justify-content: center;
    position: relative;
    width: 80px;
  }
`;

export const ImageWrapper = styled((props) => <Image alt="logo" {...props} />)`
  && {
    border-radius: 6px;
    object-fit: cover;
  }
`;

export const SafeImageWrapper = styled((props) => <SafeImage alt="logo" {...props} />)`
  && {
    border-radius: 6px;
    object-fit: cover;
  }
`;

export const HeaderWrapper = styled.label`
  align-items: center;
  background: ${({ theme }) => theme.palette.grey85};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  height: 80px;
  justify-content: center;
  position: relative;
  width: 100%;
`;

export const AddPhotoIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.palette.grey97};
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ withImage }) =>
    withImage &&
    `
    position: absolute;
    opacity: 0;
    ${LogoUpload}:hover &,
    ${HeaderWrapper}:hover & {
      opacity: 0.75
    }
  `}
`;

export const HeaderText = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    color: ${({ theme }) => theme.palette.grey250};
  }
`;
