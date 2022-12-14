import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import Link from 'next/link';
import styled from 'styled-components';
import palette from 'theme/palette';

export const GridIconWrapper = styled.div`
  background: ${palette.grey87};
  border-radius: 300px;
  height: 38px;
  width: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 180px;
    background: linear-gradient(180deg, #7427ff 0%, #f2c678 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
`;

export const ItemContainer = styled.div`
  background: ${palette.grey99};
  width: 100%;
  border-radius: 6px;
`;

export const PageItemContainer = styled(ItemContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  width: 100%;
  cursor: pointer;
  &:hover {
    background: ${palette.grey87};
    ${GridIconWrapper} {
      border: 2px solid ${palette.highlightPurple};
      background: linear-gradient(180deg, #7427ff 0%, #f2c678 100%);
    }
    svg {
      path {
        stroke: ${({ theme }) => theme.palette.white};
      }
    }
  }
`;

export const UserContainer = styled(ItemContainer)`
  height: 12rem;
  overflow: hidden;
`;

export const PageSelectorWrapper = styled.div`
  display: flex;
  gap: 14px;
  justify-content: space-between;
`;

export const ImageWrapper = styled.div`
  height: 50%;
  width: auto;
  img {
    position: relative !important;
    object-fit: cover !important;
  }
`;

export const ProfileInfoWrapper = styled.div`
  height: 170px;
  position: relative;
`;

export const ProfileInfo = styled.div`
  position: absolute;
  right: 50%;
  left: 50%;
  bottom: 55%;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
`;

export const LinkWrapper = styled(Link)`
  width: 100%;
  height: 100%;
  text-decoration: none;
`;

export const ButtonIcon = styled(ItemButtonIcon)`
  && {
    height: 24px;
    width: 24px;
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const UserHelperWrapper = styled.div`
  display: flex;
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  align-items: center;
  gap: 14px;
  justify-content: flex-start;
  &:hover {
    background: ${palette.grey87};
    ${ButtonIcon} {
      background: ${({ theme }) => theme.palette.highlightPurple};
    }
  }
`;
