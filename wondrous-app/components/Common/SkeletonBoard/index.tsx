import SkeletonCard from 'components/Common/SkeletonCard';
import { SkeletonBoardWrapper } from './styles';
import { CardsContainer } from 'components/Common/Boards/styles';

const SkeletonBoard = () => {
  const cards = Array(8).fill(null);
  return (
    <SkeletonBoardWrapper>
      <CardsContainer numberOfColumns={4} isFullWidth={false}>
        {cards.map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </CardsContainer>
    </SkeletonBoardWrapper>
  );
};

export default SkeletonBoard;
