import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { ReactEditor } from 'slate-react';

import { ENTITIES_TYPES } from 'utils/constants';
import CloseModalIcon from '../Icons/closeModal';
import CreateDaoIcon from '../Icons/createDao';
import CreatePodIcon from '../Icons/createPod';
import InputForm from '../Common/InputForm/inputForm';
import DropdownSelect from '../Common/DropdownSelect/dropdownSelect';
import { ENTITIES_UI_ELEMENTS } from './chooseEntityToCreateModal';
import {
  CreateFormBaseModal,
  CreateFormBaseModalCloseBtn,
  CreateFormBaseModalHeader,
  CreateFormBaseModalTitle,
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormMainDescriptionInputSymbolCounter,
  CreateFormMainInputBlock,
  CreateFormMainSection,
  CreateFormMainSelects,
  CreateFormPreviewButton,
  CreateFormMainBlockTitle,
  CreateRewardAmountDiv,
  MultiMediaUploadButton,
  MultiMediaUploadButtonText,
  MediaUploadDiv,
  EditorContainer,
  EditorPlaceholder,
  EditorToolbar,
  CreateFormRewardCurrency,
  SnapshotButtonBlock,
  SnapshotButton,
  SnapshotErrorText,
} from './styles';

import UploadImageIcon from '../Icons/uploadImage';
import { handleAddFile } from 'utils/media';

import { MediaItem } from './MediaItem';
import { AddFileUpload } from '../Icons/addFileUpload';
import apollo from 'services/apollo';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_USER_ORGS } from 'graphql/queries';
import { GET_USER_AVAILABLE_PODS } from 'graphql/queries/pod';
import { transformTaskProposalToTaskProposalCard } from 'utils/helpers';
import { GET_ORG_USERS } from 'graphql/queries/org';
import { ATTACH_MEDIA_TO_TASK, REMOVE_MEDIA_FROM_TASK } from 'graphql/mutations/task';
import { LINKE_PROPOSAL_TO_SNAPSHOT, UNLINKE_PROPOSAL_FROM_SNAPSHOT } from 'graphql/mutations/integration';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import {
  ATTACH_MEDIA_TO_TASK_PROPOSAL,
  REMOVE_MEDIA_FROM_TASK_PROPOSAL,
  UPDATE_TASK_PROPOSAL,
} from 'graphql/mutations/taskProposal';
import { useMe } from '../Auth/withAuth';
import { getProposalStatus } from 'utils/board';
import { filterOrgUsersForAutocomplete, filterPaymentMethods } from './createEntityModal';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';
import { ErrorText } from '../Common';
import { FileLoading } from '../Common/FileUpload/FileUpload';
import { RichTextEditor, useEditor, countCharacters, deserializeRichText, extractMentions } from 'components/RichText';
import { useSnapshot } from 'services/snapshot';
import { transformMediaFormat } from 'utils/helpers';

