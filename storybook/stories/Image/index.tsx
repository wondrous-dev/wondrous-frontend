import { useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { Platform, Image } from 'react-native'
import { SvgXml } from "react-native-svg"

import { GET_PREVIEW_IMAGE } from '../../../graphql/queries'
import apollo from '../../../services/apollo'

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

export const SafeImage = ({ src, style, defaultImage }) => {
  const [getImage, { data, loading, error }] = useLazyQuery(GET_PREVIEW_IMAGE, {
    fetchPolicy: 'network-only'
  })
  if (!src && defaultImage) {
    return <Image style={style} source={defaultImage} />
  }

  if (!src) {
    return null
  }

  useEffect(() => {
    getImage({
      variables: {
        path: src
      }
    })
  }, [])
  
  if (src.startsWith('https')) {
    return <Image style={style} source={{
      uri: src
    }} />
  }
  if (data && data.getPreviewImage) {
    console.log('data url', data.getPreviewImage.url)
    return <Image style={style} source={{
      uri: data.getPreviewImage.url
    }} />
  }

  return null
}

