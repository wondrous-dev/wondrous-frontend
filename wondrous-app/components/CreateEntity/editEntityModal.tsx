import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { CircularProgress, Popper, styled, Switch, TextField } from '@material-ui/core';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';

import ProfilePictureAdd from '../../public/images/onboarding/profile-picture-add.svg';
import {
  ENTITIES_TYPES,
  IMAGE_FILE_EXTENSIONS_TYPE_MAPPING,
  MEDIA_TYPES,
  PERMISSIONS,
  VIDEO_FILE_EXTENSIONS_TYPE_MAPPING,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  PRIVACY_LEVEL,
} from '../../utils/constants';
import CircleIcon from '../Icons/circleIcon';
import CodeIcon from '../Icons/MediaTypesIcons/code';
import AudioIcon from '../Icons/MediaTypesIcons/audio';
import WonderTokenIcon from '../Icons/wonderToken';
import PriorityIcon from '../Icons/priority';
import CloseModalIcon from '../Icons/closeModal';
import CreateDaoIcon from '../Icons/createDao';
import CreatePodIcon from '../Icons/createPod';
import ImageIcon from '../Icons/MediaTypesIcons/image';
import VideoIcon from '../Icons/MediaTypesIcons/video';
import InputForm from '../Common/InputForm/inputForm';
import DropdownSelect from '../Common/DropdownSelect/dropdownSelect';
import { ENTITIES_UI_ELEMENTS } from './chooseEntityToCreateModal';
import MembersRow from './MembersRow/membersRow';
import { CreateFormMembersList } from './MembersRow/styles';
import HeaderImage from './HeaderImage/headerImage';
import {
  CreateFormAddDetailsAppearBlock,
  CreateFormAddDetailsAppearBlockContainer,
  CreateFormAddDetailsButton,
  CreateFormAddDetailsInputBlock,
  CreateFormAddDetailsInputLabel,
  CreateFormAddDetailsInputs,
  CreateFormAddDetailsSection,
  CreateFormAddDetailsSelects,
  CreateFormAddDetailsTab,
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
  StyledAutocompletePopper,
  OptionDiv,
  OptionTypography,
  StyledChip,
  CreateFormRewardCurrency,
  CreateFormAddDetailsTabLabel,
  CreateFormAddDetailsLocalizationProvider,
} from './styles';
import SelectDownIcon from '../Icons/selectDownIcon';
import UploadImageIcon from '../Icons/uploadImage';
import { getFilenameAndType, handleAddFile, uploadMedia } from '../../utils/media';
import DatePicker from '../Common/DatePicker';
import { MediaItem } from './MediaItem';
import { AddFileUpload } from '../Icons/addFileUpload';
import { TextInput } from '../TextInput';
import { White } from '../../theme/colors';
import { TextInputContext } from '../../utils/contexts';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_AUTOCOMPLETE_USERS, GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from '../../graphql/queries';
import { SafeImage } from '../Common/Image';
import { GET_USER_AVAILABLE_PODS, GET_USER_PODS, GET_POD_USERS } from '../../graphql/queries/pod';
import {
  getMentionArray,
  parseUserPermissionContext,
  transformTaskProposalToTaskProposalCard,
  transformTaskToTaskCard,
} from '../../utils/helpers';
import { GET_ORG_USERS } from '../../graphql/queries/org';
import {
  ATTACH_MEDIA_TO_TASK,
  CREATE_TASK,
  REMOVE_MEDIA_FROM_TASK,
  UPDATE_TASK,
  UPDATE_MILESTONE,
  UPDATE_BOUNTY,
} from '../../graphql/mutations/task';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from '../../utils/hooks';
import {
  ATTACH_MEDIA_TO_TASK_PROPOSAL,
  CREATE_TASK_PROPOSAL,
  REMOVE_MEDIA_FROM_TASK_PROPOSAL,
  UPDATE_TASK_PROPOSAL,
} from '../../graphql/mutations/taskProposal';
import { useMe } from '../Auth/withAuth';
import Ethereum from '../Icons/ethereum';
import { USDCoin } from '../Icons/USDCoin';
import { TaskFragment } from '../../graphql/fragments/task';
import { updateProposalItem } from '../../utils/board';
import { GET_ORG_TASK_BOARD_PROPOSALS } from '../../graphql/queries/taskBoard';
import { filterOrgUsersForAutocomplete, filterPaymentMethods } from './createEntityModal';
import { GET_PAYMENT_METHODS_FOR_ORG } from '../../graphql/queries/payment';
import { ErrorText } from '../Common';
import { FileLoading } from '../Common/FileUpload/FileUpload';
import { updateInProgressTask, updateTaskItem } from '../../utils/board';
import {
  GET_MILESTONES,
  GET_ELIGIBLE_REVIEWERS_FOR_ORG,
  GET_ELIGIBLE_REVIEWERS_FOR_POD,
} from '../../graphql/queries/task';
import { TabsVisibilityCreateEntity } from '@components/Common/TabsVisibilityCreateEntity';

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
];

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
];

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
];

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
];

