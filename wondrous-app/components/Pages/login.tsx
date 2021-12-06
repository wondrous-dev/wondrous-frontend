import styled from 'styled-components'

export const LoginWrapper = styled.div`
	&& {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url('/images/login/background.png'), url('/images/login/background-blur.png');
		background-repeat: no-repeat;
		background-position: center; /* Center the image */
		background-size: cover;
		flex-direction: column;
	}
`

export const TopBubble = styled.img`
	position: absolute;
	top: -187px;
	right: -200px;
	@media (max-width: 745px) {
		display: none;
	}
	@media (max-height: 775px) {
		display: none;
	}
	@media (orientation: portrait) {
		display: none;
	}
	@media (min-height: 965px) {
		display: none;
	}
`
