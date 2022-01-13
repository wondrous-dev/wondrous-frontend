import styled from 'styled-components'
import {
  GradientMidnightDiagonal,
  GradientMidnightVertical,
} from '../gradients'
import { Grey80, White } from '../../../theme/colors'
import { Typography } from '@material-ui/core'
import { BaseCard } from '../card'

export const TaskInner = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  flex-flow: column wrap;
  align-items: stretch;

  border-radius: 5px;
  padding: 14px;

  padding-bottom: 18px;

  ${GradientMidnightVertical}
`

export const TaskWrapper = styled.div`
  display: flex;
  margin: ${(props) => (props.wrapped ? '0' : '1em 0 0 0')};

  padding: 1px;
  background: #515151;
  cursor: pointer;

  ${GradientMidnightDiagonal}

  border-radius: ${(props) => (props.wrapped ? '0px' : '6px')};

  min-width: 290px;
  min-height: 216px;
`

export const TaskHeader = styled.div`
  display: flex;
  width: 100%;
  text-align: left;

  margin: 0 0 33px 0;
`

export const TaskContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-start;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  color: ${White};
`

export const TaskSeparator = styled.div`
  display: flex;
  border-bottom: 1px solid ${Grey80};
  margin-top: 5px;
`

export const TaskTitle = styled.div`
  display: flex;

  font-size: 16px;
  font-weight: bold;
`

export const TaskFooter = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;

  margin-top: 22px;

  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  height: 19px;
  line-height: 19px;
`

export const TaskAction = styled.div`
  display: flex;
  flex-direction: row;
  flext-content: flex-start;
  align-content: space-between;
  margin-right: 30px;
`

export const TaskActionMenu = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: flex-end;
  height: 24px;
`

export const TaskActionAmount = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  padding-left: 10px;
`

export const PodWrapper = styled.div`
  background: #363636;
  padding: 1px 8px;
  border-radius: 8px;
  margin-left: 12px;
`

export const PodName = styled(Typography)`
  && {
    font-size: 13px;
    color: ${White};
  }
`

export const TaskModal = styled(BaseCard)`
  width: 680px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -20%);
`

export const TaskModalHeader = styled.div`
  display: flex;
  align-items: center;
`
export const PodNameTypography = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    color: ${White};
  }
`
