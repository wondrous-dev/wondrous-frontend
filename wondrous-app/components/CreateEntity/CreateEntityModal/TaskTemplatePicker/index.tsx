import { useLazyQuery } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import { ActionButton } from 'components/Common/Task/styles';
import { RichTextViewer } from 'components/RichText';
import { TokenGatingTextfieldInput } from 'components/Settings/TokenGating/styles';
import { GET_ORG_TASK_TEMPLATES, GET_TASK_TEMPLATES_BY_USER_ID } from 'graphql/queries';
import { useEffect, useState } from 'react';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityTextfieldInputTemplate,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { MODAL_ACTIONS } from 'utils/constants';
import Typography from '@mui/material/Typography';
import {
  CreateEntityDefaultDaoImage,
  PodSearchLabel,
  PodSearchListItem,
  TaskTemplateActionPopper,
  TaskTemplateArrowIcon,
  TaskTemplateBorderLine,
  TaskTemplateCancelButton,
  TaskTemplateClickAway,
  TaskTemplateCloseIcon,
  TaskTemplateContainer,
  TaskTemplateDefaultPopper,
  TaskTemplateDeleteIcon,
  TaskTemplateEthereumIcon,
  TaskTemplateIcon,
  TaskTemplateLabel,
  TaskTemplateLabelValue,
  TaskTemplateLabelWrapper,
  TaskTemplateListItems,
  TaskTemplateModal,
  TaskTemplateOptionsLabel,
  TaskTemplatePointsValue,
  TaskTemplateRewardBox,
  TaskTemplateRewardContainer,
  TaskTemplateRewardValue,
  TaskTemplateSaveTopContainer,
  TaskTemplateSpecificTitleBar,
  TaskTemplateTitle,
  TaskTemplateTitleBar,
  TaskTemplateActionContainer,
} from './styles';
import TemplateEllipsesIcon from './TemplateEllipsesIcon';

