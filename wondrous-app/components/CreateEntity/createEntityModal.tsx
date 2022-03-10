import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { styled, Switch, TextField } from '@material-ui/core';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CREATE_POD } from '../../graphql/mutations/pod';
import { CREATE_MILESTONE, CREATE_TASK, CREATE_BOUNTY } from '../../graphql/mutations/task';
import { CREATE_TASK_PROPOSAL } from '../../graphql/mutations/taskProposal';
import {
  GET_AUTOCOMPLETE_USERS,
  GET_TASK_BY_ID,
  GET_USER_ORGS,
  GET_USER_PERMISSION_CONTEXT,
} from '../../graphql/queries';
import { GET_ORG_USERS } from '../../graphql/queries/org';
import { GET_PAYMENT_METHODS_FOR_ORG } from '../../graphql/queries/payment';
import { GET_POD_USERS, GET_USER_AVAILABLE_PODS } from '../../graphql/queries/pod';
import {
  GET_ELIGIBLE_REVIEWERS_FOR_ORG,
  GET_ELIGIBLE_REVIEWERS_FOR_POD,
  GET_MILESTONES,
} from '../../graphql/queries/task';
import { Grey700, White } from '../../theme/colors';
import { addProposalItem } from '../../utils/board';
import {
  CHAIN_TO_CHAIN_DIPLAY_NAME,
  ENTITIES_TYPES,
  MEDIA_TYPES,
  PERMISSIONS,
  PRIVACY_LEVEL,
  TAGS,
} from '../../utils/constants';
import { TextInputContext } from '../../utils/contexts';
import {
  getMentionArray,
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
} from '../../utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from '../../utils/hooks';
import { handleAddFile } from '../../utils/media';
import { useMe } from '../Auth/withAuth';
import { ErrorText } from '../Common';
import DatePicker from '../Common/DatePicker';
import DropdownSelect from '../Common/DropdownSelect/dropdownSelect';
import { FileLoading } from '../Common/FileUpload/FileUpload';
import { SafeImage } from '../Common/Image';
import InputForm from '../Common/InputForm/inputForm';
import { AddFileUpload } from '../Icons/addFileUpload';
import CircleIcon from '../Icons/circleIcon';
import CloseModalIcon from '../Icons/closeModal';
import CreateDaoIcon from '../Icons/createDao';
import CreatePodIcon from '../Icons/createPod';
import AudioIcon from '../Icons/MediaTypesIcons/audio';
import CodeIcon from '../Icons/MediaTypesIcons/code';
import ImageIcon from '../Icons/MediaTypesIcons/image';
import VideoIcon from '../Icons/MediaTypesIcons/video';
import UploadImageIcon from '../Icons/uploadImage';
import { TextInput } from '../TextInput';
import { ENTITIES_UI_ELEMENTS } from './chooseEntityToCreateModal';
import HeaderImage from './HeaderImage/headerImage';
import { MediaItem } from './MediaItem';
import Tags from '../Tags';
import MembersRow from './MembersRow/membersRow';
import { CreateFormMembersList } from './MembersRow/styles';
import {
  CreateFormAddDetailsAppearBlock,
  CreateFormAddDetailsAppearBlockContainer,
  CreateFormAddDetailsInputBlock,
  CreateFormAddDetailsInputLabel,
  CreateFormAddDetailsInputs,
  CreateFormAddDetailsLocalizationProvider,
  CreateFormAddDetailsSection,
  CreateFormAddDetailsSelects,
  CreateFormAddDetailsSwitch,
  CreateFormAddDetailsSwitchLabel,
  CreateFormBaseModal,
  CreateFormBaseModalCloseBtn,
  CreateFormBaseModalHeader,
  CreateFormBaseModalTitle,
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormLinkAttachmentBlock,
  CreateFormLinkAttachmentLabel,
  CreateFormMainBlockTitle,
  CreateFormMainDescriptionInputSymbolCounter,
  CreateFormMainInputBlock,
  CreateFormMainSection,
  CreateFormMainSelects,
  CreateFormMembersBlock,
  CreateFormMembersBlockTitle,
  CreateFormMembersSection,
  CreateFormPreviewButton,
  CreateFormRewardCurrency,
  CreateRewardAmountDiv,
  MediaUploadDiv,
  MultiMediaUploadButton,
  MultiMediaUploadButtonText,
  OptionDiv,
  OptionTypography,
  StyledChip,
  TextInputDiv,
  StyledAutocompletePopper,
  CreateFormAddTagsSection,
} from './styles';

