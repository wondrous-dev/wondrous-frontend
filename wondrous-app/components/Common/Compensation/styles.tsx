import { Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Grey85, White } from '../../../theme/colors'

export const CompensationWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  align-self: flex-end;

  svg {
    z-index: 9999;
    height: 28px;
  }
`

export const CompensationStatus = styled((props) => {
  return (
    <>
      {props.taskIcon}
    </>
  )
})``

export const CompensationPill = styled.div`
  display: flex;
  align-items: center;
  min-width: 63px;
  flex-direction: row;
  justify-content: center;
  background: ${Grey85};
  border-radius: 25px;
  padding: 2px 8px;
  padding-right: 12px;
  line-height: 28px;
  margin-left: -5px;
  z-index: 0;
  height: 28px;
`

export const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  height: 28px;
  border-radius: 28px;
  padding: 0;
  z-index: 2;
  margin-right: 4px;
`

export const CompensationAmount = styled(Typography)`
  && {
    color: ${White};
    font-weight: 600;
    font-size: 13px;
  }
`
