import styled from 'styled-components'

export const WelcomeMessageWrapper = styled.div`
	padding: 1px;
	background: rgb(75, 75, 75);
	background: linear-gradient(
		0deg,
		rgba(75, 75, 75, 0.5) 0%,
		rgba(35, 35, 35, 0.5) 100%
	);
	border-radius: 6px;
`

export const WelcomeMessageInner = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;

	min-height: 56px;
	padding: 4px 5px;
	line-height: 1.1;
	color: #ffffff;
	background: rgb(30, 30, 30);
	background: linear-gradient(
		0deg,
		rgba(30, 30, 30, 1) 0%,
		rgba(20, 20, 20, 1) 100%
	);
	border-radius: 6px;

	& > *:not(:first-child) {
		margin-left: 15px;
	}
`

export const WelcomeMessage = ({ children }) => {
	return (
		<WelcomeMessageWrapper>
			<WelcomeMessageInner>{children}</WelcomeMessageInner>
		</WelcomeMessageWrapper>
	)
}

export const GmBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	height: 56px;
	min-width: 85px;
	font-size: 24px;
	line-height: 1;
	color: #ffffff;
	background: #0f0f0f;
	border-radius: 3px;
`
