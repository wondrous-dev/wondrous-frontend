import { css } from 'styled-components';
import palette from 'theme/palette';

export const GradientHighlightHorizontal = css`
  background: rgb(204, 187, 255);
  background: linear-gradient(90deg, rgba(204, 187, 255, 1) 0%, rgba(116, 39, 255, 1) 50%, rgba(0, 186, 255, 1) 100%);
`;

export const GradientHighlightVertical = css`
  background: rgb(204, 187, 255);
  background: linear-gradient(0deg, rgba(204, 187, 255, 1) 0%, rgba(116, 39, 255, 1) 50%, rgba(130, 55, 255, 1) 100%);
`;

export const GradientMidnightVertical = css`
  background: rgb(20, 20, 20);
  background: linear-gradient(0deg, rgba(20, 20, 20, 1) 0%, rgba(30, 30, 30, 1) 100%);
`;

export const GradientMidnightDiagonal = css`
  background: ${palette.black90};
  background: linear-gradient(250deg, ${palette.grey75}80, ${palette.black90}80);
`;

export const GradientMidnightDiagonalOposite = css`
  background: ${palette.black90};
  background: linear-gradient(170deg, ${palette.grey75}FF, ${palette.black90}FF);
`;

export const GradientGR15Horizontal = css`
  background: ${palette.black90};
  background: linear-gradient(90deg, #c1adfe 0%, #83ccb9 35.66%, #fba3b8 74.41%, #ffe98a 99.22%),
    linear-gradient(0deg, #e2fffa, #e2fffa);
`;
