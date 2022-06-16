import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Pressable, Dimensions, SafeAreaView } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator'
import { ImageBrowser } from 'expo-image-picker-multiple'

import { Paragraph, RegularText } from '../../storybook/stories/Text';
import { getFilenameAndType, uploadMedia } from '../../utils/image';

export default class ImageBrowserScreen extends Component {
  state = {
    count: 0,
    submit: null
  }
  _getHeaderLoader = () => (
    <ActivityIndicator size='small' color={'#0580FF'}/>
  );

  imagesCallback = (callback) => {
    const { setImageUploading, setMedia, media,
      edit
     } = this.props;

    callback.then(async (photos) => {
      if (edit) {
        const photoToBeUpdated = photos && photos[0]
        const pPhoto = await this._processImageAsync(photoToBeUpdated.uri)
        const {
          filename,
          fileType
        } = getFilenameAndType(pPhoto.uri)
        const newFileName = this.props.imagePrefix ? this.props.imagePrefix + filename : filename
        setImageUploading(true)
        uploadMedia({ filename: newFileName, localUrl: pPhoto.uri, fileType} )
        setImageUploading(false)
        const newArr = media.map(image => {
          if (image === edit) {
            return pPhoto.uri
          }
          return image
        })
        setMedia(newArr)
      } else {
        const cPhotos = [];
        for(let photo of photos) {
          const pPhoto = await this._processImageAsync(photo.uri);
          const {
            filename,
            fileType
          } = getFilenameAndType(pPhoto.uri)
          const newFileName = this.props.imagePrefix ? this.props.imagePrefix + filename : filename
          setImageUploading(true)
          uploadMedia({ filename: newFileName, localUrl: pPhoto.uri, fileType} )
          setImageUploading(false)
          cPhotos.push(pPhoto.uri)
        }
        setMedia([
          ...media,
          ...cPhotos
        ])
      }
    }).catch((e) => console.log(e))
  };

  async _processImageAsync(uri) {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{resize: { width: 1000 }}],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  };

  _renderDoneButton = (count, onSubmit) => {
    // if (!count) return <View />;
    return <TouchableOpacity title={'Done'} onPress={() => {
      if (count) {
        onSubmit()
        this.props.setImageBrowser(false)
      }
    }}>
      <Text style={{
        // marginRight: 25,
        // marginLeft: -25
        color: count ? palette.blue400 : palette.white
      }}>Done</Text>
    </TouchableOpacity>
  }

  renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  render() {
    const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>
    const {
      count,
      submit
    } = this.state
    const {
      media,
      setImageBrowser,
      edit
    } = this.props
    const maxPhotos = (media && (4 - media.length)) || 4
    return (
      <SafeAreaView style={[styles.flex, styles.container]}>
        <View style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          height: 64,
          borderBottomWidth: 1,
          borderBottomColor: palette.grey300,
          backgroundColor: palette.white,
        }}>
          <Pressable onPress={() => setImageBrowser(false)}>
            <RegularText color={palette.blue400} style={{
              color: palette.blue400,
              marginLeft: 25,
              marginRight: -25
            }}>
              Cancel
            </RegularText>
          </Pressable>
          <View>
            <Paragraph color={palette.black}>
              Select {count} files
            </Paragraph>
          </View>
          <View style={{
            marginRight: 25,
            marginLeft: -25
          }}>
            {this._renderDoneButton(count, submit)}
          </View>
        </View>
        <ImageBrowser
          max={edit ? 1 : maxPhotos}
          onChange={(count, onSubmit) => {
            this.setState({
              count,
              submit: onSubmit
            })
          }}
          callback={this.imagesCallback}
          renderSelectedComponent={this.renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignSelf: 'center'
  },
  emptyStay:{
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF'
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff'
  }
});
