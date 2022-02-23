import styled from 'styled-components';
import {
  PostItemBorderDashedCircle,
  PostItemBorderDashedFirstChild,
  PostItemBorderDashedLastChild,
} from '../../Common/PostItem/styles';

export const Feed = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding-left: 24px;
  position: relative;
  ${(props) =>
    props.isMoreThanOne
      ? `& > :first-child {
    border-left: 0;
    ${PostItemBorderDashedFirstChild} {
      display: flex;
    }
    ${PostItemBorderDashedCircle} {
      display: none;
    }
  }
  & > :last-child {
    border-left: 0;
    ${PostItemBorderDashedLastChild} {
      display: flex;
    }
    ${PostItemBorderDashedCircle} {
      display: none;
    }
  }`
      : `
      & > :first-child {border-left: 0;}`}
`;