const EditLayoutBaseModal = (props) => {
  const { entityType, handleClose, cancel, existingTask, isTaskProposal, open } = props;
  const user = useMe();

  const editor = useEditor();
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();

  const [descriptionText, setDescriptionText] = useState(deserializeRichText(existingTask?.description || ''));
  const [mediaUploads, setMediaUploads] = useState(transformMediaFormat(existingTask?.media) || []);

  const [org, setOrg] = useState({
    id: existingTask?.orgId,
    profilePicture: existingTask?.orgProfilePicture,
    name: existingTask?.orgName,
  });

  const [milestone, setMilestone] = useState(null);
  const [assignee, setAssignee] = useState(
    existingTask?.assigneeId && {
      value: existingTask?.assigneeId,
      profilePicture: existingTask?.assigneeProfilePicture,
      label: existingTask?.assigneeUsername,
    }
  );
  const [snapshotId, setSnapshotId] = useState(existingTask?.snapshotId);

  // snapshot integration
  const {
    orgSnapshot,
    getOrgSnapshotInfo,
    snapshotConnected,
    snapshotSpace,
    snapshotErrorElement,
    snapshotLoading,
    exportTaskProposal,
    cancelProposal,
  } = useSnapshot();

  // TODO: set later
  const initialRewards = existingTask?.rewards && existingTask?.rewards[0];
  const initialCurrency = initialRewards?.paymentMethodId;
  const initialAmount = initialRewards?.rewardAmount;

  const [rewardsCurrency, setRewardsCurrency] = useState(initialCurrency);
  const [rewardsAmount, setRewardsAmount] = useState(initialAmount);
  // const [maxSubmissionCount, setMaxSubmissionCount] = useState(existingTask?.maxSubmissionCount);
  const [title, setTitle] = useState(existingTask?.title);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();

  const board = orgBoard || podBoard || userBoard;
  const boardColumns = useColumns();
  const { data: userOrgs } = useQuery(GET_USER_ORGS);

  const [getOrgUsers, { data: orgUsersData }] = useLazyQuery(GET_ORG_USERS);

  const [getUserAvailablePods] = useLazyQuery(GET_USER_AVAILABLE_PODS, {
    onCompleted: (data) => {
      setPods(data?.getAvailableUserPods);
    },
    fetchPolicy: 'cache-and-network',
  });
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
  const [dueDate, setDueDate] = useState(existingTask?.dueDate);
  const proposalRejected = existingTask?.rejectedAt;
  const proposalChangeRequested = existingTask?.changeRequestedAt;
  const proposalApproved = existingTask?.approvedAt;
  const proposalOpen = !proposalRejected && !proposalChangeRequested && !proposalApproved;
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const isTask = entityType === ENTITIES_TYPES.TASK;
  const isProposal = entityType === ENTITIES_TYPES.PROPOSAL;
  const { showBountySwitchSection } = useMemo(() => {
    return {
      showBountySwitchSection: isTask || isProposal,
      showAppearSection: isTask,
      showDueDateSection: isTask,
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

  const onCorrectPage =
    existingTask?.orgId === board?.orgId ||
    existingTask?.podId === board?.podId ||
    existingTask?.userId === board?.userId;

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
          limit: 1000, // TODO: fix autocomplete
        },
      });
      getPaymentMethods({
        variables: {
          orgId: org?.id || org,
        },
      });
      getOrgSnapshotInfo({
        variables: {
          orgId: existingTask?.orgId,
        },
      });
    }
  }, [
    userOrgs?.getUserOrgs,
    org,
    getUserAvailablePods,
    getOrgUsers,
    existingTask?.orgId,
    getPaymentMethods,
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

        if (board?.entityType === ENTITIES_TYPES.PROPOSAL) {
          let proposalStatus = getProposalStatus(taskProposal);
          const statusColumnIndex = columns.findIndex((column) => column.status === proposalStatus);
          if (statusColumnIndex) {
            columns[statusColumnIndex].tasks = columns[statusColumnIndex].tasks.map((task) => {
              if (task?.id === transformedTaskProposal?.id) {
                return transformedTaskProposal;
              }
              return task;
            });
          }
        } else {
          columns[0].section.tasks = columns[0].section.tasks.map((existingTaskProposal) => {
            if (transformedTaskProposal?.id === existingTaskProposal.id) {
              return transformedTaskProposal;
            }
            return existingTaskProposal;
          });
        }
        boardColumns.setColumns(columns);
      }
      handleClose();
    },
    refetchQueries: ['GetOrgTaskBoardProposals'],
  });

  const submitMutation = useCallback(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const description = JSON.stringify(descriptionText);
    const userMentions = extractMentions(descriptionText);

    switch (entityType) {
      case ENTITIES_TYPES.PROPOSAL: {
        const proposalInput = {
          title,
          description,
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
          userMentions,
          mediaUploads,
          timezone,
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
    mediaUploads,
    existingTask?.id,
    errors,
    updateTaskProposal,
  ]);

  const paymentMethods = filterPaymentMethods(paymentMethodData?.getPaymentMethodsForOrg);
  const updating = updateTaskProposalLoading;
  const exportProposalToSnapshot = async () => {
    const receipt = await exportTaskProposal(existingTask);
    setSnapshotId(receipt.id);
    if (receipt && receipt.id) {
      await apollo.mutate({
        mutation: LINKE_PROPOSAL_TO_SNAPSHOT,
        variables: {
          proposalId: existingTask?.id,
          snapshotId: receipt.id,
        },
      });
    }
    // update proposal, and if successful, initiate transaction to export to snapshot
  };

  // cancel snapshot proposal
  const cancelSnapshotProposal = async () => {
    await cancelProposal(existingTask.snapshotId).then((receipt) => {
      setSnapshotId(null);
    });
    await apollo.mutate({
      mutation: UNLINKE_PROPOSAL_FROM_SNAPSHOT,
      variables: {
        proposalId: existingTask?.id,
      },
    });
  };
  console.log('snapshitId', snapshotId);
  return (
    <CreateFormBaseModal>
      <CreateFormBaseModalCloseBtn onClick={handleClose}>
        <CloseModalIcon />
      </CreateFormBaseModalCloseBtn>
      <CreateFormBaseModalHeader
        style={{
          marginBottom: '10px',
        }}
      >
        <TitleIcon circle />
        <CreateFormBaseModalTitle>Edit {titleText?.toLowerCase()}</CreateFormBaseModalTitle>
        {snapshotConnected && isTaskProposal && proposalOpen && (
          <SnapshotButtonBlock>
            {!snapshotId && (
              <SnapshotButton onClick={exportProposalToSnapshot} disabled={snapshotLoading}>
                {snapshotLoading ? <CircularProgress size={20} /> : null}
                Export to Snapshot
              </SnapshotButton>
            )}
            {snapshotId && (
              <SnapshotButton onClick={cancelSnapshotProposal} disabled={snapshotLoading}>
                {snapshotLoading ? <CircularProgress size={20} /> : null}
                Cancel Snapshot Proposal
              </SnapshotButton>
            )}
            {snapshotErrorElement && (
              <SnapshotErrorText>
                {snapshotErrorElement.map((elem, i) => (
                  <ErrorText key={i}>{elem}</ErrorText>
                ))}
              </SnapshotErrorText>
            )}
          </SnapshotButtonBlock>
        )}
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
            onChange={(e) => {}}
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
          <EditorToolbar ref={setEditorToolbarNode} />
          <EditorContainer
            onClick={() => {
              if (!ReactEditor.isFocused(editor)) {
                ReactEditor.focus(editor);
              }
            }}
          >
            <RichTextEditor
              editor={editor}
              initialValue={descriptionText}
              mentionables={filterOrgUsersForAutocomplete(orgUsersData?.getOrgUsers)}
              placeholder={<EditorPlaceholder>Enter task description</EditorPlaceholder>}
              toolbarNode={editorToolbarNode}
              onChange={setDescriptionText}
              editorContainerNode={document.querySelector('#modal-scrolling-container')}
            />
          </EditorContainer>

          <CreateFormMainDescriptionInputSymbolCounter>
            {countCharacters(descriptionText)}/900 characters
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
              <InputForm
                style={{
                  marginTop: '37px',
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
          </CreateFormMainSelects>
        )}
      </CreateFormMainSection>

      <CreateFormFooterButtons>
        {errors.general && <ErrorText> {errors.general} </ErrorText>}
        <CreateFormButtonsBlock>
          <CreateFormCancelButton onClick={cancel}>Cancel</CreateFormCancelButton>
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
