import styled from 'styled-components';
import {
  PostBorderDashedCircle,
  PostBorderDashedFirstChild,
  PostBorderDashedLastChild,
} from '../../Common/Post/styles';

export const Feed = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding-left: 24px;
  position: relative;
  ${(props) =>
    props.isMoreThanOne
      ? `& > :first-child {
    border-left: 0;
    ${PostBorderDashedFirstChild} {
      display: flex;
    }
    ${PostBorderDashedCircle} {
      display: none;
    }
  }
  & > :last-child {
    border-left: 0;
    ${PostBorderDashedLastChild} {
      display: flex;
    }
    ${PostBorderDashedCircle} {
      display: none;
    }
  }`
      : `
      & > :first-child {border-left: 0;}`}
`;
