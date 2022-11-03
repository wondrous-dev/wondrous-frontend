import { useCallback, useEffect, useState } from 'react';
import apollo from 'services/apollo';
import { Grid, Typography } from '@mui/material';
import cloneDeep from 'lodash/cloneDeep';
import { useRouter } from 'next/router';

import { SafeImage } from 'components/Common/Image';
import CheckMarkIcon from 'components/Icons/checkMark';
import CloseModalIcon from 'components/Icons/closeModal';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { User } from 'types/User';
import palette from 'theme/palette';
import { logout } from 'components/Auth/withAuth';
import { ErrorText } from 'components/Common';
import { CONNECT_COORDINAPE_TO_ORG } from 'graphql/mutations/integration';
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
  CoordinapeIntegrationFormContentSectionSeperator,
  CoordinapeIntegrationFormExpandedViewWrapper,
  CoordinapeIntegrationFormExpandedViewInvisibleState,
  CoordinapeIntegrationFormExpandedViewContent,
} from './styles';

import { DEFAULT_ORGANIZATION_OPTION, DEFAULT_POD_OPTION } from './constants';
import { useGetLoggedInUserFullAccessOrgs, useGetOrgPods } from './hooks';

const coordinapeImageUrl = 'https://avatars.githubusercontent.com/u/80926529';

const profilePictureStyle = {
  display: 'flex',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
};

interface ICoordinapeIntegrationFormProps {
  user: User;
}

const CoordinapeIntegrationForm = (props: ICoordinapeIntegrationFormProps) => {
  const { user } = props;
  const router = useRouter();
  const { redirect, circleId } = router.query;

  const [selectedOrganization, setSelectedOrganization] = useState(DEFAULT_ORGANIZATION_OPTION);
  const [selectedPods, setSelectedPods] = useState(DEFAULT_POD_OPTION);
  const [errorText, setErrorText] = useState(null);
  const userFullAccessOrganizationData = useGetLoggedInUserFullAccessOrgs();

  const orgPods = useGetOrgPods(selectedOrganization?.value);

  const userProfilePicture = user?.thumbnailPicture || user?.profilePicture;
  const username = user?.username;

  useEffect(() => {
    if (selectedPods?.length === 0) {
      setSelectedPods(DEFAULT_POD_OPTION);
    }
  }, [selectedPods]);

  useEffect(() => {
    setSelectedPods(DEFAULT_POD_OPTION);
  }, [selectedOrganization?.value]);

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

  const handleCancel = () => {
    const redirectUrl: any = redirect;
    router.push(redirectUrl);
  };

  const handleAuthorize = async () => {
    setErrorText(null);
    const orgId = selectedOrganization?.value;
    const orgUsername = selectedOrganization?.label;
    const podIds = selectedPods?.map((selectedPod) => selectedPod.value);
    const podIdsString = podIds.join(',');
    apollo
      .mutate({
        mutation: CONNECT_COORDINAPE_TO_ORG,
        variables: {
          orgId,
          input: {
            circleId,
            selectedPodIds: podIds[0] === '' ? null : podIds,
          },
        },
      })
      .then(() => {
        const url = `${redirect}?wonder_organization_id=${orgId}&wonder_organization_name=${orgUsername}&wonder_pod_ids=${podIdsString}`;
        router.push(url);
      })
      .catch((err) => {
        console.error(err);
        setErrorText('could not link coordinape circle please contact support');
      });
  };

  useEffect(() => {
    setErrorText(null);
    if (userFullAccessOrganizationData?.length === 0) {
      setErrorText('You must have full access to an org to configure coordinape');
    }
  }, [userFullAccessOrganizationData]);
  return (
    <CoordinapeIntegrationFormWrapper>
      <CoordinapeIntegrationFormContent>
        <CoordinapeIntegrationFormContentSection>
          <Grid display="flex" alignItems="center" gap="28px">
            <SafeImage
              useNextImage
              src={coordinapeImageUrl}
              width={80}
              height={80}
              style={{
                borderRadius: '50%',
              }}
            />
            <Ellipses strokeColor={palette.grey250} width={6} height={18} />
            <SafeImage
              src={userProfilePicture}
              placeholderComp={<DefaultUserImage style={profilePictureStyle} />}
              width={80}
              height={80}
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
          <ErrorText>{errorText}</ErrorText>

          <CoordinapeIntegrationFormContentSectionSeperator />
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
              {userFullAccessOrganizationData?.map((org) => (
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
        <CoordinapeIntegrationFormExpandedViewWrapper
          expanded={selectedOrganization?.value && orgPods?.length}
          TransitionProps={{ unmountOnExit: true }}
        >
          <CoordinapeIntegrationFormExpandedViewInvisibleState />
          <CoordinapeIntegrationFormExpandedViewContent>
            <CoordinapeIntegrationFormContentSectionSeperator />
            <Typography fontSize="12px" color={palette.grey40} fontWeight={500} textTransform="uppercase" width="100%">
              Optional: Only show specific pods
            </Typography>
            <CoordinapeIntegrationFormSelect
              value={selectedPods}
              renderValue={renderPodSelection}
              onChange={handleSelectedPodChange}
            >
              {orgPods?.map((pod) => (
                <CoordinapeIntegrationFormSelectMenuItem key={pod.id} value={pod}>
                  {pod.name}
                  {isPodPresentInSelectedPods(pod.id) && <CheckMarkIcon fillColor={palette.highlightBlue} />}
                </CoordinapeIntegrationFormSelectMenuItem>
              ))}
            </CoordinapeIntegrationFormSelect>
          </CoordinapeIntegrationFormExpandedViewContent>
        </CoordinapeIntegrationFormExpandedViewWrapper>
      </CoordinapeIntegrationFormContent>
      <CoordinapeIntegrationFormActions>
        <CoordinapeIntegrationFormAction onClick={handleCancel}>Cancel</CoordinapeIntegrationFormAction>
        <CoordinapeIntegrationFormActionSeperator />
        {userFullAccessOrganizationData?.length && (
          <CoordinapeIntegrationFormAction isPrimary onClick={handleAuthorize}>
            Authorize
          </CoordinapeIntegrationFormAction>
        )}
      </CoordinapeIntegrationFormActions>
    </CoordinapeIntegrationFormWrapper>
  );
};

export default CoordinapeIntegrationForm;
