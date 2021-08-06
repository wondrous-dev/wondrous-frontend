import React from 'react'
import { Blue500 } from '../../constants/Colors'
import Svg, { Path } from 'react-native-svg'
import { Pressable } from 'react-native'

const Video = ({ color=Blue500, style, onPress }) => (
  <Pressable onPress={onPress}>
  <Svg width={(style && style.width) || '24'} height={(style && style.height) || '24'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <Path d="M21 7.15C20.6962 7.0132 20.3588 6.9687 20.0299 7.02204C19.701 7.07537 19.395 7.22419 19.15 7.45L17 9.45V8C17 7.20435 16.6839 6.44129 16.1213 5.87868C15.5587 5.31607 14.7956 5 14 5H5C4.20435 5 3.44129 5.31607 2.87868 5.87868C2.31607 6.44129 2 7.20435 2 8V16C2 16.7956 2.31607 17.5587 2.87868 18.1213C3.44129 18.6839 4.20435 19 5 19H14C14.7956 19 15.5587 18.6839 16.1213 18.1213C16.6839 17.5587 17 16.7956 17 16V14.55L19.16 16.55C19.478 16.8378 19.8911 16.9981 20.32 17C20.558 16.9994 20.7932 16.9483 21.01 16.85C21.3049 16.7307 21.5576 16.5262 21.7357 16.2625C21.9139 15.9989 22.0094 15.6882 22.01 15.37V8.63C22.0086 8.31069 21.9116 7.99911 21.7316 7.73536C21.5516 7.47161 21.2968 7.26774 21 7.15V7.15Z" fill={color} />
  </Svg>
  </Pressable>
)

export default Video
