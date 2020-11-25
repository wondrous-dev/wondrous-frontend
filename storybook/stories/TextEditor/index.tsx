import React, { useState } from 'react'
import {
  Appearance,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  AppState
} from 'react-native'

import { RichEditor, RichToolbar } from './RichEditor'
import styles from './style'
import { Black } from '../../../constants/Colors'
import apollo from '../../../services/apollo'
import { GET_AUTOCOMPLETE_USERS } from '../../../graphql/queries'

export class DescriptionTextEditor extends React.Component {
  richText = React.createRef()

  constructor(props) {
    super(props)
    const theme = 'light'
    const contentStyle = this.createContentStyle(theme)
    this.state = {
      contentStyle,
      theme,
      searchUsers: false,
      autocompleteString: ''
    }
  }

  callAutocomplete = async () => {
    try {
      console.log('state string', this.state.autocompleteString)
      const result = await apollo.query({
        query: GET_AUTOCOMPLETE_USERS,
        variables: {
          username: this.state.autocompleteString
        },
      })
      console.log('results', result)
    } catch (err) {
      console.log('error getting autocomplete users', JSON.stringify(err, null, 2))
    }
  }

  handleKey = async (e) => {
    console.log('eve', e)
    if (e === '@') {
      // set state for tagging users and post request for searching users
      console.log('the fucj', this.state.searchUsers)
      this.setState({
        searchUsers: true
      }, this.callAutocomplete)
    } else if (e === ' ') {
      if (this.state.searchUsers) {
        this.setState({
          searchUsers: false,
          autocompleteString: ''
        })
      }
    } else {
      if (e !== 'Enter') {
        console.log('this', this.state.searchUsers)
        if (this.state.searchUsers) {
          this.setState({
            autocompleteString: this.state.autocompleteString + e
          }, this.callAutocomplete)
        }
      } else {
        // Basically choosing dropdown menu
        this.setState({
          searchUsers: false,
          autocompleteString: ''
        })
      }
    }
  }
  handleChange = (html) => {
    console.log('editor data:', html)
  }
  createContentStyle = (theme) => {
    // Can be selected for more situations (cssText or contentCSSText).
    const contentStyle = {
        backgroundColor: '#000033',
        color: Black,
        placeholderColor: 'gray',
        // cssText: '#editor {background-color: #f3f3f3}', // initial valid
        contentCSSText: 'font-size: 16px; height: 80px', // initial valid
    };
    if (theme === 'light') {
        contentStyle.backgroundColor = '#fff';
        contentStyle.color = Black;
        contentStyle.placeholderColor = '#a9a9a9';
    }
    return contentStyle;
  }

  render() {
    const {
      contentStyle
    } = this.state
    const { backgroundColor, color, placeholderColor } = contentStyle
    const themeBg = { backgroundColor, height: 80 }
    return (
      <SafeAreaView style={[styles.descriptionContainer, themeBg]}>
        <RichEditor
          containerStyle={{
            maxHeight: 80,
            borderRadius: 8
          }}
          editorStyle={{
            maxHeight: 80
          }}
          ref={this.richText}
          placeholder='Add description...'
          onChange={this.handleChange}
          onKeyDown={this.handleKey}
        />
      </SafeAreaView>
    )
  }
}
