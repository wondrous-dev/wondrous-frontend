import styled from 'styled-components'
import {
	GradientHighlightHorizontal,
	GradientMidnightVertical,
} from './gradients'

const ButtonInner = styled.button`
	flex: 1 1 auto;

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	${GradientMidnightVertical}

	border-radius: 98px;
	font-size: 16px;
	border: none;
	color: white;

	cursor: pointer;
`

const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: row;
	min-height: 50px;
	padding: 2px;
	margin-top: ${(props) => props.marginTop || 0};

	background: #515151;
	${(props) => props.highlighted && GradientHighlightHorizontal}

	border-radius: 98px;
`

export const Button = ({ children, ...props }) => (
	<ButtonWrapper {...props}>
		<ButtonInner>{children}</ButtonInner>
	</ButtonWrapper>
)
