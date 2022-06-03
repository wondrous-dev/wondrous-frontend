import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import Tooltip from 'components/Tooltip';
import { useFormik } from 'formik';
import { CREATE_LABEL } from 'graphql/mutations/org';
import { CREATE_BOUNTY, CREATE_MILESTONE, CREATE_TASK } from 'graphql/mutations/task';
import { GET_ORG_LABELS, GET_ORG_USERS, GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';
import { GET_USER_AVAILABLE_PODS } from 'graphql/queries/pod';
import { GET_ELIGIBLE_REVIEWERS_FOR_ORG, GET_ELIGIBLE_REVIEWERS_FOR_POD, GET_MILESTONES } from 'graphql/queries/task';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CHAIN_TO_CHAIN_DIPLAY_NAME, ENTITIES_TYPES, PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { TextInputContext } from 'utils/contexts';
import { getMentionArray, parseUserPermissionContext, transformTaskToTaskCard } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { handleAddFile } from 'utils/media';
import * as Yup from 'yup';
import { useMe } from '../../Auth/withAuth';
import { SafeImage } from '../../Common/Image';
import Tags, { Option as Label } from '../../Tags';
import { MediaItem } from '../MediaItem';
import {
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  CreateEntityAttachment,
  CreateEntityAttachmentIcon,
  CreateEntityAutocompleteOption,
  CreateEntityAutocompleteOptionTypography,
  CreateEntityAutocompletePopper,
  CreateEntityAutocompletePopperRenderInput,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityBody,
  CreateEntityCancelButton,
  CreateEntityCreateTaskButton,
  CreateEntityDefaultDaoImage,
  CreateEntityDefaultPodImage,
  CreateEntityDefaultUserImage,
  CreateEntityDescription,
  CreateEntityDescriptionWrapper,
  CreateEntityDivider,
  CreateEntityDueDate,
  CreateEntityError,
  CreateEntityForm,
  CreateEntityHeader,
  CreateEntityHeaderArrowIcon,
  CreateEntityHeaderWrapper,
  CreateEntityLabel,
  CreateEntityLabelAddButton,
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
  CreateEntityOpenInFullIcon,
  CreateEntityOption,
  CreateEntityOptionImageWrapper,
  CreateEntityOptionLabel,
  CreateEntityPaymentMethodLabel,
  CreateEntityPaymentMethodLabelChain,
  CreateEntityPaymentMethodOption,
  CreateEntityPaymentMethodOptionIcon,
  CreateEntityPaymentMethodSelect,
  CreateEntityPaymentMethodSelectRender,
  CreateEntityPrivacyIconWrapper,
  CreateEntityPrivacyLabel,
  CreateEntityPrivacyMembersIcon,
  CreateEntityPrivacyPublicIcon,
  CreateEntityPrivacySelect,
  CreateEntityPrivacySelectOption,
  CreateEntityPrivacySelectRender,
  CreateEntityPrivacySelectRenderLabel,
  CreateEntityRewardWrapper,
  CreateEntitySelect,
  CreateEntitySelectArrowIcon,
  CreateEntitySelectErrorWrapper,
  CreateEntitySelectRootValue,
  CreateEntitySelectRootValueWrapper,
  CreateEntitySelectWrapper,
  CreateEntityTextfield,
  CreateEntityTextfieldInputLabel,
  CreateEntityTextfieldInputPoints,
  CreateEntityTextfieldInputReward,
  CreateEntityTextfieldPoints,
  CreateEntityTitle,
  MediaUploadDiv,
} from './styles';

const formValidationSchema = Yup.object().shape({
  orgId: Yup.string().required('Organization is required'),
  podId: Yup.string().optional().nullable(),
  title: Yup.string().required('Title is required'),
  reviewerIds: Yup.array().of(Yup.string().nullable()).nullable(),
  assigneeId: Yup.string().nullable(),
  points: Yup.number()
    .typeError('Points must be a number')
    .integer('Points must be whole number')
    .moreThan(0, 'Points must be greater than 0')
    .optional()
    .nullable(),
  rewards: Yup.array()
    .of(
      Yup.object({
        paymentMethodId: Yup.string().required(),
        rewardAmount: Yup.number()
          .typeError('Reward amount must be a number')
          .moreThan(0, 'Reward amount must be greater than 0'),
      })
    )
    .optional()
    .nullable(),
  milestoneId: Yup.string().nullable(),
  description: Yup.string().nullable(),
});

const privacyOptions = {
  public: {
    label: 'Public',
    value: PRIVACY_LEVEL.public,
    Icon: CreateEntityPrivacyPublicIcon,
  },
  private: {
    label: 'Members',
    value: '',
    Icon: CreateEntityPrivacyMembersIcon,
  },
};
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

const filterOrgUsersForAutocomplete = (orgUsers) => {
  if (!orgUsers) {
    return [];
  }
  return orgUsers.map((orgUser) => ({
    ...orgUser?.user,
    display: orgUser?.user?.username,
    id: orgUser?.user?.id,
  }));
};

const filterPaymentMethods = (paymentMethods) => {
  if (!paymentMethods) return [];
  return paymentMethods.map((paymentMethod) => {
    return {
      ...paymentMethod,
      icon: <SafeImage src={paymentMethod.icon} style={{ width: '30px', height: '30px', borderRadius: '15px' }} />,
      label: `${paymentMethod.tokenName?.toUpperCase()}: ${CHAIN_TO_CHAIN_DIPLAY_NAME[paymentMethod.chain]}`,
      value: paymentMethod.id,
    };
  });
};

const filterOrgUsers = (orgUsers) => {
  if (!orgUsers) {
    return [];
  }

  return orgUsers.map((orgUser) => ({
    profilePicture: orgUser?.user?.profilePicture,
    label: orgUser?.user?.username,
    value: orgUser?.user?.id,
  }));
};

const filterOptionsWithPermission = (options, userPermissionsContext) => {
  if (!options) {
    return [];
  }
  return options
    .filter(({ id }) => {
      const permissions = parseUserPermissionContext({
        userPermissionsContext,
        orgId: id,
        podId: id,
      });
      return permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.CREATE_TASK);
    })
    .map(({ profilePicture, name, id, color }) => ({
      imageUrl: profilePicture,
      label: name,
      value: id,
      color: color,
    }));
};

