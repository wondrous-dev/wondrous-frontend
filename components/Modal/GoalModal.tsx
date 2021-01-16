import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions, Platform, TextInput, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import { useQuery } from '@apollo/client'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { isAfter, formatDistanceToNowStrict, format, toDate } from 'date-fns'

import { Black, White, Blue400, Grey400, Grey800, Grey750, Blue500, Red400, Yellow300 } from '../../constants/Colors'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import { endOfWeekFromNow } from '../../utils/date'
import { useMe } from '../../components/withAuth'
import { GET_USER_PROJECTS } from '../../graphql/queries/project'
import Camera from '../../components/Camera'
import { privacyDropdown } from './common'
import PriorityFlame from '../../assets/images/modal/priority'
import CameraIcon from '../../assets/images/camera'
import ImageIcon from '../../assets/images/image'
import LinkIcon from '../../assets/images/link'

const goalModalStyles = StyleSheet.create({
  fullScreenContainer: {
    backgroundColor: White,
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height),
    alignSelf: 'center',
    marginBottom: 0
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
    marginTop: spacingUnit * 3
  },
  infoContainer: {
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
    marginTop: spacingUnit * 3,
    ...(Platform.OS !== 'android' && {
      zIndex: 100,
    })
  },
  inputContainer: {

  },
  title: {
    fontSize: 18
  },
  editContainer: {
    borderTopColor: Grey400,
    borderTopWidth: 1,
    marginTop: spacingUnit * 3,
    paddingTop: spacingUnit * 3
  },
  editRowContainer: {
    flexDirection: 'row',
    marginBottom: spacingUnit * 2.5,
    alignItems: 'center',
  },
  editRowTextContainer: {
    marginRight: spacingUnit * 2
  },
  editRowText: {
    color: Grey800,
    fontSize: 16,
    width: spacingUnit * 7.5
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  priorityRowItem: {
    padding: spacingUnit * 0.5,
    paddingLeft: spacingUnit * 0.75,
    paddingRight: spacingUnit * 0.75,
    flexDirection: 'row',
    marginRight: spacingUnit,
    borderRadius: 4
  },
  descriptionBox: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: Grey400,
    flex: 1,
    minHeight: spacingUnit * 9,
    padding: spacingUnit,
    color: Black
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacingUnit * 2
  },
  link: {
    fontFamily: 'Rubik Light',
    fontSize: 16
  },
  addLinkButton: {
    padding: spacingUnit
  }
})

const DateDisplay = ({ dueDate, onDateChange, editDate, setEditDate }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      {/* <DueDateIcon /> */}
      <DateTimePicker
          testID="dateTimePicker"
          value={dueDate}
          mode={'date'}
          display="default"
          onChange={(e, date) => {
            if (date) {
              onDateChange(new Date(date))
            }
          }}
          style={{
            flex: 1,
            marginLeft: spacingUnit
          }}
        />
    </View>
  )
}

const ModalDropdown = ({ defaultValue, items, placeholder, value, setValue, zIndex }) => {
  return (
      <DropDownPicker
      defaultValue={value}
      style={{
        backgroundColor: Grey750,
        // borderColor: 'rgba(47,46,65, 0.54)'
      }}

      containerStyle={{
        flex: 1,
        height: 40
      }}
      labelStyle={{
        color: Black,
        fontSize: 16,
        fontFamily: 'Rubik Light'
      }}
      itemStyle={{justifyContent: 'flex-start'}}
      selectedLabelStyle={{
        fontFamily: 'Rubik Light',
        fontWeight: '500'
      }}

      searchable={true}
        items={items}
      />
  )
}

export const PriorityList = ({ priority, setPriority }) => {
  const priorityHigh = priority === 'high'
  const priorityMedium = priority === 'medium'
  const priorityLow = priority === 'low'

  return (
    <View style={goalModalStyles.priorityRow}>
      <Pressable onPress={() => setPriority('high')} style={{
        ...goalModalStyles.priorityRowItem,
        ...(priorityHigh && {
          backgroundColor: Red400
        })
      }}>
        <PriorityFlame color={priorityHigh ? White : Red400} style={{
          marginRight: 0.5 * spacingUnit
        }} />
        <Paragraph color={priorityHigh ? White : Grey800}>
          High
        </Paragraph>
      </Pressable>
      <Pressable onPress={() => setPriority('medium')} style={{
        ...goalModalStyles.priorityRowItem,
        ...(priorityMedium && {
          backgroundColor: Yellow300
        })
      }}>
        <PriorityFlame color={priorityMedium ? White: Yellow300} style={{
          marginRight: 0.5 * spacingUnit
        }} />
        <Paragraph color={priorityMedium ? White : Grey800}>
          Medium
        </Paragraph>
      </Pressable>
      <Pressable onPress={() => setPriority('low')} style={{
        ...goalModalStyles.priorityRowItem,
        ...(priorityLow && {
          backgroundColor: Blue400
        })
      }}>
        <PriorityFlame color={priorityLow ? White : Blue400} style={{
          marginRight: 0.5 * spacingUnit
        }}/>
        <Paragraph color={priorityLow ? White : Grey800}>
          Low
        </Paragraph>
      </Pressable>
    </View>
  )
}

