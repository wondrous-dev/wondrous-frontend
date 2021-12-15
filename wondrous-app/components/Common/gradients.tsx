import { css } from 'styled-components'
import { Grey75, Black90 } from '../../theme/colors'

export const GradientHighlightHorizontal = css`
	background: rgb(204, 187, 255);
	background: linear-gradient(
		90deg,
		rgba(204, 187, 255, 1) 0%,
		rgba(116, 39, 255, 1) 50%,
		rgba(0, 186, 255, 1) 100%
	);
`

export const GradientMidnightVertical = css`
	background: rgb(20, 20, 20);
	background: linear-gradient(
		0deg,
		rgba(20, 20, 20, 1) 0%,
		rgba(30, 30, 30, 1) 100%
	);
`

export const GradientMidnightDiagonal = css`
	background: ${Black90};
	background: linear-gradient(250deg, ${Grey75}80, ${Black90}80);
`

export const GradientMidnightDiagonalOposite = css`
	background: ${Black90};
	background: linear-gradient(170deg, ${Grey75}FF, ${Black90}FF);
`
