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
  AppState,
  Animated,
  ActivityIndicator,
  Image,
  Pressable
} from 'react-native'

import { RichEditor, RichToolbar } from './RichEditor'
import { SvgImage } from '../Image'
import Placeholder from '../../../assets/images/placeholder.svg'
import { Black, Grey100, Grey200, Grey300, White } from '../../../constants/Colors'
import apollo from '../../../services/apollo'
import { GET_AUTOCOMPLETE_USERS } from '../../../graphql/queries'

function findIndexes(source, find) {
  if (!source) {
    return [];
  }
  if (!find) {
      return source.split('').map(function(_, i) { return i; });
  }
  var result = [];
  var i = 0;
  while(i < source.length) {
    if (source.substring(i, i + find.length) == find) {
      result.push(i);
      i += find.length;
    } else {
      i++;
    }
  }
  return result;
}

function findEndIndex (source, index) {
  let i = index
  while(i < source.length && source.charAt(i) !== ' ' && source.substring(i, i+6) !== '&nbsp' && source.charAt(i) !== '<') {

    i++
  }
  return i
}

const AutocompleteListItem = ({ user, autocompleteFill }) => {
  return (
    <Pressable onPress={() => autocompleteFill(user)}>
      <View style={{
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Grey100,
        
      }}>
        {
          user.profilePicture && user.profilePicture !== 'None' ?
          <Image
          source={{uri: user.profilePicture}} style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            marginRight: 8
          }} />
          :
          <SvgImage width="30" height="30" srcElement={Placeholder} style={{
            marginRight: 8
          }} />
        }
        <View>
          <Text style={{color: Black, marginBottom: 4, fontWeight: 'bold'}}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={{ color: Grey200, fontSize: 14 }}>
            @{user.username}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const AutocompleteList = ({ users, autocompleteLoading, autocompleteFill}) => {
  const margin = users.length * -58
  return (
    <SafeAreaView style={{
      flex: 1,
      width: '100%',
      backgroundColor: White,
      borderWidth: 1,
      borderColor: Grey300,
      marginTop: margin,
      zIndex: 10,
      position: 'absolute',
      justifyContent: 'center',
      borderRadius: 4
    }}>
      {
        autocompleteLoading ?
        <ActivityIndicator />
        :
        <>
          {users.map(user => (
            <AutocompleteListItem key={user.id} user={user} autocompleteFill={autocompleteFill} />
          ))}
        </>
      }
    </SafeAreaView>
  )
}
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
      autocompleteString: '',
      autocompleteLoading: false,
      autocompleteUserList: [],
      content: ''
    }
    this.paddingInput = new Animated.Value(0)
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.paddingInput, {
        duration: event.duration,
        toValue: 60,
        useNativeDriver: false
    }).start();
  }

  keyboardWillHide = (event) => {
    Animated.timing(this.paddingInput, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false
    }).start()
  }


  callAutocomplete = async () => {
    this.setState({
      autocompleteLoading: true
    })
    try {
      const result = await apollo.query({
        query: GET_AUTOCOMPLETE_USERS,
        variables: {
          username: this.state.autocompleteString
        },
      })
      if (result.data) {
        this.setState({
          autocompleteUserList: result.data.getAutocompleteUsers,
          autocompleteLoading: false
        })
      }
    } catch (err) {
      console.log('error getting autocomplete users', JSON.stringify(err, null, 2))
    }
  }

  handleKey = async (e) => {
    if (e === '@') {
      // set state for tagging users and post request for searching users
      this.setState({
        searchUsers: !this.state.searchUsers
      }, this.callAutocomplete)
    } else if (e === ' ') {
      if (this.state.searchUsers) {
        this.setState({
          searchUsers: false,
          autocompleteString: ''
        })
      }
    } else if (e === 'Backspace') {
      if (this.state.searchUsers && !this.state.autocompleteString) {
        this.setState({
          searchUsers: false
        })
      } else if (this.state.searchUsers && this.state.autocompleteString) {
        this.setState({
          autocompleteString: this.state.autocompleteString.slice(0, -1) 
        }, this.callAutocomplete)
      }
    } else {
      if (e !== 'Enter' && /^[A-Za-z0-9_]$/.test(e)) {
        if (this.state.searchUsers) {
          this.setState({
            autocompleteString: this.state.autocompleteString + e
          }, this.callAutocomplete)
        }
      } else if (e === 'Enter') {
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
    this.setState({
      content: html
    })
  }

  replaceLink = ({ username, index, endIndex, newHtml}) => {
    newHtml = newHtml.slice(0, index) + `<a href='/user/${username}'>@${username}</a>` + newHtml.slice(endIndex)
    return newHtml
  }

  replaceAutocompleteLink = (user) => {
    const { username } = user
    // Find the autocompletestring we're on right now.
    const instances = findIndexes(this.state.content, '@' + this.state.autocompleteString)
    let newHtml = this.state.content
    instances.forEach(instance => {
      // Find whether there's a </a> after it
      const endIndex = findEndIndex(this.state.content, instance)
      if (endIndex + '</a>'.length < newHtml.length) {
        if (this.state.content.substring(endIndex, endIndex + '</a>'.length) !== '</a>') {
          newHtml = this.replaceLink({ username, index: instance, endIndex, newHtml })
        }
      } else {
          newHtml = this.replaceLink({ username, index: instance, endIndex, newHtml })
      }
    })

    this.setState({
      content: newHtml,
      searchUsers: false,
      autocompleteString: ''
    })
    //TODO set props for selected user to send to the backend
    this.richText.current.setContentHTML(newHtml)
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
    const themeBg = { backgroundColor, height: 80, borderRadius: 8 }
    return (
      <SafeAreaView style={{
        position: 'absolute',
        bottom: 0,
        width: '100%'
      }}>
        <KeyboardAvoidingView style={[themeBg]} behavior='padding'>
          <Animated.View style={{marginBottom: this.paddingInput}}>
            {
              this.state.searchUsers &&
              <AutocompleteList users={this.state.autocompleteUserList} autocompleteLoading={this.state.autocompleteLoading} autocompleteFill={this.replaceAutocompleteLink} />
            }
            <ScrollView
            nestedScrollEnabled={true}
            
            >
            
            <RichEditor
              containerStyle={{
                maxHeight: 80,
                borderRadius: 8
              }}
              editorStyle={{
                maxHeight: 80,
                borderWidth: 1,
                borderColor: Grey300,
                
              }}

              ref={this.richText}
              placeholder='Add description...'
              onChange={this.handleChange}
              onKeyDown={this.handleKey}
            />
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}
