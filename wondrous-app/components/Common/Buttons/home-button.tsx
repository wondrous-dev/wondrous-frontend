import styled from 'styled-components'
import {
	GradientHighlightHorizontal,
	GradientMidnightVertical,
} from '../gradients'
import { Grey80 } from '../../../theme/colors'

export const StyledButton = styled.button`
	display: flex;
	flex-direction: column;

    margin: 0em 2em;
	
    line-height: 3em;
    height: 3em;
    width: 3em;
    padding: 0;

    ${GradientHighlightHorizontal}

	background: ${Grey80};
	border-radius: 6px;
`

export const HomeButton = (className) => (
	<StyledButton className={className}>
        H
	</StyledButton>
)
