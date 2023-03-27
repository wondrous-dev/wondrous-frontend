import { Box } from '@mui/material';
import Tooltip from 'components/Tooltip';

import { ENTITIES_TYPES } from 'utils/constants';
import Button from 'components/Button';
import palette from 'theme/palette';
import { CreateEntityDropdown, filterOptionsWithPermission } from '../Helpers';
import PodSearch from '../PodSearch';
import {
  CreateEntityCloseIcon,
  CreateEntityDefaultDaoImage,
  CreateEntityError,
  CreateEntityHeader,
  CreateEntityHeaderArrowIcon,
  CreateEntityHeaderWrapper,
  CreateEntityOpenInFullIcon,
  CreateEntitySelectErrorWrapper,
} from '../styles';

const Header = ({
  filteredDaoOptions,
  form,
  isSubtask,
  existingTask,
  formValues,
  entityType,
  fetchedUserPermissionsContext,
  podValue,
  handlePodChange,
  toggleFullScreen,
  cancel,
  pods,
  showTemplates,
  setShowTemplates,
}) => {
  const isMilestone = entityType === ENTITIES_TYPES.MILESTONE;
  return (
    <CreateEntityHeader>
      <CreateEntityHeaderWrapper showOnSmallScreen hideOnLargeScreen={false}>
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
            disabled={isSubtask || existingTask || formValues !== undefined}
          />
          {form.errors.orgId && <CreateEntityError>{form.errors.orgId}</CreateEntityError>}
        </CreateEntitySelectErrorWrapper>
        {form.values.orgId !== null && (
          <>
            <CreateEntityHeaderArrowIcon />
            <PodSearch
              options={filterOptionsWithPermission(entityType, pods, fetchedUserPermissionsContext, form.values.orgId)}
              multiple={isMilestone}
              value={podValue}
              onChange={handlePodChange}
              disabled={isSubtask}
            />
          </>
        )}
      </CreateEntityHeaderWrapper>
      <CreateEntityHeaderWrapper>
        <Button
          color="grey"
          borderRadius={6}
          textColor={palette.white}
          height={34}
          buttonTheme={{
            fontWeight: '500',
            fontSize: '13px',
            paddingX: 10,
          }}
          // @ts-ignore
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setShowTemplates(!showTemplates);
          }}
        >
          {showTemplates ? 'Hide' : 'Show'} templates
        </Button>
        <Tooltip title="Full screen" placement="top">
          <Box>
            <CreateEntityOpenInFullIcon onClick={toggleFullScreen} />
          </Box>
        </Tooltip>
      </CreateEntityHeaderWrapper>
      <CreateEntityHeaderWrapper showOnSmallScreen hideOnLargeScreen>
        <Tooltip title="Close Modal" placement="top-end">
          <Box>
            <CreateEntityCloseIcon onClick={cancel} />
          </Box>
        </Tooltip>
      </CreateEntityHeaderWrapper>
    </CreateEntityHeader>
  );
};

export default Header;
