import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform, Image, Dimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import * as FileSystem from 'expo-file-system'

import { uploadMedia, getFilenameAndType, uploadVideo } from '../../utils/image'
import { setDeepVariable } from '../../utils/common'
import { MAX_VIDEO_LIMIT } from '../../constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 100,
    borderRadius: 16
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 16,
    alignItems: 'center',
    padding: 2,
    overflow: 'hidden'
  },
  buttonContainer: {

  },
  button: {
    backgroundColor: 'blue'
  },
  text: {
    color: 'white'
  },
})

//TODO use hooks and contexts here
export default function Snapper ({ setSnapperOpen, snapperOpen, setImage, setModalVisible, saveImageMutation, saveImageMutationVariable, filePrefix, upload=true , setVideo, setVideoUploading, setErrors, setImageUploading }) {
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: cameraStatus } = await Camera.requestPermissionsAsync()
        if (cameraStatus) {
          setHasPermission(cameraStatus === 'granted')
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          })

          if (result.cancelled) {
            setSnapperOpen(false)
          } else {
            // Set image
            // Get image filename
            if (result.duration > MAX_VIDEO_LIMIT) {
              setErrors({
                mediaError: 'Cannot upload a video longer than 10 seconds'
              })
            }
            if (setModalVisible) {
              setModalVisible(false)
            }
            const {
              fileType,
              filename
            } = getFilenameAndType(result.uri)
            const isVideo = result.type === 'video'
            const isImage = result.type === 'image'
            const mediaUrl = isVideo ? `video/${filename}` : filePrefix + filename
            setSnapperOpen(false)
            if (upload) {
              if (isVideo) {
                if (setVideoUploading) {
                  setVideoUploading(true)
                }
                await uploadVideo({ filename: mediaUrl, localUrl: result.uri, fileType })
                if (setVideoUploading) {
                  setVideoUploading(false)
                }
              } else if (isImage) {
                if (setImageUploading) {
                  setImageUploading(true)
                }
                await uploadMedia({ filename: mediaUrl, localUrl: result.uri, fileType })
                if (setImageUploading) {
                  setImageUploading(false)
                }
              }
            }
            if (isVideo) {
              setVideo(result.uri)
            } else if (result.type === 'image') {
              setImage(result.uri)
            }
            if (saveImageMutation && saveImageMutationVariable) {
              const variables = setDeepVariable(saveImageMutationVariable[0], saveImageMutationVariable[1], mediaUrl)
              saveImageMutation({
                variables
              })
            }

          }
        }
        // if (status !== 'granted') {
        //   alert('Sorry, we need camera roll permissions to make this work!')
        // }
      }
    })()
  }, [snapperOpen])
  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={styles.container}>
      {/* <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera> */}
    </View>
    // <View style={styles.container}>
    //   <Camera style={styles.camera} type={type}>
    //     <View style={styles.buttonContainer}>
    //       <TouchableOpacity
    //         style={styles.button}
    //         onPress={() => {
    //           setType(
    //             type === Camera.Constants.Type.back
    //               ? Camera.Constants.Type.front
    //               : Camera.Constants.Type.back
    //           );
    //         }}>
    //         <Text style={styles.text}> Flip </Text>
    //       </TouchableOpacity>
    //     </View>
    //   </Camera>
    // </View>
  )
}