function TaskTemplatePicker(props) {
  const {
    options,
    onChange,
    value,
    disabled,
    handleSubmitTemplate,
    paymentMethods,
    handleSaveTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [optionAnchorEl, setOptionAnchorEl] = useState(null);
  const [usedTemplate, setUsedTemplate] = useState(null);
  const [templateValue, setTemplateValue] = useState('');

  const user = useMe();
  const handleEllipsesClick = (event) => setOptionAnchorEl(optionAnchorEl ? null : event.currentTarget);
  const [saveOrOpen, setSaveOrOpen] = useState(MODAL_ACTIONS.NONE);
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const handleClickAway = () => {
    setAnchorEl(null);
    setSaveOrOpen(MODAL_ACTIONS.NONE);
  };
  const open = Boolean(anchorEl);
  const templateOptionsOpen = Boolean(optionAnchorEl);
  const [templates, setTemplates] = useState([]);

  const [getTaskTemplates, { data, loading }] = useLazyQuery(GET_ORG_TASK_TEMPLATES, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (value) {
      getTaskTemplates({
        variables: {
          orgId: value,
        },
      });
    }
  }, [value]);

  const handlePressEditTemplate = (templateId) => {
    handleEditTemplate(templateId);
  };

  const handlePressDeleteTemplate = (templateId) => {
    handleDeleteTemplate(templateId);
  };
  function TaskTemplateOpen() {
    return (
      <TaskTemplateActionPopper
        open={open}
        anchorEl={anchorEl}
        placement="top-start"
        disablePortal
        style={sizingForPopperContainer()}
      >
        <TaskTemplateTitleBar>
          <TaskTemplateTitle>Templates</TaskTemplateTitle>
          <TaskTemplateCloseIcon
            color="#FFFFFF"
            onClick={() => {
              setAnchorEl(false);
              setSaveOrOpen(MODAL_ACTIONS.NONE);
            }}
          />
        </TaskTemplateTitleBar>
        {loading ? (
          <TaskTemplateLabelValue>loading!</TaskTemplateLabelValue>
        ) : data?.getOrgTaskTemplates.length > 0 ? (
          data?.getOrgTaskTemplates.map((template, index) => (
            <TaskTemplateContainer
              onClick={() => {
                handleSubmitTemplate(template);
                setUsedTemplate(template);
                setAnchorEl(false);
              }}
              key={index}
            >
              <TaskTemplateSpecificTitleBar>
                <PodSearchListItem>
                  <TaskTemplateIcon color={template?.color} />
                  <PodSearchLabel>{template?.name}</PodSearchLabel>
                </PodSearchListItem>
                <TemplateEllipsesIcon
                  templateId={template?.id}
                  handleEditTemplate={handlePressEditTemplate}
                  handleDeleteTemplate={handlePressDeleteTemplate}
                />
              </TaskTemplateSpecificTitleBar>
              <TaskTemplateBorderLine />

              <TaskTemplateListItems>
                <TaskTemplateLabelValue style={{ fontWeight: '500', color: '#FFFFFF' }}>
                  {template?.title}
                </TaskTemplateLabelValue>
                <TaskTemplateLabelValue style={{ fontWeight: '400', color: '#FFFFFF' }} as="div">
                  <RichTextViewer text={template?.description} />
                </TaskTemplateLabelValue>

                {/* 
  
                    Just in case we want to add reviewer and assignee later on:
  
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                      <TaskTemplateLabelValue>{`Reviewer(s): `}</TaskTemplateLabelValue>
                      {template?.reviewer?.map((reviewer, index) => {
                        if (index < template.reviewer.length - 1) {
                          return <TaskTemplateReviewerValue>{`${reviewer.label}, `}</TaskTemplateReviewerValue>;
                        } else {
                          return <TaskTemplateReviewerValue>{`${reviewer.label}`}</TaskTemplateReviewerValue>;
                        }
                      })}
                    </Grid>
                    <TaskTemplateLabelValue>{`Assignee: ${template?.assignee?.label}`}</TaskTemplateLabelValue> 
                    
                    */}

                <TaskTemplateRewardContainer>
                  {template?.rewards?.[0] ? (
                    <TaskTemplateRewardBox>
                      <TaskTemplateEthereumIcon />
                      <TaskTemplateRewardValue>
                        {template?.rewards?.[0]?.rewardAmount}{' '}
                        {getPaymentMethodData(template?.rewards?.[0]?.paymentMethodId)?.symbol}
                      </TaskTemplateRewardValue>
                    </TaskTemplateRewardBox>
                  ) : null}
                  {template?.points ? (
                    <TaskTemplateRewardBox>
                      <CreateEntityDefaultDaoImage onClick={handleEllipsesClick} />

                      <TaskTemplatePointsValue>{template?.points} points</TaskTemplatePointsValue>
                    </TaskTemplateRewardBox>
                  ) : null}
                </TaskTemplateRewardContainer>
              </TaskTemplateListItems>
            </TaskTemplateContainer>
          ))
        ) : (
          <TaskTemplateLabelValue
            style={{
              fontSize: '15px',
            }}
          >
            No templates yet!
          </TaskTemplateLabelValue>
        )}
      </TaskTemplateActionPopper>
    );
  }

  const renderContainer = () => {
    if (saveOrOpen === MODAL_ACTIONS.OPEN) {
      return <TaskTemplateOpen />;
    }
    return (
      <TaskTemplateDefaultPopper
        open={open}
        anchorEl={anchorEl}
        placement="top-start"
        disablePortal
        style={sizingForPopperContainer()}
      >
        <TaskTemplateOptionsLabel
          onClick={() => {
            setSaveOrOpen(MODAL_ACTIONS.SAVE);
          }}
        >
          Save new template
        </TaskTemplateOptionsLabel>
        <TaskTemplateOptionsLabel
          onClick={() => {
            setSaveOrOpen(MODAL_ACTIONS.OPEN);
          }}
        >
          Open existing template
        </TaskTemplateOptionsLabel>
      </TaskTemplateDefaultPopper>
    );
  };

  const sizingForPopperContainer = () => {
    if (saveOrOpen === MODAL_ACTIONS.SAVE) {
      return { width: 500, padding: '0px' };
    }
    if (saveOrOpen === MODAL_ACTIONS.OPEN) {
      return { height: 600, width: 500, padding: '24px' };
    }
    return null;
  };

  const getPaymentMethodData = (id) => paymentMethods.find((payment) => payment.id === id);

  const labels = ['title', 'description', 'reward', 'assignee'];
  return (
    <TaskTemplateClickAway onClickAway={handleClickAway}>
      <div>
        <TaskTemplateModal open={open} disabled={!options || disabled} onClick={handleClick}>
          <TaskTemplateLabelWrapper>
            {usedTemplate ? <TaskTemplateIcon color="474747" /> : null}
            <TaskTemplateLabel>{usedTemplate?.name ?? `Select Template`}</TaskTemplateLabel>
          </TaskTemplateLabelWrapper>
          {usedTemplate ? (
            <TaskTemplateDeleteIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUsedTemplate(null);
              }}
            />
          ) : (
            <TaskTemplateArrowIcon />
          )}
        </TaskTemplateModal>

        {saveOrOpen === MODAL_ACTIONS.SAVE ? (
          <TaskTemplateDefaultPopper
            open={open}
            anchorEl={anchorEl}
            placement="top-start"
            disablePortal
            style={sizingForPopperContainer()}
          >
            <TaskTemplateSaveTopContainer>
              <TaskTemplateTitleBar style={{ marginBottom: '18px' }}>
                <TaskTemplateTitle>Save as preset?</TaskTemplateTitle>
                <TaskTemplateCloseIcon
                  color="#FFFFFF"
                  onClick={() => {
                    setAnchorEl(false);
                    setSaveOrOpen('none');
                  }}
                />
              </TaskTemplateTitleBar>
              <TaskTemplateLabelValue style={{ marginBottom: '18px' }}>
                This will appear on the org's template lists. It will only be visible to members of the organization.
              </TaskTemplateLabelValue>
              <TokenGatingTextfieldInput
                autoComplete="off"
                name="rewards"
                onChange={(e) => {
                  setTemplateValue(e.target.value);
                }}
                placeholder="Enter name for template"
                value={templateValue}
                fullWidth
                InputProps={{
                  inputComponent: CreateEntityTextfieldInputTemplate,
                  endAdornment: (
                    <CreateEntityAutocompletePopperRenderInputAdornment
                      position="end"
                      onClick={() => {
                        setTemplateValue(null);
                      }}
                    >
                      <CreateEntityAutocompletePopperRenderInputIcon />
                    </CreateEntityAutocompletePopperRenderInputAdornment>
                  ),
                }}
              />
            </TaskTemplateSaveTopContainer>

            <TaskTemplateActionContainer>
              <TaskTemplateCancelButton
                onClick={() => {
                  setSaveOrOpen(MODAL_ACTIONS.NONE);
                }}
              >
                Cancel
              </TaskTemplateCancelButton>

              <ActionButton
                style={{ padding: '8px 30px 8px 30px' }}
                onClick={() => {
                  handleSaveTemplate(templateValue);
                  setSaveOrOpen(MODAL_ACTIONS.OPEN);
                }}
              >
                Save
              </ActionButton>
            </TaskTemplateActionContainer>
          </TaskTemplateDefaultPopper>
        ) : (
          renderContainer()
        )}
      </div>
    </TaskTemplateClickAway>
  );
}

export default TaskTemplatePicker;