const filterUserOptions = (options) => {
  if (!options) return [];
  return options.map((option) => {
    return {
      label: option?.username ?? option?.title,
      id: option?.id,
      profilePicture: option?.profilePicture,
    };
  });
};

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
};

export const AndroidSwitch = styled(Switch)(({ theme }) => ({
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
    background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
  },
}));

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
];

export const filterOrgUsersForAutocomplete = (orgUsers) => {
  if (!orgUsers) {
    return [];
  }
  return orgUsers.map((orgUser) => ({
    ...orgUser?.user,
    display: orgUser?.user?.username,
    id: orgUser?.user?.id,
  }));
};

export const filterPaymentMethods = (paymentMethods) => {
  if (!paymentMethods) return [];
  return paymentMethods.map((paymentMethod) => {
    return {
      ...paymentMethod,
      icon: <SafeImage src={paymentMethod.icon} style={{ width: '30px', height: '30px', borderRadius: '15px' }} />,
      label: `${paymentMethod.tokenName}: ${CHAIN_TO_CHAIN_DIPLAY_NAME[paymentMethod.chain]}`,
      value: paymentMethod.id,
    };
  });
};

export const filterOrgUsers = (orgUsers) => {
  if (!orgUsers) {
    return [];
  }

  return orgUsers.map((orgUser) => ({
    profilePicture: orgUser?.user?.profilePicture,
    label: orgUser?.user?.username,
    value: orgUser?.user?.id,
  }));
};

