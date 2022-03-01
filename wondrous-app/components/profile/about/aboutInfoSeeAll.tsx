import { useState } from 'react';
import {
  AboutInfoBlockHeaderSeeAll,
  AboutSeeAllDialog,
  AboutSeeAllDialogContent,
  AboutSeeAllDialogHeader,
  AboutSeeAllTextWrapper,
  AboutInfoBlockHeaderCount,
  AboutInfoBlockHeaderText,
  AboutSeeAllDialogCloseButton,
  AboutInfoBlockHeaderSeeAllText,
  AboutSeeAllDialogContentBorder,
} from './styles';

export const AboutInfoSeeAll = (props) => {
  const { count, text } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  return (
    <>
      <AboutSeeAllDialog open={isDialogOpen} onClose={handleCloseDialog}>
        <AboutSeeAllDialogContentBorder>
          <AboutSeeAllDialogContent>
            <AboutSeeAllDialogHeader>
              <AboutSeeAllTextWrapper>
                <AboutInfoBlockHeaderCount>{count}</AboutInfoBlockHeaderCount>
                <AboutInfoBlockHeaderText>{text}</AboutInfoBlockHeaderText>
              </AboutSeeAllTextWrapper>
              <AboutSeeAllDialogCloseButton onClick={handleCloseDialog} />
            </AboutSeeAllDialogHeader>
            {props.children}
          </AboutSeeAllDialogContent>
        </AboutSeeAllDialogContentBorder>
      </AboutSeeAllDialog>
      <AboutInfoBlockHeaderSeeAll onClick={handleOpenDialog}>
        <AboutInfoBlockHeaderSeeAllText>See All</AboutInfoBlockHeaderSeeAllText>
      </AboutInfoBlockHeaderSeeAll>
      ;
    </>
  );
};
