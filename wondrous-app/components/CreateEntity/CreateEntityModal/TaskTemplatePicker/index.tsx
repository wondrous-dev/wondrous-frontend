import { useLazyQuery } from '@apollo/client';
import { ActionButton } from 'components/Common/Task/styles';
import { RichTextViewer } from 'components/RichText';
import { TaskTemplateActionContainer, TokenGatingTextfieldInput } from 'components/Settings/TokenGating/styles';
import { GET_TASK_TEMPLATES_BY_ID } from 'graphql/queries';
import { useEffect, useState } from 'react';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityTextfieldInputTemplate,
} from '../styles';
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
  TaskTemplateSpecificTitleBar,
  TaskTemplateTitle,
  TaskTemplateTitleBar,
} from './styles';
import TemplateEllipsesIcon from './TemplateEllipsesIcon';

const TaskTemplatePicker = (props) => {
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

  const handleEllipsesClick = (event) => setOptionAnchorEl(optionAnchorEl ? null : event.currentTarget);
  const [saveOrOpen, setSaveOrOpen] = useState('none');
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const handleClickAway = () => {
    setAnchorEl(null);
    setSaveOrOpen('none');
  };
  const open = Boolean(anchorEl);
  const templateOptionsOpen = Boolean(optionAnchorEl);
  const [templates, setTemplates] = useState([]);

  const [getTaskTemplates] = useLazyQuery(GET_TASK_TEMPLATES_BY_ID, {
    onCompleted: (data) => {
      setTemplates(data?.getTaskTemplatesById);
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getTaskTemplates({
      variables: {
        userId: '62219612940402689',
      },
    });
  }, []);

  const handlePressEditTemplate = (templateId) => {
    handleEditTemplate(templateId);
  };

  const handlePressDeleteTemplate = (templateId) => {
    handleDeleteTemplate(templateId);
  };
  const TaskTemplateOpen = () => {
    return (
      <TaskTemplateActionPopper
        open={open}
        anchorEl={anchorEl}
        placement="top-start"
        disablePortal={true}
        style={sizingForPopperContainer()}
      >
        <TaskTemplateTitleBar>
          <TaskTemplateTitle>Templates</TaskTemplateTitle>
          <TaskTemplateCloseIcon
            color={'#FFFFFF'}
            onClick={() => {
              setAnchorEl(false);
              setSaveOrOpen('none');
            }}
          />
        </TaskTemplateTitleBar>

        {templates.length > 0 ? (
          templates.map((template, index) => {
            return (
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
                  <TaskTemplateLabelValue style={{ fontWeight: '400', color: '#FFFFFF' }}>
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
            );
          })
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
  };

  const renderContainer = () => {
    switch (saveOrOpen) {
      case 'open':
        return <TaskTemplateOpen />;
      default:
        return (
          <TaskTemplateDefaultPopper
            open={open}
            anchorEl={anchorEl}
            placement="top-start"
            disablePortal={true}
            style={sizingForPopperContainer()}
          >
            <TaskTemplateOptionsLabel
              onClick={() => {
                setSaveOrOpen('save');
              }}
            >
              Save new template
            </TaskTemplateOptionsLabel>
            <TaskTemplateOptionsLabel
              onClick={() => {
                setSaveOrOpen('open');
              }}
            >
              Open existing template
            </TaskTemplateOptionsLabel>
          </TaskTemplateDefaultPopper>
        );
    }
  };

  const sizingForPopperContainer = () => {
    switch (saveOrOpen) {
      case 'save':
        return { width: 500, padding: '0px' };
      case 'open':
        return { height: 600, width: 500, padding: '24px' };
      default:
        return null;
    }
  };

  const getPaymentMethodData = (id) => paymentMethods.find((payment) => payment.id === id);

  const labels = ['title', 'description', 'reward', 'assignee'];
  return (
    <TaskTemplateClickAway onClickAway={handleClickAway}>
      <div>
        <TaskTemplateModal open={open} disabled={!options || disabled} onClick={handleClick}>
          <TaskTemplateLabelWrapper>
            {usedTemplate ? <TaskTemplateIcon color={'474747'} /> : null}
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

        {saveOrOpen === 'save' ? (
          <TaskTemplateDefaultPopper
            open={open}
            anchorEl={anchorEl}
            placement="top-start"
            disablePortal={true}
            style={sizingForPopperContainer()}
          >
            <div style={{ padding: '24px' }}>
              <TaskTemplateTitleBar style={{ marginBottom: '18px' }}>
                <TaskTemplateTitle>Save as preset?</TaskTemplateTitle>
                <TaskTemplateCloseIcon
                  color={'#FFFFFF'}
                  onClick={() => {
                    setAnchorEl(false);
                    setSaveOrOpen('none');
                  }}
                />
              </TaskTemplateTitleBar>
              <TaskTemplateLabelValue style={{ marginBottom: '18px' }}>
                This will appear on your template lists. It will only be visible to you and you can apply it or delete
                it any time.
              </TaskTemplateLabelValue>
              <TokenGatingTextfieldInput
                autoComplete="off"
                name="rewards"
                onChange={(e) => {
                  setTemplateValue(e.target.value);
                }}
                placeholder="Enter name for template"
                value={templateValue}
                fullWidth={true}
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
            </div>

            <TaskTemplateActionContainer>
              <TaskTemplateCancelButton
                onClick={() => {
                  setSaveOrOpen('none');
                }}
              >
                Cancel
              </TaskTemplateCancelButton>

              <ActionButton
                style={{ padding: '8px 30px 8px 30px' }}
                onClick={() => {
                  handleSaveTemplate(templateValue);
                  setSaveOrOpen('open');
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
};

export default TaskTemplatePicker;
