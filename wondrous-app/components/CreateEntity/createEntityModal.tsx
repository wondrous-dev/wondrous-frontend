import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { Popper, styled, Switch, TextField } from '@material-ui/core'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import Autocomplete from '@mui/material/Autocomplete'

import ProfilePictureAdd from '../../public/images/onboarding/profile-picture-add.svg'
import {
  ENTITIES_TYPES,
  IMAGE_FILE_EXTENSIONS_TYPE_MAPPING,
  MEDIA_TYPES,
  PERMISSIONS,
  VIDEO_FILE_EXTENSIONS_TYPE_MAPPING,
} from '../../utils/constants'
import CircleIcon from '../Icons/circleIcon'
import CodeIcon from '../Icons/MediaTypesIcons/code'
import AudioIcon from '../Icons/MediaTypesIcons/audio'
import WonderTokenIcon from '../Icons/wonderToken'
import PriorityIcon from '../Icons/priority'
import CloseModalIcon from '../Icons/closeModal'
import CreateDaoIcon from '../Icons/createDao'
import CreatePodIcon from '../Icons/createPod'
import ImageIcon from '../Icons/MediaTypesIcons/image'
import VideoIcon from '../Icons/MediaTypesIcons/video'
import InputForm from '../Common/InputForm/inputForm'
import DropdownSelect from '../Common/DropdownSelect/dropdownSelect'

import { ENTITIES_UI_ELEMENTS } from './chooseEntityToCreateModal'
import MembersRow from './MembersRow/membersRow'
import { CreateFormMembersList } from './MembersRow/styles'
import HeaderImage from './HeaderImage/headerImage'
import {
  CreateFormAddDetailsAppearBlock,
  CreateFormAddDetailsAppearBlockContainer,
  CreateFormAddDetailsButton,
  CreateFormAddDetailsInputBlock,
  CreateFormAddDetailsInputLabel,
  CreateFormAddDetailsInputs,
  CreateFormAddDetailsSection,
  CreateFormAddDetailsSelects,
  CreateFormAddDetailsSwitch,
  CreateFormBaseModal,
  CreateFormBaseModalCloseBtn,
  CreateFormBaseModalHeader,
  CreateFormBaseModalTitle,
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormLinkAttachmentBlock,
  CreateFormLinkAttachmentLabel,
  CreateFormMainDescriptionInput,
  CreateFormMainDescriptionInputSymbolCounter,
  CreateFormMainInputBlock,
  CreateFormMainSection,
  CreateFormMainSelects,
  CreateFormMembersBlock,
  CreateFormMembersBlockTitle,
  CreateFormMembersSection,
  CreateFormPreviewButton,
  CreateFormTaskRequirements,
  CreateFormTaskRequirementsContainer,
  CreateFormTaskRequirementsItem,
  CreateFormTaskRequirementsItemText,
  CreateFormTaskRequirementsTitle,
  CreateLayoutDaoMenuItemIcon,
  CreateFormMainBlockTitle,
  CreateRewardAmountDiv,
  CreateFormAddDetailsButtonText,
  MultiMediaUploadButton,
  MultiMediaUploadButtonText,
  MediaUploadDiv,
  TextInputDiv,
  StyledAutocomplete,
  AutocompleteList,
  OptionDiv,
  OptionTypography,
  StyledChip,
} from './styles'
import SelectDownIcon from '../Icons/selectDownIcon'
import UploadImageIcon from '../Icons/uploadImage'
import {
  getFilenameAndType,
  handleAddFile,
  uploadMedia,
} from '../../utils/media'
import DatePicker from '../Common/DatePicker'
import { MediaItem } from './MediaItem'
import { AddFileUpload } from '../Icons/addFileUpload'
import { TextInput } from '../TextInput'
import { White } from '../../theme/colors'
import { TextInputContext } from '../../utils/contexts'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  GET_AUTOCOMPLETE_USERS,
  GET_USER_ORGS,
  GET_USER_PERMISSION_CONTEXT,
} from '../../graphql/queries'
import { SafeImage } from '../Common/Image'
import {
  GET_USER_AVAILABLE_PODS,
  GET_USER_PODS,
} from '../../graphql/queries/pod'
import { GET_ELIGIBLE_REVIEWERS_FOR_ORG } from '../../graphql/queries/task'
import {
  getMentionArray,
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
} from '../../utils/helpers'
import { GET_ORG_USERS } from '../../graphql/queries/org'
import { CREATE_TASK } from '../../graphql/mutations/task'
import { useOrgBoard } from '../../utils/hooks'
import { CREATE_TASK_PROPOSAL } from '../../graphql/mutations/taskProposal'
import { useMe } from '../Auth/withAuth'
import Ethereum from '../Icons/ethereum'
import { USDCoin } from '../Icons/USDCoin'
import { addProposalItem } from '../../utils/board'
import { CREATE_POD } from '../../graphql/mutations/pod'
import { useRouter } from 'next/router'
import { delQuery } from '../../utils'

