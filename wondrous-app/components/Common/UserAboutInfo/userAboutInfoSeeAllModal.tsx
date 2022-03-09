import { useState } from 'react';
import {
  UserAboutInfoBlockHeaderSeeAll,
  UserAboutInfoSeeAllDialog,
  UserAboutInfoSeeAllDialogContent,
  UserAboutInfoSeeAllDialogHeader,
  UserAboutInfoSeeAllTextWrapper,
  UserAboutInfoBlockHeaderCount,
  UserAboutInfoBlockHeaderText,
  UserAboutInfoSeeAllDialogCloseButton,
  UserAboutInfoBlockHeaderSeeAllText,
  UserAboutInfoSeeAllDialogContentBorder,
} from './styles';

export const AboutInfoSeeAll = (props) => {
  const { count, text } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  return (
    <>
      <UserAboutInfoSeeAllDialog open={isDialogOpen} onClose={handleCloseDialog}>
        <UserAboutInfoSeeAllDialogContentBorder>
          <UserAboutInfoSeeAllDialogContent>
            <UserAboutInfoSeeAllDialogHeader>
              <UserAboutInfoSeeAllTextWrapper>
                <UserAboutInfoBlockHeaderCount>{count}</UserAboutInfoBlockHeaderCount>
                <UserAboutInfoBlockHeaderText>{text}</UserAboutInfoBlockHeaderText>
              </UserAboutInfoSeeAllTextWrapper>
              <UserAboutInfoSeeAllDialogCloseButton onClick={handleCloseDialog} />
            </UserAboutInfoSeeAllDialogHeader>
            {props.children}
          </UserAboutInfoSeeAllDialogContent>
        </UserAboutInfoSeeAllDialogContentBorder>
      </UserAboutInfoSeeAllDialog>
      <UserAboutInfoBlockHeaderSeeAll onClick={handleOpenDialog}>
        <UserAboutInfoBlockHeaderSeeAllText>See all</UserAboutInfoBlockHeaderSeeAllText>
      </UserAboutInfoBlockHeaderSeeAll>
      ;
    </>
  );
};
