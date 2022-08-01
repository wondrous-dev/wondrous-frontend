import EmptyStateArt from './EmptyStateArt';
import { EmptyStateGenericWrapper, EmptyStateGenericText } from './styles';

interface Props {
  content: string;
  children?: any;
}

const EmptyStateGeneric = ({ content = '', children }: Props) => {
  return (
    <EmptyStateGenericWrapper>
      <EmptyStateGenericText>{content}</EmptyStateGenericText>
      <EmptyStateArt />
      {children}
    </EmptyStateGenericWrapper>
  );
};

export default EmptyStateGeneric;
