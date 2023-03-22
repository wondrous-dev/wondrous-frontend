import { Grid } from '@mui/material';
import ImageUpload from 'components/Settings/imageUpload';
import { AVATAR_EDITOR_TYPES } from 'constants/avatarEditor';
import { InputWrapper } from 'components/TextField/styles';
import { PageLabel, TextArea } from '../Shared/styles';
import { ButtonsPanel } from '../Shared';
import useProjectOnboardingContext from '../Shared/context';
import { CONFIG, TYPES } from '../Shared/constants';

const ProjectLogo = ({ updateData, data }) => {
  const { setStep } = useProjectOnboardingContext();
  const handleChange = (value, name) => updateData((prev) => ({ ...prev, [name]: value }));

  const FIELDS = [
    {
      name: 'profilePicture',
      label: 'Project Logo',
      imageType: AVATAR_EDITOR_TYPES.ICON_IMAGE,
    },
    {
      name: 'headerPicture',
      label: 'Project Cover',
      imageType: AVATAR_EDITOR_TYPES.HEADER_IMAGE,
    },
    {
      name: 'description',
      label: 'Bio',
      Component: (
        <InputWrapper>
          <TextArea multiline maxLength={200} placeholder="Enter a bio" />
        </InputWrapper>
      ),
    },
  ];

  const onClick = () => {
    setStep(CONFIG.findIndex((item) => item.type === TYPES.GUIDES));
  };

  const onSkip = () => {
    setStep(CONFIG.findIndex((item) => item.type === TYPES.GUIDES));
  };

  return (
    <Grid container direction="column" justifyContent="space-between" height="100%">
      <Grid gap="42px" display="flex" flexDirection="column">
        {FIELDS.map(({ label, name, Component, imageType }, idx) => (
          <Grid display="flex" gap="68px" key={idx}>
            <PageLabel fontSize="13px" minWidth="max-content" flexBasis="15%">
              {label}
            </PageLabel>
            {Component || (
              <ImageUpload
                title=""
                image={data[name]}
                updateFilesCb={(file) => handleChange(file, name)}
                imageType={imageType}
                onDeleteImage={(imageType) => handleChange(null, name)}
                onReplace={(file) => handleChange(file, name)}
              />
            )}
          </Grid>
        ))}
      </Grid>
      <ButtonsPanel onContinue={onClick} onSkip={onSkip} />
    </Grid>
  );
};
export default ProjectLogo;