const getPodObject = (pods, podId) => {
  let justCreatedPod = null;
  pods.forEach((testPod) => {
    if (testPod.id === podId) {
      justCreatedPod = testPod;
    }
  });
  return justCreatedPod;
};

const useGetAvailableUserPods = (org) => {
  const [getAvailableUserPods, { data }] = useLazyQuery(GET_USER_AVAILABLE_PODS, {
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (org) {
      getAvailableUserPods({
        variables: {
          orgId: org,
        },
      });
    }
  }, [getAvailableUserPods, org]);
  return data?.getAvailableUserPods;
};

const useGetEligibleReviewers = (org, pod) => {
  const [getEligibleReviewersForOrg, { data: eligibleReviewersForOrgData }] =
    useLazyQuery(GET_ELIGIBLE_REVIEWERS_FOR_ORG);

  const [getEligibleReviewersForPod, { data: eligibleReviewersForPodData }] =
    useLazyQuery(GET_ELIGIBLE_REVIEWERS_FOR_POD);
  useEffect(() => {
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
  }, [org, pod, getEligibleReviewersForOrg, getEligibleReviewersForPod]);
  const eligibleReviewers = filterUserOptions(
    eligibleReviewersForPodData?.getEligibleReviewersForPod ?? eligibleReviewersForOrgData?.getEligibleReviewersForOrg
  );
  return eligibleReviewers;
};

const useGetOrgLabels = (orgId) => {
  const [getOrgLabels, { data }] = useLazyQuery(GET_ORG_LABELS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId) {
      getOrgLabels({
        variables: {
          orgId: orgId,
        },
      });
    }
  }, [orgId, getOrgLabels]);

  return data?.getOrgLabels;
};

const useCreateLabel = (orgId, callback) => {
  const [createLabel] = useMutation(CREATE_LABEL, {
    refetchQueries: () => ['getOrgLabels'],
  });

  const handleCreateLabel = async (label: Label) => {
    const {
      data: { createLabel: newLabel },
    } = await createLabel({
      variables: {
        input: {
          orgId: orgId,
          name: label.name,
          color: label.color,
        },
      },
    });
    callback(newLabel.id);
  };
  return handleCreateLabel;
};

