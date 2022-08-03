import { ToggleWrapper, ToggleItem } from './styles';
interface Props {
  items: unknown[];
}

interface Item {
  onChange: (e) => any;
  label: string;
  isActive: boolean;
}
const Toggle = ({ items }: Props) => {
  return (
    <ToggleWrapper>
      {items.map((item: Item, idx) => (
        <ToggleItem key={idx} onClick={item.onChange} isActive={item.isActive}>
          {item.label}
        </ToggleItem>
      ))}
    </ToggleWrapper>
  );
};

export default Toggle;
