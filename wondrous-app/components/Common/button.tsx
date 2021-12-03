import styled from 'styled-components'
import {
	GradientHighlightHorizontal,
	GradientMidnightVertical,
} from './gradients'

const ButtonInner = styled.div`
	flex: 1 1 auto;

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	${GradientMidnightVertical}

	border-radius: 98px;
`

const buttonAttrs = () => ({
	role: 'button',
})

const ButtonWrapper = styled.div.attrs(buttonAttrs)`
	display: flex;
	flex-direction: row;
	min-height: 50px;
	padding: 2px;

	background: #515151;
	${(props) => props.highlighted && GradientHighlightHorizontal}

	border-radius: 98px;
`

export const Button = ({ children, ...props }) => (
	<ButtonWrapper {...props}>
		<ButtonInner>{children}</ButtonInner>
	</ButtonWrapper>
)
