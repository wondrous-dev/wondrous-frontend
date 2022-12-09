import Link from 'next/link';
import styled from 'styled-components';
import palette from 'theme/palette';

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
  bottom: 40%;
  display: flex;
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