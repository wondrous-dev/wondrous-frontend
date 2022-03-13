import { TabsVisibilityButton, TabsVisibilityWrapper } from './styles';

interface ITabsVisibilityProps {
  selected: string;
  options: {};
  onChange: (e) => any;
}

export const TabsVisibility = (props: ITabsVisibilityProps) => {
  const { selected, options, onChange } = props;
  return (
    <TabsVisibilityWrapper>
      {Object.keys(options).map((option) => (
        <TabsVisibilityButton key={option} value={option} isSelected={selected === options[option]} onClick={onChange}>
          {options[option]}
        </TabsVisibilityButton>
      ))}
    </TabsVisibilityWrapper>
  );
};
