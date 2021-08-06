import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { Blue400 } from '../../services/colors'
import { createSpacingUnit } from '../../utils'

export const PrimaryButton = styled(Button)`
	&& {
		background-color: ${Blue400};
		border-radius: ${createSpacingUnit()}px;
	}
`
export const FunkyButton = styled(Button)`
	&& {
		@keyframes gradient {
			0% {
				background-position: 0% 50%;
			}
			50% {
				background-position: 100% 50%;
			}
			100% {
				background-position: 0% 50%;
			}
		}
		background: linear-gradient(
			264.73deg,
			#37c6ce 13.71%,
			#8d6fea 50.94%,
			#f645e5 70.76%
		);
		background-size: 400% 400%;
		-webkit-animation: gradient 10s ease infinite;
		animation: gradient 8s ease infinite;
		border-radius: ${createSpacingUnit()}px;
	}
`
