import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PREVIEW_IMAGE } from '../../../graphql/queries/media'

interface SafeImageArgs {
  src: string
  style?: object
  defaultImage?: string
  setImage?(url: string): void
}
export const SafeImage = (safeImageArgs: SafeImageArgs) => {
  const { src, style, defaultImage, setImage } = safeImageArgs
  const { data, loading, error } = useQuery(GET_PREVIEW_IMAGE, {
    variables: {
      path: src,
    },
    fetchPolicy: 'network-only',
  })

  const imgUrl = data?.getPreviewImage?.url
  useEffect(() => {
    if (imgUrl) {
      if (
        setImage &&
        !(src?.startsWith('https') || src?.startsWith('file://'))
      ) {
        setImage(data.getPreviewImage.url)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgUrl, src, setImage])

  if (!src && defaultImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={style} src={defaultImage} alt="" />
  }

  if (src?.startsWith('https') || src?.startsWith('file://')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img style={style} key={src} src={src} alt="" />
  } else if (imgUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img style={style} key={src} src={imgUrl} alt="" />
    )
  }
  return null
}
