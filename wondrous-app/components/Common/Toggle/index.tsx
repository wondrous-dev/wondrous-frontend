import { ToggleWrapper, ToggleItem } from './styles';

interface Props {
  items: unknown[];
}

interface Item {
  onChange: (e) => any;
  label: string;
  isActive: boolean;
  gradient?: string;
}
const Toggle = ({ items }: Props) => (
  <ToggleWrapper>
    {items.map((item: Item, idx) => (
      <ToggleItem key={idx} onClick={item.onChange} isActive={item.isActive} gradient={item.gradient}>
        {item.label}
      </ToggleItem>
    ))}
  </ToggleWrapper>
);

export default Toggle;
