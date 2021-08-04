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
		background: linear-gradient(264.73deg, #F645E5 13.71%, #8D6FEA 50.94%, #239AF0 80.76%);
		border-radius: ${createSpacingUnit()}px;
	}
`