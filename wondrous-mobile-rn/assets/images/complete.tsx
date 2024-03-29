
import React from 'react'
import Svg, { Path } from 'react-native-svg'

const Complete = ({ style }) => (
  <Svg style={style} width={(style && style.width) || '24'} height={(style && style.height) || '24'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47998 2 2 6.48 2 12C2 17.52 6.47998 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58997 20 4 16.41 4 12C4 7.59 7.58997 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM10 14.17L16.59 7.58L18 9L10 17L6 13L7.41003 11.59L10 14.17Z" fill="white" stroke="white" stroke-width="0.5" />
  </Svg>
)

export default Complete

