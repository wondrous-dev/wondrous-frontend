import React from 'react'
import Svg, { Path } from 'react-native-svg'
import palette from 'theme/palette'

const DownCaret = ({ color=palette.black, style, onPress }) => (
  <Svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M7 10L12 15L17 10H7Z" fill={palette.black}/>
  </Svg>
)

export default DownCaret

