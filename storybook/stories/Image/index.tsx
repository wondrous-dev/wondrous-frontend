import React from 'react'
import { Platform, View } from 'react-native'
import { SvgXml } from "react-native-svg"

interface ImageProps {
  width?: String
  height?: String
  webStyle?: any
  srcElement?: any
  style?: any
}

export function SvgImage ({ width, height, webStyle, srcElement, style }) {
  if (Platform.OS === 'web') {
    const base64data = btoa(unescape(encodeURIComponent(srcElement)))
    return <img src={`data:image/svg+xml;base64,${base64data}`} alt="" />
  }
  return (
    <SvgXml width={width} height={height} style={style} xml={`${srcElement}`} />
  )
  
}
