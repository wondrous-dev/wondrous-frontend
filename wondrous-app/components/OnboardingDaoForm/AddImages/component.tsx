import AddAPhotoIcon from 'components/Icons/addAPhoto.svg';
import { ChildrenFieldWrapper, FieldLabel, FieldWrapper } from 'components/OnboardingDaoForm/styles';
import { AddPhotoIconWrapper, HeaderText, HeaderWrapper, LogoWrapper } from './styles';

const AddImages = () => {
  return (
    <ChildrenFieldWrapper>
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
    </ChildrenFieldWrapper>
  );
};

export default AddImages;
