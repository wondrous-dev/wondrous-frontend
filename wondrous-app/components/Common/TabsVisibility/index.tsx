import Tooltip from 'components/Tooltip';
import { TabsVisibilityButton, TabsVisibilityWrapper } from './styles';

interface ITabsVisibilityProps {
  selected: { title: string; tooltip: string };
  options: { [key: string]: { title: string; tooltip: string } };
  onChange: (e) => any;
  variant?: boolean;
}

export function TabsVisibility(props: ITabsVisibilityProps) {
  const { selected, options, onChange, variant } = props;
  return (
    <TabsVisibilityWrapper variant={variant}>
      {Object.keys(options).map((option) => (
        <Tooltip key={option} title={options[option].tooltip} placement="top">
          <TabsVisibilityButton
            key={option}
            value={option}
            isSelected={selected === options[option]}
            onClick={onChange}
          >
            {options[option].title}
          </TabsVisibilityButton>
        </Tooltip>
      ))}
    </TabsVisibilityWrapper>
  );
}
