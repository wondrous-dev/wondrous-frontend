import styled from 'styled-components';

export const SectionWrapper = styled.section`
  width: ${({ width }) => `calc(100% - ${width})`};
  height: 100%;
  min-height: 100vh;
  margin-left: ${({ width }) => `${width}`};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    margin-left: 0;
  }
`;
