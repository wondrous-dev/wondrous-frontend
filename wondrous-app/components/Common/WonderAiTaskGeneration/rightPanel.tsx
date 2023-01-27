import { useEffect, useMemo, useRef, useState } from 'react';
import RobotHand from 'components/Common/WonderAiTaskGeneration/images/robot-hand.svg';
import SmallRobotIcon from 'components/Common/WonderAiTaskGeneration/images/small-robot-icon.svg';
import {
  ApplicationInputUnassignContainer,
  ApplicationInputWrapper,
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  CreateEntityApplicationsSelectRender,
  CreateEntityAutocompleteOption,
  CreateEntityAutocompleteOptionTypography,
  CreateEntityAutocompletePopper,
  CreateEntityAutocompletePopperRenderInput,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityBody,
  CreateEntityDefaultUserImage,
  CreateEntityDueDate,
  CreateEntityError,
  CreateEntityForm,
  CreateEntityLabel,
  CreateEntityLabelAddButton,
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
  CreateEntityOption,
  CreateEntityOptionLabel,
  CreateEntityPaymentMethodOption,
  CreateEntityPaymentMethodSelect,
  CreateEntityPaymentMethodSelected,
  CreateEntitySelect,
  CreateEntitySelectArrowIcon,
  CreateEntitySelectErrorWrapper,
  CreateEntitySelectWrapper,
  CreateEntityTextfield,
  CreateEntityTitle,
  CreateEntityWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import {} from 'components/Common/WonderAiTaskGeneration/styles';
import { useMutation, useQuery } from '@apollo/client';
import { GENERATE_GPT_TASKS } from 'graphql/mutations';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { Checkbox, CircularProgress, Tooltip } from '@mui/material';
import palette from 'theme/palette';
import { APPLICATION_POLICY, APPLICATION_POLICY_LABELS_MAP, ENTITIES_TYPES, PRIORITIES } from 'utils/constants';
import { RichTextEditor, useEditor } from 'components/RichText';
import { useFormik } from 'formik';
import {
  CreateEntityPaymentMethodItem,
  CreateEntityTextfieldInputPointsComponent,
  CreateEntityTextfieldInputRewardComponent,
  Fields,
  entityTypeData,
  filterCategoryValues,
  filterPaymentMethods,
  formValidationSchema,
  handleRewardOnChange,
  initialValues,
  useCreateLabel,
  useGetAvailableUserPods,
  useGetCategories,
  useGetEligibleReviewers,
  useGetOrgLabels,
  useGetOrgRoles,
  useGetOrgUsers,
  useGetPaymentMethods,
  filterOrgUsers,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import moment from 'moment';
import { cloneDeep, isEmpty, isNull } from 'lodash';
import { useRouter } from 'next/router';
import { EditorContainer, EditorPlaceholder, EditorToolbar } from 'components/CreateEntity/styles';
import { ReactEditor } from 'slate-react';
import { Editor, Transforms } from 'slate';
import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreatePodModal';
import { SafeImage } from 'components/Common/Image';
import ListBox from 'components/CreateCollaborationModal/Steps/AddTeamMembers/Listbox';
import { StyledChipTag } from 'components/Tags/styles';
import { ErrorText } from 'components/Common';
import { StyledLink } from 'components/TextLink/TextLinkStyles';
import TaskPriorityToggleButton from 'components/Common/TaskPriorityToggleButton';
import DropdownSearch from 'components/DropdownSearch';
import Tags from 'components/Tags';

const RightPanel = (props) => {
  const { entityType, setField, orgId, podId, existingTask, errors, setErrors, editor } = props;
  const router = useRouter();

  const [paymentMethodInactiveError, setPaymentMethodInactiveError] = useState(false);

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });

  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();

  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const { data: orgUsersData, search, hasMoreOrgUsers, fetchMoreOrgUsers } = useGetOrgUsers(orgId);
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated
  const filteredOrgUsersData = filterOrgUsers({ orgUsersData, existingTask });
  const orgLabelsData = useGetOrgLabels(orgId);
  const handleCreateLabel = useCreateLabel(orgId, (newLabelId) => {
    if (existingTask?.labelIds) {
      setField('labelIds', [...existingTask?.labelIds, newLabelId]);
    } else {
      setField('labelIds', [newLabelId]);
    }
  });

  const categoriesData = useGetCategories();
  const roles = useGetOrgRoles(orgId);

  const eligibleReviewers = useGetEligibleReviewers(orgId, podId);
  const filteredEligibleReviewers = eligibleReviewers.filter((reviewer) => {
    if (existingTask?.reviewerIds) {
      return !existingTask.reviewerIds.includes(reviewer.id);
    }
    return true;
  });

  useEffect(() => {
    if (existingTask?.recurrenceType && !existingTask?.dueDate) {
      setField('dueDate', moment().toDate());
    }
  }, [existingTask?.dueDate, existingTask?.recurrenceType]);

  const getRoleDataById = (id) => roles?.find((role) => role.id === id);

  const selectedPaymentMethod = paymentMethods.filter((p) => p.id === existingTask?.rewards?.[0]?.paymentMethodId);

  useEffect(() => {
    if (selectedPaymentMethod?.length > 0) {
      setPaymentMethodInactiveError(false);
      if (selectedPaymentMethod?.[0]?.deactivatedAt) {
        setPaymentMethodInactiveError(true);
      }
    }
  }, [selectedPaymentMethod]);

  const handlePaymentMethodRedirect = () => {
    router.push(`/organization/settings/${orgId}/payment-method`);
  };

  return (
    <CreateEntityForm fullScreen={false}>
      <CreateEntityBody>
        <CreateEntityTitle
          type="text"
          onChange={(event) => setField('title', event.target.value)}
          value={existingTask?.title}
          name="title"
          placeholder="Enter a title"
          minRows={1}
          maxRows={3}
          error={errors?.title}
          onFocus={() => setErrors('title', undefined)}
          data-cy="create-entity-input-title"
          autoFocus
        />

        <EditorToolbar ref={setEditorToolbarNode} />
        <EditorContainer
          onClick={() => {
            // since editor will collapse to 1 row on input, we need to emulate min-height somehow
            // to achive it, we wrap it with EditorContainer and make it switch focus to editor on click
            ReactEditor.focus(editor);
            // also we need to move cursor to the last position in the editor
            Transforms.select(editor, {
              anchor: Editor.end(editor, []),
              focus: Editor.end(editor, []),
            });
          }}
        >
          <RichTextEditor
            editor={editor}
            onMentionChange={search}
            initialValue={existingTask?.description}
            mentionables={filterOrgUsersForAutocomplete(orgUsersData)}
            placeholder={<EditorPlaceholder>Enter a description</EditorPlaceholder>}
            toolbarNode={editorToolbarNode}
            onChange={(value) => {
              setField('description', value);
            }}
            editorContainerNode={document.querySelector('#modal-scrolling-container')}
            onClick={(e) => {
              // we need to stop click event propagation,
              // since EditorContainer moves cursor to the last position in the editor on click
              e.stopPropagation();
            }}
          />
        </EditorContainer>
        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.reviewer)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Reviewer</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {existingTask.reviewerIds?.map((reviewerId, index) => {
              const hasError = errors?.reviewerIds?.[index];
              return (
                <CreateEntitySelectErrorWrapper key={index}>
                  <CreateEntityAutocompletePopper
                    onFocus={() => setErrors('reviewerIds', undefined)}
                    openOnFocus
                    options={eligibleReviewers}
                    value={reviewerId}
                    isOptionEqualToValue={(option, value) => option.id === value}
                    renderInput={(params) => {
                      const reviewer = eligibleReviewers.find((reviewer) => reviewer.id === params.inputProps.value);
                      const shouldAutoFocus = existingTask?.reviewerIds?.filter((id) => id === null)?.length > 0;
                      return (
                        <CreateEntityAutocompletePopperRenderInput
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            value: reviewer?.label,
                          }}
                          autoFocus={shouldAutoFocus}
                          ref={params.InputProps.ref}
                          disableUnderline
                          fullWidth
                          placeholder="Enter username..."
                          startAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                              {reviewer?.profilePicture ? (
                                <SafeImage useNextImage={false} src={reviewer.profilePicture} alt="Profile picture" />
                              ) : (
                                <CreateEntityDefaultUserImage />
                              )}
                            </CreateEntityAutocompletePopperRenderInputAdornment>
                          }
                          endAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment
                              position="end"
                              onClick={() => {
                                const newReviewers = cloneDeep(existingTask?.reviewerIds).filter(
                                  (id, i) => i !== index
                                );
                                setField('reviewerIds', newReviewers);
                              }}
                            >
                              <CreateEntityAutocompletePopperRenderInputIcon />
                            </CreateEntityAutocompletePopperRenderInputAdornment>
                          }
                        />
                      );
                    }}
                    renderOption={(props, option) => {
                      if (existingTask?.reviewerIds.includes(option.id) && option.id !== reviewerId) return null;
                      return (
                        <CreateEntityAutocompleteOption {...props}>
                          {option?.profilePicture ? (
                            <SafeImage useNextImage={false} src={option?.profilePicture} alt="Profile picture" />
                          ) : (
                            <CreateEntityDefaultUserImage />
                          )}
                          <CreateEntityAutocompleteOptionTypography>
                            {option?.label}
                          </CreateEntityAutocompleteOptionTypography>
                        </CreateEntityAutocompleteOption>
                      );
                    }}
                    onChange={(event, value, reason) => {
                      if (reason === 'selectOption' && !existingTask?.reviewerIds.includes(value.id)) {
                        const reviewerIds = cloneDeep(existingTask?.reviewerIds);
                        reviewerIds[index] = value.id;
                        setField('reviewerIds', reviewerIds);
                      }
                    }}
                    blurOnSelect
                    error={hasError}
                  />
                  {hasError && <CreateEntityError>{hasError}</CreateEntityError>}
                </CreateEntitySelectErrorWrapper>
              );
            })}
            <Tooltip
              title={isEmpty(filteredEligibleReviewers) && 'You reached the maximum no. of available reviewers'}
              placement="top"
            >
              <CreateEntityLabelAddButton
                onClick={() => {
                  if (isEmpty(filteredEligibleReviewers)) return;
                  if (!existingTask?.reviewerIds) {
                    setField('reviewerIds', [null]);
                    return;
                  }
                  setField('reviewerIds', existingTask?.reviewerIds.concat(null));
                }}
              >
                <CreateEntityAddButtonIcon />
                {(isNull(existingTask?.reviewerIds) || isEmpty(existingTask?.reviewerIds)) && (
                  <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
                )}
              </CreateEntityLabelAddButton>
            </Tooltip>
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.assignee)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Assignee</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {existingTask?.assigneeId !== null && (
              <CreateEntitySelectErrorWrapper>
                <CreateEntityAutocompletePopper
                  onFocus={() => setErrors('assigneeId', undefined)}
                  openOnFocus
                  ListboxComponent={ListBox}
                  ListboxProps={{
                    handleFetchMore: fetchMoreOrgUsers,
                    hasMore: hasMoreOrgUsers,
                  }}
                  data-cy="input-autocomplete-assignee"
                  options={filteredOrgUsersData}
                  value={existingTask?.assigneeId}
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
                        autoFocus={!existingTask?.assigneeId}
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
                              setField('assigneeId', null);
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
                      setField('assigneeId', value.value);
                    }
                  }}
                  blurOnSelect
                  error={errors?.assigneeId}
                />
                {errors?.assigneeId && <CreateEntityError>{errors?.assigneeId}</CreateEntityError>}
              </CreateEntitySelectErrorWrapper>
            )}
            {existingTask?.assigneeId === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  setField('assigneeId', '');
                }}
                data-cy="button-add-assignee"
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>
        <ApplicationInputWrapper>
          <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.claimPolicy)}>
            <CreateEntityLabelWrapper>
              <CreateEntityLabel>Applications</CreateEntityLabel>
            </CreateEntityLabelWrapper>
            <CreateEntitySelectWrapper style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
              {existingTask?.claimPolicy !== null && (
                <CreateEntityWrapper>
                  <CreateEntitySelect
                    name="task-applications"
                    value={existingTask?.claimPolicy}
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      setField('claimPolicy', value);
                      if (
                        value === APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM.value ||
                        value === APPLICATION_POLICY.ROLES_CAN_CAN_APPLY.value
                      )
                        setField('claimPolicyRoles', [roles[0]?.id]);
                    }}
                    renderValue={() => {
                      const isRolesSelected =
                        existingTask?.claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM.value ||
                        existingTask?.claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_APPLY.value;
                      return (
                        <CreateEntityApplicationsSelectRender>
                          <span>
                            {isRolesSelected
                              ? 'Role: '
                              : APPLICATION_POLICY_LABELS_MAP[existingTask?.claimPolicy]?.title}
                          </span>
                          <CreateEntitySelectArrowIcon />
                        </CreateEntityApplicationsSelectRender>
                      );
                    }}
                  >
                    {Object.keys(APPLICATION_POLICY).map((policy, idx) => {
                      const appPolicy = APPLICATION_POLICY[policy];
                      return (
                        <CreateEntityOption key={idx} value={appPolicy?.value}>
                          <CreateEntityOptionLabel>{appPolicy?.title}</CreateEntityOptionLabel>
                        </CreateEntityOption>
                      );
                    })}
                  </CreateEntitySelect>
                  {(existingTask?.claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM.value ||
                    existingTask?.claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_APPLY.value) && (
                    <CreateEntitySelect
                      name="task-applications-claim-roles"
                      value={existingTask?.claimPolicyRoles}
                      style={{ width: '100%', height: 'fit-content' }}
                      onChange={(value) =>
                        setField(
                          'claimPolicyRoles',
                          existingTask?.claimPolicyRoles ? [...existingTask?.claimPolicyRoles, value] : [value]
                        )
                      }
                      renderValue={() => (
                        <CreateEntityApplicationsSelectRender>
                          {existingTask?.claimPolicyRoles?.map((role) => {
                            const roleData = getRoleDataById(role);
                            return (
                              <StyledChipTag
                                key={role}
                                style={{ margin: '2px' }}
                                deleteIcon={<div>&times;</div>}
                                onClick={() =>
                                  setField(
                                    'claimPolicyRoles',
                                    existingTask?.claimPolicyRoles?.filter((claimRole) => claimRole !== role)
                                  )
                                }
                                label={roleData?.name}
                                // background={option.color}
                                variant="outlined"
                              />
                            );
                          })}
                          <CreateEntitySelectArrowIcon />
                        </CreateEntityApplicationsSelectRender>
                      )}
                    >
                      {roles?.map((role, roleIdx) => {
                        if (existingTask?.claimPolicyRoles?.includes(role.id)) return null;
                        return (
                          <CreateEntityOption key={roleIdx} value={role.id}>
                            <CreateEntityOptionLabel>{role?.name}</CreateEntityOptionLabel>
                          </CreateEntityOption>
                        );
                      })}
                    </CreateEntitySelect>
                  )}
                </CreateEntityWrapper>
              )}
              {existingTask?.claimPolicy !== null && (
                <CreateEntityAutocompletePopperRenderInputAdornment
                  position="end"
                  onClick={() => {
                    setField('claimPolicy', null);
                    setField('claimPolicyRoles', null);
                    setField('shouldUnclaimOnDueDateExpiry', null);
                  }}
                >
                  <CreateEntityAutocompletePopperRenderInputIcon />
                </CreateEntityAutocompletePopperRenderInputAdornment>
              )}
              {existingTask?.claimPolicy === null && (
                <CreateEntityLabelAddButton
                  onClick={() => {
                    setField('claimPolicy', APPLICATION_POLICY.ALL_MEMBERS.value);
                  }}
                >
                  <CreateEntityAddButtonIcon />
                  <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
                </CreateEntityLabelAddButton>
              )}
            </CreateEntitySelectWrapper>
          </CreateEntityLabelSelectWrapper>
          {existingTask?.claimPolicy !== null && entityTypeData[entityType].fields.includes(Fields.claimPolicy) && (
            <ApplicationInputUnassignContainer>
              <Checkbox
                checked={!!existingTask?.shouldUnclaimOnDueDateExpiry}
                onChange={() => setField('shouldUnclaimOnDueDateExpiry', !existingTask?.shouldUnclaimOnDueDateExpiry)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              Remove assignee when due date is passed
            </ApplicationInputUnassignContainer>
          )}
        </ApplicationInputWrapper>
        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.dueDate)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Due Date</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {existingTask?.dueDate !== null && (
              <CreateEntityDueDate
                autoFocus={!existingTask?.dueDate}
                setValue={(date) => setField('dueDate', date)}
                setRecurrenceType={(value) => setField('recurrenceType', value)}
                setRecurrenceValue={(value) => setField('recurrenceValue', value)}
                hideRecurring={false}
                handleClose={() => {
                  setField('dueDate', null);
                  setField('recurrenceType', null);
                  setField('recurrenceValue', null);
                }}
                value={existingTask?.dueDate}
                recurrenceType={existingTask?.recurrenceType}
                recurrenceValue={existingTask?.recurrenceValue}
              />
            )}
            {existingTask?.dueDate === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  setField('dueDate', '');
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
            {existingTask?.rewards?.length > 0 &&
              // this check is to only show the field when there exist a reward with paymethod not active, otherwise just hide
              (activePaymentMethods?.length > 0 || existingTask?.rewards?.[0]?.paymentMethodId) && (
                <CreateEntityWrapper>
                  <CreateEntityPaymentMethodSelect
                    name="rewards-payment-method"
                    value={existingTask?.rewards?.[0]?.paymentMethodId}
                    onChange={(value) => {
                      if (existingTask?.rewards) {
                        setField('rewards', [{ ...existingTask?.rewards?.[0], paymentMethodId: value }]);
                      } else {
                        setField('rewards', [{ paymentMethodId: value }]);
                      }
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
                    autoFocus={!existingTask?.rewards?.[0]?.rewardAmount}
                    name="rewards"
                    onChange={(e) => {
                      const { value } = e.target;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setField('rewards', [{ ...existingTask?.rewards?.[0], rewardAmount: value }]);
                      }
                    }}
                    placeholder="Enter rewards..."
                    value={existingTask?.rewards?.[0]?.rewardAmount}
                    fullWidth
                    InputProps={{
                      inputComponent: CreateEntityTextfieldInputRewardComponent,
                      endAdornment: (
                        <CreateEntityAutocompletePopperRenderInputAdornment
                          position="end"
                          onClick={() => {
                            setField('rewards', []);
                          }}
                        >
                          <CreateEntityAutocompletePopperRenderInputIcon />
                        </CreateEntityAutocompletePopperRenderInputAdornment>
                      ),
                    }}
                    error={errors?.rewards?.[0]?.rewardAmount}
                    onFocus={() => setErrors('rewards', undefined)}
                  />
                </CreateEntityWrapper>
              )}
            {paymentMethodInactiveError && (
              <ErrorText>
                Payment method {`${selectedPaymentMethod?.[0]?.symbol} ${selectedPaymentMethod?.[0]?.chain}`} is
                deactivated
              </ErrorText>
            )}{' '}
            {existingTask?.rewards?.length > 0 && activePaymentMethods?.length === 0 && (
              // this is the case when no reward is currently attached and no payment method was created
              <StyledLink onClick={handlePaymentMethodRedirect} style={{ cursor: 'pointer' }}>
                {' '}
                Set up payment method
              </StyledLink>
            )}
            {errors?.rewards?.[0]?.rewardAmount && (
              <CreateEntityError>{errors?.rewards?.[0]?.rewardAmount}</CreateEntityError>
            )}
            {existingTask?.rewards?.length === 0 && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  setField('rewards', [{ rewardAmount: '', paymentMethodId: activePaymentMethods?.[0]?.id }]);
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
            {existingTask?.points !== null && (
              <>
                <CreateEntityTextfield
                  autoComplete="off"
                  autoFocus={!existingTask?.points}
                  name="points"
                  onChange={(event) => setField('points', event.target.value)}
                  fullWidth
                  value={existingTask?.points}
                  InputProps={{
                    inputComponent: CreateEntityTextfieldInputPointsComponent,
                    endAdornment: (
                      <CreateEntityAutocompletePopperRenderInputAdornment
                        position="end"
                        onClick={() => {
                          setField('points', null);
                        }}
                      >
                        <CreateEntityAutocompletePopperRenderInputIcon />
                      </CreateEntityAutocompletePopperRenderInputAdornment>
                    ),
                  }}
                  error={errors.points}
                  onFocus={() => setErrors('points', undefined)}
                />
                {errors?.points && <CreateEntityError>{errors.points}</CreateEntityError>}
              </>
            )}

            {existingTask?.points === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  setField('points', '');
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.priority)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Priority</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {existingTask?.priority === null ? (
              <CreateEntityLabelAddButton
                onClick={() => {
                  setField('priority', PRIORITIES[1].value);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            ) : (
              <TaskPriorityToggleButton value={existingTask?.priority} setValue={setField} />
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.tags)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Category</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {existingTask?.categories !== null && (
              <DropdownSearch
                autoFocus={existingTask?.categories?.length === 0}
                label="Select Category"
                searchPlaceholder="Search categories"
                options={categoriesData}
                value={filterCategoryValues(existingTask?.categories)}
                onChange={(categories) => {
                  setField('categories', [...categories]);
                }}
                disabled={false}
                onClose={() => {}}
              />
            )}
            {existingTask?.categories == null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  setField('categories', []);
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
            {existingTask?.labelIds !== null && (
              <Tags
                autoFocus={!existingTask?.labelIds?.length}
                options={orgLabelsData || []}
                ids={existingTask?.labelIds}
                onChange={(labelIds) => {
                  setField('labelIds', labelIds);
                }}
                onCreate={handleCreateLabel}
                limit={4}
              />
            )}
            {existingTask?.labelIds === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  setField('labelIds', []);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>
      </CreateEntityBody>
    </CreateEntityForm>
  );
};

export default RightPanel;