export const FullScreenGoalModal = ({ goal, setup, isVisible, setModalVisible, projectId }) => {
  const initialDueDate = endOfWeekFromNow()
  const [completed, setCompleted] = useState(false)
  const [goalText, setGoalText] = useState(goal && goal.name)
  const [project, setProject] = useState((goal && goal.projectId) || projectId)
  const [priority, setPriority] = useState(goal && goal.priority)
  const [description, setDescription] = useState(goal && goal.description)
  const [privacy, setPrivacy] = useState('public')
  const [dueDate, setDueDate] = useState((goal && goal.dueDate) ? new Date(goal.dueDate) : toDate(initialDueDate))
  const [editDate, setEditDate] = useState(false)
  const [link, setLink] = useState(goal && goal.additionalData && goal.additionalData.link)
  const [addLink, setAddLink] = useState(!!(link))
  const [media, setMedia] = useState((goal && goal.additionalData && goal.additionalData.media) || [])
  const [cameraOpen, setCameraOpen] = useState(false)
  const user = useMe()
  const { data: projectUsers, loading, error } = useQuery(GET_USER_PROJECTS)
  const projectDropdowns = projectUsers && projectUsers.getUserProjects ? projectUsers.getUserProjects.map(projectUser => {
    return {
      label: projectUser.project.name,
      value: projectUser.project.id
    }
  }) : [{
    label: '',
    value: ''
  }]
  console.log('projectDropdwons', projectDropdowns, projectId)
  return (
    <Modal isVisible={isVisible}>
      <TouchableWithoutFeedback 
  onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={goalModalStyles.fullScreenContainer}>
        {cameraOpen &&
                <Camera
                snapperOpen={cameraOpen}
              setSnapperOpen={setCameraOpen}
                setImage={(image) => setMedia([image])}
                filePrefix={`goal/new`}
                saveLocalImage={false}
              />
        }
        <View style={goalModalStyles.topRowContainer}>
          <Pressable onPress={() => setModalVisible(false)} style={{
            flex: 1
          }}>
          <RegularText color={Blue400} style={{
            fontSize: 16
          }}>
            Cancel
          </RegularText>
          </Pressable>
          <View style={{
            flex: 1
          }}>
            <Subheading color={Black} style={{
              fontSize: 24
            }}>
              {goal ? 'Edit' : 'New'} goal
            </Subheading>
          </View>
          <View style={{
            flex: 1,
          }}>
          <Pressable style={{
                alignSelf: 'flex-end',
                width: spacingUnit * 10,
                paddingTop: 4,
                paddingBottom: 4,
                backgroundColor: Blue500,
                borderRadius: spacingUnit,
                alignItems: 'center'
              }}>
            <RegularText color={White} style={{
              fontSize: 16
            }}>
              {goal ? 'Update': 'Create' }
            </RegularText>
          </Pressable>
        </View>
        </View>
        <View style={goalModalStyles.infoContainer}>
          <View style={goalModalStyles.inputContainer}>
            <TextInput
              multiline
              onChangeText={text => setGoalText(text)}
              value={goalText}
              autoFocus={!(goalText)}
              placeholder='Add goal...'
              style={goalModalStyles.title}
            />
          </View>
          <View style={goalModalStyles.editContainer}>
              <View style={[
                goalModalStyles.editRowContainer,

                // NEW
                Platform.OS !== 'android' && {
                  zIndex: 5000
                }
              ]}>
                <View style={goalModalStyles.editRowTextContainer}>
                  <RegularText color={Grey800} style={goalModalStyles.editRowText}>
                    Project
                  </RegularText>
                </View>
                <ModalDropdown value={project} setValue={setProject} defaultValue={projectId} items={projectDropdowns} placeholder='Select a project' zIndex={5000} />
              </View>
              <View style={[
                goalModalStyles.editRowContainer,
                Platform.OS !== 'android' && {
                  zIndex: 4000
                }
              ]}>
                <View style={goalModalStyles.editRowTextContainer}>
                  <RegularText color={Grey800} style={goalModalStyles.editRowText}>
                    Privacy
                  </RegularText>
                </View>
                <ModalDropdown value={privacy} items={privacyDropdown} zIndex={4000} setValue={setPrivacy} placeholder='Select privacy level' />
              </View>
              <View style={goalModalStyles.editRowContainer}>
                <View style={goalModalStyles.editRowTextContainer}>
                  <RegularText color={Grey800} style={goalModalStyles.editRowText}>
                    Priority
                  </RegularText>
                </View>
                <PriorityList priority={priority} setPriority={setPriority} />
              </View>
              <View style={goalModalStyles.editRowContainer}>
                    <View style={goalModalStyles.editRowTextContainer}>
                      <RegularText color={Grey800} style={goalModalStyles.editRowText}>
                        Due
                      </RegularText>
                    </View>
                    <DateDisplay dueDate={dueDate} onDateChange={setDueDate} editDate={editDate} setEditDate={setEditDate} />
                </View>
              <View style={[goalModalStyles.editRowContainer, {
                marginBottom: spacingUnit * 2
              }]}>
                <TextInput
                  multiline
                  onChangeText={text => setDescription(text)}
                  value={description}
                  placeholder='Longer description...'
                  style={goalModalStyles.descriptionBox}
                />
              </View>
              <View style={goalModalStyles.attachmentRow}>
                <LinkIcon color={Grey800} style={{
                  marginRight: spacingUnit * 2
                }} onPress={() => setAddLink(true)} />
                <CameraIcon onPress={() => setCameraOpen(true)} color={Grey800} style={{
                  marginRight: spacingUnit * 2
                }} />
                <ImageIcon color={Grey800} />
              </View>
              <ScrollView>
                {addLink &&
                  <View style={goalModalStyles.linkContainer}>
                    <TextInput
                      onChangeText={text => setLink(text)}
                      value={link}
                      autoFocus={!(link)}
                      placeholder='Add link'
                      style={goalModalStyles.link}
                    />
                  </View>
                }
              </ScrollView>
          </View>
        </View>
      </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
