import AddAPhotoIcon from 'components/Icons/addAPhoto.svg';
import { ComponentFieldWrapper, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { AddPhotoIconWrapper, HeaderText, HeaderWrapper, LogoWrapper } from './styles';

const AddImages = () => {
  return (
    <ComponentFieldWrapper>
      <FieldWrapper>
        <FieldLabel>Logo</FieldLabel>
        <LogoWrapper>
          <AddPhotoIconWrapper>
            <AddAPhotoIcon />
          </AddPhotoIconWrapper>
        </LogoWrapper>
      </FieldWrapper>
      <FieldWrapper>
        <FieldLabel>Header</FieldLabel>
        <HeaderWrapper>
          <AddPhotoIconWrapper>
            <AddAPhotoIcon />
          </AddPhotoIconWrapper>
        </HeaderWrapper>
        <HeaderText>Optimum size: 1358px x 160px</HeaderText>
      </FieldWrapper>
    </ComponentFieldWrapper>
  );
};

export default AddImages;