const useGetPaymentMethods = (orgId) => {
  const [getPaymentMethods, { data }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG);
  useEffect(() => {
    if (orgId) {
      getPaymentMethods({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId, getPaymentMethods]);
  return data?.getPaymentMethodsForOrg;
};

const useGetOrgUsers = (orgId) => {
  const [getOrgUsers, { data }] = useLazyQuery(GET_ORG_USERS);
  useEffect(() => {
    getOrgUsers({
      variables: {
        orgId,
        limit: 100, // TODO: fix autocomplete
      },
    });
  }, [orgId, getOrgUsers]);
  return data?.getOrgUsers;
};

const useCreateTask = () => {
  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    refetchQueries: () => [
      'getPerStatusTaskCountForMilestone',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getSubtasksForTask',
      'getSubtaskCountForTask',
    ],
  });
  const handleMutation = (input, board, pods, form, handleClose) =>
    createTask({
      variables: {
        input,
      },
    })
      .then((result) => {
        //checking if it's pod or org to use pod/org entity type else we assume it's the userBoard and we use the normal flow
        if (board?.entityType === ENTITIES_TYPES.TASK || !board?.entityType) {
          const task = result?.data?.createTask;
          const justCreatedPod = getPodObject(pods, task.podId);
          if (
            board?.setColumns &&
            ((task?.orgId === board?.orgId && !board?.podId) ||
              task?.podId === board?.podId ||
              form.values.podId === board?.podId)
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
        } else {
          board?.setEntityType(ENTITIES_TYPES.TASK);
        }
        handleClose();
      })
      .catch((e) => console.log(e));
  return { handleMutation, loading };
};

const useCreateMilestone = () => {
  const [createMilestone, { loading }] = useMutation(CREATE_MILESTONE, {
    refetchQueries: () => ['getPerTypeTaskCountForOrgBoard', 'getPerTypeTaskCountForPodBoard'],
  });
  const handleMutation = (input, board, pods, form, handleClose) => {
    createMilestone({
      variables: {
        input,
      },
    }).then((result) => {
      if (board?.entityType === ENTITIES_TYPES.MILESTONE || !board?.entityType) {
        const task = result?.data?.createMilestone;
        const justCreatedPod = getPodObject(pods, task.podId);
        if (
          board?.setColumns &&
          ((task?.orgId === board?.orgId && !board?.podId) ||
            task?.podId === board?.podId ||
            form.values.podId === board?.podId)
        ) {
          const transformedTask = transformTaskToTaskCard(task, {
            orgName: board?.org?.name,
            orgProfilePicture: board?.org?.profilePicture,
            podName: justCreatedPod?.name,
          });

          let columns = [...board?.columns];
          if (columns[0]?.tasks) {
            columns[0].tasks = [transformedTask, ...columns[0].tasks];
          } else {
            columns = [transformedTask, ...columns];
          }
          board.setColumns(columns);
        }
      } else {
        board?.setEntityType(ENTITIES_TYPES.MILESTONE);
      }
      handleClose();
    });
  };
  return { handleMutation, loading };
};

const useCreateBounty = () => {
  const [createBounty, { loading }] = useMutation(CREATE_BOUNTY, {
    refetchQueries: () => ['getPerTypeTaskCountForOrgBoard', 'getPerTypeTaskCountForPodBoard'],
  });
  const handleMutation = (input, board, pods, form, handleClose) => {
    createBounty({
      variables: {
        input,
      },
    })
      .then((result) => {
        if (board?.entityType === ENTITIES_TYPES.BOUNTY || !board?.entityType) {
          const task = result?.data?.createBounty;
          const justCreatedPod = getPodObject(pods, task.podId);
          if (
            board?.setColumns &&
            ((task?.orgId === board?.orgId && !board?.podId) ||
              task?.podId === board?.podId ||
              form.values.podId === board?.podId)
          ) {
            const transformedTask = transformTaskToTaskCard(task, {
              orgName: board?.org?.name,
              orgProfilePicture: board?.org?.profilePicture,
              podName: justCreatedPod?.name,
            });

            let columns = [...board?.columns];
            if (columns[0]?.tasks) {
              columns = [transformedTask, ...columns[0].tasks];
            } else {
              columns = [transformedTask, ...columns];
            }
            board?.setColumns(columns);
          }
        } else {
          board?.setEntityType(ENTITIES_TYPES.BOUNTY);
        }
        handleClose();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return { handleMutation, loading };
};

const CreateEntityDropdownRenderOptions = (value) => {
  return (
    <CreateEntitySelectRootValue>
      <CreateEntitySelectRootValueWrapper>{value?.label}</CreateEntitySelectRootValueWrapper>
      <CreateEntitySelectArrowIcon />
    </CreateEntitySelectRootValue>
  );
};

const CreateEntityDropdown = (props) => {
  const {
    value,
    options,
    onChange,
    name,
    renderValue = CreateEntityDropdownRenderOptions,
    DefaultImageComponent,
    error,
    onFocus,
  } = props;
  const dropdownValue = value === null ? 'placeholder' : value;
  const placeholderText = { podId: 'Select Pod', orgId: 'Select Org' };
  return (
    <CreateEntitySelect
      name={name}
      renderValue={renderValue}
      onChange={onChange}
      disabled={options.length == 0}
      value={dropdownValue}
      error={error}
      onFocus={onFocus}
    >
      <CreateEntityOption key={'placeholder'} value={'placeholder'} hide={true}>
        <CreateEntityOptionImageWrapper>
          <DefaultImageComponent color={'#474747'} />
        </CreateEntityOptionImageWrapper>
        <CreateEntityOptionLabel>{placeholderText[name]}</CreateEntityOptionLabel>
      </CreateEntityOption>
      {options.map((i) => {
        const { imageUrl, label, value, color = '' } = i;
        return (
          <CreateEntityOption key={value} value={i.value}>
            <CreateEntityOptionImageWrapper>
              {imageUrl ? <SafeImage src={imageUrl} /> : <DefaultImageComponent color={color} />}
            </CreateEntityOptionImageWrapper>
            <CreateEntityOptionLabel>{label}</CreateEntityOptionLabel>
          </CreateEntityOption>
        );
      })}
    </CreateEntitySelect>
  );
};

const CreateEntityTextfieldInputPointsComponent = React.forwardRef(function CreateEntityTextfieldInputCustom(
  props,
  ref
) {
  return (
    <CreateEntityTextfieldInputPoints
      {...props}
      autoFocus={true}
      fullWidth={false}
      ref={ref}
      inputProps={{
        maxLength: 3,
      }}
      InputProps={{
        startAdornment: (
          <CreateEntityAutocompletePopperRenderInputAdornment position="start">
            <CreateEntityTextfieldPoints />
          </CreateEntityAutocompletePopperRenderInputAdornment>
        ),
        endAdornment: (
          <CreateEntityAutocompletePopperRenderInputAdornment position="end">
            <CreateEntityTextfieldInputLabel>PTS</CreateEntityTextfieldInputLabel>
          </CreateEntityAutocompletePopperRenderInputAdornment>
        ),
      }}
    />
  );
});

const CreateEntityTextfieldInputRewardComponent = React.forwardRef(function CreateEntityTextfieldInput(props, ref) {
  return <CreateEntityTextfieldInputReward {...props} ref={ref} />;
});

enum Fields {
  reviewer,
  assignee,
  dueDate,
  reward,
  points,
  milestone,
  tags,
}

const entityTypeData = {
  [ENTITIES_TYPES.TASK]: {
    fields: [
      Fields.reviewer,
      Fields.assignee,
      Fields.dueDate,
      Fields.reward,
      Fields.points,
      Fields.milestone,
      Fields.tags,
    ],
    mutation: useCreateTask,
    initialValues: {
      orgId: null,
      podId: null,
      title: '',
      description: '',
      reviewerIds: null,
      assigneeId: null,
      dueDate: null,
      rewards: null,
      points: null,
      milestoneId: null,
      labelIds: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
    },
  },
  [ENTITIES_TYPES.MILESTONE]: {
    fields: [Fields.reviewer, Fields.dueDate, Fields.points, Fields.tags],
    mutation: useCreateMilestone,
    initialValues: {
      orgId: null,
      podId: null,
      title: '',
      description: '',
      reviewerIds: null,
      dueDate: null,
      points: null,
      labelIds: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
    },
  },
  [ENTITIES_TYPES.BOUNTY]: {
    fields: [Fields.reviewer, Fields.dueDate, Fields.points, Fields.tags],
    mutation: useCreateBounty,
    initialValues: {
      orgId: null,
      podId: null,
      title: '',
      description: '',
      reviewerIds: null,
      dueDate: null,
      points: null,
      labelIds: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
    },
  },
};

const TEXT_LIMIT = 900;

export const CreateEntityModal = (props) => {
  const { entityType, handleClose, resetEntityType, open, parentTaskId } = props;
  const user = useMe();
  const [recurrenceType, setRecurrenceType] = useState(null);
  const [recurrenceValue, setRecurrenceValue] = useState(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });
  const inputRef: any = useRef();
  const fetchedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const filteredDaoOptions = filterOptionsWithPermission(userOrgs?.getUserOrgs, fetchedUserPermissionsContext);
  const { handleMutation, loading } = entityTypeData[entityType]?.mutation();
  const form = useFormik({
    initialValues: entityTypeData[entityType]?.initialValues,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      const reviewerIds = values?.reviewerIds?.filter((i) => i !== null);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const userMentions = getMentionArray(values.description);
      const points = parseInt(values.points);
      const rewards = values.rewards && [
        { ...values.rewards[0], rewardAmount: parseFloat(values.rewards[0].rewardAmount) },
      ];
      const input = { ...values, reviewerIds, points, rewards, timezone, userMentions };
      handleMutation(input, board, pods, form, handleClose);
    },
  });
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(form.values.orgId));
  const orgUsersData = useGetOrgUsers(form.values.orgId);
  const filteredOrgUsersData = filterOrgUsers(orgUsersData);
  const orgLabelsData = useGetOrgLabels(form.values.orgId);
  const handleCreateLabel = useCreateLabel(form.values.orgId, (newLabelId) =>
    form.setFieldValue('labelIds', [...form.values.labelIds, newLabelId])
  );
  const [getMilestones, { data: milestonesData }] = useLazyQuery(GET_MILESTONES);
  const pods = useGetAvailableUserPods(form.values.orgId);

  const handleOnchangePodId = useCallback(
    (podId) => {
      const selectedPodPrivacyLevel = pods?.filter((i) => i.id === podId)[0]?.privacyLevel;
      const privacyLevel = privacyOptions[selectedPodPrivacyLevel]?.value ?? privacyOptions.public.value;
      form.setValues({
        ...form.values,
        reviewerIds: form.initialValues?.reviewerIds,
        assigneeId: form.initialValues?.assigneeId,
        rewards: form.initialValues?.rewards,
        milestoneId: form.initialValues?.milestoneId,
        privacyLevel,
        podId,
      });
      form.setErrors({});
    },
    [form, pods]
  );

  const router = useRouter();
  const { podId: routerPodId } = router.query;
  useEffect(() => {
    if (open) {
      if (router?.pathname.includes('/dashboard') && !form.values.orgId && filteredDaoOptions[0]?.value) {
        form.setFieldValue('orgId', filteredDaoOptions[0]?.value);
      }
      if (
        fetchedUserPermissionsContext &&
        board?.orgId in fetchedUserPermissionsContext?.orgPermissions &&
        !form.values.orgId
      ) {
        // If you're only part of one dao then just set that as default
        // TODO: if you are part of the org and you're on that page it should be create on that org

        form.setFieldValue('orgId', board?.orgId);
      }

      if (
        form.values.orgId &&
        pods &&
        fetchedUserPermissionsContext &&
        board?.podId in fetchedUserPermissionsContext?.podPermissions &&
        !form.values.podId
      ) {
        // If you're only part of one dao then just set that as default
        // TODO: if you are part of the org and you're on that page it should be create on that org
        handleOnchangePodId(board?.podId || routerPodId);
      }
    }
  }, [
    board?.orgId,
    fetchedUserPermissionsContext,
    board?.podId,
    form.values.orgId,
    form.values.podId,
    open,
    routerPodId,
    form,
    filteredDaoOptions,
    router,
    handleOnchangePodId,
    pods,
  ]);
  const eligibleReviewers = useGetEligibleReviewers(form.values.orgId, form.values.podId);
  const filteredEligibleReviewers = eligibleReviewers.filter(
    (reviewer) => !form.values.reviewerIds?.includes(reviewer.id)
  );
  const [fullScreen, setFullScreen] = useState(false);
  return (
    <CreateEntityForm onSubmit={form.handleSubmit} fullScreen={fullScreen}>
      <CreateEntityHeader>
        <CreateEntityHeaderWrapper>
          <CreateEntitySelectErrorWrapper>
            <CreateEntityDropdown
              name="orgId"
              options={filteredDaoOptions}
              onChange={(orgId) => {
                // NOTE: This will reset the data that depends on the orgId
                form.setValues({
                  ...form.initialValues,
                  points: form.values.points,
                  dueDate: form.values.dueDate,
                  title: form.values.title,
                  description: form.values.description,
                  mediaUploads: form.values.mediaUploads,
                  orgId,
                });
                form.setErrors({});
              }}
              value={form.values.orgId}
              DefaultImageComponent={CreateEntityDefaultDaoImage}
              error={form.errors.orgId}
              onFocus={() => form.setFieldError('orgId', undefined)}
            />
            {form.errors.orgId && <CreateEntityError>{form.errors.orgId}</CreateEntityError>}
          </CreateEntitySelectErrorWrapper>
          {form.values.orgId !== null && (
            <>
              <CreateEntityHeaderArrowIcon />
              <CreateEntityDropdown
                name="podId"
                options={filterOptionsWithPermission(pods, fetchedUserPermissionsContext)}
                onChange={handleOnchangePodId}
                value={form.values.podId}
                DefaultImageComponent={CreateEntityDefaultPodImage}
              />
            </>
          )}
        </CreateEntityHeaderWrapper>
        <CreateEntityHeaderWrapper>
          <CreateEntityOpenInFullIcon onClick={() => setFullScreen(!fullScreen)} />
        </CreateEntityHeaderWrapper>
      </CreateEntityHeader>
      <CreateEntityBody>
        <CreateEntityTitle
          type="text"
          onChange={form.handleChange('title')}
          value={form.values.title}
          name="title"
          placeholder="Enter a title"
          minRows={1}
          maxRows={3}
          error={form.errors?.title}
          onFocus={() => form.setFieldError('title', undefined)}
        />
        <CreateEntityError>{form.errors?.title}</CreateEntityError>
        <TextInputContext.Provider
          value={{
            content: form.values.description,
            onChange: (e) => {
              if (e.target.value.length < TEXT_LIMIT) {
                form.setFieldValue('description', e.target.value);
              }
            },
            list: filterOrgUsersForAutocomplete(orgUsersData),
          }}
        >
          <CreateEntityDescriptionWrapper>
            <CreateEntityDescription placeholder="Enter a description" minRows={4} />
          </CreateEntityDescriptionWrapper>
        </TextInputContext.Provider>
        <CreateEntityLabelSelectWrapper show={true}>
          <MediaUploadDiv>
            {form.values.mediaUploads?.length > 0 &&
              form.values.mediaUploads.map((mediaItem) => (
                <MediaItem
                  key={mediaItem?.uploadSlug}
                  mediaUploads={form.values.mediaUploads}
                  setMediaUploads={(mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads)}
                  mediaItem={mediaItem}
                />
              ))}
            <CreateEntityAttachment onClick={() => inputRef.current.click()}>
              <CreateEntityAttachmentIcon />
              Add Attachment
              {fileUploadLoading && <FileLoading />}
            </CreateEntityAttachment>
          </MediaUploadDiv>
          <input
            type="file"
            hidden
            ref={inputRef}
            onChange={(event) =>
              handleAddFile({
                event,
                filePrefix: 'tmp/task/new/',
                mediaUploads: form.values.mediaUploads,
                setMediaUploads: (mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads),
                setFileUploadLoading,
              })
            }
          />
        </CreateEntityLabelSelectWrapper>
        <CreateEntityDivider />
        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.reviewer)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Reviewer</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values?.reviewerIds?.map((reviewerId, index) => {
              const hasError = form.errors?.reviewerIds?.[index];
              return (
                <CreateEntitySelectErrorWrapper key={reviewerId}>
                  <CreateEntityAutocompletePopper
                    onFocus={() => form.setFieldError('reviewerIds', undefined)}
                    openOnFocus={true}
                    options={eligibleReviewers}
                    value={reviewerId}
                    isOptionEqualToValue={(option, value) => {
                      return option.id === value;
                    }}
                    renderInput={(params) => {
                      const reviewer = eligibleReviewers.find((reviewer) => reviewer.id === params.inputProps.value);
                      return (
                        <CreateEntityAutocompletePopperRenderInput
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            value: reviewer?.label,
                          }}
                          autoFocus={true}
                          ref={params.InputProps.ref}
                          disableUnderline={true}
                          fullWidth={true}
                          placeholder="Enter username..."
                          startAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                              {reviewer?.profilePicture ? (
                                <SafeImage src={reviewer.profilePicture} />
                              ) : (
                                <CreateEntityDefaultUserImage />
                              )}
                            </CreateEntityAutocompletePopperRenderInputAdornment>
                          }
                          endAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment
                              position="end"
                              onClick={() => {
                                const newReviewers = _.cloneDeep(form.values.reviewerIds).filter(
                                  (id) => id !== reviewerId
                                );
                                form.setFieldValue('reviewerIds', newReviewers);
                              }}
                            >
                              <CreateEntityAutocompletePopperRenderInputIcon />
                            </CreateEntityAutocompletePopperRenderInputAdornment>
                          }
                        />
                      );
                    }}
                    renderOption={(props, option) => {
                      if (form.values.reviewerIds.includes(option.id) && option.id !== reviewerId) return null;
                      return (
                        <CreateEntityAutocompleteOption
                          {...props}
                          onClick={() => {
                            if (!form.values.reviewerIds.includes(option.id)) {
                              const reviewerIds = _.cloneDeep(form.values.reviewerIds);
                              reviewerIds[index] = option.id;
                              form.setFieldValue('reviewerIds', reviewerIds);
                            }
                          }}
                        >
                          {option?.profilePicture ? (
                            <SafeImage src={option?.profilePicture} />
                          ) : (
                            <CreateEntityDefaultUserImage />
                          )}
                          <CreateEntityAutocompleteOptionTypography>
                            {option?.label}
                          </CreateEntityAutocompleteOptionTypography>
                        </CreateEntityAutocompleteOption>
                      );
                    }}
                    error={hasError}
                  />
                  {hasError && <CreateEntityError>{hasError}</CreateEntityError>}
                </CreateEntitySelectErrorWrapper>
              );
            })}
            <Tooltip
              title={
                form.values.reviewerIds?.length >= filteredEligibleReviewers.length &&
                'You reached the maximum no. of available reviewers'
              }
              placement="top"
            >
              <CreateEntityLabelAddButton
                disabled={form.values.reviewerIds?.length >= filteredEligibleReviewers.length}
                onClick={() => {
                  if (form.values.reviewerIds === null) {
                    form.setFieldValue('reviewerIds', [null]);
                    return;
                  }
                  form.setFieldValue('reviewerIds', form.values.reviewerIds.concat(null));
                }}
              >
                <CreateEntityAddButtonIcon />
                {form.values.reviewerIds === null && <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>}
              </CreateEntityLabelAddButton>
            </Tooltip>
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.assignee)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Assignee</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values.assigneeId !== null && (
              <CreateEntitySelectErrorWrapper>
                <CreateEntityAutocompletePopper
                  onFocus={() => form.setFieldError('assigneeId', undefined)}
                  openOnFocus={true}
                  options={filteredOrgUsersData}
                  value={form.values.assigneeId}
                  isOptionEqualToValue={(option, value) => {
                    return option.value === value;
                  }}
                  renderInput={(params) => {
                    const assignee = filteredOrgUsersData.find((user) => user.value === params.inputProps.value);
                    return (
                      <CreateEntityAutocompletePopperRenderInput
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          value: assignee?.label,
                        }}
                        autoFocus={true}
                        ref={params.InputProps.ref}
                        disableUnderline={true}
                        fullWidth={true}
                        placeholder="Enter username..."
                        startAdornment={
                          <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                            {assignee?.profilePicture ? (
                              <SafeImage src={assignee.profilePicture} />
                            ) : (
                              <CreateEntityDefaultUserImage />
                            )}
                          </CreateEntityAutocompletePopperRenderInputAdornment>
                        }
                        endAdornment={
                          <CreateEntityAutocompletePopperRenderInputAdornment
                            position="end"
                            onClick={() => {
                              form.setFieldValue('assigneeId', null);
                            }}
                          >
                            <CreateEntityAutocompletePopperRenderInputIcon />
                          </CreateEntityAutocompletePopperRenderInputAdornment>
                        }
                      />
                    );
                  }}
                  renderOption={(props, option) => {
                    return (
                      <CreateEntityAutocompleteOption
                        {...props}
                        onClick={() => {
                          if (form.values.assigneeId !== option.value) {
                            form.setFieldValue('assigneeId', option.value);
                          }
                          form.setFieldError('assigneeId', undefined);
                        }}
                      >
                        {option?.profilePicture ? (
                          <SafeImage src={option?.profilePicture} />
                        ) : (
                          <CreateEntityDefaultUserImage />
                        )}
                        <CreateEntityAutocompleteOptionTypography>
                          {option?.label}
                        </CreateEntityAutocompleteOptionTypography>
                      </CreateEntityAutocompleteOption>
                    );
                  }}
                  error={form.errors?.assigneeId}
                />
                {form.errors?.assigneeId && <CreateEntityError>{form.errors?.assigneeId}</CreateEntityError>}
              </CreateEntitySelectErrorWrapper>
            )}
            {form.values.assigneeId === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('assigneeId', '');
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.dueDate)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Due Date</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.dueDate !== null && (
              <CreateEntityDueDate
                setValue={(date) => form.setFieldValue('dueDate', date)}
                setRecurrenceType={setRecurrenceType}
                setRecurrenceValue={setRecurrenceValue}
                hideRecurring={false}
                handleClose={() => form.setFieldValue('dueDate', null)}
              />
            )}
            {form.values.dueDate === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('dueDate', '');
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.reward)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Reward</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.rewards !== null && (
              <CreateEntityRewardWrapper>
                <CreateEntityPaymentMethodSelect
                  name="rewards-payment-method"
                  value={form.values?.rewards?.[0].paymentMethodId}
                  onChange={(value) => {
                    form.setFieldValue('rewards', [{ ...form.values?.rewards?.[0], paymentMethodId: value }]);
                  }}
                  renderValue={(value) => {
                    return (
                      <CreateEntityPaymentMethodSelectRender>
                        {value?.label} <CreateEntitySelectArrowIcon />
                      </CreateEntityPaymentMethodSelectRender>
                    );
                  }}
                >
                  {paymentMethods.map(({ symbol, icon, id, chain }) => {
                    return (
                      <CreateEntityPaymentMethodOption key={id} value={id}>
                        <CreateEntityPaymentMethodOptionIcon>{icon ?? <></>}</CreateEntityPaymentMethodOptionIcon>
                        <CreateEntityPaymentMethodLabel>
                          {symbol}
                          <CreateEntityPaymentMethodLabelChain>{chain}</CreateEntityPaymentMethodLabelChain>
                        </CreateEntityPaymentMethodLabel>
                      </CreateEntityPaymentMethodOption>
                    );
                  })}
                </CreateEntityPaymentMethodSelect>
                <CreateEntityTextfield
                  autoComplete="off"
                  name="rewards"
                  onChange={(e) => {
                    form.setFieldValue('rewards', [{ ...form.values?.rewards?.[0], rewardAmount: e.target.value }]);
                  }}
                  placeholder="Enter rewards..."
                  value={form.values?.rewards?.[0]?.rewardAmount}
                  fullWidth={true}
                  autoFocus={true}
                  InputProps={{
                    inputComponent: CreateEntityTextfieldInputRewardComponent,
                    endAdornment: (
                      <CreateEntityAutocompletePopperRenderInputAdornment
                        position="end"
                        onClick={() => {
                          form.setFieldValue('rewards', null);
                        }}
                      >
                        <CreateEntityAutocompletePopperRenderInputIcon />
                      </CreateEntityAutocompletePopperRenderInputAdornment>
                    ),
                  }}
                  error={form.errors?.rewards?.[0].rewardAmount}
                  onFocus={() => form.setFieldError('rewards', undefined)}
                />
              </CreateEntityRewardWrapper>
            )}
            {form.touched.rewards && form.errors.rewards && (
              <CreateEntityError>{form.errors.rewards[0].rewardAmount}</CreateEntityError>
            )}
            {form.values.rewards === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('rewards', [{ rewardAmount: null, paymentMethodId: paymentMethods?.[0]?.id }]);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.points)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Points</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values.points !== null && (
              <>
                <CreateEntityTextfield
                  autoComplete="off"
                  name="points"
                  onChange={form.handleChange('points')}
                  fullWidth={true}
                  value={form.values.points}
                  InputProps={{
                    inputComponent: CreateEntityTextfieldInputPointsComponent,
                    endAdornment: (
                      <CreateEntityAutocompletePopperRenderInputAdornment
                        position="end"
                        onClick={() => {
                          form.setFieldValue('points', null);
                        }}
                      >
                        <CreateEntityAutocompletePopperRenderInputIcon />
                      </CreateEntityAutocompletePopperRenderInputAdornment>
                    ),
                  }}
                  error={form.errors.points}
                  onFocus={() => form.setFieldError('points', undefined)}
                />
                {form.touched.points && form.errors.points && (
                  <CreateEntityError>{form.errors.points}</CreateEntityError>
                )}
              </>
            )}

            {form.values.points === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('points', '');
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.milestone)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Milestone</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values.milestoneId !== null && (
              <CreateEntitySelectErrorWrapper>
                <CreateEntityAutocompletePopper
                  options={filterUserOptions(milestonesData?.getMilestones)}
                  onOpen={() =>
                    getMilestones({
                      variables: {
                        orgId: form.values.orgId,
                        podId: form.values.podId,
                      },
                    })
                  }
                  renderInput={(params) => {
                    const milestone = filterUserOptions(milestonesData?.getMilestones).find(
                      (milestone) => milestone.id === form.values.milestoneId
                    );
                    return (
                      <CreateEntityAutocompletePopperRenderInput
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          value: milestone?.label,
                        }}
                        autoFocus={true}
                        ref={params.InputProps.ref}
                        disableUnderline={true}
                        fullWidth={true}
                        name="milestone"
                        placeholder="Enter milestone..."
                        endAdornment={
                          <CreateEntityAutocompletePopperRenderInputAdornment
                            position="end"
                            onClick={() => {
                              form.setFieldValue('milestoneId', null);
                            }}
                          >
                            <CreateEntityAutocompletePopperRenderInputIcon />
                          </CreateEntityAutocompletePopperRenderInputAdornment>
                        }
                      />
                    );
                  }}
                  value={form.values.milestoneId}
                  renderOption={(props, option, state) => {
                    return (
                      <CreateEntityAutocompleteOption
                        onClick={() => {
                          if (form.values.milestoneId?.id !== option.id) {
                            form.setFieldValue('milestoneId', option.id);
                          }
                        }}
                      >
                        {option?.profilePicture ? <SafeImage src={option?.profilePicture} /> : <div />}
                        <CreateEntityAutocompleteOptionTypography>
                          {option?.label}
                        </CreateEntityAutocompleteOptionTypography>
                      </CreateEntityAutocompleteOption>
                    );
                  }}
                />
              </CreateEntitySelectErrorWrapper>
            )}
            {form.values.milestoneId === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('milestoneId', filterUserOptions(milestonesData?.getMilestones)?.[0]?.id);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.tags)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Tags</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.labelIds !== null && (
              <Tags
                options={orgLabelsData || []}
                ids={form.values.labelIds}
                onChange={(labelIds) => {
                  form.setFieldValue('labelIds', labelIds);
                }}
                onCreate={handleCreateLabel}
                limit={4}
              />
            )}
            {form.values.labelIds === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('labelIds', []);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>
      </CreateEntityBody>
      <CreateEntityHeader>
        <CreateEntityHeaderWrapper>
          <CreateEntityPrivacySelect
            disabled={form.values.privacyLevel !== privacyOptions.public.value}
            name="privacyLevel"
            value={form.values.privacyLevel}
            onChange={form.handleChange('privacyLevel')}
            renderValue={(value) => {
              return (
                <Tooltip
                  title={
                    form.values.privacyLevel !== privacyOptions.public.value && 'The selected pod is for members only'
                  }
                  placement="top"
                >
                  <CreateEntityPrivacySelectRender>
                    <CreateEntityPrivacySelectRenderLabel>{value?.label}</CreateEntityPrivacySelectRenderLabel>
                    <CreateEntitySelectArrowIcon />
                  </CreateEntityPrivacySelectRender>
                </Tooltip>
              );
            }}
          >
            {Object.keys(privacyOptions).map((i) => {
              const { label, value, Icon } = privacyOptions[i];
              return (
                <CreateEntityPrivacySelectOption key={value} value={value}>
                  <CreateEntityPrivacyIconWrapper>{Icon && <Icon />}</CreateEntityPrivacyIconWrapper>
                  <CreateEntityPrivacyLabel>{label}</CreateEntityPrivacyLabel>
                </CreateEntityPrivacySelectOption>
              );
            })}
          </CreateEntityPrivacySelect>
        </CreateEntityHeaderWrapper>
        <CreateEntityHeaderWrapper>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <CreateEntityCancelButton onClick={resetEntityType}>Cancel</CreateEntityCancelButton>
              <CreateEntitySelectErrorWrapper>
                <CreateEntityCreateTaskButton type="submit">Create {entityType}</CreateEntityCreateTaskButton>
                {!_.isEmpty(form.errors) && <CreateEntityError>Something went wrong</CreateEntityError>}
              </CreateEntitySelectErrorWrapper>
            </>
          )}
        </CreateEntityHeaderWrapper>
      </CreateEntityHeader>
    </CreateEntityForm>
  );
};
