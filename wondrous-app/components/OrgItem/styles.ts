import Typography from '@mui/material/Typography';

import styled from 'styled-components';

export const StyledGridItem = styled.div`
  background-color: #1e1e1e;
  border-radius: 12px;
  text-align: center;
  padding-bottom: 20px;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  position: relative;
  align-items: center;
  overflow: hidden;
  img {
    transition: transform 0.4s ease;
    transform-origin: 50% 50%;
  }
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: none;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
    pointer-events: none;
  }

  &:hover {
    background: linear-gradient(180deg, #1e1e1e 50%, #373737 100%);
    &::before {
      background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);
    }
    img {
      transform: scale(1.1);
    }
  }
`;

export const OrgName = styled(Typography)`
  && {
    color: white;
    font-weight: bold;
    font-size: 18px;
    line-height: 26px;
    margin-bottom: 8px;
  }
`;

export const OrgDescription = styled(Typography)`
  && {
    font-size: 15px;
    line-height: 24px;
    color: #c4c4c4;
    padding-left: 12px;
    padding-right: 12px;
  }
`;
