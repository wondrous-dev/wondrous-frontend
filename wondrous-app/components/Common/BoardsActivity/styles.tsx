import styled from 'styled-components';

export const BoardsActivityWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  margin-top: 22px;
  & > div {
    margin-left: 18px;
    :first-child {
      margin: 0;
    }
  }
`;
