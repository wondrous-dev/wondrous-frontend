import DropdownSearch from 'components/DropdownSearch';

import { FormikValues } from 'formik';
import React, { forwardRef, useEffect, useState } from 'react';
import { ENTITIES_TYPES, PRIORITIES, PROPOSAL_VOTE_CHOICES, TASK_STATUS_TODO } from 'utils/constants';
import { ErrorText } from 'components/Common';
import Templates from 'components/CreateEntity/CreateEntityModal/Templates';

import ListBox from 'components/CreateCollaborationModal/Steps/AddTeamMembers/Listbox';
import { StyledLink } from 'components/Common/text';
import TaskPriorityToggleButton from 'components/Common/TaskPriorityToggleButton';
import PlateRichEditor from 'components/PlateRichEditor/PlateRichEditor';
import GithubIssues from 'components/CreateEntity/CreateEntityModal/GithubIssues';
import {
  filterUserOptions,
  filterCategoryValues,
  entityTypeData,
  filterOrgUsersForAutocomplete,
  Fields,
  handleRewardOnChange,
  CreateEntityPaymentMethodItem,
  CreateEntityTextfieldInputPointsComponent,
  CreateEntityTextfieldInputRewardComponent,
  filterOrgUsers,
  filterPaymentMethods,
  useCreateLabel,
  useGetCategories,
  useGetMilestones,
  useGetOrgLabels,
  useGetOrgRoles,
  useGetOrgUsers,
  useGetPaymentMethods,
  useGetProposalChoices,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  CreateEntityAttachment,
  CreateEntityAutocompleteOption,
  CreateEntityAutocompleteOptionTypography,
  CreateEntityAutocompletePopper,
  CreateEntityAutocompletePopperRenderInput,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityBody,
  CreateEntityDefaultUserImage,
  CreateEntityDivider,
  CreateEntityDueDate,
  CreateEntityError,
  CreateEntityLabel,
  CreateEntityLabelAddButton,
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
  CreateEntityPaymentMethodOption,
  CreateEntityPaymentMethodSelect,
  CreateEntityWrapper,
  CreateEntitySelectArrowIcon,
  CreateEntitySelectErrorWrapper,
  CreateEntitySelectWrapper,
  CreateEntityTextfield,
  CreateEntityTitle,
  CreateEntityPaymentMethodSelected,
  ProposalVoteSelect,
  ProposalVoteSelectMenuItem,
  ProposalVoteSelectMenuItemText,
} from 'components/CreateEntity/CreateEntityModal/styles';

import Tags from 'components/Tags';
import { SafeImage } from 'components/Common/Image';
import CustomProposal from 'components/CreateEntity/CreateEntityModal/CustomProposal';
import { useMutation } from '@apollo/client';
import { useGetSubtasksForTask } from 'components/Common/TaskSubtask/TaskSubtaskList/TaskSubtaskList';
import {
  ATTACH_MEDIA_TO_TASK,
  REMOVE_MEDIA_FROM_TASK,
  ATTACH_MEDIA_TO_TASK_PROPOSAL,
  REMOVE_MEDIA_FROM_TASK_PROPOSAL,
  REMOVE_MILESTONE_MEDIA,
  ATTACH_MILESTONE_MEDIA,
} from 'graphql/mutations';
import router from 'next/router';
import MediaUpload from './MediaUpload';
import Reviewer from './Reviewer';
import ApplicationsInput from './ApplicationsInput';
import MilestoneSearch from '../MilestoneSearch';

