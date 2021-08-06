
import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useNavigation } from '@react-navigation/native'

import { Grey500 } from '../../constants/Colors'

const RightCaret = ({ color=Grey500, style }) => {
  return (
    <Svg style={style} width={(style && style.width) || "12"} height={(style && style.height) || "20"} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path fillRule="evenodd" clipRule="evenodd" d="M7.99162 10L0.338571 2.06351C-0.166865 1.53935 -0.0985765 0.750227 0.491099 0.300951C1.08078 -0.148325 1.96854 -0.0876236 2.47397 0.436533L10.9115 9.18651C11.3628 9.65462 11.3628 10.3454 10.9115 10.8135L2.47397 19.5635C1.96854 20.0876 1.08078 20.1483 0.491099 19.699C-0.0985765 19.2498 -0.166865 18.4606 0.338571 17.9365L7.99162 10Z" fill={color} fill-opacity="0.54"/>
    </Svg>    
  )
}

export default RightCaret
