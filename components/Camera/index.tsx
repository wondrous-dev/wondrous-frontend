import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform, Image, Dimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import * as FileSystem from 'expo-file-system'

import apollo from '../../services/apollo'
import { GET_PRESIGNED_IMAGE_URL } from '../../graphql/queries/media'

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
  }
})

const win = Dimensions.get('window')

//TODO use hooks and contexts here
export default function Snapper ({ setSnapperOpen, snapperOpen, image, setImage }) {
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: cameraRollStatus } = await ImagePicker.requestCameraRollPermissionsAsync()
        const { status: cameraStatus} = await ImagePicker.requestCameraPermissionsAsync()
        if (cameraStatus && cameraRollStatus) {
          setHasPermission(true)
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
            setImage(result.uri)
            // Get image filename
            const uriArr = result.uri.split('/')
            const filename = uriArr[uriArr.length - 1]
            const fileType = filename.substring(filename.lastIndexOf(".") + 1)
            try {
              const apolloResult = await apollo.query({
                query: GET_PRESIGNED_IMAGE_URL,
                variables: {
                  filename
                }
              })
              const apiUrl = apolloResult.data.getPresignedImageUrl.url
              
              const uploadResponse = await FileSystem.uploadAsync(apiUrl, result.uri, {
                httpMethod: "PUT",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": `image/${fileType}`
                }
              })
              // console.log('uploadResponse', uploadResponse)
            } catch (error) {
              console.log("error", JSON.stringify(error, null, 2))
            }
            setSnapperOpen(false)
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
    <View>

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