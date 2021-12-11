import styled from 'styled-components'
import { Midnight, Background, White } from '../../../../services/colors'

export const HeaderWrapper = styled.header`
	position: relative;

	height: 70px;
	width: 100%;
	padding-bottom: 2px;

	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;

		width: 100%;
		height: 2px;

		background: rgb(75, 75, 75);
		background: linear-gradient(
			90deg,
			rgba(75, 75, 75, 1) 0%,
			rgba(35, 35, 35, 1) 100%
		);
	}
`

const HeaderInner = styled.div`
	display: flex;
	align-items: center;

	height: 100%;
	width: 100%;
	padding: 15px 20px;
	background: ${Midnight};

	& > .logo {
		flex: 0 0 auto;
		height: 31px;
	}
`

export const Header = ({ children }) => (
	<HeaderWrapper>
		<HeaderInner>{children}</HeaderInner>
	</HeaderWrapper>
)

const MainBgShape = styled.div``

export const MainWrapper = styled.main`
	position: relative;

	width: 100%;
	min-height: 100vh;

	@supports (width: calc(2px - 1px)) {
		/* Viewheight - Header Height */
		min-height: calc(100vh - 70px);
	}

	padding: 36px;

	color: ${White};
	background: ${Background};

	/* Fallback Shape Blur using Radial Gradients
     Use RGBAs because of Webkit Gradient Issues 
    (needs the same same color for opacity transition) */
	background: radial-gradient(
			45vh at 25% 25%,
			rgba(154, 29, 235, 0.3) 0,
			rgba(154, 29, 235, 0.1) 50%,
			rgba(154, 29, 235, 0) 90%
		),
		radial-gradient(
			40vh at 85% 60%,
			rgba(20, 0, 255, 0.2) 0,
			rgba(20, 0, 255, 0.1) 30%,
			rgba(20, 0, 255, 0) 90%
		),
		${Background};

	overflow-x: hidden;
	overflow-y: auto;

	& > ${MainBgShape} {
		display: none;
	}

	@supports (filter: blur(1px)) {
		background: ${Background};

		& > ${MainBgShape} {
			display: block;
		}
	}
`

export const MainBgColorCircle = styled(MainBgShape)`
	position: absolute;
	top: 250px;
	left: 150px;

	z-index: 0;

	height: 193px;
	width: 193px;
	border-radius: 50%;
	background: rgb(154, 39, 235);
	filter: blur(150px);
`

export const MainBgGradientOval = styled(MainBgShape)`
	position: absolute;

	top: 400px;
	right: -150px;
	bottom: 0;

	z-index: 0;

	@supports (width: calc(2px - 1px)) {
		bottom: unset;
		/* Viewheight - Oval Height - Header Height */
		/* Positions in bottom right Corner; Prevents unnecessary Scrollbar */
		top: calc(100vh - 398px - 70px);
	}

	height: 398px;
	width: 614px;

	border-radius: 50%;
	background: rgb(75, 132, 247);
	background: linear-gradient(
		140deg,
		rgba(59, 245, 233, 1) 0%,
		rgba(75, 132, 247, 1) 20%,
		rgba(20, 0, 255, 1) 60%,
		rgba(154, 29, 235, 1) 100%
	);
	filter: blur(200px);
`

export const Main = ({ children }) => {
	return (
		<MainWrapper>
			<MainBgColorCircle />
			<MainBgGradientOval />
			{children}
		</MainWrapper>
	)
}

export const Container = styled.div`
	position: inherit;
	max-width: 1024px;
	margin: 0 auto;

	z-index: 100;
`

export const Footer = styled.footer`
	background: ${Midnight};
`
