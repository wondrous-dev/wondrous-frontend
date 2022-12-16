import { Wrapper, Title } from './styles';

const WidgetLayout: React.FC<{ title: string; children: any; padding?: String }> = ({ title, children, ...props }) => (
  <Wrapper {...props}>
    <Title>{title}</Title>
    <div>{children}</div>
  </Wrapper>
);

export default WidgetLayout;
