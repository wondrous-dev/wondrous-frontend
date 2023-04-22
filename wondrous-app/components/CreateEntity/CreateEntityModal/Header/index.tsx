import { Box, Grid } from '@mui/material';
import Tooltip from 'components/Tooltip';

import { ANALYTIC_EVENTS, ENTITIES_TYPES } from 'utils/constants';
import Button from 'components/Button';
import palette from 'theme/palette';
import { useMe } from 'components/Auth/withAuth';
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
  TemplatesGalleryText,
} from '../styles';
import { StyledGrid } from '../TemplateBody/styles';

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
  const user = useMe();
  if (showTemplates) {
    return (
      <CreateEntityHeader
        style={{
          alignItems: 'center',
          padding: 0,
        }}
      >
        <Grid container>
          <StyledGrid
            item
            sm={3}
            md={2}
            style={{
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '24px',
            }}
          >
            {' '}
            <TemplatesGalleryText>Templates Gallery</TemplatesGalleryText>
          </StyledGrid>
          <StyledGrid
            item
            sm={9}
            md={5}
            style={{
              border: 'none',
            }}
          />
          <Box
            style={{
              borderTopWidth: '0',
              borderBottomWidth: '0px',
              display: 'flex',
              alignItems: 'center',
            }}
            item
            md={5}
            component={StyledGrid}
            sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
          >
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
                    options={filterOptionsWithPermission(
                      entityType,
                      pods,
                      fetchedUserPermissionsContext,
                      form.values.orgId
                    )}
                    multiple={isMilestone}
                    value={podValue}
                    onChange={handlePodChange}
                    disabled={isSubtask}
                  />
                </>
              )}
            </CreateEntityHeaderWrapper>
            <div style={{ flex: 1 }} />
            <CreateEntityHeaderWrapper
              style={{
                marginLeft: showTemplates ? '16px' : 0,
              }}
            >
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
                  if (!showTemplates && window?.analytics && process.env.NEXT_PUBLIC_PRODUCTION) {
                    window?.analytics?.track(ANALYTIC_EVENTS.SHOW_TEMPLATES_CLICKED, {
                      orgId: form?.values?.orgId,
                      podId: form?.values?.podId,
                      userId: user?.id,
                    });
                  }
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
          </Box>
        </Grid>
      </CreateEntityHeader>
    );
  }
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
      <CreateEntityHeaderWrapper
        style={{
          marginLeft: showTemplates ? '16px' : 0,
        }}
      >
        {(entityType === ENTITIES_TYPES.TASK || entityType === ENTITIES_TYPES.BOUNTY) && (
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
        )}
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
