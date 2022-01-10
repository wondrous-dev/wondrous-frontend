import { Button, Popper } from '@material-ui/core'
import styled from 'styled-components'

export const StyledDropDownButton = styled(Button)`
	&& {
		background: linear-gradient(
			180deg,
			#ccbbff 0%,
			#7427ff 47.4%,
			#00baff 100%
		);
		border: none;
		width: 24px;
		height: 24px;
		min-width: 0;
		border-radius: 2px;
		position: relative;
		z-index: 1;
	}

	&:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: 0.08em;
		z-index: -1;
		border-radius: inherit;
		background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
	}

	&.active {
		background: #4b4b4b;
		border-radius: 2px 2px 0 0;

		.MuiButton-label {
			transform: rotate(180deg);
		}

		:after {
			background: linear-gradient(92.34deg, #1e1e1e 4.36%, #141414 42.75%);
			margin-bottom: 0;
		}

		:hover {
			background: #4b4b4b;
		}
	}
`

export const StyledPopper = styled(Popper)`
	.MuiPaper-rounded {
		border-radius: 0 6px 6px 6px;
		background: transparent;
	}
`