interface Props {
  form: any;
  initialRecurrenceValue: number;
  initialRecurrenceType: string;
  existingTask: any;
  entityType: string;
  handleClose: Function;
  isSubtask: boolean;
  fileUploadLoading: boolean;
  setFileUploadLoading: (loading: boolean) => void;
  setTurnTaskToBountyModal: (open: boolean) => void;
  formValues: FormikValues;
  fetchedUserPermissionsContext: any;
  handlePodChange: (podId: string) => void;
  pods: any;
}
const FormBody = forwardRef(
  (
    {
      form,
      initialRecurrenceValue,
      initialRecurrenceType,
      existingTask,
      entityType,
      handleClose,
      isSubtask,
      fileUploadLoading,
      setFileUploadLoading,
      setTurnTaskToBountyModal,
      formValues,
      fetchedUserPermissionsContext,
      handlePodChange,
      pods,
    }: Props,
    ref: any
  ) => {
    const isProposal = entityType === ENTITIES_TYPES.PROPOSAL;
    const isBounty = entityType === ENTITIES_TYPES.BOUNTY;
    const isMilestone = entityType === ENTITIES_TYPES.MILESTONE;
    const { data: orgUsersData, search, hasMoreOrgUsers, fetchMoreOrgUsers } = useGetOrgUsers(form.values.orgId);
    const [paymentMethodInactiveError, setPaymentMethodInactiveError] = useState(false);
    const [recurrenceValue, setRecurrenceValue] = useState(initialRecurrenceValue);
    const [recurrenceType, setRecurrenceType] = useState(initialRecurrenceType);

    const paymentMethods = filterPaymentMethods(useGetPaymentMethods(form.values.orgId, true));
    const roles = useGetOrgRoles(form.values.orgId);
    const selectedPaymentMethod = paymentMethods.filter((p) => p.id === form.values?.rewards?.[0]?.paymentMethodId);
    useEffect(() => {
      if (selectedPaymentMethod?.length > 0) {
        setPaymentMethodInactiveError(false);
        if (selectedPaymentMethod?.[0]?.deactivatedAt) {
          setPaymentMethodInactiveError(true);
        }
      }
    }, [selectedPaymentMethod]);

    const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated
    const filteredOrgUsersData = filterOrgUsers({ orgUsersData, existingTask });
    const orgLabelsData = useGetOrgLabels(form.values.orgId);
    const handleCreateLabel = useCreateLabel(form.values.orgId, (newLabelId) =>
      form.setFieldValue('labelIds', [...form.values.labelIds, newLabelId])
    );
    const milestonesData = useGetMilestones(form.values.orgId, form.values.podId);

    const categoriesData = useGetCategories();
    const proposalChoices = useGetProposalChoices();
    const [attachMedia] = useMutation(ATTACH_MEDIA_TO_TASK);
    const [removeMedia] = useMutation(REMOVE_MEDIA_FROM_TASK);
    const [removeMilestoneMedia] = useMutation(REMOVE_MILESTONE_MEDIA);
    const [attachMilestoneMedia] = useMutation(ATTACH_MILESTONE_MEDIA);
    const [attachTaskProposalMedia] = useMutation(ATTACH_MEDIA_TO_TASK_PROPOSAL);
    const [removeTaskProposalMedia] = useMutation(REMOVE_MEDIA_FROM_TASK_PROPOSAL);

    const handleMedia = () => {
      if (entityType === ENTITIES_TYPES.PROPOSAL) {
        return {
          attach: attachTaskProposalMedia,
          remove: removeTaskProposalMedia,
        };
      }
      if (entityType === ENTITIES_TYPES.MILESTONE) {
        return {
          attach: attachMilestoneMedia,
          remove: removeMilestoneMedia,
        };
      }
      return { attach: attachMedia, remove: removeMedia };
    };

    const subTasks = useGetSubtasksForTask({ taskId: existingTask?.id, status: TASK_STATUS_TODO });
    const hasSubTasks = subTasks?.data?.length > 0;
    const canTurnIntoBounty = !hasSubTasks && !isSubtask && existingTask?.type === ENTITIES_TYPES.TASK;
    const handlePaymentMethodRedirect = () => {
      handleClose();
      router.push(`/organization/settings/${form.values.orgId}/payment-method`);
    };

    return (
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
          data-cy="create-entity-input-title"
          autoFocus
        />
        <CreateEntityError>{form.errors?.title}</CreateEntityError>

        <PlateRichEditor
          inputValue={form.values.description}
          mentionables={filterOrgUsersForAutocomplete(orgUsersData)}
          onChange={(value) => {
            form.setFieldValue('description', value);
          }}
          mediaUploads={() => {
            ref.current.click();
          }}
          placeholder="Type ‘/’ for commands"
        />

        {form.errors?.description && <ErrorText>{form.errors?.description}</ErrorText>}
        <CreateEntityLabelSelectWrapper show>
          <MediaUpload
            ref={ref}
            mediaUploads={form.values.mediaUploads}
            setMediaUploadsValue={(mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads)}
            existingTaskId={existingTask?.id}
            isProposal={isProposal}
            isMilestone={entityType === ENTITIES_TYPES.MILESTONE}
            fileUploadLoading={fileUploadLoading}
            handleMedia={handleMedia}
            setFileUploadLoading={setFileUploadLoading}
          />
          {existingTask && canTurnIntoBounty && (
            <>
              <div
                style={{
                  flex: 1,
                }}
              />
              <CreateEntityAttachment
                style={{
                  marginLeft: '16px',
                  alignSelf: 'flex-start',
                }}
                onClick={() => {
                  setTurnTaskToBountyModal(true);
                }}
              >
                Turn into bounty
              </CreateEntityAttachment>
            </>
          )}
        </CreateEntityLabelSelectWrapper>
        <CreateEntityDivider />
        {isProposal && !existingTask && form?.values?.proposalVoteType && (
          <>
            <ProposalVoteSelect value={form?.values?.proposalVoteType} label="Select voting style">
              {proposalChoices.map((option) => (
                <ProposalVoteSelectMenuItem
                  value={option?.value}
                  onClick={() => form.setFieldValue('proposalVoteType', option?.value)}
                >
                  <ProposalVoteSelectMenuItemText>{option?.label}</ProposalVoteSelectMenuItemText>
                </ProposalVoteSelectMenuItem>
              ))}
            </ProposalVoteSelect>
            {form?.values?.proposalVoteType === PROPOSAL_VOTE_CHOICES.CUSTOM && <CustomProposal form={form} />}
            <ProposalVoteSelectMenuItemText
              style={{
                marginTop: '8px',
                fontSize: '12px',
              }}
            >
              P.S In 'Multiple Choice' voting, options cannot be edited after the proposal is created
            </ProposalVoteSelectMenuItemText>
            <CreateEntityDivider />
          </>
        )}
        <Reviewer
          entityType={entityType}
          reviewerIds={form.values.reviewerIds}
          setFieldError={(err) => form.setFieldError('reviewerIds', err)}
          setFieldValue={(value) => form.setFieldValue('reviewerIds', value)}
          errors={form.errors}
          orgId={form.values.orgId}
          podId={form.values.podId}
        />
        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.assignee)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Assignee</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values.assigneeId !== null && (
              <CreateEntitySelectErrorWrapper>
                <CreateEntityAutocompletePopper
                  onFocus={() => form.setFieldError('assigneeId', undefined)}
                  openOnFocus
                  ListboxComponent={ListBox}
                  ListboxProps={{
                    handleFetchMore: fetchMoreOrgUsers,
                    hasMore: hasMoreOrgUsers,
                  }}
                  data-cy="input-autocomplete-assignee"
                  options={filteredOrgUsersData}
                  value={form.values.assigneeId}
                  isOptionEqualToValue={(option, value) => option.value === value}
                  renderInput={(params) => {
                    const assignee: any = filteredOrgUsersData.find(
                      (user: any) => user.value === params.inputProps.value
                    );
                    return (
                      <CreateEntityAutocompletePopperRenderInput
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          value: assignee?.label,
                        }}
                        onChange={(e) => {
                          params.inputProps.onChange(e);
                          search(e.target.value);
                        }}
                        autoFocus={!form.values.assigneeId}
                        ref={params.InputProps.ref}
                        disableUnderline
                        fullWidth
                        placeholder="Enter username..."
                        startAdornment={
                          <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                            {assignee?.profilePicture ? (
                              <SafeImage useNextImage={false} src={assignee.profilePicture} alt="Profile picture" />
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
                  renderOption={(props, option) => (
                    <CreateEntityAutocompleteOption {...props} data-cy={`assignee-option-${option.label}`}>
                      {option?.profilePicture ? (
                        <SafeImage useNextImage={false} src={option?.profilePicture} alt="Profile picture" />
                      ) : (
                        <CreateEntityDefaultUserImage />
                      )}
                      <CreateEntityAutocompleteOptionTypography>
                        {option?.label}
                      </CreateEntityAutocompleteOptionTypography>
                    </CreateEntityAutocompleteOption>
                  )}
                  onChange={(event, value, reason) => {
                    if (reason === 'selectOption') {
                      form.setFieldValue('assigneeId', value.value);
                    }
                  }}
                  blurOnSelect
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
                data-cy="button-add-assignee"
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>
        <ApplicationsInput
          entityType={entityType}
          roles={roles}
          claimPolicy={form.values.claimPolicy}
          claimPolicyRoles={form.values.claimPolicyRoles}
          setFieldValue={(value) => form.setFieldValue('claimPolicy', value)}
          setRolesFieldValue={(value) => form.setFieldValue('claimPolicyRoles', value)}
          setUnclaimFieldValue={(value) => form.setFieldValue('shouldUnclaimOnDueDateExpiry', value)}
          touched={form.touched.claimPolicy}
          shouldUnclaimOnDueDateExpiry={form.values.shouldUnclaimOnDueDateExpiry}
        />
        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.dueDate)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Due Date</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.dueDate !== null && (
              <CreateEntityDueDate
                autoFocus={!form.values.dueDate}
                setValue={(date) => form.setFieldValue('dueDate', date)}
                setRecurrenceType={setRecurrenceType}
                setRecurrenceValue={setRecurrenceValue}
                hideRecurring={false}
                handleClose={() => {
                  form.setFieldValue('dueDate', null);
                  setRecurrenceType(null);
                  setRecurrenceValue(null);
                }}
                value={form.values.dueDate}
                recurrenceType={recurrenceType}
                recurrenceValue={recurrenceValue}
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
            {form.values.rewards?.length > 0 &&
              // this check is to only show the field when there exist a reward with paymethod not active, otherwise just hide
              (activePaymentMethods?.length > 0 || form.values?.rewards?.[0]?.paymentMethodId) && (
                <CreateEntityWrapper>
                  <CreateEntityPaymentMethodSelect
                    name="rewards-payment-method"
                    value={form.values?.rewards?.[0]?.paymentMethodId}
                    onChange={(value) => {
                      form.setFieldValue('rewards', [{ ...form.values?.rewards?.[0], paymentMethodId: value }]);
                    }}
                    renderValue={(selectedItem) => {
                      if (!selectedItem?.label?.props) return null;
                      return (
                        <CreateEntityPaymentMethodSelected>
                          <CreateEntityPaymentMethodItem {...selectedItem.label.props} />
                          <CreateEntitySelectArrowIcon />
                        </CreateEntityPaymentMethodSelected>
                      );
                    }}
                  >
                    {activePaymentMethods.map(({ symbol, icon, id, chain }) => (
                      <CreateEntityPaymentMethodOption key={id} value={id}>
                        <CreateEntityPaymentMethodItem icon={icon} symbol={symbol} chain={chain} />
                      </CreateEntityPaymentMethodOption>
                    ))}
                  </CreateEntityPaymentMethodSelect>
                  <CreateEntityTextfield
                    autoComplete="off"
                    autoFocus={!form.values.rewards?.[0]?.rewardAmount}
                    name="rewards"
                    onChange={handleRewardOnChange(form)}
                    placeholder="Enter rewards..."
                    value={form.values?.rewards?.[0]?.rewardAmount}
                    fullWidth
                    InputProps={{
                      inputComponent: CreateEntityTextfieldInputRewardComponent,
                      endAdornment: (
                        <CreateEntityAutocompletePopperRenderInputAdornment
                          position="end"
                          onClick={() => {
                            form.setFieldValue('rewards', []);
                          }}
                        >
                          <CreateEntityAutocompletePopperRenderInputIcon />
                        </CreateEntityAutocompletePopperRenderInputAdornment>
                      ),
                    }}
                    error={form.errors?.rewards?.[0]?.rewardAmount}
                    onFocus={() => form.setFieldError('rewards', undefined)}
                  />
                </CreateEntityWrapper>
              )}
            {paymentMethodInactiveError && (
              <ErrorText>
                Payment method {`${selectedPaymentMethod?.[0]?.symbol} ${selectedPaymentMethod?.[0]?.chain}`} is
                deactivated
              </ErrorText>
            )}{' '}
            {form.values.rewards?.length > 0 && activePaymentMethods?.length === 0 && (
              // this is the case when no reward is currently attached and no payment method was created
              <StyledLink onClick={handlePaymentMethodRedirect} style={{ cursor: 'pointer' }}>
                {' '}
                Set up payment method
              </StyledLink>
            )}
            {form.touched.rewards && form.errors?.rewards?.[0]?.rewardAmount && (
              <CreateEntityError>{form.errors?.rewards?.[0]?.rewardAmount}</CreateEntityError>
            )}
            {form.values.rewards?.length === 0 && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('rewards', [{ rewardAmount: '', paymentMethodId: activePaymentMethods?.[0]?.id }]);
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
                  autoFocus={!form.values.points}
                  name="points"
                  onChange={form.handleChange('points')}
                  fullWidth
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

        <CreateEntityLabelSelectWrapper
          show={entityTypeData[entityType].fields.includes(Fields.milestone) && !isSubtask}
        >
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Milestone</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values.milestoneId !== null && (
              <CreateEntityWrapper>
                <MilestoneSearch
                  autoFocus={!form.values?.milestoneId}
                  options={filterUserOptions(milestonesData)}
                  value={form.values.milestoneId}
                  onChange={(milestoneId) => {
                    form.setFieldValue('milestoneId', milestoneId);
                  }}
                  handleClose={() => {
                    form.setFieldValue('milestoneId', null);
                  }}
                  formValues={form.values}
                  disabled={formValues?.milestoneId || isSubtask}
                />
              </CreateEntityWrapper>
            )}
            {form.values.milestoneId === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('milestoneId', undefined);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
            {form?.errors?.milestoneId && <ErrorText>{form?.errors?.milestoneId}</ErrorText>}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.priority)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Priority</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.priority === null ? (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('priority', PRIORITIES[1].value);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            ) : (
              <TaskPriorityToggleButton value={form.values.priority} setValue={form.setFieldValue} />
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.categories)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Category</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.categories !== null && (
              <DropdownSearch
                autoFocus={form?.values?.categories?.length === 0}
                label="Select Category"
                searchPlaceholder="Search categories"
                options={categoriesData}
                value={filterCategoryValues(form.values.categories)}
                onChange={(categories) => {
                  form.setFieldValue('categories', [...categories]);
                }}
                disabled={formValues?.categories}
                onClose={() => {}}
              />
            )}
            {form.values.categories == null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('categories', []);
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
                autoFocus={!form.values.labelIds?.length}
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
        <GithubIssues existingTask={existingTask} form={form} entityType={entityType} />
        <CreateEntityDivider />
        <Templates
          form={form}
          pods={pods}
          isMilestone={isMilestone}
          entityType={entityType}
          fetchedUserPermissionsContext={fetchedUserPermissionsContext}
          handlePodChange={handlePodChange}
          formValues={formValues}
          paymentMethods={paymentMethods}
          isBounty={isBounty}
        />
      </CreateEntityBody>
    );
  }
);

export default FormBody;
