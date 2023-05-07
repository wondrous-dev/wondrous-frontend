import { useMutation } from '@apollo/client';
import { makeUniqueId } from '@apollo/client/utilities';
import { Typography, Grid, Box } from '@mui/material';
import { CustomTextField } from 'components/AddFormEntity/components/styles';
import PanelComponent from 'components/CreateTemplate/PanelComponent';
import { Label } from 'components/CreateTemplate/styles';
import ImageUpload from 'components/ImageUpload';
import { AVATAR_EDITOR_TYPES } from 'components/ImageUpload/AvatarEditor';
import { SharedSecondaryButton } from 'components/Shared/styles';
import { UPDATE_ORG } from 'graphql/mutations';
import { useContext, useEffect, useRef, useState } from 'react';
import GlobalContext from 'utils/context/GlobalContext';
import useAlerts from 'utils/hooks';

import { handleImageFile, uploadMedia } from 'utils/media';

const ChangeOrgDetails = () => {
  const {
    setSnackbarAlertOpen,
    setSnackbarAlertMessage,
    setSnackbarAlertAnchorOrigin,
  } = useAlerts();
  const [data, setData] = useState({
    profilePicture: null,
  });
  const [updateOrg, { data: updateOrgData, loading: updateLoading }] =
    useMutation(UPDATE_ORG, {
      refetchQueries: ['getUserOrgs'],
      onCompleted: () => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage('Success!');
        setSnackbarAlertAnchorOrigin({
          vertical: 'top',
          horizontal: 'center',
        });
      },
    });

  const { activeOrg } = useContext(GlobalContext);
  const handleChange = (value) => setData({ profilePicture: value });

  const ref = useRef(null);

  useEffect(() => {
    if (data.profilePicture !== activeOrg?.profilePicture) {
      setData((prev) => ({
        ...prev,
        profilePicture: activeOrg?.profilePicture,
      }));
    }
  }, [activeOrg?.profilePicture, activeOrg?.headerPicture]);

  const transformAndUploadMedia = async ({ file }) => {
    if (!file) return null;

    const imageFile = handleImageFile({ file, id: makeUniqueId('temp') });
    await uploadMedia(imageFile);
    return { ...imageFile };
  };

  const onClick = async () => {
    let inputData = {};
    if (data.profilePicture !== activeOrg?.profilePicture) {
      const { filename } = await transformAndUploadMedia({
        file: data.profilePicture,
      });
      inputData = {
        ...inputData,
        profilePicture: filename,
      };
    }
    if (ref?.current && ref?.current !== activeOrg?.name) {
      inputData = {
        ...inputData,
        name: ref?.current,
      };
    }
    await updateOrg({
      variables: {
        orgId: activeOrg.id,
        input: {
          ...inputData,
        },
      },
    });
  };

  return (
    <Grid container direction='column' gap='24px'>
      <Label>Project Logo</Label>

      <ImageUpload
        title=''
        image={data.profilePicture}
        updateFilesCb={(file) => handleChange(file)}
        imageType={AVATAR_EDITOR_TYPES.ICON_IMAGE}
        onDeleteImage={(imageType) => handleChange(null)}
        onReplace={(file) => handleChange(file)}
      />
      <Box
        display='flex'
        flexDirection='column'
        gap='14px'
        justifyContent='flex-start'
        alignItems='flex-start'
      >
        <Label>Project Name</Label>
        <CustomTextField
          defaultValue={activeOrg.name}
          onChange={(e) => (ref.current = e.target.value)}
        />
      </Box>
      <Box
        width='100%'
        display='flex'
        justifyContent='flex-end'
        alignItems='flex-start'
      >
        <SharedSecondaryButton onClick={onClick}>Change</SharedSecondaryButton>
      </Box>
    </Grid>
  );
};

const OrgDetails = () => {
  return (
    <Grid flex='1' width={{
      xs: '100%',
      sm: '70%',
    }}>
      <PanelComponent
        renderHeader={() => (
          <Typography
            fontFamily='Poppins'
            fontSize='12px'
            padding='14px'
            lineHeight='14px'
            fontWeight={600}
            color='#2A8D5C'
          >
            Basic Details
          </Typography>
        )}
        renderBody={ChangeOrgDetails}
      />
    </Grid>
  );
};

export default OrgDetails;
