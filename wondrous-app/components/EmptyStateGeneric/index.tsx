import EmptyStateArt from './EmptyStateArt';
import { EmptyStateGenericWrapper, EmptyStateGenericText } from './styles';

interface Props {
  content: string;
}

const EmptyStateGeneric = ({ content = '' }: Props) => {
  return (
    <EmptyStateGenericWrapper>
      <EmptyStateGenericText>{content}</EmptyStateGenericText>
      <EmptyStateArt />
    </EmptyStateGenericWrapper>
  );
};

export default EmptyStateGeneric;