const CreateLayoutBaseModal = (props) => {
  const { entityType, handleClose, resetEntityType, open, parentTaskId } = props;
  const user = useMe();
  const [addDetails, setAddDetails] = useState(true);
  const [descriptionText, setDescriptionText] = useState('');
  const [mediaUploads, setMediaUploads] = useState([]);
  const addDetailsHandleClick = () => {
    setAddDetails(!addDetails);
  };

  const [errors, setErrors] = useState({
    general: null,
    title: null,
    description: null,
    org: null,
    // maxSubmissionCount: null,
  });

  const [org, setOrg] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [assigneeString, setAssigneeString] = useState('');
  const [reviewerString, setReviewerString] = useState('');
  const [milestoneString, setMilestoneString] = useState('');
  const [assignee, setAssignee] = useState(null);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [tags, setTags] = useState([]);
  const [link, setLink] = useState('');
  const [rewardsCurrency, setRewardsCurrency] = useState(null);
  const [rewardsAmount, setRewardsAmount] = useState(null);
  // const [maxSubmissionCount, setMaxSubmissionCount] = useState('');
  const [title, setTitle] = useState('');
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const isPod = entityType === ENTITIES_TYPES.POD;
  const isTask = entityType === ENTITIES_TYPES.TASK;
  const isBounty = entityType === ENTITIES_TYPES.BOUNTY;
  const isMilestone = entityType === ENTITIES_TYPES.MILESTONE;
  const isSubtask = parentTaskId !== undefined;
  const textLimit = isPod ? 200 : 900;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const [getAutocompleteUsers, { data: autocompleteData }] = useLazyQuery(GET_AUTOCOMPLETE_USERS);
  const [fetchPaymentMethod, setFetchPaymentMethod] = useState(false);
  const [getPaymentMethods, { data: paymentMethodData }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG, {
    onCompleted: () => {
      setFetchPaymentMethod(true);
    },
  });
  const [orgUserFetched, setOrgUserFetched] = useState(false);
  const [getOrgUsers, { data: orgUsersData }] = useLazyQuery(GET_ORG_USERS, {
    onCompleted: () => {
      setOrgUserFetched(true);
    },
  });

  const [getEligibleReviewersForOrg, { data: eligibleReviewersForOrgData }] =
    useLazyQuery(GET_ELIGIBLE_REVIEWERS_FOR_ORG);

  const [getEligibleReviewersForPod, { data: eligibleReviewersForPodData }] =
    useLazyQuery(GET_ELIGIBLE_REVIEWERS_FOR_POD);

  const [getMilestones, { data: milestonesData }] = useLazyQuery(GET_MILESTONES);

  const descriptionTextCounter = (e) => {
    if (e.target.value.length < textLimit) {
      setDescriptionText(e.target.value);
    }
  };

  const [getPodUsers, { data: podUsersData }] = useLazyQuery(GET_POD_USERS);

  const [podsFetched, setPodsFetched] = useState(false);
  const [getUserAvailablePods] = useLazyQuery(GET_USER_AVAILABLE_PODS, {
    onCompleted: (data) => {
      setPods(data?.getAvailableUserPods);
      setPodsFetched(true);
    },
    fetchPolicy: 'network-only',
  });
  const [getTaskById] = useLazyQuery(GET_TASK_BY_ID);

  // const getOrgReviewers = useQuery(GET_ORG_REVIEWERS)
  const [pods, setPods] = useState([]);
  const [pod, setPod] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [publicTask, setPublicTask] = useState(false);
  const {
    showDeliverableRequirementsSection,
    showBountySwitchSection,
    showAppearSection,
    showLinkAttachmentSection,
    showHeaderImagePickerSection,
    showMembersSection,
    showPrioritySelectSection,
    showDueDateSection,
  } = useMemo(() => {
    return {
      showDeliverableRequirementsSection: isTask,
      showBountySwitchSection: isTask || isBounty,
      showAppearSection: isTask || isBounty,
      showLinkAttachmentSection: isPod,
      // TODO: add back in entityType === ENTITIES_TYPES.POD
      showHeaderImagePickerSection: false,
      // TODO: add back in entityType === ENTITIES_TYPES.POD
      showMembersSection: false,
      showPrioritySelectSection: isMilestone,
      showDueDateSection: isTask || isMilestone || isBounty,
    };
  }, [isBounty, isMilestone, isPod, isTask]);

  const { icon: TitleIcon, label: titleText } = ENTITIES_UI_ELEMENTS[entityType];
  const inputRef: any = useRef();

  const filterDAOptions = useCallback((orgs) => {
    if (!orgs) {
      return [];
    }
    return orgs.map((org) => ({
      imageUrl: org?.profilePicture,
      label: org?.name,
      value: org?.id,
    }));
  }, []);

  const fetchedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;

  const router = useRouter();
  const { podId: routerPodId } = router.query;
  useEffect(() => {
    if (isSubtask) {
      getTaskById({
        variables: {
          taskId: parentTaskId,
        },
      })
        .then((data) => {
          console.log({ data });
          const task = data?.data?.getTaskById;
          setOrg(task?.orgId);
          setPod(task?.podId);
        })
        .catch((e) => console.error(e));
    }
  }, [parentTaskId, getTaskById, isSubtask]);

  useEffect(() => {
    if (isSubtask) {
      getTaskById({
        variables: {
          taskId: parentTaskId,
        },
      })
        .then((data) => {
          console.log({ data });
          const task = data?.data?.getTaskById;
          setOrg(task?.orgId);
          setPod(task?.podId);
        })
        .catch((e) => console.error(e));
    }
  }, [parentTaskId, getTaskById, isSubtask]);

  useEffect(() => {
    if (open) {
      if (fetchedUserPermissionsContext && board?.orgId in fetchedUserPermissionsContext?.orgPermissions && !org) {
        // If you're only part of one dao then just set that as default
        // TODO: if you are part of the org and you're on that page it should be create on that org
        setOrg(board?.orgId);
      }

      if (board?.podId && !pod) {
        // If you're only part of one dao then just set that as default
        // TODO: if you are part of the org and you're on that page it should be create on that org
        setPod(board?.podId || routerPodId);
      }
      if (org) {
        if (!podsFetched) {
          getUserAvailablePods({
            variables: {
              orgId: org,
            },
          });
          setPodsFetched(true);
        }
        if (!orgUserFetched) {
          getOrgUsers({
            variables: {
              orgId: org,
              limit: 100, // TODO: fix autocomplete
            },
          });
          setOrgUserFetched(true);
        }
        if (!fetchPaymentMethod) {
          getPaymentMethods({
            variables: {
              orgId: org,
            },
          });
          setFetchPaymentMethod(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board?.orgId, fetchedUserPermissionsContext, board?.podId, org, pod, open, routerPodId]);

  const permissions = parseUserPermissionContext({
    userPermissionsContext: fetchedUserPermissionsContext,
    orgId: org,
    podId: pod,
  });
  const canCreateTask = permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.CREATE_TASK);
  const canCreatePod = permissions.includes(PERMISSIONS.FULL_ACCESS);

  const getPodObject = useCallback(() => {
    let justCreatedPod = null;
    pods.forEach((testPod) => {
      if (testPod.id === pod) {
        justCreatedPod = testPod;
      }
    });
    return justCreatedPod;
  }, [pods, pod]);

  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: () => [
      'getPerStatusTaskCountForMilestone',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getSubtasksForTask',
      'getSubtaskCountForTask',
    ],
  });
  const [createBounty] = useMutation(CREATE_BOUNTY);

  const [createTaskProposal] = useMutation(CREATE_TASK_PROPOSAL);

  const [createPod] = useMutation(CREATE_POD, {
    onCompleted: (data) => {
      const pod = data?.createPod;
      handleClose();
      router.push(`/pod/${pod?.id}/boards`, undefined, {
        shallow: true,
      });
    },
    refetchQueries: ['getOrgById'],
  });

  const [createMilestone] = useMutation(CREATE_MILESTONE);

  const submitMutation = useCallback(() => {
    switch (entityType) {
      case ENTITIES_TYPES.TASK:
        const taskInput = {
          title,
          tags,
          description: descriptionText,
          orgId: org,
          milestoneId: milestone?.id,
          parentTaskId,
          podId: pod,
          dueDate,
          ...(rewardsAmount &&
            rewardsCurrency && {
              rewards: [
                {
                  rewardAmount: parseFloat(rewardsAmount),
                  paymentMethodId: rewardsCurrency,
                },
              ],
            }),
          // TODO: add links?,
          ...(canCreateTask && {
            assigneeId: assignee?.value,
          }),
          ...(!canCreateTask && {
            proposedAssigneeId: assignee?.value,
          }),
          ...(publicTask && {
            privacyLevel: PRIVACY_LEVEL.public,
          }),
          reviewerIds: selectedReviewers.map(({ id }) => id),
          userMentions: getMentionArray(descriptionText),
          mediaUploads,
        };

        if (!title || !org) {
          const newErrors = { ...errors };
          if (!title) {
            newErrors.title = 'Please enter a title';
          }
          if (!org) {
            newErrors.org = 'Please select an organization';
          }
          newErrors.general = 'Please enter the necessary information above';
          setErrors(newErrors);
        } else {
          if (canCreateTask) {
            createTask({
              variables: {
                input: taskInput,
              },
            }).then((result) => {
              const task = result?.data?.createTask;
              const justCreatedPod = getPodObject();
              if (
                board?.setColumns &&
                ((task?.orgId === board?.orgId && !board?.podId) ||
                  task?.podId === board?.podId ||
                  pod === board?.podId)
              ) {
                const transformedTask = transformTaskToTaskCard(task, {
                  orgName: board?.org?.name,
                  orgProfilePicture: board?.org?.profilePicture,
                  podName: justCreatedPod?.name,
                });

                const columns = [...board?.columns];
                columns[0].tasks = [transformedTask, ...columns[0].tasks];
                board.setColumns(columns);
              }
              handleClose();
            });
          } else {
            createTaskProposal({
              variables: {
                input: taskInput,
              },
            }).then((result) => {
              const taskProposal = result?.data?.createTaskProposal;
              const justCreatedPod = getPodObject();
              if (
                board?.setColumns &&
                ((taskProposal?.orgId === board?.orgId && !board?.podId) ||
                  taskProposal?.podId === board?.podId ||
                  pod === board?.podId)
              ) {
                const transformedTaskProposal = transformTaskProposalToTaskProposalCard(taskProposal, {
                  userProfilePicture: user?.profilePicture,
                  username: user?.username,
                  orgName: board?.org?.name,
                  orgProfilePicture: board?.org?.profilePicture,
                  podName: justCreatedPod?.name,
                });

                let columns = [...board?.columns];
                columns = addProposalItem(transformedTaskProposal, columns);
                board.setColumns(columns);
              }
              handleClose();
            });
          }
        }
        break;
      case ENTITIES_TYPES.POD:
        if (canCreatePod) {
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
          };
          if (!title) {
            const newErrors = { ...errors };
            if (!title) {
              newErrors.title = 'Please enter a title';
            }
            newErrors.general = 'Please enter the necessary information above';
            setErrors(newErrors);
          } else {
            createPod({
              variables: {
                input: podInput,
              },
            });
          }
        } else {
          setErrors({
            ...errors,
            general: 'You need full access permissions to create a pod',
          });
        }
        break;
      case ENTITIES_TYPES.MILESTONE:
        const milestoneInput = {
          title,
          tags,
          description: descriptionText,
          orgId: org,
          podId: pod,
          mediaUploads,
          dueDate,
          ...(publicTask && {
            privacyLevel: PRIVACY_LEVEL.public,
          }),
        };
        if (canCreateTask) {
          createMilestone({
            variables: {
              input: milestoneInput,
            },
          }).then((result) => {
            const task = result?.data?.createMilestone;
            const justCreatedPod = getPodObject();
            if (
              board?.setColumns &&
              ((task?.orgId === board?.orgId && !board?.podId) || task?.podId === board?.podId || pod === board?.podId)
            ) {
              const transformedTask = transformTaskToTaskCard(task, {
                orgName: board?.org?.name,
                orgProfilePicture: board?.org?.profilePicture,
                podName: justCreatedPod?.name,
              });

              const columns = [...board?.columns];
              columns[0].tasks = [transformedTask, ...columns[0].tasks];
              board.setColumns(columns);
            }
            handleClose();
          });
        }
        break;
      case ENTITIES_TYPES.BOUNTY:
        const bountyInput = {
          title,
          tags,
          description: descriptionText,
          orgId: org,
          milestoneId: milestone?.id,
          parentTaskId,
          podId: pod,
          // maxSubmissionCount: parseFloat(maxSubmissionCount),
          dueDate,
          ...(rewardsAmount &&
            rewardsCurrency && {
              rewards: [
                {
                  rewardAmount: parseFloat(rewardsAmount),
                  paymentMethodId: rewardsCurrency,
                },
              ],
            }),
          // TODO: add links?,
          ...(canCreateTask && {
            assigneeId: assignee?.value,
          }),
          ...(!canCreateTask && {
            proposedAssigneeId: assignee?.value,
          }),
          ...(publicTask && {
            privacyLevel: PRIVACY_LEVEL.public,
          }),
          reviewerIds: selectedReviewers.map(({ id }) => id),
          userMentions: getMentionArray(descriptionText),
          mediaUploads,
        };
        // const isErrorMaxSubmissionCount =
        //   bountyInput?.maxSubmissionCount <= 0 || bountyInput?.maxSubmissionCount > 10000 || !maxSubmissionCount;
        if (!title || !descriptionText || !org || !canCreateTask) {
          const newErrors = { ...errors };
          if (!title) {
            newErrors.title = 'Please enter a title';
          }
          if (!descriptionText) {
            newErrors.description = 'Please enter a description';
          }
          if (!org) {
            newErrors.org = 'Please select an organization';
          }
          // if (isErrorMaxSubmissionCount) {
          //   newErrors.maxSubmissionCount = 'The number should be from 1 to 10,000';
          // }
          newErrors.general = !canCreateTask
            ? "You can't propose a bounty"
            : 'Please enter the necessary information above';
          setErrors(newErrors);
        } else {
          if (canCreateTask) {
            createBounty({
              variables: {
                input: bountyInput,
              },
            })
              .then((result) => {
                const task = result?.data?.createBounty;
                const justCreatedPod = getPodObject();
                if (
                  board?.setColumns &&
                  ((task?.orgId === board?.orgId && !board?.podId) ||
                    task?.podId === board?.podId ||
                    pod === board?.podId)
                ) {
                  const transformedTask = transformTaskToTaskCard(task, {
                    orgName: board?.org?.name,
                    orgProfilePicture: board?.org?.profilePicture,
                    podName: justCreatedPod?.name,
                  });

                  const columns = [...board?.columns];
                  columns[0].tasks = [transformedTask, ...columns[0].tasks];
                  board.setColumns(columns);
                }
                handleClose();
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }
        break;
    }
  }, [
    entityType,
    title,
    descriptionText,
    org,
    milestone?.id,
    parentTaskId,
    pod,
    dueDate,
    rewardsAmount,
    rewardsCurrency,
    canCreateTask,
    assignee?.value,
    publicTask,
    selectedReviewers,
    mediaUploads,
    canCreatePod,
    errors,
    createTask,
    getPodObject,
    board,
    handleClose,
    createTaskProposal,
    user?.profilePicture,
    user?.username,
    isPrivate,
    link,
    createPod,
    createMilestone,
    createBounty,
  ]);

  const paymentMethods = filterPaymentMethods(paymentMethodData?.getPaymentMethodsForOrg);

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
        <CreateFormBaseModalTitle>Create a {titleText.toLowerCase()}</CreateFormBaseModalTitle>
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
            disabled={isSubtask}
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
              onChange={(e) => {
                setMilestoneString('');
                setMilestone(null);
                setAssignee('');
                setAssignee(null);
                setSelectedReviewers([]);
                setReviewerString('');
              }}
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
          {errors.title && <ErrorText> {errors.title} </ErrorText>}
        </CreateFormMainInputBlock>

        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>{titleText} description</CreateFormMainBlockTitle>
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
          {errors.description && <ErrorText> {errors.description} </ErrorText>}
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
                    inputRef.current.click();
                  }}
                  style={{
                    cursor: 'pointer',
                    width: '24',
                    height: '24',
                    marginBottom: '8px',
                  }}
                />
                {fileUploadLoading && <FileLoading />}
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
                <MultiMediaUploadButtonText>Upload file</MultiMediaUploadButtonText>
                {fileUploadLoading && <FileLoading />}
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
                  setFileUploadLoading,
                })
              }
            />
          </CreateFormMainInputBlock>
        )}

        {/*Upload header image block*/}
        {showHeaderImagePickerSection && <HeaderImage />}

        {showBountySwitchSection && (
          <CreateFormMainSelects>
            <CreateRewardAmountDiv>
              <CreateFormRewardCurrency
                title="Reward currency"
                labelText="Choose tokens"
                options={paymentMethods}
                name="reward-currency"
                setValue={setRewardsCurrency}
                value={rewardsCurrency}
              />
            </CreateRewardAmountDiv>
            <CreateRewardAmountDiv>
              <CreateFormMainBlockTitle>Reward amount {isBounty ? 'per submission' : ''}</CreateFormMainBlockTitle>

              <InputForm
                style={{
                  marginTop: '20px',
                }}
                type={'number'}
                min="0"
                placeholder="Enter reward amount"
                search={false}
                value={rewardsAmount}
                onChange={(e) => setRewardsAmount(e.target.value)}
                endAdornment={
                  <CloseModalIcon
                    style={{
                      marginRight: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setRewardsCurrency('');
                      setRewardsAmount(0);
                    }}
                  />
                }
              />
            </CreateRewardAmountDiv>
            {/* {isBounty && (
              <CreateRewardAmountDiv>
                <CreateFormMainBlockTitle>Maximum no. of submissions</CreateFormMainBlockTitle>

                <InputForm
                  style={{
                    marginTop: '20px',
                  }}
                  min="1"
                  max="10000"
                  placeholder="Enter the max. no. of submissions"
                  search={false}
                  value={maxSubmissionCount}
                  onChange={(e) => setMaxSubmissionCount(e.target.value)}
                  endAdornment={
                    <CloseModalIcon
                      style={{
                        marginRight: '8px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setMaxSubmissionCount('');
                      }}
                    />
                  }
                />
                {errors.maxSubmissionCount && <ErrorText> {errors.maxSubmissionCount} </ErrorText>}
              </CreateRewardAmountDiv>
            )} */}
          </CreateFormMainSelects>
        )}

        {showMembersSection && (
          <CreateFormMembersSection>
            <CreateFormMainBlockTitle>Members</CreateFormMainBlockTitle>

            <InputForm search margin icon={<CircleIcon />} placeholder="Search reviewers" />

            <CreateFormMembersBlock>
              <CreateFormMembersBlockTitle>
                {createPodMembersList.length}
                {createPodMembersList.length > 1 ? ' members' : ' member'}
              </CreateFormMembersBlockTitle>
              <CreateFormMembersList>
                {createPodMembersList.map((item) => (
                  <MembersRow key={item.name} name={item.name} styledSwitch={<AndroidSwitch />} />
                ))}
              </CreateFormMembersList>
            </CreateFormMembersBlock>
          </CreateFormMembersSection>
        )}
        {showAppearSection && canCreateTask && (
          <CreateFormAddDetailsInputs
            style={{
              marginBottom: '40px',
            }}
          >
            {!isBounty && (
              <CreateFormAddDetailsInputBlock>
                <CreateFormAddDetailsInputLabel>Assigned to</CreateFormAddDetailsInputLabel>
                <StyledAutocompletePopper
                  options={filterOrgUsers(podUsersData?.getPodUsers ?? orgUsersData?.getOrgUsers)}
                  onOpen={() => {
                    if (pod) {
                      getPodUsers({
                        variables: {
                          podId: pod?.id || pod,
                          limit: 100, // TODO: fix autocomplete
                        },
                      });
                    }
                  }}
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
                  value={assignee}
                  inputValue={assigneeString}
                  onInputChange={(event, newInputValue) => {
                    setAssigneeString(newInputValue);
                  }}
                  onChange={(_, __, reason) => {
                    if (reason === 'clear') {
                      setAssignee(null);
                    }
                  }}
                  renderOption={(props, option, state) => {
                    return (
                      <OptionDiv
                        onClick={(event) => {
                          setAssignee(option);
                          props?.onClick(event);
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
                    );
                  }}
                />
              </CreateFormAddDetailsInputBlock>
            )}

            <CreateFormAddDetailsInputBlock>
              <CreateFormAddDetailsInputLabel>Reviewer</CreateFormAddDetailsInputLabel>
              <StyledAutocompletePopper
                options={filterUserOptions(
                  eligibleReviewersForPodData?.getEligibleReviewersForPod ??
                    eligibleReviewersForOrgData?.getEligibleReviewersForOrg
                ).filter(({ id }) => !selectedReviewers.map(({ id }) => id).includes(id))}
                multiple
                onChange={(event, newValue, reason) => {
                  if ('clear' === reason) {
                    setSelectedReviewers([]);
                  }
                  if (event.code === 'Backspace' && reviewerString === '') {
                    setSelectedReviewers(selectedReviewers.slice(0, -1));
                  }
                }}
                onOpen={() => {
                  if (pod) {
                    getEligibleReviewersForPod({
                      variables: {
                        podId: pod,
                        searchString: '',
                      },
                    });
                  } else {
                    getEligibleReviewersForOrg({
                      variables: {
                        orgId: org,
                        searchString: '',
                      },
                    });
                  }
                }}
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
                      setReviewerString(event.target.value);
                      getEligibleReviewersForOrg({
                        variables: {
                          orgId: org,
                          searchString: event.target.value,
                        },
                      });
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
                        onDelete={() => setSelectedReviewers(selectedReviewers.filter(({ id }) => id !== option?.id))}
                      />
                    );
                  })
                }
                renderOption={(props, option, state) => {
                  return (
                    <OptionDiv
                      onClick={(event) => {
                        if (selectedReviewers.map(({ id }) => id).indexOf(option?.id === -1)) {
                          setSelectedReviewers([...selectedReviewers, option]);
                          setReviewerString('');
                        }
                        props?.onClick(event);
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
                  );
                }}
              />
            </CreateFormAddDetailsInputBlock>

            <CreateFormAddDetailsInputBlock>
              <CreateFormAddDetailsInputLabel>Milestone</CreateFormAddDetailsInputLabel>
              <StyledAutocompletePopper
                options={filterUserOptions(milestonesData?.getMilestones)}
                onOpen={() =>
                  getMilestones({
                    variables: {
                      orgId: org,
                      podId: pod,
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
                    placeholder="Enter milestone..."
                    InputLabelProps={{ shrink: false }}
                    {...params}
                  />
                )}
                value={milestone}
                inputValue={milestoneString}
                onInputChange={(_, newInputValue) => {
                  setMilestoneString(newInputValue);
                }}
                onChange={(_, __, reason) => {
                  if (reason === 'clear') {
                    setMilestone(null);
                  }
                }}
                renderOption={(props, option) => {
                  return (
                    <OptionDiv
                      onClick={(event) => {
                        setMilestone(option);
                        props?.onClick(event);
                      }}
                    >
                      <OptionTypography>{option?.label}</OptionTypography>
                    </OptionDiv>
                  );
                }}
              />
            </CreateFormAddDetailsInputBlock>
          </CreateFormAddDetailsInputs>
        )}
      </CreateFormMainSection>

      <CreateFormAddTagsSection>
        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>Add tags</CreateFormMainBlockTitle>

          <Tags options={TAGS} value={tags} onChange={setTags} limit={4} />
        </CreateFormMainInputBlock>
      </CreateFormAddTagsSection>

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
            {showDueDateSection && (
              <CreateFormAddDetailsAppearBlockContainer>
                <CreateFormAddDetailsSelects>
                  <CreateFormAddDetailsLocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker title="Due date" inputFormat="MM/dd/yyyy" value={dueDate} setValue={setDueDate} />
                    </LocalizationProvider>
                  </CreateFormAddDetailsLocalizationProvider>
                  <CreateFormAddDetailsSwitch
                    style={{
                      width: '100%',
                      marginLeft: '20px',
                    }}
                  >
                    <CreateFormAddDetailsSwitchLabel>Show task as public</CreateFormAddDetailsSwitchLabel>
                    <AndroidSwitch
                      checked={publicTask}
                      onChange={(e) => {
                        setPublicTask(e.target.checked);
                      }}
                    />
                  </CreateFormAddDetailsSwitch>
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
                    <CreateFormAddDetailsInputLabel>This is a bounty</CreateFormAddDetailsInputLabel>
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
                <CreateFormLinkAttachmentLabel>Link</CreateFormLinkAttachmentLabel>
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
                  <CreateFormAddDetailsInputLabel>Private {titleText.toLowerCase()}</CreateFormAddDetailsInputLabel>
                  <AndroidSwitch
                    checked={isPrivate}
                    onChange={(e) => {
                      setIsPrivate(e.target.checked);
                    }}
                  />
                </CreateFormAddDetailsSwitch>
              </div>
            )}
          </CreateFormAddDetailsAppearBlock>
        )}
      </CreateFormAddDetailsSection>

      <CreateFormFooterButtons>
        {errors.general && <ErrorText>{errors.general}</ErrorText>}
        <CreateFormButtonsBlock>
          <CreateFormCancelButton onClick={resetEntityType}>Cancel</CreateFormCancelButton>
          <CreateFormPreviewButton
            style={{
              ...(isPod &&
                !canCreatePod && {
                  background: Grey700,
                  border: `1px solid ${Grey700}`,
                  cursor: 'default',
                }),
            }}
            onClick={submitMutation}
          >
            {canCreateTask ? 'Create' : 'Propose'} {titleText}
          </CreateFormPreviewButton>
        </CreateFormButtonsBlock>
      </CreateFormFooterButtons>
    </CreateFormBaseModal>
  );
};

export default CreateLayoutBaseModal;
