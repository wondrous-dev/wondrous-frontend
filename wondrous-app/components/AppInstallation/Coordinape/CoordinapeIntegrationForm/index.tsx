import { useCallback, useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import cloneDeep from 'lodash/cloneDeep';

import { SafeImage } from 'components/Common/Image';
import CheckMarkIcon from 'components/Icons/checkMark';
import CloseModalIcon from 'components/Icons/closeModal';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { User } from 'types/User';
import palette from 'theme/palette';
import { logout } from 'components/Auth/withAuth';
import {
  CoordinapeIntegrationFormAction,
  CoordinapeIntegrationFormActions,
  CoordinapeIntegrationFormActionSeperator,
  CoordinapeIntegrationFormContent,
  CoordinapeIntegrationFormWrapper,
  CoordinapeIntegrationFormContentSection,
  Ellipses,
  CoordinapeIntegrationFormSelect,
  CoordinapeIntegrationFormSelectMenuItem,
  CoordinapeIntegrationFormSelectChip,
} from './styles';

import { DEFAULT_ORGANIZATION_OPTION, DEFAULT_POD_OPTION } from './constants';
import { useGetLoggedInUserFullAccessOrgs, useGetOrgPods, useGetUserOrgs } from './hooks';

const coordinapeImageUrl = 'https://avatars.githubusercontent.com/u/80926529';

const profilePictureStyle = {
  display: 'flex',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
};

interface ICoordinapeIntegrationFormProps {
  isMobile?: boolean;
  user: User;
}

const CoordinapeIntegrationForm = (props: ICoordinapeIntegrationFormProps) => {
  const { user } = props;
  const [selectedOrganization, setSelectedOrganization] = useState(DEFAULT_ORGANIZATION_OPTION);
  const [selectedPods, setSelectedPods] = useState(DEFAULT_POD_OPTION);

  // const userFullAccessOrganizationData = useGetLoggedInUserFullAccessOrgs(); // to be utilized when backend is ready
  const userOrgs = useGetUserOrgs(user?.id);
  const orgPods = useGetOrgPods(selectedOrganization?.value);

  const userProfilePicture = user?.thumbnailPicture || user?.profilePicture;
  const username = user?.username;

  useEffect(() => {
    if (selectedPods?.length === 0) {
      setSelectedPods(DEFAULT_POD_OPTION);
    }
  }, [selectedPods]);

  const handleSelectedOrganizationChange = useCallback((event) => {
    const { value } = event.target;
    const selectedOrg = {
      label: value?.name,
      value: value?.id,
    };
    setSelectedOrganization((_) => selectedOrg);
  }, []);

  const handleSelectedPodChange = useCallback((event) => {
    const { value } = event.target;
    const selectedPod = {
      label: value?.name,
      value: value?.id,
    };
    setSelectedPods((existingPods) => {
      if (!existingPods?.[0]?.value) return [selectedPod];
      const isSelectedPodAlreadySelected = existingPods?.find((pod) => pod?.value === selectedPod?.value);
      if (isSelectedPodAlreadySelected) return existingPods.filter((pod) => pod?.value !== selectedPod?.value);
      return [...cloneDeep(existingPods), selectedPod];
    });
  }, []);

  const handleDeletePod = useCallback((podId) => {
    setSelectedPods((existingPods) => existingPods.filter((pod) => pod?.value !== podId));
  }, []);

  const isPodPresentInSelectedPods = useCallback(
    (podId) => selectedPods?.find((pod) => pod?.value === podId),
    [selectedPods]
  );

  const renderOrganizationSelection = () => (
    <Typography fontSize="13px" color={palette.grey40} width="100%">
      {selectedOrganization?.label}
    </Typography>
  );

  const renderPodSelection = () => (
    <Grid display="flex" flexWrap="wrap" alignItems="center" gap="6px">
      {selectedPods?.[0]?.value ? (
        selectedPods?.map((pod) => (
          <CoordinapeIntegrationFormSelectChip
            key={pod.value}
            label={pod.label}
            onDelete={() => handleDeletePod(pod.value)}
            onMouseDown={(event) => event.stopPropagation()}
            variant="outlined"
          />
        ))
      ) : (
        <Typography fontSize="13px" color={palette.grey40} width="100%">
          {selectedPods?.[0]?.label}
        </Typography>
      )}
    </Grid>
  );

  return (
    <CoordinapeIntegrationFormWrapper>
      <CoordinapeIntegrationFormContent>
        <CoordinapeIntegrationFormContentSection>
          <Grid display="flex" alignItems="center" gap="28px">
            <SafeImage
              useNextImage
              src={coordinapeImageUrl}
              width="80px"
              height="80px"
              style={{
                borderRadius: '50%',
              }}
            />
            <Ellipses strokeColor={palette.grey250} width={6} height={18} />
            <SafeImage
              src={userProfilePicture}
              placeholderComp={<DefaultUserImage style={profilePictureStyle} />}
              width="80px"
              height="80px"
              objectFit="cover"
              useNextImage
              style={profilePictureStyle}
            />
          </Grid>
          <Grid marginTop="24px">
            <Typography fontSize="18px" fontWeight={500} color={palette.grey300} textAlign="center">
              Coordinape
            </Typography>
            <Typography fontSize="14px" color={palette.grey40} fontWeight={500} textAlign="center">
              wants to access your account
            </Typography>
          </Grid>
          <Grid display="flex" alignItems="center" gap="12px" marginTop="12px">
            <Typography fontSize="12px" color={palette.grey40}>
              Signed in as {username}
            </Typography>
            <Typography fontSize="12px" fontWeight={600} color={palette.highlightBlue} onClick={logout}>
              Not you?
            </Typography>
          </Grid>
        </CoordinapeIntegrationFormContentSection>
        <CoordinapeIntegrationFormContentSection>
          <Grid width="100%">
            <Typography fontSize="12px" color={palette.grey40} fontWeight={500} textTransform="uppercase" width="100%">
              Add to organization:
            </Typography>
            <CoordinapeIntegrationFormSelect
              value={selectedOrganization}
              renderValue={renderOrganizationSelection}
              onChange={handleSelectedOrganizationChange}
            >
              {userOrgs?.map((org) => (
                <CoordinapeIntegrationFormSelectMenuItem key={org.id} value={org}>
                  {org.name}
                </CoordinapeIntegrationFormSelectMenuItem>
              ))}
            </CoordinapeIntegrationFormSelect>
          </Grid>
          <Grid width="100%" display="flex" flexDirection="column" gap="8px" marginTop="20px">
            <Typography fontSize="12px" color={palette.grey40} fontWeight={500} textTransform="uppercase" width="100%">
              This will allow coordinape to:
            </Typography>
            <Grid display="flex" alignItems="center" gap="6px">
              <CheckMarkIcon />
              <Typography fontSize="13px" color={palette.grey40} width="100%">
                Read selected organization's tasks in public workspaces
              </Typography>
            </Grid>

            <Grid display="flex" alignItems="center" gap="6px">
              <CloseModalIcon strokeColor={palette.grey50} strokeWidth="2" />
              <Typography fontSize="13px" color={palette.grey40} width="100%">
                Read selected organization's tasks in private workspaces
              </Typography>
            </Grid>
          </Grid>
        </CoordinapeIntegrationFormContentSection>
        <Grid width="100%">
          <Typography fontSize="12px" color={palette.grey40} fontWeight={500} textTransform="uppercase" width="100%">
            Optional: Only show specific pods
          </Typography>
          <CoordinapeIntegrationFormSelect
            value={selectedPods}
            renderValue={renderPodSelection}
            onChange={handleSelectedPodChange}
            // showIcon={false}
          >
            {orgPods?.map((pod) => (
              <CoordinapeIntegrationFormSelectMenuItem key={pod.id} value={pod}>
                {pod.name}
                {isPodPresentInSelectedPods(pod.id) && <CheckMarkIcon fillColor={palette.highlightBlue} />}
              </CoordinapeIntegrationFormSelectMenuItem>
            ))}
          </CoordinapeIntegrationFormSelect>
        </Grid>
      </CoordinapeIntegrationFormContent>
      <CoordinapeIntegrationFormActions>
        <CoordinapeIntegrationFormAction>Cancel</CoordinapeIntegrationFormAction>
        <CoordinapeIntegrationFormActionSeperator />
        <CoordinapeIntegrationFormAction isPrimary>Authorize</CoordinapeIntegrationFormAction>
      </CoordinapeIntegrationFormActions>
    </CoordinapeIntegrationFormWrapper>
  );
};

export default CoordinapeIntegrationForm;
