import { Box, CircularProgress, Grid } from '@mui/material';
import Tooltip from 'components/Tooltip';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { isEmpty } from 'lodash';
import { forwardRef, useEffect, useState } from 'react';
import { ANALYTIC_EVENTS, ENTITIES_TYPES } from 'utils/constants';
import { privacyOptions } from '../Helpers';
import {
  CreateEntityFooter,
  CreateEntityHeaderWrapper,
  CreateEntityAttachment,
  CreateEntityAttachmentIcon,
  CreateEntityPrivacySelect,
  CreateEntityPrivacySelectRender,
  CreateEntityPrivacySelectRenderLabelWrapper,
  CreateEntityPrivacySelectRenderLabel,
  CreateEntitySelectArrowIcon,
  CreateEntityPrivacySelectOption,
  CreateEntityPrivacyIconWrapper,
  CreateEntityPrivacyLabel,
  CreateEntityCancelButton,
  CreateEntitySelectErrorWrapper,
  CreateEntityCreateTaskButton,
  CreateEntityError,
} from '../styles';
import { SaveTemplateButton, SaveTemplateButtonText, StyledGrid } from '../TemplateBody/styles';
import SaveIcon from '../TemplateBody/icons/save-icon.svg';

const Footer = forwardRef(
  (
    {
      fileUploadLoading,
      form,
      loading,
      entityType,
      cancel,
      hasExistingTask,
      showTemplates,
      taskTemplate,
      handleEditTemplate,
      handleSaveTemplate,
      taskTemplateSaved,
      taskTemplateLoading,
    }: any,
    ref: any
  ) => {
    const isProposal = entityType === ENTITIES_TYPES.PROPOSAL;
    const [saveText, setSaveText] = useState('Save');

    useEffect(() => {
      if (taskTemplateLoading) {
        setSaveText('Saving template...');
      }
      if (taskTemplateSaved) {
        setSaveText('Template saved!');
        setTimeout(() => {
          setSaveText('Save');
        }, 2000);
      }
    }, [taskTemplateSaved, taskTemplateLoading]);

    if (showTemplates) {
      return (
        <Grid container>
          <StyledGrid
            item
            sm={3}
            md={2}
            style={{
              borderTopWidth: '0',
              borderBottomWidth: '1px',
            }}
          />
          <StyledGrid
            item
            sm={9}
            md={5}
            style={{
              borderTopWidth: '0',
              borderBottomWidth: '1px',
            }}
          />
          <Box
            style={{
              paddingLeft: '0',
              borderTopWidth: '0',
              borderBottomWidth: '1px',
              display: 'flex',
              alignItems: 'center',
            }}
            item
            component={StyledGrid}
            sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
            md={5}
          >
            {form?.values?.title && form?.values?.description && (
              <SaveTemplateButton
                onClick={() => {
                  if (window?.analytics && process.env.NODE_ENV === 'production') {
                    window?.analytics?.track(ANALYTIC_EVENTS.TASK_TEMPLATE_SAVED, {
                      orgId: form?.values?.orgId,
                      podId: form?.values?.podID,
                    });
                  }
                  if (taskTemplate) {
                    handleEditTemplate(taskTemplate);
                  } else {
                    handleSaveTemplate();
                  }
                }}
                style={{
                  marginRight: '8px',
                }}
              >
                <SaveIcon />
                <SaveTemplateButtonText>{saveText}</SaveTemplateButtonText>
              </SaveTemplateButton>
            )}
            <CreateEntityHeaderWrapper showOnSmallScreen>
              <CreateEntityAttachment showOnSmallScreen onClick={() => ref.current.click()}>
                <CreateEntityAttachmentIcon />
                {fileUploadLoading && <FileLoading />}
              </CreateEntityAttachment>
              {!isProposal && (
                <CreateEntityPrivacySelect
                  className="select-tooltip"
                  name="privacyLevel"
                  value={form.values.privacyLevel}
                  onChange={(value) => {
                    form.setFieldValue('privacyLevel', value);
                  }}
                  renderValue={(value) => (
                    <Tooltip placement="top">
                      <CreateEntityPrivacySelectRender>
                        <CreateEntityPrivacySelectRenderLabelWrapper>
                          <CreateEntityPrivacySelectRenderLabel>{value?.label}</CreateEntityPrivacySelectRenderLabel>
                        </CreateEntityPrivacySelectRenderLabelWrapper>
                        <CreateEntitySelectArrowIcon />
                      </CreateEntityPrivacySelectRender>
                    </Tooltip>
                  )}
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
              )}
            </CreateEntityHeaderWrapper>
            <div style={{ flex: 1 }} />
            <CreateEntityHeaderWrapper showOnSmallScreen>
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <CreateEntityCancelButton onClick={cancel}>Cancel</CreateEntityCancelButton>
                  <CreateEntitySelectErrorWrapper>
                    <CreateEntityCreateTaskButton type="submit" data-cy="create-entity-button-submit">
                      {showTemplates ? (
                        <> Add to board</>
                      ) : (
                        <>{hasExistingTask ? 'Save changes' : `Create ${entityType}`}</>
                      )}
                    </CreateEntityCreateTaskButton>
                    {!isEmpty(form.errors) && <CreateEntityError>Please check your input fields</CreateEntityError>}
                  </CreateEntitySelectErrorWrapper>
                </>
              )}
            </CreateEntityHeaderWrapper>
          </Box>
        </Grid>
      );
    }
    return (
      <CreateEntityFooter>
        <CreateEntityHeaderWrapper showOnSmallScreen>
          <CreateEntityAttachment showOnSmallScreen onClick={() => ref.current.click()}>
            <CreateEntityAttachmentIcon />
            {fileUploadLoading && <FileLoading />}
          </CreateEntityAttachment>
          {!isProposal && (
            <CreateEntityPrivacySelect
              className="select-tooltip"
              name="privacyLevel"
              value={form.values.privacyLevel}
              onChange={(value) => {
                form.setFieldValue('privacyLevel', value);
              }}
              renderValue={(value) => (
                <Tooltip placement="top">
                  <CreateEntityPrivacySelectRender>
                    <CreateEntityPrivacySelectRenderLabelWrapper>
                      <CreateEntityPrivacySelectRenderLabel>{value?.label}</CreateEntityPrivacySelectRenderLabel>
                    </CreateEntityPrivacySelectRenderLabelWrapper>
                    <CreateEntitySelectArrowIcon />
                  </CreateEntityPrivacySelectRender>
                </Tooltip>
              )}
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
          )}
        </CreateEntityHeaderWrapper>
        <CreateEntityHeaderWrapper showOnSmallScreen>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <CreateEntityCancelButton onClick={cancel}>Cancel</CreateEntityCancelButton>
              <CreateEntitySelectErrorWrapper>
                <CreateEntityCreateTaskButton type="submit" data-cy="create-entity-button-submit">
                  {showTemplates ? (
                    <> Add to board</>
                  ) : (
                    <>{hasExistingTask ? 'Save changes' : `Create ${entityType}`}</>
                  )}
                </CreateEntityCreateTaskButton>
                {!isEmpty(form.errors) && <CreateEntityError>Please check your input fields</CreateEntityError>}
              </CreateEntitySelectErrorWrapper>
            </>
          )}
        </CreateEntityHeaderWrapper>
      </CreateEntityFooter>
    );
  }
);
export default Footer;
