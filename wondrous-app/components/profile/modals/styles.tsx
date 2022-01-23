import { Typography } from '@material-ui/core'
import styled from 'styled-components'
import { White } from '../../../theme/colors'
import { SafeImage } from '../../Common/Image'
import DefaultUserImage from '../../Common/Image/DefaultUserImage'

export const PodWrapper = styled.div`
  background: #0f0f0f;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
`

export const UserWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  cursor: pointer;
`

const ProfilePictureStyles = {
  width: '52px',
  height: '52px',
  borderRadius: '52px',
  marginRight: '12px',
}

export const TabContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

export const PodExplainerText = styled(Typography)`
  && {
    color: #828282;
    font-size: 13px;
    line-height: 20px;
    margin-top: 8px;
  }
`
export const TabContainerText = styled(Typography)`
  && {
    font-size: 16px;
    line-height: 19px;
    color: ${White};
  }
`
export const Tab = styled.div`
  text-align: center;
  flex: 1;
  border-bottom: 2px solid ${(props) => (props.selected ? '#7427FF' : White)};
  padding-bottom: 12px;
  margin-right: 24px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
`
export const UserProfilePicture = (props) => {
  return <SafeImage src={props?.src} style={ProfilePictureStyles} />
}

export const DefaultProfilePicture = (props) => {
  return <DefaultUserImage style={ProfilePictureStyles} />
}

export const Title = styled(Typography)`
  && {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: ${White};
  }
`