const filterUserOptions = (options) => {
  if (!options) return []
  return options.map((option) => {
    return {
      label: option?.username,
      id: option?.id,
      profilePicture: option?.profilePicture,
    }
  })
}

export const MEDIA_UI_ELEMENTS = {
  [MEDIA_TYPES.IMAGE]: {
    icon: ImageIcon,
    label: 'Image',
  },
  [MEDIA_TYPES.AUDIO]: {
    icon: AudioIcon,
    label: 'Audio',
  },
  [MEDIA_TYPES.LINK]: {
    icon: ImageIcon,
    label: 'Link',
  },
  [MEDIA_TYPES.TEXT]: {
    icon: ImageIcon,
    label: 'Text',
  },

  [MEDIA_TYPES.CODE]: {
    icon: CodeIcon,
    label: 'Code',
  },

  [MEDIA_TYPES.VIDEO]: {
    icon: VideoIcon,
    label: 'Video',
  },
}

const AndroidSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    background: '#3E3E3E',

    '&:before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
      zIndex: 1000,
      opacity: 1,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
    background: 'white',
  },

  '& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
    background:
      'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
  },
}))

const createPodMembersList = [
  {
    avatar: '',
    name: '0xAndros',
    admin: 'true',
  },
  {
    avatar: '',
    name: '0xAndraos',
    admin: 'false',
  },
  {
    avatar: '',
    name: '0xAndos',
    admin: 'false',
  },
  {
    avatar: '',
    name: '0xAsndros',
    admin: 'false',
  },
]

const SELECT_OPTIONS = [
  {
    label: 'Today',
    value: 'today',
  },
  {
    label: 'Tomorrow',
    value: 'tomorrow',
  },
  {
    label: 'Never',
    value: 'never',
  },
]

const POD_SELECT_OPTIONS = [
  {
    icon: <CreatePodIcon ellipseColor="#00BAFF" />,
    label: 'Beta Launch',
    amount: 4,
    value: 'beta-launch',
  },
  {
    icon: <CreatePodIcon ellipseColor="#00BAFF" />,
    label: 'Alfa Launch',
    amount: 8,
    value: 'alfa-launch',
  },
]

const REWARD_SELECT_OPTIONS = [
  {
    icon: <Ethereum />,
    label: 'Ether',
    value: 'ETH',
  },
  {
    icon: <USDCoin />,
    label: 'USDC',
    value: 'USDC',
  },
]

const PRIORITY_SELECT_OPTIONS = [
  {
    icon: <PriorityIcon />,
    label: 'Priority 1',
    value: 'priority-1',
  },
  {
    icon: <PriorityIcon />,
    label: 'Priority 2',
    value: 'priority-2',
  },
  {
    icon: <PriorityIcon />,
    label: 'Priority 3',
    value: 'priority-3',
  },
]