export const transformMediaFormat = (media) => {
  return (
    media &&
    media.map((item) => {
      return {
        uploadSlug: item?.slug,
        type: item?.type,
        name: item?.name,
      };
    })
  );
};

const EditLayoutBaseModal = (props) => {
  const { entityType, handleClose, cancelEdit, existingTask, isTaskProposal, open } = props;
  const user = useMe();

  const [addDetails, setAddDetails] = useState(true);
  const [descriptionText, setDescriptionText] = useState(existingTask?.description || '');
  const [mediaUploads, setMediaUploads] = useState(transformMediaFormat(existingTask?.media) || []);
  const addDetailsHandleClick = () => {
    setAddDetails(!addDetails);
  };

  const [org, setOrg] = useState({
    id: existingTask?.orgId,
    profilePicture: existingTask?.orgProfilePicture,
    name: existingTask?.orgName,
  });

  const [milestone, setMilestone] = useState(null);
  const [milestoneString, setMilestoneString] = useState('');
  const [assigneeString, setAssigneeString] = useState(existingTask?.assigneeUsername);
  const [reviewerString, setReviewerString] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState(filterUserOptions(existingTask?.reviewers));
  const [assignee, setAssignee] = useState(
    existingTask?.assigneeId && {
      value: existingTask?.assigneeId,
      profilePicture: existingTask?.assigneeProfilePicture,
      label: existingTask?.assigneeUsername,
    }
  );
  // TODO: set later
  const initialRewards = existingTask?.rewards && existingTask?.rewards[0];
  const initialCurrency = initialRewards?.paymentMethodId;
  const initialAmount = initialRewards?.rewardAmount;
  const [rewardsCurrency, setRewardsCurrency] = useState(initialCurrency);
  const [rewardsAmount, setRewardsAmount] = useState(initialAmount);
  // const [maxSubmissionCount, setMaxSubmissionCount] = useState(existingTask?.maxSubmissionCount);
  const [title, setTitle] = useState(existingTask?.title);
  const [publicTask, setPublicTask] = useState(existingTask?.privacyLevel === 'public');
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();

  const board = orgBoard || podBoard || userBoard;
  const boardColumns = useColumns();
  const { data: userOrgs } = useQuery(GET_USER_ORGS);

  const [getOrgUsers, { data: orgUsersData }] = useLazyQuery(GET_ORG_USERS);

  const [getEligibleReviewersForOrg, { data: eligibleReviewersForOrgData }] =
    useLazyQuery(GET_ELIGIBLE_REVIEWERS_FOR_ORG);

  const [getEligibleReviewersForPod, { data: eligibleReviewersForPodData }] =
    useLazyQuery(GET_ELIGIBLE_REVIEWERS_FOR_POD);

  const [getMilestones, { data: milestonesData }] = useLazyQuery(GET_MILESTONES);

  const descriptionTextCounter = (e) => {
    setDescriptionText(e.target.value);
  };

  const [getPodUsers, { data: podUsersData }] = useLazyQuery(GET_POD_USERS);
  const [getUserAvailablePods] = useLazyQuery(GET_USER_AVAILABLE_PODS, {
    onCompleted: (data) => {
      setPods(data?.getAvailableUserPods);
    },
    fetchPolicy: 'cache-and-network',
  });
  const [fetchPaymentMethod, setFetchPaymentMethod] = useState(false);
  const [errors, setErrors] = useState({
    general: null,
    title: null,
    description: null,
    org: null,
    privacy: null,
    // maxSubmissionCount: null,
  });
  const [getPaymentMethods, { data: paymentMethodData }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG);
  // const getOrgReviewers = useQuery(GET_ORG_REVIEWERS)
  const [pods, setPods] = useState([]);
  const [pod, setPod] = useState(existingTask?.podName && existingTask?.podId);
  const podPrivacyLevel = pods?.filter((i) => i.id === pod)[0]?.privacyLevel;
  const isPodPublic = !podPrivacyLevel || podPrivacyLevel === 'public';
  const [dueDate, setDueDate] = useState(existingTask?.dueDate);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const isBounty = entityType === ENTITIES_TYPES.BOUNTY;
  const isTask = entityType === ENTITIES_TYPES.TASK;
  const isMilestone = entityType === ENTITIES_TYPES.MILESTONE;
  const isPod = entityType === ENTITIES_TYPES.POD;
  const {
    showDeliverableRequirementsSection,
    showBountySwitchSection,
    showAppearSection,
    showLinkAttachmentSection,
    showHeaderImagePickerSection,
    showMembersSection,
    showPrioritySelectSection,
    showDueDateSection,
    showVisibility,
  } = useMemo(() => {
    return {
      showDeliverableRequirementsSection: isTask,
      showBountySwitchSection: isTask || isBounty,
      showAppearSection: isTask || isBounty,
      showLinkAttachmentSection: isPod,
      showHeaderImagePickerSection: isPod,
      showMembersSection: isPod,
      showPrioritySelectSection: isMilestone,
      showDueDateSection: isTask || isBounty || isMilestone,
      showVisibility: isTask || isBounty,
    };
  }, [entityType]);
  const { icon: TitleIcon, label: titleText } = ENTITIES_UI_ELEMENTS[entityType];
  const inputRef: any = useRef();

  const [attachMedia] = useMutation(ATTACH_MEDIA_TO_TASK);
  const [removeMedia] = useMutation(REMOVE_MEDIA_FROM_TASK);
  const [attachTaskProposalMedia] = useMutation(ATTACH_MEDIA_TO_TASK_PROPOSAL);
  const [removeTaskProposalMedia] = useMutation(REMOVE_MEDIA_FROM_TASK_PROPOSAL);
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

  const filterOrgUsers = useCallback((orgUsers) => {
    if (!orgUsers) {
      return [];
    }

    return orgUsers.map((orgUser) => ({
      profilePicture: orgUser?.user?.profilePicture,
      label: orgUser?.user?.username,
      value: orgUser?.user?.id,
    }));
  }, []);

  const onCorrectPage =
    existingTask?.orgId === board?.orgId ||
    existingTask?.podId === board?.podId ||
    existingTask?.userId === board?.userId;

  useEffect(() => {
    setPublicTask(existingTask?.privacyLevel === PRIVACY_LEVEL.public);
  }, [existingTask?.privacyLevel]);

  useEffect(() => {
    if (existingTask?.orgId) {
      // If you're only part of one dao then just set that as default
      setOrg(existingTask?.orgId);
    }
    if (org?.id || org) {
      getUserAvailablePods({
        variables: {
          orgId: org?.id || org,
        },
      });
      getOrgUsers({
        variables: {
          orgId: org?.id || org,
          limit: 100, // TODO: fix autocomplete
        },
      });
      getPaymentMethods({
        variables: {
          orgId: org?.id || org,
        },
      });
    }
    if (!milestonesData?.getMilestones) {
      getMilestones({
        variables: {
          orgId: org?.id || org,
          podId: pod?.id || pod,
        },
      })
        .then((res) => {
          const milestones = res?.data?.getMilestones;
          const existingMilestone = milestones?.find((m) => m.id === existingTask?.milestoneId);
          if (existingMilestone) {
            setMilestone({
              id: existingMilestone?.id,
              label: existingMilestone?.title,
            });
          }
        })
        .catch((e) => console.error(e));
    }
  }, [
    userOrgs?.getUserOrgs,
    org,
    getUserAvailablePods,
    getOrgUsers,
    existingTask?.orgId,
    getPaymentMethods,
    getMilestones,
    milestonesData,
    existingTask?.reviewers,
  ]);

  const getPodObject = useCallback(() => {
    let justCreatedPod = null;
    pods.forEach((testPod) => {
      if (testPod.id === pod) {
        justCreatedPod = testPod;
      }
    });
    return justCreatedPod;
  }, [pods, pod]);

  const [updateTask, { loading: updateTaskLoading }] = useMutation(UPDATE_TASK, {
    refetchQueries: () => [
      'getPerStatusTaskCountForMilestone',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
    ],
    onCompleted: (data) => {
      const task = data?.updateTask;
      const justCreatedPod = getPodObject();
      if (boardColumns?.setColumns && onCorrectPage) {
        const transformedTask = transformTaskToTaskCard(task, {});
        let columns = [...boardColumns?.columns];
        if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
          columns = updateInProgressTask(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_TODO) {
          columns = updateTaskItem(transformedTask, columns);
        }
        boardColumns.setColumns(columns);
      }
      handleClose();
    },
  });

  const [updateBounty, { loading: updateBountyLoading }] = useMutation(UPDATE_BOUNTY, {
    refetchQueries: () => [
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
    ],
  });

  const [updateTaskProposal, { loading: updateTaskProposalLoading }] = useMutation(UPDATE_TASK_PROPOSAL, {
    onCompleted: (data) => {
      const taskProposal = data?.updateTaskProposal;
      const justCreatedPod = getPodObject();
      if (boardColumns?.setColumns && onCorrectPage) {
        const transformedTaskProposal = transformTaskProposalToTaskProposalCard(taskProposal, {
          userProfilePicture: user?.profilePicture,
          username: user?.username,
          podName: justCreatedPod?.name,
        });

        const columns = [...boardColumns?.columns];
        columns[0].section.tasks = columns[0].section.tasks.map((existingTaskProposal) => {
          if (transformedTaskProposal?.id === existingTaskProposal.id) {
            return transformedTaskProposal;
          }
          return existingTaskProposal;
        });
        boardColumns.setColumns(columns);
      }
      handleClose();
    },
    refetchQueries: ['GetOrgTaskBoardProposals'],
  });

  const [updateMilestone, { loading: updateMilestoneLoading }] = useMutation(UPDATE_MILESTONE, {
    onCompleted: (data) => {
      const milestone = data?.updateMilestone;
      if (boardColumns?.setColumns && onCorrectPage) {
        const transformedTask = transformTaskToTaskCard(milestone, {});
        let columns = [...boardColumns?.columns];
        if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
          columns = updateInProgressTask(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_TODO) {
          columns = updateTaskItem(transformedTask, columns);
        }
        boardColumns.setColumns(columns);
      }
      handleClose();
    },
  });

  const submitMutation = useCallback(() => {
    switch (entityType) {
      case ENTITIES_TYPES.TASK:
        const taskInput = {
          title,
          description: descriptionText,
          orgId: org?.id,
          milestoneId: milestone?.id ?? milestone,
          podId: pod?.id ?? pod,
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
          ...(existingTask?.assigneeId !== assignee?.value && {
            assigneeId: assignee?.value,
          }),
          ...(publicTask &&
            isPodPublic && {
              privacyLevel: PRIVACY_LEVEL.public,
            }),
          reviewerIds: selectedReviewers.map(({ id }) => id) || [],
          userMentions: getMentionArray(descriptionText),
          mediaUploads,
        };
        const taskPodPrivacyError = !isPodPublic ? publicTask : false;
        if (!title || !org || taskPodPrivacyError) {
          const newErrors = {
            ...errors,
            title: !title ? 'Please enter a title' : errors.title,
            org: !org ? 'Please select an organization' : errors.org,
            privacy: taskPodPrivacyError ? 'The selected pod is for members only' : errors.privacy,
            general: 'Please enter the necessary information above',
          };
          setErrors(newErrors);
        } else {
          updateTask({
            variables: {
              taskId: existingTask?.id,
              input: taskInput,
            },
          });
        }
        break;
      case ENTITIES_TYPES.PROPOSAL: {
        const proposalInput = {
          title,
          description: descriptionText,
          orgId: org?.id,
          milestoneId: milestone?.id ?? milestone,
          podId: pod?.id ?? pod,
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
          ...(isTaskProposal && {
            proposedAssigneeId: assignee?.value,
          }),
          userMentions: getMentionArray(descriptionText),
          mediaUploads,
        };

        if (!title) {
          const newErrors = { ...errors };
          if (!title) {
            newErrors.title = 'Please enter a title';
          }
          newErrors.general = 'Please enter the necessary information above';
          setErrors(newErrors);
        } else {
          updateTaskProposal({
            variables: {
              proposalId: existingTask?.id,
              input: proposalInput,
            },
          });
        }
        break;
      }
      case ENTITIES_TYPES.MILESTONE: {
        updateMilestone({
          variables: {
            milestoneId: existingTask?.id,
            input: {
              title,
              description: descriptionText,
              dueDate,
              orgId: org?.id,
              podId: pod?.id,
              userMentions: getMentionArray(descriptionText),
              mediaUploads,
            },
          },
        });
        break;
      }
      case ENTITIES_TYPES.BOUNTY:
        const bountyInput = {
          title,
          description: descriptionText,
          orgId: org?.id || org,
          milestoneId: milestone?.id,
          parentTaskId: existingTask?.parentTaskId,
          podId: pod?.id || pod,
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
          ...(publicTask &&
            isPodPublic && {
              privacyLevel: PRIVACY_LEVEL.public,
            }),
          reviewerIds: selectedReviewers.map(({ id }) => id),
          userMentions: getMentionArray(descriptionText),
          mediaUploads,
        };
        // const isErrorMaxSubmissionCount =
        //   bountyInput?.maxSubmissionCount <= 0 || bountyInput?.maxSubmissionCount > 10000 || !maxSubmissionCount;

        const bountyPodPrivacyError = !isPodPublic ? publicTask : false;
        if (!title || !descriptionText || !org || bountyPodPrivacyError) {
          const newErrors = {
            ...errors,
            title: !title ? 'Please enter a title' : errors.title,
            description: !descriptionText ? 'Please enter a description' : errors.description,
            org: !org ? 'Please select an organization' : errors.org,
            privacy: bountyPodPrivacyError ? 'The selected pod is for members only' : errors.privacy,
            general: 'Please enter the necessary information above',
          };
          setErrors(newErrors);
        } else {
          updateBounty({
            variables: {
              bountyId: existingTask?.id,
              input: bountyInput,
            },
          })
            .then((result) => {
              const task = result?.data?.updateBounty;
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
        break;
    }
  }, [
    entityType,
    title,
    descriptionText,
    org,
    milestone,
    pod,
    dueDate,
    rewardsAmount,
    rewardsCurrency,
    isTaskProposal,
    assignee?.value,
    publicTask,
    selectedReviewers,
    mediaUploads,
    existingTask?.parentTaskId,
    existingTask?.id,
    // maxSubmissionCount,
    errors,
    updateTask,
    updateTaskProposal,
    updateMilestone,
    updateBounty,
    getPodObject,
    board,
    handleClose,
    existingTask?.assigneeId,
  ]);

  const paymentMethods = filterPaymentMethods(paymentMethodData?.getPaymentMethodsForOrg);
  const updating = updateBountyLoading || updateTaskLoading || updateMilestoneLoading || updateTaskProposalLoading;

  return (
    <CreateFormBaseModal>
      <CreateFormBaseModalCloseBtn onClick={handleClose}>
        <CloseModalIcon />
      </CreateFormBaseModalCloseBtn>
      <CreateFormBaseModalHeader
        style={{
          marginBottom: '0',
        }}
      >
        <TitleIcon circle />
        <CreateFormBaseModalTitle>Edit {titleText.toLowerCase()}</CreateFormBaseModalTitle>
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
              setAssigneeString('');
              setAssignee(null);
              setReviewerString('');
              setSelectedReviewers([]);
            }}
          />
        </CreateFormMainSelects>

        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>Task title</CreateFormMainBlockTitle>

          <InputForm
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            search={false}
          />
          {errors.title && <ErrorText> {errors.title} </ErrorText>}
        </CreateFormMainInputBlock>

        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>Task description</CreateFormMainBlockTitle>
          <TextInputDiv>
            <TextInputContext.Provider
              value={{
                content: descriptionText,
                onChange: descriptionTextCounter,
                list: filterOrgUsersForAutocomplete(orgUsersData?.getOrgUsers),
              }}
            >
              <TextInput
                placeholder="Enter task description"
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
            {descriptionText?.length}/900 characters
          </CreateFormMainDescriptionInputSymbolCounter>
          {errors.description && <ErrorText> {errors.description} </ErrorText>}
        </CreateFormMainInputBlock>
        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>Multi-media</CreateFormMainBlockTitle>

          {mediaUploads && mediaUploads.length > 0 ? (
            <MediaUploadDiv>
              {mediaUploads.map((mediaItem) => (
                <MediaItem
                  key={mediaItem?.uploadSlug}
                  mediaUploads={mediaUploads}
                  setMediaUploads={setMediaUploads}
                  mediaItem={mediaItem}
                  removeMediaItem={() => {
                    if (isTaskProposal) {
                      removeTaskProposalMedia({
                        variables: {
                          proposalId: existingTask?.id,
                          slug: mediaItem?.uploadSlug || mediaItem?.slug,
                        },
                      });
                    } else {
                      removeMedia({
                        variables: {
                          taskId: existingTask?.id,
                          slug: mediaItem?.uploadSlug || mediaItem?.slug,
                        },
                      });
                    }
                  }}
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
            onChange={async (event) => {
              setFileUploadLoading(true);
              const fileToAdd = await handleAddFile({
                event,
                filePrefix: 'tmp/task/new/',
                mediaUploads,
                setMediaUploads: () => {},
              });
              if (isTaskProposal) {
                attachTaskProposalMedia({
                  variables: {
                    proposalId: existingTask?.id,
                    input: {
                      mediaUploads: [fileToAdd],
                    },
                  },
                  onCompleted: (data) => {
                    const taskProposal = data?.attachTaskProposalMedia;
                    setMediaUploads(transformMediaFormat(taskProposal?.media));
                    setFileUploadLoading(false);
                  },
                });
              } else {
                attachMedia({
                  variables: {
                    taskId: existingTask?.id,
                    input: {
                      mediaUploads: [fileToAdd],
                    },
                  },
                  onCompleted: (data) => {
                    const task = data?.attachTaskMedia;
                    setMediaUploads(transformMediaFormat(task?.media));
                    setFileUploadLoading(false);
                  },
                });
              }
            }}
          />
        </CreateFormMainInputBlock>
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
                {createPodMembersList?.length}
                {createPodMembersList?.length > 1 ? ' members' : ' member'}
              </CreateFormMembersBlockTitle>
              <CreateFormMembersList>
                {createPodMembersList.map((item) => (
                  <MembersRow key={item.name} name={item.name} styledSwitch={<AndroidSwitch />} />
                ))}
              </CreateFormMembersList>
            </CreateFormMembersBlock>
          </CreateFormMembersSection>
        )}
        {showAppearSection && !isTaskProposal && (
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
            <CreateFormAddDetailsAppearBlockContainer>
              {showDueDateSection && (
                <CreateFormAddDetailsSelects>
                  <CreateFormAddDetailsLocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker title="Due date" inputFormat="MM/dd/yyyy" value={dueDate} setValue={setDueDate} />
                    </LocalizationProvider>
                  </CreateFormAddDetailsLocalizationProvider>
                </CreateFormAddDetailsSelects>

                // {/* <CreateFormAddDetailsSelects> */}
                // {/* <CreateFormAddDetailsSwitch>
                // 		<CreateFormAddDetailsInputLabel>
                // 			Private task
                // 		</CreateFormAddDetailsInputLabel>
                // 		<AndroidSwitch />
                // 	</CreateFormAddDetailsSwitch> */}

                // {/*if Suggest a task opened */}
                // {/* {showBountySwitchSection && !isTaskProposal && (
                //     <CreateFormAddDetailsSwitch>
                //       <CreateFormAddDetailsInputLabel>
                //         This is a bounty
                //       </CreateFormAddDetailsInputLabel>
                //       <AndroidSwitch />
                //     </CreateFormAddDetailsSwitch>
                //   )} */}

                // {/*if Create a milestone opened*/}
                // {/* {showPrioritySelectSection && (
                //     <DropdownSelect
                //       title="Priority"
                //       labelText="Choose Milestone"
                //       options={PRIORITY_SELECT_OPTIONS}
                //       name="priority"
                //     />
                //   )} */}
                // {/* </CreateFormAddDetailsSelects> */}
              )}
            </CreateFormAddDetailsAppearBlockContainer>

            {(showLinkAttachmentSection || showVisibility) && (
              <CreateFormAddDetailsAppearBlockContainer>
                {showLinkAttachmentSection && (
                  <CreateFormLinkAttachmentBlock>
                    <CreateFormLinkAttachmentLabel>Links</CreateFormLinkAttachmentLabel>
                    <InputForm margin placeholder="Enter link attachment" search={false} />
                  </CreateFormLinkAttachmentBlock>
                )}
                {showVisibility && (
                  <CreateFormAddDetailsTab>
                    <CreateFormAddDetailsInputLabel>
                      Who can see this {titleText.toLowerCase()}?
                    </CreateFormAddDetailsInputLabel>
                    <TabsVisibilityCreateEntity isPod={isPod} isPublic={publicTask} setIsPublic={setPublicTask} />
                    {errors.privacy && <ErrorText>{errors.privacy}</ErrorText>}
                  </CreateFormAddDetailsTab>
                )}
              </CreateFormAddDetailsAppearBlockContainer>
            )}
          </CreateFormAddDetailsAppearBlock>
        )}
      </CreateFormAddDetailsSection>

      <CreateFormFooterButtons>
        {errors.general && <ErrorText> {errors.general} </ErrorText>}
        <CreateFormButtonsBlock>
          <CreateFormCancelButton onClick={cancelEdit}>Cancel</CreateFormCancelButton>
          <CreateFormPreviewButton onClick={submitMutation} disabled={updating}>
            {updating ? <CircularProgress size={20} /> : null}
            Update {isTaskProposal ? 'proposal' : titleText}
          </CreateFormPreviewButton>
        </CreateFormButtonsBlock>
      </CreateFormFooterButtons>
    </CreateFormBaseModal>
  );
};

export default EditLayoutBaseModal;
