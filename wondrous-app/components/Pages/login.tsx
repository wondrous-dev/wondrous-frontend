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
	z-index: 1;
	height: 275px;
	width: 500px; 
	position: absolute;
	@media (max-width: 745px) {
		display: none;
	}
	@media (max-height: 775px) {
		top: 0;
		right: 10vw;
		max-height: 25%;
		max-width: 30%;
	}
	@media (min-height: 775px) and (max-height: 965px) {
		top: 0;
		right: 20vw;
		max-height: min(275px, 30%);
	}
	@media (min-height: 965px) {
		top: 0;
		right: 15vw;
		height: 35%;
		width: 40%;
	}

	@media (orientation: portrait) {
		display: none;
	}
`