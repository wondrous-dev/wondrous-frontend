import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Pressable, Dimensions, SafeAreaView } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator'
import { MediaType } from 'expo-media-library'

import palette from 'theme/palette'
import { ErrorText, Paragraph, RegularText } from '../../storybook/stories/Text';
import { MAX_VIDEO_LENGTH } from '../../constants';

export default class ImageBrowserScreen extends Component {
  state = {
    count: 0,
    submit: null,
    error: ''
  }
  _getHeaderLoader = () => (
    <ActivityIndicator size='small' color={'#0580FF'}/>
  );

  checkVideoErrors = (mediaArr) => {
    let videoCount = 0
    let videoTooLong = false
    for (let i = 0; i < mediaArr.length; i++) {
      const media = mediaArr[i]
      if (Number(media.duration) > MAX_VIDEO_LENGTH) {
        videoTooLong = true
        break
      }
      if (media.mediaType === 'video') {
        videoCount++
      }
    }
    if (videoCount > 0) {
      this.setState({
        error: 'Cannot upload more than 1 video'
      })
      return false
    } else if (videoTooLong) {
      this.setState({
        error: 'Cannot upload video longer than 10 secs'
      })
      return false
    }
    return true
  }
  imagesCallback = (callback) => {
    const { setImageBrowserOpen, setMedia, media,
      edit
     } = this.props;
    callback.then(async (selectedMedia) => {
      const videoErrors = this.checkVideoErrors(selectedMedia)
      if (videoErrors) {
        return
      }

      if (selectedMedia.mediaType === 'video') {
        if (edit) {
          this.setEditVideo(selectedMedia)
        } else {
          this.setNewVideo(selectedMedia)
        }
      }
      this.props.setVideoBrowser(false)
    }).catch((e) => console.log(e))
  };

  async setNewVideo(selectedMedia) {
    const { setImageBrowserOpen, setMedia, media,
      edit, imagePrefix
     } = this.props
     //upload video
     setMedia([
       ...media,
       selectedMedia.uri
     ])
  }

  async setEditVideo(selectedMedia) {
    const { setImageBrowserOpen, setMedia, media,
      edit, imagePrefix
     } = this.props
     // upload video
     const newArr = media.map(video => {
      if (video === edit) {
        return selectedMedia.uri
      }
      return video
    })
    setMedia(newArr)
  }

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
      }
    }}>
      <Text style={{
        // marginRight: 25,
        // marginLeft: -25
        color: count ? palette.blue400 : palette.white
      }}>Done</Text>
    </TouchableOpacity>
  }
  render() {
    const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>
    const {
      count,
      submit,
      error
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
            {
              !!(error) &&
              <ErrorText>
                {error}
              </ErrorText>
            }
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
          mediaType = {[MediaType.photo, MediaType.video]}
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
  }
});
