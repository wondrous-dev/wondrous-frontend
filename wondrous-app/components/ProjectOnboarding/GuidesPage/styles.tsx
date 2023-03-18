import styled from 'styled-components';

export const Image = styled.img`
  max-height: 14rem;
  width: 50%;
  object-fit: cover;
  border-radius: 12px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;
