import { Wrapper, ChildrenWrapper, Title } from './styles';

const WidgetLayout: React.FC<{ title: string; children: any }> = ({ title, children }) => (
  <Wrapper>
    <Title>{title}</Title>
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </Wrapper>
);

export default WidgetLayout;
