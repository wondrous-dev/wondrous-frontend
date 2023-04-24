import { makeUniqueId } from '@apollo/client/utilities';
import { Typography, Grid, Box } from '@mui/material';
import { CustomTextField } from 'components/AddFormEntity/components/styles';
import PanelComponent from 'components/CreateTemplate/PanelComponent';
import { Label } from 'components/CreateTemplate/styles';
import ImageUpload from 'components/ImageUpload';
import { AVATAR_EDITOR_TYPES } from 'components/ImageUpload/AvatarEditor';
import { useRef, useState } from 'react';
import { handleImageFile, uploadMedia } from 'utils/media';

const ChangeOrgDetails = () => {
  const [data, setData] = useState({
    profilePicture: null,
  });
  const handleChange = (value) => setData({ profilePicture: value });

  const ref = useRef(null);

  const transformAndUploadMedia = async ({ file }) => {
    if (!file) return null;

    const imageFile = handleImageFile({ file, id: makeUniqueId('temp') });
    await uploadMedia(imageFile);
    return { ...imageFile };
  };
  const onClick = async () => {
    let inputData = {};
    const { filename } = await transformAndUploadMedia({
      file: data.profilePicture,
    });
    inputData = {
      ...inputData,
      profilePicture: filename,
    };

    // if (ref?.current?.value !== orgData?.description) {
    //   inputData = {
    //     ...inputData,
    //     description: ref?.current?.value,
    //   };
    // }
    // if (data.headerPicture !== orgData?.headerPicture && data.headerPicture) {
    //   const { filename } = await transformAndUploadMedia({ file: data.headerPicture });

    //   inputData = {
    //     ...inputData,
    //     headerPicture: filename,
    //   };
    // }

    // await updateOrg(inputData);
  };

  console.log(data.profilePicture, 'DATA PROFI PIC')
  return (
    <Grid padding='24px 14px' container direction='column' gap='24px'>
      <Box
        display='flex'
        flexDirection='column'
        gap='14px'
        justifyContent='flex-start'
        alignItems='flex-start'
      >
        <Label>Project Name</Label>
        <CustomTextField />
      </Box>
      <ImageUpload
        title=''
        image={data.profilePicture}
        updateFilesCb={(file) => handleChange(file)}
        imageType={AVATAR_EDITOR_TYPES.ICON_IMAGE}
        onDeleteImage={(imageType) => handleChange(null)}
        onReplace={(file) => handleChange(file)}
      />
    </Grid>
  );
};

const OrgDetails = () => {
  return (
    <Grid flex='1'>
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
