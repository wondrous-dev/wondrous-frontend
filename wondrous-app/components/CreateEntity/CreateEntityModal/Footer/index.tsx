import { Box, CircularProgress, Grid } from '@mui/material';
import Tooltip from 'components/Tooltip';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { isEmpty } from 'lodash';
import { forwardRef } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
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
  ({ fileUploadLoading, form, loading, entityType, cancel, hasExistingTask, showTemplates }: any, ref: any) => {
    const isProposal = entityType === ENTITIES_TYPES.PROPOSAL;

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
          >
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
          </StyledGrid>
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
            <SaveTemplateButton>
              <SaveIcon />
              <SaveTemplateButtonText>Save</SaveTemplateButtonText>
            </SaveTemplateButton>
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
