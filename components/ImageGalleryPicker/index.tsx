import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform, Image, Dimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import * as FileSystem from 'expo-file-system'

export default function ImageGalleryPicker ({ imageLibraryOpen, setImageLibraryOpen, setImage }) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  
}