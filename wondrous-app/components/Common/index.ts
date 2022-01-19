import { Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Red400 } from '../../theme/colors'

export const Flex = styled.div`
  flex: 1;
`

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`

export const CenteredFlexRow = styled(FlexRow)`
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.marginTop || 0};
`

export const NewCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
`

export const ErrorText = styled(Typography)`
  && {
    color: ${Red400};
    font-size: 13px;
  }
`