export const filterOrgUsersForAutocomplete = (orgUsers) => {
  if (!orgUsers) {
    return []
  }
  return orgUsers.map((orgUser) => ({
    ...orgUser?.user,
    display: orgUser?.user?.username,
    id: orgUser?.user?.id,
  }))
}

const CreateLayoutBaseModal = (props) => {
  const { entityType, handleClose, resetEntityType } = props
  const user = useMe()
  const [addDetails, setAddDetails] = useState(true)
  const [descriptionText, setDescriptionText] = useState('')
  const [mediaUploads, setMediaUploads] = useState([])
  const addDetailsHandleClick = () => {
    setAddDetails(!addDetails)
  }

  const [org, setOrg] = useState(null)
  const [milestone, setMilestone] = useState(null)
  const [assigneeString, setAssigneeString] = useState('')
  const [reviewerString, setReviewerString] = useState('')
  const [assignee, setAssignee] = useState(null)
  const [selectedReviewers, setSelectedReviewers] = useState([])
  const [link, setLink] = useState('')
  const [rewardsCurrency, setRewardsCurrency] = useState(null)
  const [rewardsAmount, setRewardsAmount] = useState(null)
  const [title, setTitle] = useState('')
  const orgBoard = useOrgBoard()
  const isPod = entityType === ENTITIES_TYPES.POD
  const isTask = entityType === ENTITIES_TYPES.TASK
  const textLimit = isPod ? 200 : 900
  const { data: userPermissionsContext } = useQuery(
    GET_USER_PERMISSION_CONTEXT,
    {
      fetchPolicy: 'cache-and-network',
    }
  )
  const { data: userOrgs } = useQuery(GET_USER_ORGS)
  const [getAutocompleteUsers, { data: autocompleteData }] = useLazyQuery(
    GET_AUTOCOMPLETE_USERS
  )

  const [getOrgUsers, { data: orgUsersData }] = useLazyQuery(GET_ORG_USERS)

  const [getEligibleReviewersForOrg, { data: eligibleReviewersData }] =
    useLazyQuery(GET_ELIGIBLE_REVIEWERS_FOR_ORG)

  const descriptionTextCounter = (e) => {
    if (e.target.value.length < textLimit) {
      setDescriptionText(e.target.value)
    }
  }

  const [getUserPods] = useLazyQuery(GET_USER_PODS, {
    onCompleted: (data) => {
      setPods(data?.getUserPods || [])
    },
  })

  const [getUserAvailablePods] = useLazyQuery(GET_USER_AVAILABLE_PODS, {
    onCompleted: (data) => {
      setPods(data?.getAvailableUserPods)
    },
    fetchPolicy: 'network-only',
  })

  // const getOrgReviewers = useQuery(GET_ORG_REVIEWERS)
  const [pods, setPods] = useState([])
  const [pod, setPod] = useState(null)
  const [dueDate, setDueDate] = useState(null)
  const [isPrivate, setIsPrivate] = useState(false)
  const {
    showDeliverableRequirementsSection,
    showBountySwitchSection,
    showAppearSection,
    showLinkAttachmentSection,
    showHeaderImagePickerSection,
    showMembersSection,
    showPrioritySelectSection,
  } = useMemo(() => {
    return {
      showDeliverableRequirementsSection: entityType === ENTITIES_TYPES.TASK,
      showBountySwitchSection: entityType === ENTITIES_TYPES.TASK,
      showAppearSection:
        entityType === ENTITIES_TYPES.TASK ||
        entityType === ENTITIES_TYPES.MILESTONE,
      showLinkAttachmentSection: entityType === ENTITIES_TYPES.POD,
      // TODO: add back in entityType === ENTITIES_TYPES.POD
      showHeaderImagePickerSection: false,
      // TODO: add back in entityType === ENTITIES_TYPES.POD
      showMembersSection: false,
      showPrioritySelectSection: entityType === ENTITIES_TYPES.MILESTONE,
    }
  }, [entityType])

  const { icon: TitleIcon, label: titleText } = ENTITIES_UI_ELEMENTS[entityType]
  const inputRef: any = useRef()

  const filterDAOptions = useCallback((orgs) => {
    if (!orgs) {
      return []
    }
    return orgs.map((org) => ({
      imageUrl: org?.profilePicture,
      label: org?.name,
      value: org?.id,
    }))
  }, [])

  const filterOrgUsers = useCallback((orgUsers) => {
    if (!orgUsers) {
      return []
    }

    return orgUsers.map((orgUser) => ({
      profilePicture: orgUser?.user?.profilePicture,
      label: orgUser?.user?.username,
      value: orgUser?.user?.id,
    }))
  }, [])

  useEffect(() => {
    if (userOrgs?.getUserOrgs?.length === 1) {
      // If you're only part of one dao then just set that as default
      setOrg(userOrgs?.getUserOrgs[0]?.id)
    }
    if (org) {
      getUserAvailablePods({
        variables: {
          orgId: org,
        },
      })
      getOrgUsers({
        variables: {
          orgId: org,
        },
      })
    }
  }, [userOrgs?.getUserOrgs, org, getUserAvailablePods, getOrgUsers])

  const permissions = parseUserPermissionContext({
    userPermissionsContext: userPermissionsContext?.getUserPermissionContext
      ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
      : null,
    orgId: org,
    podId: pod,
  })
  const canCreateTask = permissions.includes(PERMISSIONS.CREATE_TASK)
  const router = useRouter()
  const getPodObject = useCallback(() => {
    let justCreatedPod = null
    pods.forEach((testPod) => {
      if (testPod.id === pod) {
        justCreatedPod = testPod
      }
    })
    return justCreatedPod
  }, [pods, pod])

  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: (data) => {
      const task = data?.createTask
      const justCreatedPod = getPodObject()
      if (orgBoard?.setColumns && task?.orgId === orgBoard?.orgId) {
        const transformedTask = transformTaskToTaskCard(task, {
          orgName: orgBoard?.org?.name,
          orgProfilePicture: orgBoard?.org?.profilePicture,
          podName: justCreatedPod?.name,
        })

        const columns = [...orgBoard?.columns]
        columns[0].tasks = [transformedTask, ...columns[0].tasks]
        orgBoard.setColumns(columns)
      }
      handleClose()
    },
  })

  const [createTaskProposal] = useMutation(CREATE_TASK_PROPOSAL, {
    onCompleted: (data) => {
      const taskProposal = data?.createTaskProposal
      const justCreatedPod = getPodObject()
      if (orgBoard?.setColumns && taskProposal?.orgId === orgBoard?.orgId) {
        const transformedTaskProposal = transformTaskProposalToTaskProposalCard(
          taskProposal,
          {
            userProfilePicture: user?.profilePicture,
            username: user?.username,
            orgName: orgBoard?.org?.name,
            orgProfilePicture: orgBoard?.org?.profilePicture,
            podName: justCreatedPod?.name,
          }
        )

        let columns = [...orgBoard?.columns]
        columns = addProposalItem(transformedTaskProposal, columns)
        orgBoard.setColumns(columns)
      }
      handleClose()
    },
  })

  const [createPod] = useMutation(CREATE_POD, {
    onCompleted: (data) => {
      const pod = data?.createPod
      router.push(`/pod/${pod?.id}`)
    },
    refetchQueries: ['getOrgById'],
  })

  const submitMutation = useCallback(() => {
    switch (entityType) {
      case ENTITIES_TYPES.TASK:
        const taskInput = {
          title,
          description: descriptionText,
          orgId: org,
          milestoneId: milestone,
          podId: pod,
          dueDate,
          // TODO: add links?,
          ...(canCreateTask && {
            assigneeId: assignee?.value,
          }),
          ...(!canCreateTask && {
            proposedAssigneeId: assignee?.value,
          }),
          reviewerIds: selectedReviewers.map(({ id }) => id),
          userMentions: getMentionArray(descriptionText),
          mediaUploads,
        }
        if (canCreateTask) {
          createTask({
            variables: {
              input: taskInput,
            },
          })
        } else {
          createTaskProposal({
            variables: {
              input: taskInput,
            },
          })
        }
        break
      case ENTITIES_TYPES.POD:
        const podInput = {
          name: title,
          username: title?.toLowerCase().split(' ').join('_'),
          description: descriptionText,
          orgId: org,
          privacyLevel: isPrivate ? 'private' : 'public',
          links: [
            {
              url: link,
              displayName: link,
            },
          ],
        }
        createPod({
          variables: {
            input: podInput,
          },
        })
    }
  }, [
    title,
    descriptionText,
    org,
    milestone,
    pod,
    dueDate,
    assignee,
    selectedReviewers,
    mediaUploads,
    canCreateTask,
    createTask,
    entityType,
    createTaskProposal,
    isPrivate,
    link,
    createPod,
  ])
  console.log('isBpod', isPod)
  return (
    <CreateFormBaseModal isPod={isPod}>
      <CreateFormBaseModalCloseBtn onClick={handleClose}>
        <CloseModalIcon />
      </CreateFormBaseModalCloseBtn>
      <CreateFormBaseModalHeader
        style={{
          marginBottom: '0',
        }}
      >
        <TitleIcon circle />
        <CreateFormBaseModalTitle>
          Create a {titleText.toLowerCase()}
        </CreateFormBaseModalTitle>
      </CreateFormBaseModalHeader>

      <CreateFormMainSection>
        <CreateFormMainSelects>
          <DropdownSelect
            title="DAO"
            value={org}
            setValue={setOrg}
            labelText="Choose DAO"
            labelIcon={<CreateDaoIcon />}
            options={filterDAOptions(userOrgs?.getUserOrgs) || []}
            name="dao"
          />
          {!isPod && (
            <DropdownSelect
              title="Pod"
              labelText="Choose Pod"
              value={pod}
              setValue={setPod}
              labelIcon={<CreatePodIcon />}
              options={filterDAOptions(pods) || []}
              name="pod"
            />
          )}
        </CreateFormMainSelects>

        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>{titleText} title</CreateFormMainBlockTitle>

          <InputForm
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Enter ${titleText.toLowerCase()} title`}
            search={false}
          />
        </CreateFormMainInputBlock>

        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>
            {titleText} description
          </CreateFormMainBlockTitle>
          <TextInputDiv>
            <TextInputContext.Provider
              value={{
                content: descriptionText,
                onChange: descriptionTextCounter,
                list: filterOrgUsersForAutocomplete(orgUsersData?.getOrgUsers),
              }}
            >
              <TextInput
                placeholder={`Enter ${titleText.toLowerCase()} description`}
                // rows={5}
                // maxRows={5}
                style={{
                  input: {
                    overflow: 'auto',
                    color: White,
                    height: '100px',
                    marginBottom: '16px',
                    borderRadius: '6px',
                    padding: '8px',
                  },
                }}
              />
            </TextInputContext.Provider>
          </TextInputDiv>

          <CreateFormMainDescriptionInputSymbolCounter>
            {descriptionText.length}/{textLimit} characters
          </CreateFormMainDescriptionInputSymbolCounter>
        </CreateFormMainInputBlock>
        {!isPod && (
          <CreateFormMainInputBlock>
            <CreateFormMainBlockTitle>Multi-media</CreateFormMainBlockTitle>

            {mediaUploads?.length > 0 ? (
              <MediaUploadDiv>
                {mediaUploads.map((mediaItem) => (
                  <MediaItem
                    key={mediaItem?.uploadSlug}
                    mediaUploads={mediaUploads}
                    setMediaUploads={setMediaUploads}
                    mediaItem={mediaItem}
                  />
                ))}
                <AddFileUpload
                  onClick={() => {
                    inputRef.current.click()
                  }}
                  style={{
                    cursor: 'pointer',
                    width: '24',
                    height: '24',
                    marginBottom: '8px',
                  }}
                />
              </MediaUploadDiv>
            ) : (
              <MultiMediaUploadButton onClick={() => inputRef.current.click()}>
                <UploadImageIcon
                  style={{
                    width: '13',
                    height: '17',
                    marginRight: '8px',
                  }}
                />
                <MultiMediaUploadButtonText>
                  Upload file
                </MultiMediaUploadButtonText>
              </MultiMediaUploadButton>
            )}
            <input
              type="file"
              hidden
              ref={inputRef}
              onChange={(event) =>
                handleAddFile({
                  event,
                  filePrefix: 'tmp/task/new/',
                  mediaUploads,
                  setMediaUploads,
                })
              }
            />
          </CreateFormMainInputBlock>
        )}

        {/*Upload header image block*/}
        {showHeaderImagePickerSection && <HeaderImage />}

        {isTask && (
          <CreateFormMainSelects>
            <DropdownSelect
              title="Reward currency"
              labelText="Choose tokens"
              options={REWARD_SELECT_OPTIONS}
              name="reward-currency"
              setValue={setRewardsCurrency}
              value={rewardsCurrency}
            />
            <CreateRewardAmountDiv>
              <CreateFormMainBlockTitle>Reward amount</CreateFormMainBlockTitle>

              <InputForm
                style={{
                  marginTop: '20px',
                }}
                type={'number'}
                placeholder="Enter reward amount"
                search={false}
                value={rewardsAmount}
                setValue={setRewardsAmount}
              />
            </CreateRewardAmountDiv>
          </CreateFormMainSelects>
        )}

        {showMembersSection && (
          <CreateFormMembersSection>
            <CreateFormMainBlockTitle>Members</CreateFormMainBlockTitle>

            <InputForm
              search
              margin
              icon={<CircleIcon />}
              placeholder="Search reviewers"
            />

            <CreateFormMembersBlock>
              <CreateFormMembersBlockTitle>
                {createPodMembersList.length}
                {createPodMembersList.length > 1 ? ' members' : ' member'}
              </CreateFormMembersBlockTitle>
              <CreateFormMembersList>
                {createPodMembersList.map((item) => (
                  <MembersRow
                    key={item.name}
                    name={item.name}
                    styledSwitch={<AndroidSwitch />}
                  />
                ))}
              </CreateFormMembersList>
            </CreateFormMembersBlock>
          </CreateFormMembersSection>
        )}
        {showAppearSection && (
          <CreateFormAddDetailsInputs
            style={{
              marginBottom: '40px',
            }}
          >
            <CreateFormAddDetailsInputBlock>
              <CreateFormAddDetailsInputLabel>
                Assigned to
              </CreateFormAddDetailsInputLabel>
              <StyledAutocomplete
                options={filterOrgUsers(orgUsersData?.getOrgUsers)}
                renderInput={(params) => (
                  <TextField
                    style={{
                      color: White,
                      fontFamily: 'Space Grotesk',
                      fontSize: '14px',
                      paddingLeft: '4px',
                    }}
                    placeholder="Enter username..."
                    InputLabelProps={{ shrink: false }}
                    {...params}
                  />
                )}
                PopperComponent={AutocompleteList}
                value={assignee}
                inputValue={assigneeString}
                onInputChange={(event, newInputValue) => {
                  setAssigneeString(newInputValue)
                }}
                renderOption={(props, option, state) => {
                  return (
                    <OptionDiv
                      onClick={(event) => {
                        setAssignee(option)
                        props?.onClick(event)
                      }}
                    >
                      {option?.profilePicture && (
                        <SafeImage
                          src={option?.profilePicture}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '15px',
                          }}
                        />
                      )}
                      <OptionTypography>{option?.label}</OptionTypography>
                    </OptionDiv>
                  )
                }}
              />
            </CreateFormAddDetailsInputBlock>
            {canCreateTask && (
              <CreateFormAddDetailsInputBlock>
                <CreateFormAddDetailsInputLabel>
                  Reviewer
                </CreateFormAddDetailsInputLabel>
                <StyledAutocomplete
                  options={filterUserOptions(
                    eligibleReviewersData?.getEligibleReviewersForOrg
                  ).filter(
                    ({ id }) =>
                      !selectedReviewers.map(({ id }) => id).includes(id)
                  )}
                  multiple
                  onChange={(event, newValue, reason) => {
                    if ('clear' === reason) {
                      setSelectedReviewers([])
                    }
                    if (event.code === 'Backspace' && reviewerString === '') {
                      setSelectedReviewers(selectedReviewers.slice(0, -1))
                    }
                  }}
                  onOpen={() =>
                    getEligibleReviewersForOrg({
                      variables: {
                        orgId: org,
                        searchString: '',
                      },
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      style={{
                        color: White,
                        fontFamily: 'Space Grotesk',
                        fontSize: '14px',
                        paddingLeft: '4px',
                      }}
                      placeholder="Enter username..."
                      InputLabelProps={{ shrink: false }}
                      onChange={(event) => {
                        setReviewerString(event.target.value)
                        getEligibleReviewersForOrg({
                          variables: {
                            orgId: org,
                            searchString: event.target.value,
                          },
                        })
                      }}
                      {...params}
                    />
                  )}
                  value={selectedReviewers}
                  renderTags={(value) =>
                    value?.map((option, index) => {
                      return (
                        <StyledChip
                          key={index}
                          label={option?.label}
                          onDelete={() =>
                            setSelectedReviewers(
                              selectedReviewers.filter(
                                ({ id }) => id !== option?.id
                              )
                            )
                          }
                        />
                      )
                    })
                  }
                  PopperComponent={AutocompleteList}
                  renderOption={(props, option, state) => {
                    return (
                      <OptionDiv
                        onClick={(event) => {
                          if (
                            selectedReviewers
                              .map(({ id }) => id)
                              .indexOf(option?.id === -1)
                          ) {
                            setSelectedReviewers([...selectedReviewers, option])
                            setReviewerString('')
                          }
                          props?.onClick(event)
                        }}
                      >
                        {option?.profilePicture && (
                          <SafeImage
                            src={option?.profilePicture}
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '15px',
                              marginRight: '8px',
                            }}
                          />
                        )}
                        <OptionTypography>{option?.label}</OptionTypography>
                      </OptionDiv>
                    )
                  }}
                />
              </CreateFormAddDetailsInputBlock>
            )}
          </CreateFormAddDetailsInputs>
        )}
      </CreateFormMainSection>

      {/* {showDeliverableRequirementsSection && (
				<CreateFormTaskRequirements>
					<CreateFormTaskRequirementsTitle>
						Deliverables requirements
					</CreateFormTaskRequirementsTitle>
					<CreateFormTaskRequirementsContainer>
						{Object.entries(MEDIA_UI_ELEMENTS).map(
							([key, { icon: MediaIcon, label }]) => (
								<CreateFormTaskRequirementsItem key={key}>
									<MediaIcon />
									<CreateFormTaskRequirementsItemText>
										{label}
									</CreateFormTaskRequirementsItemText>
								</CreateFormTaskRequirementsItem>
							)
						)}
					</CreateFormTaskRequirementsContainer>
				</CreateFormTaskRequirements>
			)} */}

      <CreateFormAddDetailsSection>
        {/* <CreateFormAddDetailsButton onClick={() => addDetailsHandleClick()}>
          {!addDetails ? (
            <>
              <CreateFormAddDetailsButtonText>
                Add more details
              </CreateFormAddDetailsButtonText>
              <SelectDownIcon
                style={{
                  width: '10',
                  height: '5.83',
                }}
              ></SelectDownIcon>
            </>
          ) : (
            <SelectDownIcon
              style={{
                transform: 'rotate(180deg)',
                width: '10',
                height: '5.83',
              }}
            ></SelectDownIcon>
          )}
        </CreateFormAddDetailsButton> */}
        {addDetails && (
          <CreateFormAddDetailsAppearBlock>
            {showAppearSection && (
              <CreateFormAddDetailsAppearBlockContainer>
                <CreateFormAddDetailsSelects>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      title="Due date"
                      inputFormat="MM/dd/yyyy"
                      value={dueDate}
                      setValue={setDueDate}
                    />
                  </LocalizationProvider>
                  {/* <DropdownSelect
                    title="Connect to Milestone"
                    labelText="Choose Milestone"
                    options={MILESTONE_SELECT_OPTION}
                    name="connect-to-milestone"
                  /> */}
                </CreateFormAddDetailsSelects>

                {/* <CreateFormAddDetailsSelects> */}
                {/* {isPod && (
                  <CreateFormAddDetailsSwitch>
                    <CreateFormAddDetailsInputLabel>
                      Private
                    </CreateFormAddDetailsInputLabel>
                    <AndroidSwitch
                      checked={isPrivate}
                      onChange={(e) => {
                        setIsPrivate(e.target.checked)
                      }}
                    />
                  </CreateFormAddDetailsSwitch>
                )} */}

                {/*if Suggest a task opened */}
                {/* {showBountySwitchSection && canCreateTask && (
                    <CreateFormAddDetailsSwitch>
                      <CreateFormAddDetailsInputLabel>
                        This is a bounty
                      </CreateFormAddDetailsInputLabel>
                      <AndroidSwitch />
                    </CreateFormAddDetailsSwitch>
                  )} */}

                {/*if Create a milestone opened*/}
                {/* {showPrioritySelectSection && (
                    <DropdownSelect
                      title="Priority"
                      labelText="Choose Milestone"
                      options={PRIORITY_SELECT_OPTIONS}
                      name="priority"
                    />
                  )} */}
                {/* </CreateFormAddDetailsSelects> */}
              </CreateFormAddDetailsAppearBlockContainer>
            )}

            {showLinkAttachmentSection && (
              <CreateFormLinkAttachmentBlock
                style={{
                  borderBottom: 'none',
                  paddingTop: '16px',
                }}
              >
                <CreateFormLinkAttachmentLabel>
                  Link
                </CreateFormLinkAttachmentLabel>
                <InputForm
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  margin
                  placeholder="Enter link URL"
                  search={false}
                />
              </CreateFormLinkAttachmentBlock>
            )}
            {isPod && (
              <div>
                <CreateFormAddDetailsSwitch>
                  <CreateFormAddDetailsInputLabel>
                    Private {titleText.toLowerCase()}
                  </CreateFormAddDetailsInputLabel>
                  <AndroidSwitch
                    checked={isPrivate}
                    onChange={(e) => {
                      setIsPrivate(e.target.checked)
                    }}
                  />
                </CreateFormAddDetailsSwitch>
              </div>
            )}
          </CreateFormAddDetailsAppearBlock>
        )}
      </CreateFormAddDetailsSection>

      <CreateFormFooterButtons>
        <CreateFormButtonsBlock>
          <CreateFormCancelButton onClick={resetEntityType}>
            Cancel
          </CreateFormCancelButton>
          <CreateFormPreviewButton onClick={submitMutation}>
            {canCreateTask ? 'Create' : 'Propose'} {titleText}
          </CreateFormPreviewButton>
        </CreateFormButtonsBlock>
      </CreateFormFooterButtons>
    </CreateFormBaseModal>
  )
}

export default CreateLayoutBaseModal
