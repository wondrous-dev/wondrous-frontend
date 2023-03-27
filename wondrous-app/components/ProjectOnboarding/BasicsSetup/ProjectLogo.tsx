import { makeUniqueId } from '@apollo/client/utilities';
import { Grid } from '@mui/material';
import ImageUpload from 'components/Settings/imageUpload';
import { InputWrapper } from 'components/TextField/styles';
import { AVATAR_EDITOR_TYPES } from 'constants/avatarEditor';
import { useEffect, useRef, useState } from 'react';
import { useOrgBoard } from 'utils/hooks';
import { handleImageFile, uploadMedia } from 'utils/media';
import { ButtonsPanel } from '../Shared';
import { CONFIG, TYPES } from '../Shared/constants';
import { PageLabel, TextArea } from '../Shared/styles';

const ProjectLogo = () => {
  const { setStep, updateOrg, orgData } = useOrgBoard();
  const [data, setData] = useState({
    profilePicture: null,
    headerPicture: null,
  });

  const handleChange = (value, name) => setData((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    if (data.profilePicture !== orgData?.profilePicture) {
      setData((prev) => ({ ...prev, profilePicture: orgData?.profilePicture }));
    }
    if (data.headerPicture !== orgData?.headerPicture) {
      setData((prev) => ({ ...prev, headerPicture: orgData?.headerPicture }));
    }
  }, [orgData?.profilePicture, orgData?.headerPicture]);

  const ref = useRef(null);

  const FIELDS = [
    {
      name: 'profilePicture',
      label: 'Project Logo',
      imageType: AVATAR_EDITOR_TYPES.ICON_IMAGE,
      type: 'image',
    },
    {
      name: 'headerPicture',
      label: 'Project Cover',
      imageType: AVATAR_EDITOR_TYPES.HEADER_IMAGE,
      type: 'image',
    },
    {
      name: 'description',
      label: 'Bio',
      type: 'text',
    },
  ];

  const transformAndUploadMedia = async ({ file }) => {
    if (!file) return null;

    const imageFile = handleImageFile({ file, id: makeUniqueId('temp') });
    await uploadMedia(imageFile);
    return { ...imageFile };
  };

  const onClick = async () => {
    let inputData = {};
    if (data.profilePicture !== orgData?.profilePicture) {
      const { filename } = await transformAndUploadMedia({ file: data.profilePicture });
      inputData = {
        ...inputData,
        profilePicture: filename,
      };
    }
    if (ref?.current?.value !== orgData?.description) {
      inputData = {
        ...inputData,
        description: ref?.current?.value,
      };
    }
    if (data.headerPicture !== orgData?.headerPicture) {
      const { filename } = await transformAndUploadMedia({ file: data.headerPicture });

      inputData = {
        ...inputData,
        headerPicture: filename,
      };
    }

    await updateOrg(inputData);
    setStep(CONFIG.findIndex((item) => item.type === TYPES.GUIDES));
  };

  const onSkip = () => {
    setStep(CONFIG.findIndex((item) => item.type === TYPES.GUIDES));
  };

  return (
    <Grid container direction="column" justifyContent="space-between" height="100%" gap="42px">
      <Grid gap="42px" display="flex" flexDirection="column">
        {FIELDS.map(({ label, name, type, imageType }, idx) => (
          <Grid
            display="flex"
            gap={{
              xs: '24px',
              sm: '68px',
            }}
            key={idx}
            flexDirection={{
              xs: 'column',
              sm: 'row',
            }}
          >
            <PageLabel fontSize="13px" minWidth="max-content" flexBasis="15%">
              {label}
            </PageLabel>
            {type === 'image' ? (
              <ImageUpload
                title=""
                image={data[name]}
                updateFilesCb={(file) => handleChange(file, name)}
                imageType={imageType}
                onDeleteImage={(imageType) => handleChange(null, name)}
                onReplace={(file) => handleChange(file, name)}
              />
            ) : null}

            {type === 'text' ? (
              <InputWrapper>
                <TextArea
                  multiline
                  maxLength={200}
                  placeholder="Enter a bio"
                  defaultValue={orgData.description}
                  ref={ref}
                />
              </InputWrapper>
            ) : null}
          </Grid>
        ))}
      </Grid>
      <ButtonsPanel onContinue={onClick} onSkip={onSkip} nextTitle="Complete step" />
    </Grid>
  );
};
export default ProjectLogo;
