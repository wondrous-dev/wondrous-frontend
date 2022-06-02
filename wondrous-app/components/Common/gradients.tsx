import { css } from 'styled-components';
import { greyColors, blackColors } from 'theme/colors';

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
  background: ${blackColors.black90};
  background: linear-gradient(250deg, ${greyColors.grey75}80, ${blackColors.black90}80);
`;

export const GradientMidnightDiagonalOposite = css`
  background: ${blackColors.black90};
  background: linear-gradient(170deg, ${greyColors.grey75}FF, ${blackColors.black90}FF);
`;
