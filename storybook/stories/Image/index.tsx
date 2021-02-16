import { useLazyQuery, useQuery } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import { Platform, Image, Pressable, View } from 'react-native'
import { SvgXml } from "react-native-svg"
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker'
import isEqual from 'lodash.isequal'
import FastImage from 'react-native-fast-image'

import { GET_PREVIEW_IMAGE } from '../../../graphql/queries'
import apollo from '../../../services/apollo'
import { FlexRowContentModal } from '../../../components/Modal'
import CameraIcon from '../../../assets/images/camera'
import PictureIcon from '../../../assets/images/image'
import { Blue500 } from '../../../constants/Colors'
import { RegularText } from '../Text'
import { spacingUnit, setDeepVariable, usePrevious } from '../../../utils/common'
import Camera from '../../../components/Camera'
import { uploadMedia, getFilenameAndType } from '../../../utils/image'

interface ImageProps {
  width?: String
  height?: String
  webStyle?: any
  srcElement?: any
  style?: any
}

export const UploadImage = ({ isVisible, setModalVisible, image, setImage, saveImageMutation, imagePrefix, saveImageMutationVariable }) => {
  const [cameraOpen, setCameraOpen] = useState(false)
  // const [imageLibraryOpen, setLibraryOpen] = useState(false)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri)
      const {
        fileType,
        filename
      } = getFilenameAndType(result.uri)
      const imageUrl = imagePrefix + filename
      const variables = setDeepVariable(saveImageMutationVariable[0], saveImageMutationVariable[1], imageUrl)
      uploadMedia({ filename: imageUrl, localUrl: result.uri, fileType })
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
              }} />
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

export const SafeImage = ({ src, style, defaultImage, setImage }) => {
  const { data, loading, error } = useQuery(GET_PREVIEW_IMAGE, {
    variables: {
      path: src
    }, 
    fetchPolicy: 'network-only'
  })
  if (!src && defaultImage) {
    return <Image style={style} source={defaultImage} />
  }


  useEffect(() => {
    if (data && data.getPreviewImage && data.getPreviewImage.url) {
      if (setImage && !(src.startsWith('https') || src.startsWith('file://'))) {
        setImage(data.getPreviewImage.url)
      }
    }
  }, [data])

  if (src.startsWith('https') || src.startsWith('file://')) {
    return <Image style={style} source={{
      uri: src
    }} />
  } else if (data && data.getPreviewImage) {
    return <Image style={style} source={{
      uri: data.getPreviewImage.url
    }} />
  }

  return null
}

