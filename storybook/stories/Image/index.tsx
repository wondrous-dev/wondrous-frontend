import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Platform, Image, Pressable, View } from 'react-native'
import { SvgXml } from "react-native-svg"
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { GET_PREVIEW_IMAGE } from '../../../graphql/queries'
import { FlexRowContentModal } from '../../../components/Modal'
import CameraIcon from '../../../assets/images/camera'
import PictureIcon from '../../../assets/images/image'
import { Blue500 } from '../../../constants/Colors'
import { RegularText } from '../Text'
import { spacingUnit, setDeepVariable } from '../../../utils/common'
import Camera from '../../../components/Camera'
import { uploadMedia, getFilenameAndType } from '../../../utils/image'

interface ImageProps {
  width?: String
  height?: String
  webStyle?: any
  srcElement?: any
  style?: any
}

export const CachedImage = props => {
  const { source: { uri }, cacheKey, setCachedImage } = props
  const filesystemURI =  `${FileSystem.cacheDirectory}${cacheKey.replace(/(^\w+:|^)\/\//, '')}`

  const [imgURI, setImgURI] = useState(filesystemURI)

  useEffect(() => {
    const loadImage = async ({ fileURI }) => {
      try {
        // Use the cached image if it exists
        const metadata = await FileSystem.getInfoAsync(fileURI)
        if (!metadata.exists) {
          // download to cache
          setImgURI(null)
          await FileSystem.downloadAsync(
            uri,
            fileURI
          )
          setImgURI(fileURI)
          setCachedImage(fileURI)
        }
      } catch (err) {
        setImgURI(uri)
      }
    }

    loadImage({ fileURI: filesystemURI })
  }, [])// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Image
    // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      source={{
        uri: imgURI,
      }}
    />
  )
}

export const UploadImage = ({ isVisible, setModalVisible, image, setImage, saveImageMutation, imagePrefix, saveImageMutationVariable }) => {
  const [cameraOpen, setCameraOpen] = useState(false)
  // const [imageLibraryOpen, setLibraryOpen] = useState(false)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri)
      const {
        fileType,
        filename
      } = getFilenameAndType(result.uri)
      const imageUrl = imagePrefix + filename
      const variables = setDeepVariable(saveImageMutationVariable[0], saveImageMutationVariable[1], imageUrl)
      await uploadMedia({ filename: imageUrl, localUrl: result.uri, fileType })
      saveImageMutation({
        variables
      })
      
      setModalVisible(false)
    }
  }
  

  return (
    <>
      {
        cameraOpen &&
        <Camera
          snapperOpen={cameraOpen}
          setSnapperOpen={setCameraOpen}
          image={image}
          setImage={setImage}
          setModalVisible={setModalVisible}
          saveImageMutation={saveImageMutation}
          saveImageMutationVariable={saveImageMutationVariable}
          filePrefix={imagePrefix}
        />
      }

      <FlexRowContentModal 
        isVisible={isVisible}
        setModalVisible={setModalVisible}
        headerText='Upload profile picture'
        centered={true}
        cancelButtonStyle={{
          marginTop: spacingUnit * 2
        }}
      >
        <Pressable onPress={() => {
              setCameraOpen(true)
            }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacingUnit * 8
            }}>
              <CameraIcon color={Blue500} style={{
                width: spacingUnit * 4,
                height: spacingUnit * 4
              }} onPress={() => {
                setCameraOpen(true)
              }}/>
              <RegularText color={Blue500}>
                Take photo
              </RegularText>
            </View>
            </Pressable>
            <Pressable onPress={pickImage}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <PictureIcon color={Blue500} style={{
                width: spacingUnit * 4,
                height: spacingUnit * 4
              }} onPress={pickImage}/>
              <RegularText color={Blue500}>
                Camera roll
              </RegularText>
            </View>
            </Pressable>
      </FlexRowContentModal>
    </>
  )
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

const getCacheImage = async ({ cacheKey, setCachedImage, getImage }) => {
  const filesystemURI = `${FileSystem.cacheDirectory}${cacheKey.replace(/(^\w+:|^)\/\//, '')}`
  try {
    const metadata = await FileSystem.getInfoAsync(filesystemURI)
    if (!metadata.exists) {
      getImage()
    } else {
      setCachedImage(filesystemURI)
    }
  } catch (err) {
    getImage()
  }
}

export const SafeImage = ({ src, style, defaultImage, setImage }) => {
  const [getImage, { data, loading, error }] = useLazyQuery(GET_PREVIEW_IMAGE, {
    variables: {
      path: src
    },
    fetchPolicy: 'network-only'
  })
  if (!src && defaultImage) {
    return <Image style={style} source={defaultImage} />
  }
  const [cachedImage, setCachedImage] = useState(null)

  useEffect(() => {
    if (cachedImage) {
      if (setImage && !(src.startsWith('https') || src.startsWith('file://'))) {
        setImage(cachedImage)
      }
    } else if (data && data.getPreviewImage && data.getPreviewImage.url) {
      if (setImage && !(src.startsWith('https') || src.startsWith('file://'))) {
        setImage(data.getPreviewImage.url)
      }
    }
    if (!cachedImage && !data) {
      getCacheImage({ cacheKey: src, setCachedImage, getImage })
    }
  }, [data, cachedImage])

  if (src.startsWith('https') || src.startsWith('file://')) {
    return src.startsWith('file://') ? <Image style={style} key={src} source={{
      uri: src
    }} /> :
    <CachedImage cacheKey={src} style={style} key={src} source={{
      uri: src
    }} />
  } else if (cachedImage || data?.getPreviewImage?.url) {
    return (<CachedImage cacheKey={src} style={style} key={src} setCachedImage={setCachedImage} source={{
      uri: (cachedImage || data?.getPreviewImage?.url)
    }} />)
  }
  return null
}

