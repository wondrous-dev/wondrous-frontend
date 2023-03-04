import { CircularProgress } from '@mui/material';
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

const Footer = forwardRef(
  ({ fileUploadLoading, form, loading, entityType, cancel, hasExistingTask }: any, ref: any) => {
    const isProposal = entityType === ENTITIES_TYPES.PROPOSAL;
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
                  {hasExistingTask ? 'Save changes' : `Create ${entityType}`}
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
